import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser
  } = useChatContext();

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
let [activeTypingUser, setActiveTypingUser] = useState("");

  const stompClientRef = useRef(null);
  const typingTimeouts = useRef({});
  const chatBoxRef = useRef(null);

  // Redirect if not connected
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected]);

  // Load previous messages
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {
        toast.error("Failed to load messages");
      }
    }
    if (connected) loadMessages();
  }, [connected, roomId]);

  // Scroll down on new message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Initialize WebSocket and subscribe to room and typing topic
  useEffect(() => {
    const socket = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      toast.success("Connected");

      stompClientRef.current = client;

      client.subscribe(`/topic/room/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, newMessage]);
      });
        console.log("1111111111hhhhhhhhhhhhhhhhhhhhhhhh", roomId);

       client.subscribe(`/topic/typing/${roomId}`, (message) => {
  console.log("TYPING MESSAGE RECEIVED", message); // ✅ This must log
       const data = JSON.parse(message.body);
        console.log("hhhhhhhhhhhhhhhhhhhhhhhh", data);
  
}); 

         client.subscribe(`/topic/typing/${roomId}`, (message) => {
      const data = JSON.parse(message.body);
       console.log("hhhhhhhhhhhhhhhhhhhhhhhh", data);
      if (data.username !== currentUser) {
        setTypingUsers((prev) => {
                    console.log("wwwwwwwwwwwwwwww", prev);
                    setActiveTypingUser(prev);
          if (!prev.includes(data.username)) {
            return [...prev, data.username];
          }
          console.log("wwwwwwwwwwwwwwww", prev);
          
          return prev;
        });

        clearTimeout(typingTimeouts.current[data.username]);
        typingTimeouts.current[data.username] = setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== data.username));
        }, 3000);
      }
    });
    });

    return () => client.disconnect();
  }, [roomId, currentUser]);

  const sendMessage = () => {
    const client = stompClientRef.current;
    if (client && client.connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };
      client.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      setInput("");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    console.log("Sending typing event:", currentUser); // ✅ LOG

    const client = stompClientRef.current;
    if (client && client.connected) {
      client.send(
        "/app/typing",
        {},
        JSON.stringify({ roomId, username: currentUser })
      );
    }
  };

  const handleLogout = () => {
    stompClientRef.current.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };

  return (
    <div className="">
      {/* Header */}
      <header className="dark:border-gray-700 fixed w-full dark:bg-gray-900 py-5 shadow flex justify-around items-center">
        <div>
          <h1 className="text-xl font-semibold">
            Room : <span>{roomId}</span>
          </h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold">
            User : <span>{currentUser}</span>
          </h1>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full"
          >
            Leave Room
          </button>
        </div>
      </header>

      {/* Messages */}
      <main
        ref={chatBoxRef}
        className="py-20 px-10 w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`my-2 ${
                message.sender === currentUser ? "bg-green-800" : "bg-gray-800"
              } p-2 max-w-xs rounded`}
            >
              <div className="flex flex-row gap-2">
                <img
                  className="h-10 w-10"
                  src={"https://avatar.iran.liara.run/public/43"}
                  alt="avatar"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-400">
                    {timeAgo(message.timeStamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

  {/* Typing Indicator under Input */}
<div className="fixed bottom-20 w-full text-center">
  {activeTypingUser && (
    <div className="text-xs text-gray-400">
      <span className="font-semibold">{activeTypingUser}</span> is typing...
    </div>
  )}
</div>

{/* Input Box */}
<div className="fixed bottom-4 w-full h-16">
  <div className="h-full pr-10 gap-4 flex items-center justify-between rounded-full w-1/2 mx-auto dark:bg-gray-900">
    <input
      value={input}
      onChange={handleInputChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") sendMessage();
      }}
      type="text"
      className="w-full dark:border-gray-600 dark:bg-gray-800 px-5 py-2 rounded-full h-full focus:outline-none"
      placeholder={
        activeTypingUser ? `${activeTypingUser} is typing...` : "Type a message..."
      }
    />
    <div className="flex gap-1">
      <button className="dark:bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full">
        <MdAttachFile size={20} />
      </button>
      <button
        onClick={sendMessage}
        className="dark:bg-green-600 h-10 w-10 flex justify-center items-center rounded-full"
      >
        <MdSend size={20} />
      </button>
    </div>
  </div>
</div>


    </div>
  );
};

export default ChatPage;
