import { Alert, Button, Checkbox, FormControlLabel, TextField } from "@mui/material"
import { AxiosError, AxiosResponse } from 'axios'
import { setCookie } from "cookies-next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEvent, FormEvent, memo, ReactElement, useState } from "react"
import styles from '../../styles/login.module.scss'
import AxiosInstance from "../../utils/aixos/axios"
import { AESEncrypt } from "../../utils/crpto/crypto"
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
  const [loginError, setLoginError] = useState({
    isError: false,
    mes: ''
  })
  const [loading, setLoading] = useState(false)
  const [remeberMe, setRemeberMe] = useState(true);
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (usernameInfo.isError || passwordInfo.isError || loading) {
      return
    }
    setLoading(true)
    AxiosInstance.post('/auth/login', {
      username: usernameInfo.username,
      password: passwordInfo.password,
      rememberMe: remeberMe,
    })
      .then(async (res: AxiosResponse) => {
        setLoading(false)
        console.log(res)
        if (res.status === 500) {
          setLoginError({ isError: true, mes: '服务器发生错误，请稍后重试' })
        } else if (res.status >= 400) {
          setLoginError({ isError: true, mes: '您的网络可能发生了错误' })
        } else {
          let data = await res.data
          if (data.code === 0) {
            setLoginError({ isError: false, mes: '' })
            type saRet = {
              "tokenName"?: string,
              "tokenValue"?: string,
              "isLogin"?: boolean,
              "loginId"?: string,
              "loginType"?: string,
              "tokenTimeout"?: number,
              "sessionTimeout"?: number,
              "tokenSessionTimeout"?: number,
              "tokenActivityTimeout"?: number,
              "loginDevice"?: number,
              "tag"?: object | null
            }
            let t: saRet = data.data
            localStorage.setItem("satoken", AESEncrypt(t.tokenValue));
            setCookie('satoken', AESEncrypt(t.tokenValue), {
              maxAge: t.tokenTimeout,
              sameSite: 'strict',
              // httpOnly: true
            });
            router.push('/')
          }
        }
      })
      .catch((error: any) => {
        setLoading(false)
        if (error instanceof AxiosError) {
          if (error.response.status === 500) {
            setLoginError({
              isError: true,
              mes: '服务器发生了错误'
            })
          } else {

          }
        }
      })
  }
  const handleUsername = (event: ChangeEvent<HTMLInputElement>) => {
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
  const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
    let newV = event.target.value.trim()
    let isError = false
    let helperText = ''
    if (newV.length < 8 || newV.length > 20) {
      isError = true
      helperText = '密码的长度为8到20'
    }
    setPasswordInfo({ isError, password: newV, helperText })
  }
  const handleRemeberMe = () => {
    setRemeberMe((prev) => !prev)
  }
  return (
    <div className={styles.Login}>
      <Head>
        <title>登录</title>
      </Head>
      <div className={styles.container}>
        <h2>登录网上聊天室</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField required error={usernameInfo.isError} helperText={usernameInfo.helperText} name="account" type="text" placeholder="请输入你的账户" autoFocus={true} variant="standard" value={usernameInfo.username} onChange={handleUsername} label="账户名"></TextField>
          <TextField required error={passwordInfo.isError} name="password" type="password" placeholder="请输入你的密码" variant="standard" helperText={passwordInfo.helperText} value={passwordInfo.password} onChange={handlePassword} label="密码"></TextField>
          <FormControlLabel value={remeberMe} onChange={handleRemeberMe} control={<Checkbox defaultChecked name="remeberMe" />} label="记住我"></FormControlLabel>
          <br />
          <Button variant="contained" type="submit" disabled={loading}>{loading ? '登陆中' : '登录'}</Button>
          <Button variant="contained" type="button"><Link href="/auth/register">注册</Link></Button>
        </form>
        {loginError.isError && <Alert severity="error">{loginError.mes}</Alert>}
        <CopyRight />
      </div>
    </div>)
}) 