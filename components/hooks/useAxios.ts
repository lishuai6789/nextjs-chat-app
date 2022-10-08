import { useRouter } from "next/router";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { SERVER_URL } from '../../constant/constant'
import { useDispatch } from "react-redux";
import { openNotLogin } from "../../store/uiSlice";
export default function useAxios() {
  const router = useRouter();
  const dispatch = useDispatch()
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
      dispatch(openNotLogin())
      router.push('/auth/login')
      return 
    }
    return Promise.reject(error)
  })
  return AxiosInstance
}