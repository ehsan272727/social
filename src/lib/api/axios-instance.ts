import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

export const s3Api = axios.create({
  baseURL: "/api/s3",
  timeout: 30000,
});
