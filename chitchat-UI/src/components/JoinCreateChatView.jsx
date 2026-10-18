import React from "react";
import { FiArrowRight, FiPlus } from "react-icons/fi";
import "../css/login-page.css";

const JoinCreateChatView = ({
  detail,
  errors,
  handleFormInputChange,
  joinChat,
  createGroup,
}) => {
  return (
    <div className="group-form-container">
      <div className="group-form-card">
        <p className="group-form-eyebrow">WELCOME TO MEETIN</p>
        <h2 className="group-form-title">Bring your team together.</h2>
        <p className="group-form-copy">
          Join your team's room or create one for a new conversation.
        </p>

        <div className="group-form-field">
          <label htmlFor="name" className="group-form-label">Your name</label>
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
          <label htmlFor="groupId" className="group-form-label">Team room ID</label>
          <input
            type="text"
            id="groupId"
            name="groupId"
            placeholder="Enter your team room ID"
            value={detail.groupId}
            onChange={handleFormInputChange}
            className={`group-form-input ${errors.groupId ? "input-error" : ""}`}
          />
          {errors.groupId && <span className="error-text">{errors.groupId}</span>}
        </div>

        <div className="group-form-actions">
          <button type="button" className="group-form-btn group-form-btn--join" onClick={joinChat}>
            Join room
            <FiArrowRight aria-hidden="true" />
          </button>
          <button type="button" className="group-form-btn group-form-btn--create" onClick={createGroup}>
            <FiPlus aria-hidden="true" />
            Create room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChatView;