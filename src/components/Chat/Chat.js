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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const actionUrl = process.env.NEXT_PUBLIC_API_LINK;
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setUploading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [users, setUsers] = useState([]);
  const [chatAs, setChatAs] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: userResp } = await axios.get(`${actionUrl}/users`);
      setUsers(userResp.response);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchChatId = async () => {
      if (chatAs) {
        const { data } = await axios.post(`${actionUrl}/chats/start-chat`, {
          customerId: chatAs,
        });
        setChatId(data.chatId);
      }
    };

    fetchChatId();
  }, []);

  useEffect(() => {
    if (chatId) {
      socket.emit("joinRoom", { chatId });
    }

    const messageListener = (newMessage) => {
      if (newMessage.chatId === chatId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.off("receiveMessage").on("receiveMessage", messageListener);

    if (chatId) {
      getMessages();
    }

    return () => {
      socket.off("receiveMessage", messageListener);
    };
  }, [chatId]);

  const onSelectChange = (value) => {
    setChatAs(value);
  };

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

      const downloadUrl = await getSignDownloadUrl(fileKey);
      fileData = {
        fileName: file.name,
        fileUrl: downloadUrl,
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
    
    socket.emit("sendMessage", newMessage, (confirmedMessage) => {
      setMessages((prev) => [...prev, confirmedMessage]);
    });

    setMessage("");
    setFile(null);
    setUploading(false);
  };

  const getSignDownloadUrl = async (fileKey) => {
    const { data } = await axios.post(`${actionUrl}/file/download-url`, {
      fileKey,
    });

    return data.downloadUrl;
  };

  return (
    <Popover>
      <PopoverTrigger>
        <MessagesSquare />
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <ScrollArea className="h-64 overflow-y-auto border rounded-lg flex p-4 ">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 p-1 ${
                  msg.senderId === socket.id
                    ? "place-items-start "
                    : "place-items-end "
                }`}
              >
                {msg.content && (
                  <div
                    className={`w-10/12 rounded-lg p-2 ${
                      msg.senderId === socket.id
                        ? "bg-slate-400"
                        : "bg-green-400"
                    } `}
                  >
                    <p className="text-sm text-gray-700 ">{msg.content}</p>
                  </div>
                )}
                {console.log("Message File ", msg.fileUrl)}
                {msg.file && msg.file.fileType.startsWith("image/") ? (
                  <img
                    src={msg.file.fileUrl}
                    alt="Sent"
                    className="max-w-xs max-h-40 rounded-lg border"
                  />
                ) : msg.file ? (
                  <a
                    href={msg.file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {msg.file.fileName}
                  </a>
                ) : null}
              </div>
            ))}
          </ScrollArea>
          <div className="py-4">
            <Select className="" onValueChange={onSelectChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chat As" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Chat As</SelectLabel>
                  {users?.map((user) => {
                    return (
                      <SelectItem key={user?.id} value={user?.id}>
                        {user.role}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full h-1">
            <Progress className="h-[4px] my-[2px]" value={uploadProgress} />
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
