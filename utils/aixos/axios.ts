import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { SERVER_URL } from "../../constant/constant";
import { AESDecrypt } from "../crpto/crypto";

const AxiosInstance = axios.create({
  baseURL: SERVER_URL,
})
AxiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  if (config.url !== '/auth/login' && config.url !== '/auth/register') {
    let satoken = localStorage.getItem("satoken")
    if (typeof satoken === 'string') {
      config.headers = {
        "satoken": AESDecrypt(satoken)
      }
    }
  }
  return config
}, (error: AxiosError) => {
  Promise.reject(error)
})
AxiosInstance.interceptors.response.use((res: AxiosResponse) => {
  if (res.status === 401) {
    console.log("axios interceptors response")
    throw new Error("HHHHHHHHHHHHHhh")
  }
  return Promise.resolve(res)
}, (error: AxiosError) => {
  console.log("HHHHHHHH")
  if (error.response.status === 401) {
    
  }
  return Promise.reject(error)
})
export default AxiosInstance