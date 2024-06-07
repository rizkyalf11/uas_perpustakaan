import axios, { AxiosInstance } from "axios";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:5105",
  headers: { "Content-Type": "application/json" },
});

export const axiosClientRefresh: AxiosInstance = axios.create({
  baseURL: "http://localhost:5105",
  headers: { "Content-Type": "application/json" },
});

export interface BaseResponseSuccess {
  status: string;
  message: string;
  data?: any;
}

export interface BaseResponsePagination {
  status: string;
  message: string;
  pagination: {
    page: number;
    // limit: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
}