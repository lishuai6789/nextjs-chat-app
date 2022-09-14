import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { SERVER_URL } from "../../constant/constant";
import { AESDecrypt } from "../crpto/crypto";
const AxiosInstance = axios.create({
  baseURL: SERVER_URL
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
    const router = useRouter()
    router.push("/auth/login")
  }
  return Promise.resolve(res)
}, (error: AxiosError) => {
  Promise.reject(error)
})
export default AxiosInstance