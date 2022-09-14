import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { setCookie, getCookie } from 'cookies-next';
import { useRouter } from "next/router";
import { AES_KEY, SERVER_URL } from "../../constant/constant";
import {AES} from 'crypto-js'
import { AESDecrypt } from "../crpto/crypto";
const AxiosInstance = axios.create({
  baseURL: SERVER_URL
})
AxiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  // let satoken = getCookie('satoken');
  let satoken = localStorage.getItem("satoken")
  if (typeof satoken === 'string') {
    console.log("解密之后", AESDecrypt(satoken))
    config.headers = {
      "satoken": AESDecrypt(satoken)
    }
    console.log("token添加成功")
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