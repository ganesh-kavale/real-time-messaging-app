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
import '../css/chat-area.css';

const ChatPage = () => {
  const {
    groupId,
    currentUser,
    connected,
    setConnected,
    setGroupId,
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
        const messages = await getMessagess(groupId);
        setMessages(messages);
      } catch (error) {
        toast.error("Failed to load messages");
      }
    }
    if (connected) loadMessages();
  }, [connected, groupId]);

  // Scroll down on new message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Initialize WebSocket and subscribe to group and typing topic
  useEffect(() => {
    const socket = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      toast.success("Connected");

      stompClientRef.current = client;

      client.subscribe(`/topic/group/${groupId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, newMessage]);
      });

      client.subscribe(`/topic/typing/${groupId}`, (message) => {
        const data = JSON.parse(message.body);
        if (data.username !== currentUser) {
          setTypingUsers((prev) => {
            setActiveTypingUser(prev);
            if (!prev.includes(data.username)) {
              return [...prev, data.username];
            }
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
  }, [groupId, currentUser]);

  const sendMessage = () => {
    const client = stompClientRef.current;
    if (client && client.connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        groupId: groupId,
      };
      client.send(`/app/sendMessage/${groupId}`, {}, JSON.stringify(message));
      setInput("");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    const client = stompClientRef.current;
    if (client && client.connected) {
      client.send(
        "/app/typing",
        {},
        JSON.stringify({ groupId: groupId, username: currentUser })
      );
    }
  };

  const handleLogout = () => {
    stompClientRef.current.disconnect();
    setConnected(false);
    setGroupId("");
    setCurrentUser("");
    navigate("/");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-card">
        <div className="chat-header flex justify-between items-center w-full px-4 py-3 shadow bg-white dark:bg-gray-900">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <img
              src="/default-avatar.png"
              alt="Profile"
              className="w-8 h-8 rounded-full border border-gray-300"
            />
            <h1 className="text-lg font-medium"> {currentUser}</h1>
          </div>

          {/* Group Info */}
          <h1 className="text-xl font-semibold"> {groupId}</h1>

          {/* Leave Button */}
          <button onClick={handleLogout} className="leave-btn">
            Logout
          </button>
        </div>

        <div className="chat-body" ref={chatBoxRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-row ${message.sender === currentUser ? "end" : "start"}`}
            >
              <div className={`message-bubble ${message.sender === currentUser ? "user" : "other"}`}>
                <div className="message-content">
                  <span className="sender">{message.sender}</span>
                  <span className="text">{message.content}</span>
                  <span className="message-time">{timeAgo(message.timeStamp)}</span>
                </div>
              </div>
            </div>
          ))}
          {activeTypingUser && (
            <div className="typing-indicator">
              {activeTypingUser} is typing...
            </div>
          )}
        </div>

        <div className="chat-footer">
          <input
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            className="chat-input"
            placeholder={activeTypingUser ? `${activeTypingUser} is typing...` : "Type a message..."}
          />
          <button className="send-btn" onClick={sendMessage}>
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
