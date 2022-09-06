import Head from "next/head"
import { ReactElement, useState, memo, FormEvent } from "react"
import styles from '../styles/login.module.scss'
import { Button, TextField } from "@mui/material"
import Link from "next/link"
import axios, { AxiosError} from 'axios'
import { useRouter } from "next/router"
const CopyRight = memo(function CopyRight(): ReactElement {
  return (
    <p>
      Copyright © 李帅的网站
    </p>
  )
})
export default memo(function Login(): ReactElement {
  const [usernameInfo, setUsernameInfo] = useState({
    username: '',
    helperText: '',
    isError: false
  })
  const [passwordInfo, setPasswordInfo] = useState({
    password: '',
    helperText: '',
    isError: false
  })
  const router = useRouter()
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (usernameInfo.isError || passwordInfo.isError) {
      return
    }
    try {
      let res = await axios('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username: usernameInfo.username,
          password: passwordInfo.password
        }
      })
      let data = await res.data;
      if (data.error_code === '0') {
        router.push(`/users/${usernameInfo.username}`)
        document.cookie = `token=${data.access_token}; SameSite=Strict; Max-age=10000000`
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.status === '401') {
          setPasswordInfo((prev) => ({ password: prev.password, isError: true, helperText: '用户名或密码错误' }))
        }
      }
    }
  }
  const handleUsername = (event: any) => {
    let newV = event.target.value.trim()
    let helperText = ""
    let isError = false
    if (newV.length < 3 || newV.length > 18) {
      helperText = "用户名的长度应为3到18"
      isError = true
      setUsernameInfo({ username: newV, isError, helperText })
    } else {
      setUsernameInfo({ username: newV, isError, helperText })
    }
  }
  const handlePassword = (event: any) => {
    let newV = event.target.value.trim()
    let isError = false
    let helperText = ''
    if (newV.length < 8 || newV.length > 20) {
      isError = true
      helperText = '密码的长度为8到20'
    }
    setPasswordInfo({ isError, password: newV, helperText })
  }
  return (
    <div className={styles.Login}>
      <Head>
        <title>登录</title>
      </Head>
      <div className={styles.container}>
        <h2>登录网上聊天室</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <span>用户名：</span>
          <label>
            <TextField required error={usernameInfo.isError} helperText={usernameInfo.helperText} name="account" type="text" placeholder="请输入你的账户" autoFocus={true} variant="standard" value={usernameInfo.username} onChange={handleUsername}></TextField>
          </label>
          <span>密 码：</span>
          <label>
            <TextField required error={passwordInfo.isError} name="password" type="password" placeholder="请输入你的密码" variant="standard" helperText={passwordInfo.helperText} value={passwordInfo.password} onChange={handlePassword}></TextField>
          </label>
          <Button variant="contained" type="submit">登录</Button>
          <Button variant="contained" type="button"><Link href="/register">注册</Link></Button>
        </form>
        <CopyRight />
      </div>
    </div>)
}) 