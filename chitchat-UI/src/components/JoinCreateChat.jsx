import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import JoinCreateChatView from "./JoinCreateChatView"; // Import the layout

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({ groupId: "", userName: "" });
  const [errors, setErrors] = useState({ groupId: "", userName: "" });

  const { setGroupId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setDetail((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      groupId: detail.groupId.trim() === "" ? "Group ID is required" : "",
      userName: detail.userName.trim() === "" ? "Name is required" : "",
    };
    setErrors(newErrors);
    if (newErrors.groupId || newErrors.userName) {
      toast.error("Please fill all required fields.");
      return false;
    }
    return true;
  };

  const joinChat = async () => {
    if (!validateForm()) return;
    try {
      const group = await joinChatApi(detail.groupId);
      toast.success("Joined group successfully");
      setCurrentUser(detail.userName);
      setGroupId(group.groupId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      toast.error(error?.status === 400 ? error.response?.data || "Bad Request" : "Error in joining group");
    }
  };

  const createGroup = async () => {
    if (!validateForm()) return;
    try {
      const response = await createRoomApi(detail.groupId);
      toast.success("Group Created Successfully");
      setCurrentUser(detail.userName);
      setGroupId(response.groupId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      toast.error(error?.status === 400 ? "Group already exists!" : "Error in creating group");
    }
  };

  // Render the imported HTML view file and pass down necessary functions/state
  return (
    <JoinCreateChatView
      detail={detail}
      errors={errors}
      handleFormInputChange={handleFormInputChange}
      joinChat={joinChat}
      createGroup={createGroup}
    />
  );
};

export default JoinCreateChat;