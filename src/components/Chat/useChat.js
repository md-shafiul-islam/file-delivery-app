import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function useChat(chatId, userId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", { chatId });

    socket.on("newMessage", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  const sendMessage = (message) => {
    socket.emit("sendMessage", { chatId, senderId: userId, message });
  };

  return { messages, sendMessage };
}
