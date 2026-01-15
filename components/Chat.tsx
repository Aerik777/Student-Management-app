'use client';

import { useState, useEffect } from 'react';
import {
  sendMessage,
  getMessages,
  getConversationList,
  getContacts,
  markAsRead,
} from '@/actions/messages';
import { pusherClient } from '@/lib/pusher-client';

export default function ChatComponent({ userId }: { userId: string }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Fetch initial data
    getConversationList(userId).then(setConversations);
    getContacts(userId).then(setContacts);

    // Optimistic Clear Global Badge
    window.dispatchEvent(new Event('clear-unread'));

    // Server Sync
    import('@/actions/messages').then(({ markAllMessagesAsRead }) => {
      markAllMessagesAsRead(userId).then(() => {
        // Update local state to ensure badges are gone even if fetch returned them
        setConversations((prev) => prev.map((c) => ({ ...c, unreadCount: 0 })));
      });
    });
  }, [userId]);

  const startChat = (user: any) => {
    setActiveUser(user);
    setShowNewChat(false);
    // Optimistically add to conversations if not present
    if (!conversations.find((c) => c._id === user._id)) {
      setConversations((prev) => [user, ...prev]);
    }
  };

  useEffect(() => {
    if (!activeUser) return;
    getMessages(userId, activeUser._id).then(setMessages);

    // Pusher subscription
    const channel = pusherClient.subscribe(`chat-${userId}`);
    channel.bind('new-message', (msg: any) => {
      if (msg.senderId === activeUser._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      pusherClient.unsubscribe(`chat-${userId}`);
    };
  }, [activeUser]);

  const handleSend = async () => {
    if (!inputText || !activeUser) return;
    const msg = await sendMessage(userId, activeUser._id, inputText);
    setMessages((prev) => [...prev, msg]);
    setInputText('');
  };

  return (
    <div className='flex bg-white rounded-xl shadow-lg border h-[600px] overflow-hidden'>
      <div className='w-1/3 border-r bg-gray-50 overflow-y-auto'>
        <div className='p-4 border-b bg-white font-bold flex justify-between items-center text-slate-900'>
          <span>Conversations</span>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className='text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700'
          >
            {showNewChat ? 'Cancel' : 'New +'}
          </button>
        </div>

        {showNewChat ? (
          <div className='p-2 space-y-1'>
            <div className='text-xs text-slate-500 font-bold px-2 mb-2 uppercase tracking-wider'>
              Suggested Contacts
            </div>
            {contacts.length === 0 && (
              <div className='p-4 text-center text-sm text-slate-500'>
                No contacts found
              </div>
            )}
            {contacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => startChat(contact)}
                className='p-3 cursor-pointer hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all'
              >
                <div className='font-semibold text-sm text-slate-900'>
                  {contact.name}
                </div>
                <div className='text-xs text-slate-500'>{contact.role}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className='divide-y'>
            {conversations.map((u) => (
              <div
                key={u._id}
                onClick={() => {
                  // 1. Optimistic Sidebar Update
                  if (u.unreadCount > 0) {
                    window.dispatchEvent(
                      new CustomEvent('decrement-unread', {
                        detail: u.unreadCount,
                      })
                    );
                  }

                  // 2. Local State Update
                  setActiveUser(u);
                  setConversations((prev) =>
                    prev.map((c) =>
                      c._id === u._id ? { ...c, unreadCount: 0 } : c
                    )
                  );

                  // 3. Server Sync
                  markAsRead(u._id, userId);
                }}
                className={`p-4 cursor-pointer hover:bg-white transition-colors relative ${
                  activeUser?._id === u._id
                    ? 'bg-white border-l-4 border-indigo-500'
                    : 'border-l-4 border-transparent'
                }`}
              >
                <div className='flex justify-between items-start'>
                  <div className='font-semibold text-sm text-slate-900'>
                    {u.name}
                  </div>
                  {u.unreadCount > 0 && (
                    <span className='bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full'>
                      {u.unreadCount}
                    </span>
                  )}
                </div>
                <div className='text-xs text-slate-500 font-medium'>
                  {u.role}
                </div>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className='p-8 text-center text-sm text-slate-500 italic'>
                No active conversations. Start a new one!
              </div>
            )}
          </div>
        )}
      </div>

      <div className='flex-1 flex flex-col'>
        {activeUser ? (
          <>
            <div className='p-4 border-b font-bold bg-white flex justify-between items-center text-slate-900'>
              <span>Chatting with {activeUser.name}</span>
              <span className='text-xs bg-gray-200 px-2 py-1 rounded font-semibold text-slate-800'>
                {activeUser.role}
              </span>
            </div>
            <div className='flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50'>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.senderId === userId || m.senderId._id === userId
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[70%] text-sm ${
                      m.senderId === userId || m.senderId._id === userId
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border text-slate-900 font-medium'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className='p-4 border-t bg-white'>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={inputText}
                  placeholder='Type a message...'
                  className='flex-1 p-2 border border-slate-300 rounded-full px-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500'
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className='bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold'
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center text-gray-400'>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
