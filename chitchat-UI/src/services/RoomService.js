import { httpClient } from "../config/AxiosHelper";

export const createRoomApi = async (groupDetail) => {
  const respone = await httpClient.post(`/api/v1/groups`, groupDetail, {
    headers: {
        "Content-Type": "application/json",
    },
  });
  return respone.data;
};

export const joinChatApi = async (groupDetails) => {
    const response = await httpClient.post(`/api/v1/groups/join-team`, groupDetails, {
    headers: {
        "Content-Type": "application/json",
    },
  });
  // const response = await httpClient.post(`/api/v1/groups/${groupDetails}`);
  return response.data;
};

export const getMessagess = async (groupId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/groups/${groupId}/messages?size=${size}&page=${page}`
  );
  console.log(response.data);
  
  return response.data;
};
