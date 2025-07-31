import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [groupId, setGroupId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [connected, setConnected] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        groupId,
        currentUser,
        connected,
        setGroupId,
        setCurrentUser,
        setConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;
