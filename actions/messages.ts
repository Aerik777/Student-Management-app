'use server';

import connectDB from '@/lib/db';
import Message from '@/models/message';
import { pusherServer } from '@/lib/pusher';

export async function sendMessage(
  senderId: string,
  receiverId: string,
  text: string
) {
  await connectDB();
  const message = await Message.create({
    senderId,
    receiverId,
    text,
    read: false,
  });

  // Basic pusher implementation
  try {
    await pusherServer.trigger(`chat-${receiverId}`, 'new-message', message);
  } catch (error) {
    console.error('Pusher trigger failed:', error);
  }

  return JSON.parse(JSON.stringify(message));
}

export async function getMessages(userId1: string, userId2: string) {
  await connectDB();
  return await Message.find({
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 },
    ],
  })
    .sort({ timestamp: 1 })
    .lean();
}

export async function getConversationList(userId: string) {
  await connectDB();
  // Simplified: get all users this person has talked to
  const messages = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  })
    .populate('senderId receiverId')
    .lean();

  const usersMap = new Map();

  // Track unread counts
  const unreadCounts = new Map<string, number>();

  messages.forEach((m: any) => {
    const isSender = m.senderId._id.toString() === userId;
    const otherUser = isSender ? m.receiverId : m.senderId;
    const otherUserId = otherUser._id.toString();

    usersMap.set(otherUserId, otherUser);

    // Only count unread if:
    // 1. I am the receiver (m.receiverId === userId)
    // 2. The message is NOT read
    // 3. The message is FROM the other user (implicit if I am receiver, but good to be clear)
    if (!isSender && m.receiverId._id.toString() === userId && !m.read) {
      unreadCounts.set(otherUserId, (unreadCounts.get(otherUserId) || 0) + 1);
    }
  });

  return Array.from(usersMap.values()).map((user: any) => ({
    ...user,
    _id: user._id.toString(), // Ensure ID is string for client actions
    unreadCount: unreadCounts.get(user._id.toString()) || 0,
  }));
}

export async function getContacts(userId: string) {
  await connectDB();
  const currentUser = await (
    await import('@/models/user')
  ).default.findById(userId);
  if (!currentUser) return [];

  let query: any = {};
  const classes = currentUser.classIds || [];

  if (currentUser.role === 'STUDENT') {
    // Find Teachers in my classes
    query = {
      role: 'FACULTY',
      classIds: { $in: classes },
    };
  } else if (currentUser.role === 'FACULTY') {
    // Find Students in my classes
    query = {
      role: 'STUDENT',
      classIds: { $in: classes },
    };
  } else {
    // Admin can see everyone or just other admins/feature not specified
    // Let's return all faculty and students for admin
    query = { role: { $ne: 'ADMIN' } };
  }

  const contacts = await (await import('@/models/user')).default
    .find(query)
    .select('name role email')
    .lean();
  return JSON.parse(JSON.stringify(contacts));
}

export async function getUnreadCount(userId: string) {
  await connectDB();
  const count = await Message.countDocuments({
    receiverId: userId,
    read: { $ne: true },
  });
  return count;
}

export async function markAsRead(
  conversationPartnerId: string,
  currentUserId: string
) {
  await connectDB();
  await Message.updateMany(
    {
      senderId: conversationPartnerId,
      receiverId: currentUserId,
      read: { $ne: true },
    },
    { $set: { read: true } }
  );

  // Revalidate to update sidebar counts immediately if they use server data
  // But our sidebar uses a separate action getUnreadCount which is not cached heavily,
  // but revalidating path helps.
  const { revalidatePath } = await import('next/cache');
  revalidatePath('/student/messages');
  revalidatePath('/faculty/messages');

  return { success: true };
}

export async function markAllMessagesAsRead(userId: string) {
  await connectDB();
  await Message.updateMany(
    {
      receiverId: userId,
      read: { $ne: true },
    },
    { $set: { read: true } }
  );

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/student/messages');
  revalidatePath('/faculty/messages');

  return { success: true };
}
