'use server';

import { pusherServer } from '@/lib/pusher';

/**
 * Trigger a real-time notification or message
 * @param channel - The name of the channel (e.g., 'chat-room-1')
 * @param event - The name of the event (e.g., 'new-message')
 * @param data - The payload to send
 */
export async function triggerPusherEvent(
  channel: string,
  event: string,
  data: any
) {
  try {
    // Basic validation to ensure data is present
    if (!channel || !event || !data) {
      throw new Error('Missing pusher parameters');
    }

    await pusherServer.trigger(channel, event, data);

    return { success: true };
  } catch (error) {
    console.error('Pusher Trigger Error:', error);
    return { success: false, error: 'Failed to send real-time update' };
  }
}

/**
 * Specifically for the Faculty Hub chat
 */
export async function sendChatMessage(chatId: string, messageData: any) {
  // Logic to save message to MongoDB would go here
  // ...

  // Trigger real-time update to the specific chat channel
  return await triggerPusherEvent(
    `presence-${chatId}`,
    'message:new',
    messageData
  );
}
