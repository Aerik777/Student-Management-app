'use server';

import { connectDB } from "./db";
import Message from "@/models/Message";
import { pusherServer } from "./pusher"; // Pusher server-side config

export async function sendMessage(senderId: string, receiverId: string, text: string) {
  await connectDB();

  const newMessage = await Message.create({ senderId, receiverId, text });

  // Trigger real-time event
  await pusherServer.trigger(`chat-${receiverId}`, 'new-message', {
    text,
    senderId,
    timestamp: newMessage.timestamp,
  });

  return { success: true };
}