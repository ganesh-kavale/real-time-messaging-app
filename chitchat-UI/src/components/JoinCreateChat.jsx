import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService"; // Optional: Rename to GroupService
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import "../css/login-page.css";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    groupId: "",
    userName: "",
  });

  const [errors, setErrors] = useState({
    groupId: "",
    userName: "",
  });

  const { setGroupId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;

    setDetail((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
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
      setGroupId(group.groupId); // still using roomId in response, update API if needed
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error?.status === 400) {
        toast.error(error.response?.data || "Bad Request");
      } else {
        toast.error("Error in joining group");
      }
    }
  };

  const createGroup = async () => {
    if (!validateForm()) return;


    try {
      const response = await createRoomApi(detail.groupId);
      toast.success("Group Created Successfully");
      setCurrentUser(detail.userName);
      setGroupId(response.groupId); // response still returns roomId, can rename if needed
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error?.status === 400) {
        toast.error("Group already exists!");
      } else {
        toast.error("Error in creating group");
      }
    }
  };

  return (
    <div className="group-form-container">
      <div className="group-form-card">
        <h1 className="group-form-title">System IO Info</h1>

        <div className="group-form-field">
          <label htmlFor="name" className="group-form-label">Name</label>
          <input
            type="text"
            id="name"
            name="userName"
            placeholder="Enter your name"
            value={detail.userName}
            onChange={handleFormInputChange}
            className={`group-form-input ${errors.userName ? "input-error" : ""}`}
          />
          {errors.userName && <span className="error-text">{errors.userName}</span>}
        </div>

        <div className="group-form-field">
          <label htmlFor="groupId" className="group-form-label">Group ID / New Group ID</label>
          <input
            type="text"
            id="groupId"
            name="groupId"
            placeholder="Enter the group ID"
            value={detail.groupId}
            onChange={handleFormInputChange}
            className={`group-form-input ${errors.groupId ? "input-error" : ""}`}
          />
          {errors.groupId && <span className="error-text">{errors.groupId}</span>}
        </div>

        <div className="group-form-actions">
          <button
            type="button"
            className="group-form-btn group-form-btn--join"
            onClick={joinChat}
          >
            Login
          </button>
          <button
            type="button"
            className="group-form-btn group-form-btn--create"
            onClick={createGroup}
          >
            New
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
