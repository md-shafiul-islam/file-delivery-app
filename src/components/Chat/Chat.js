"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import socket from "@/utils/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessagesSquare, Paperclip, Send } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { v4 as uuidv4 } from "uuid";

const actionUrl = process.env.NEXT_PUBLIC_API_LINK;
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setUploading] = useState(false);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const fetchChatId = async () => {
      const { data } = await axios.post(`${actionUrl}/chats/start-chat`, {
        customerId: userId, // Get this from auth
      });
      setChatId(data.chatId);
    };

    fetchChatId();
  }, []);

  useEffect(() => {
    if (chatId) {
      socket.emit("joinRoom", { chatId });
    }

    socket.on("receiveMessage", (newMessage) => {
      if (newMessage.chatId === chatId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    if (chatId) {
      getMessages();
    }

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const getMessages = async () => {
    if (!chatId) return;

    const { data } = await axios.get(`${actionUrl}/chats/${chatId}/messages`);
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!message && !file) return;

    let fileData = null;
    if (file) {
      setUploading(true);
      const fileKey = `uploads/${uuidv4()}-${file.name}`;
      const { data } = await axios.post(`${actionUrl}/file/upload-url`, {
        fileKey,
        contentType: file.type,
      });

      const uploadResp = await axios.put(data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
          socket.emit("upload-progress", { chatId, progress: percent });
        },
      });

      if (uploadResp.status) {
        setUploadProgress(0);
      }

      fileData = {
        fileName: file.name,
        fileUrl: data.uploadUrl,
        fileType: file.type,
        fileKey,
      };
    }

    const newMessage = {
      chatId,
      senderId: socket.id,
      content: message,
      file: fileData,
    };
    socket.emit("sendMessage", newMessage);

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setFile(null);
    setUploading(false);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <MessagesSquare />
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <ScrollArea className="h-64 overflow-y-auto border rounded-lg flex ">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 p-1 ${
                  msg.senderId === socket.id
                    ? "place-items-start bg-slate-400"
                    : "place-items-end bg-green-400"
                }`}
              >
                <p className="text-sm text-gray-700">{msg.content}</p>
                {msg.file && (
                  <a
                    href={msg.file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {msg.file.fileName}
                  </a>
                )}
              </div>
            ))}
          </ScrollArea>
          <div className="w-full h-1">
            <Progress value={uploadProgress} />
          </div>
          <div className="grid gap-2 items-center">
            <div className="flex flex-row justify-between items-center py-1">
              <Button
                className="h-8"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                onClick={sendMessage}
                className="h-8"
                disabled={isUploading}
              >
                <Send className="h-4 w-5 mr-2" /> Send
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden "
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div>
              <Input
                type="text"
                className="flex-1 "
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Chat;
