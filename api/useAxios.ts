import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { SERVER_URL } from "../constant/constant";
import { MessageContext } from "../pages/_app";
const AxiosInstance = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true
})
export function useAxios(): AxiosInstance {
  const router = useRouter()
  const messageApi = useContext(MessageContext);
  const myAxios = useMemo(() => {
    AxiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      return config
    }, (error: AxiosError) => {
      Promise.reject(error)
    })
    AxiosInstance.interceptors.response.use((res: AxiosResponse) => {
      if (res.status >= 500) {
        messageApi.open({
          type: 'error',
          content: "服务器发生错误"
        })
      } else if (res.data.status === 401) {
        messageApi.open({
          type: "error",
          content: "您尚未登录，请先登录",
        })
        router.push("/auth/login")
      }
      return Promise.resolve(res)
    }, (error: AxiosError) => {
      if (error.response.status === 401) {
        router.push('/auth/login')
      }
      return Promise.reject(error)
    })
    return AxiosInstance
  }, [])
  return myAxios;
}