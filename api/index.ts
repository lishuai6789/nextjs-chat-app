import { AxiosRequestConfig } from "axios";

export const reqLogin = (username: string, password: string, rememberMe: boolean): AxiosRequestConfig => {
  const para = new URLSearchParams();
  para.append("username", username);
  para.append("password", password);
  para.append("rememberMe", rememberMe ? "true" : "false");
  return {
    url: '/auth/login',
    method: "POST",
    data: para,
    headers: {}
  }
}

export const reqRegister = (username: string, password: string): AxiosRequestConfig => {
  const para = new URLSearchParams();
  para.append("username", username);
  para.append("password", password);
  return {
    url: "/auth/register",
    method: "POST",
    data: para,
    headers: {}
  }
}

export const reqLogout = (): AxiosRequestConfig => {
  return {
    url: "/auth/logout",
    method: "GET",
    headers: {},
  }
}

export const reqGetFriendProfile = (friend: string): AxiosRequestConfig => {
  const para = new URLSearchParams();
  para.append("friend", friend);
  return {
    url: "/friend/getFriendProfile",
    data: para,
    method: "POST"
  }
}