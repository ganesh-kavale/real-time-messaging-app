import axios from "axios";
export const baseURL = "http://localhost:8017";
export const httpClient = axios.create({
  baseURL: baseURL,
});
