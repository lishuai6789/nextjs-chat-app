import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { SERVER_URL } from "../constant/constant";
import { message } from 'antd';
// 想改的话，以后再说！！！！
export function useAxios() {
  const router = useRouter();
  
  const AxiosInstance = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
    timeout: 10000,
  })
  const reqInterceptor = AxiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
    return config
  }, (error: AxiosError) => {
    Promise.reject(error)
  })
  const resInterceptor = AxiosInstance.interceptors.response.use((res: AxiosResponse) => {
    return Promise.resolve(res)
  }, (error: AxiosError) => {
    if (error.response.status >= 500) {
      message.error({ content: "服务器发生错误" });
    } else if (error.response.status === 401) {
      message.error({ content: "您还未登录" });
      router.push('/auth/login')
    } else {
      message.error({ content: `未知错误${error.message}` });
    }
    return Promise.reject(error)
  });
  return AxiosInstance;
}