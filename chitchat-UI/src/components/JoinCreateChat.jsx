import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import "../css/main-body.css";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { roomId, userName, setRoomId, setCurrentUser, setConnected } =
    useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      //join chat

      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("joined..");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
        console.log(error);
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      //create room
      console.log(detail);
      // call api to create room on backend
      try {
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room Created Successfully !!");
        //join the room
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);

        navigate("/chat");

        //forward to chat page...
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room  already exists !!");
        } else {
          toast("Error in creating room");
        }
      }
    }
  }

  return (
   <div className="app-container">
  <div className="form-card">
    <h1 className="form-title">Group Chat</h1>

    <div className="form-group">
      <label htmlFor="name" className="form-label">Your Name</label>
      <input
        type="text"
        id="name"
        name="userName"
        placeholder="Enter your name"
        value={detail.userName}
        onChange={handleFormInputChange}
        className="form-input"
      />
    </div>

    <div className="form-group">
      <label htmlFor="roomId" className="form-label">Group ID / New Group ID</label>
      <input
        type="text"
        id="roomId"
        name="roomId"
        placeholder="Enter the group ID"
        value={detail.roomId}
        onChange={handleFormInputChange}
        className="form-input"
      />
    </div>

    <div className="button-group">
      <button type="button" className="btn join-group" onClick={joinChat}>
        Join Group
      </button>
      <button type="button" className="btn create-group" onClick={createRoom}>
        Create
      </button>
    </div>
  </div>
</div>

  );
};

export default JoinCreateChat;


