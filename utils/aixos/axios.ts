import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { SERVER_URL } from "../../constant/constant";

const AxiosInstance = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true
})
AxiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  return config
}, (error: AxiosError) => {
  Promise.reject(error)
})
AxiosInstance.interceptors.response.use((res: AxiosResponse) => {
  return Promise.resolve(res)
}, (error: AxiosError) => {
  if (error.response.status === 401) {
    
  }
  return Promise.reject(error)
})
export default AxiosInstance