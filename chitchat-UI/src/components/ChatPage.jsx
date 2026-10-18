import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { FiBriefcase, FiHash, FiLogOut, FiMessageSquare } from "react-icons/fi";
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
  const activeTypingUser = typingUsers[0] || "";

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
    if (stompClientRef.current?.connected) {
      stompClientRef.current.disconnect();
    }
    setConnected(false);
    setGroupId("");
    setCurrentUser("");
    navigate("/");
  };

  const userInitials = (currentUser || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="office-chat">
      <header className="office-topbar">
        <a className="office-brand" href="/" aria-label="Meetin workspace home">
          <span className="office-brand__icon" aria-hidden="true">
            <FiMessageSquare />
          </span>
          <span>MEETIN</span>
        </a>

        <div className="office-topbar__room" aria-label="Current team room">
          <span className="office-topbar__workspace">
            <FiBriefcase aria-hidden="true" /> Team workspace
          </span>
          <span className="office-topbar__separator" aria-hidden="true">/</span>
          <span className="office-topbar__room-id">{groupId}</span>
        </div>

        <div className="office-topbar__actions">
          <div className="office-user">
            <span className="office-avatar" aria-hidden="true">{userInitials}</span>
            <span className="office-user__name">{currentUser}</span>
          </div>
          <button
            className="office-leave-button"
            type="button"
            onClick={handleLogout}
            aria-label="Leave team room"
            title="Leave team room"
          >
            <FiLogOut aria-hidden="true" />
            <span>Leave</span>
          </button>
        </div>
      </header>

      <div className="office-layout">
        <aside className="office-sidebar" aria-label="Workspace navigation">
          <div className="office-sidebar__section">
            <p className="office-sidebar__label">WORKSPACE</p>
            <div className="office-workspace-item">
              <span className="office-workspace-item__icon" aria-hidden="true">
                <FiBriefcase />
              </span>
              <span className="office-workspace-item__text">
                <strong>Team workspace</strong>
                <small>{groupId}</small>
              </span>
            </div>
          </div>

          <nav className="office-sidebar__section" aria-label="Team rooms">
            <p className="office-sidebar__label">ROOMS</p>
            <div className="office-room-link" aria-current="page">
              <FiHash aria-hidden="true" />
              <span>{groupId || "Team room"}</span>
            </div>
          </nav>

          <div className="office-sidebar__profile">
            <span className="office-avatar office-avatar--small" aria-hidden="true">
              {userInitials}
            </span>
            <span className="office-sidebar__profile-copy">
              <strong>{currentUser}</strong>
              <small>Signed in</small>
            </span>
          </div>
        </aside>

        <section className="office-conversation" aria-label={`Messages in ${groupId}`}>
          <header className="conversation-header">
            <div className="conversation-heading">
              <span className="conversation-heading__icon" aria-hidden="true">
                <FiHash />
              </span>
              <span className="conversation-heading__text">
                <h1>{groupId}</h1>
                <span>Team room</span>
              </span>
            </div>
            <span className="conversation-kind">TEAM CONVERSATION</span>
          </header>

          <div className="conversation-messages" ref={chatBoxRef}>
            {messages.length === 0 ? (
              <div className="conversation-empty">
                <span className="conversation-empty__icon" aria-hidden="true">
                  <FiMessageSquare />
                </span>
                <h2>Welcome to {groupId}</h2>
                <p>Your team's conversation starts here.</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const senderInitials = (message.sender || "U")
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("");

                return (
                  <article
                    key={`${message.timeStamp || "message"}-${index}`}
                    className={`message-row ${message.sender === currentUser ? "message-row--self" : ""}`}
                  >
                    <span className="office-avatar office-avatar--message" aria-hidden="true">
                      {senderInitials}
                    </span>
                    <div className="message-main">
                      <div className="message-meta">
                        <strong>{message.sender}</strong>
                        <time>{timeAgo(message.timeStamp)}</time>
                      </div>
                      <p className="message-text">{message.content}</p>
                    </div>
                  </article>
                );
              })
            )}

            {activeTypingUser && (
              <div className="typing-indicator" aria-live="polite">
                {activeTypingUser} is typing...
              </div>
            )}
          </div>

          <div className="conversation-composer">
            <input
              value={input}
              onChange={handleInputChange}
              onKeyDown={(event) => event.key === "Enter" && sendMessage()}
              type="text"
              className="chat-input"
              aria-label="Write a message"
              placeholder={activeTypingUser ? `${activeTypingUser} is typing...` : `Message ${groupId}`}
            />
            <button
              className="send-btn"
              type="button"
              onClick={sendMessage}
              aria-label="Send message"
              title="Send message"
            >
              <MdSend aria-hidden="true" />
            </button>
          </div>
        </section>

        <aside className="room-details" aria-label="Team room details">
          <h2>Room details</h2>
          <section className="room-details__section">
            <p className="room-details__label">ROOM ID</p>
            <p className="room-details__value"><FiHash aria-hidden="true" />{groupId}</p>
          </section>
          <section className="room-details__section">
            <p className="room-details__label">SIGNED IN AS</p>
            <div className="room-details__member">
              <span className="office-avatar office-avatar--small" aria-hidden="true">
                {userInitials}
              </span>
              <span>{currentUser}</span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ChatPage;
