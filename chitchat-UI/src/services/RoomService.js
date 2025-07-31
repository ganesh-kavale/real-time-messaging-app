import { httpClient } from "../config/AxiosHelper";

export const createRoomApi = async (groupDetail) => {
  const respone = await httpClient.post(`/api/v1/groups`, groupDetail, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return respone.data;
};

export const joinChatApi = async (groupId) => {
  
  const response = await httpClient.get(`/api/v1/groups/${groupId}`);
  return response.data;
};

export const getMessagess = async (groupId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/groups/${groupId}/messages?size=${size}&page=${page}`
  );
  console.log(response.data);
  
  return response.data;
};
