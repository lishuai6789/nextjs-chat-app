import { ReactElement, memo, useState, FormEvent, useRef, useCallback, ChangeEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import { TextField, Button, Alert } from "@mui/material";
import styles from '../../styles/register.module.scss'
import _ from 'lodash'
import axios, { AxiosError } from 'axios'
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
// FIXME: 待完善
const Register = memo(function RegisterMemo(): ReactElement {
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
  const [retypeInfo, setRetypeInfo] = useState({
    retype: '',
    helperText: '',
    isError: false
  })
  const [registerError, setRegisterError] = useState({
    isShow: false,
    mes: ''
  })
  const [isRegister, setIsRegister] = useState(false) //????
  const router = useRouter()
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (usernameInfo.isError || passwordInfo.isError || retypeInfo.isError) {
      return
    }
    // TODO: 等待完善
  }
  // TODO: 等待完善
  const checkDuplicate = useCallback(_.debounce(async (username: string) => {
    try {
      let res = await fetch(`http://localhost:8080/auth/check?username=${username}`, {
        method: 'GET',
        mode: 'cors'
      })
      let json = await res.json()
      console.log(json, username)
      if (json.error_code === '1') {
        setUsernameInfo((prev) => {
          return { username: prev.username, isError: true, helperText: '用户名重复' }
        })
      } else if (json.error_code === '0') {
        setUsernameInfo((prev) => {
          return { username: prev.username, isError: false, helperText: '' }
        })
      }
    } catch (error: any) {
      console.log(error)
    }
  }, 1000), [])
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
      // checkDuplicate(newV) // 事件驱动变化，并未使用useEffect
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
  const handleRetype = (event: ChangeEvent<HTMLInputElement>) => {
    let newV = event.target.value.trim()
    let helperText = ''
    let isError = false
    if (newV !== passwordInfo.password) {
      helperText = '密码不一致，请重新确认您的密码'
      isError = true
    }
    setRetypeInfo({ helperText, retype: newV, isError })
  }
  return (
    <div className={styles.Register}>
      <Head>
        <title>注册</title>
      </Head>
      <div className={styles.container}>
        <h2>注册新的账号</h2>
        <form className={styles.form} onSubmit={handleSubmit} encType="application/x-www-form-urlencoded">
          <span>用户名：</span>
          <label>
            <TextField required
              error={usernameInfo.isError}
              helperText={usernameInfo.helperText}
              name="username"
              type="text"
              placeholder="请输入你的账户"
              autoFocus={true}
              variant="standard"
              value={usernameInfo.username}
              onChange={handleUsername}></TextField>
          </label>
          <span>密  码：</span>
          <label>
            <TextField required
              error={passwordInfo.isError}
              name="password"
              type="password"
              placeholder="请输入你的密码"
              variant="standard"
              helperText={passwordInfo.helperText}
              value={passwordInfo.password}
              onChange={handlePassword}></TextField>
          </label>
          <span>确认密码：</span>
          <label>
            <TextField required
              type="password"
              placeholder="请重新输入密码"
              variant="standard"
              helperText={retypeInfo.helperText}
              value={retypeInfo.retype}
              error={retypeInfo.isError}
              onChange={handleRetype}></TextField>
          </label>
          <Button variant="contained" type="submit">{isRegister ? '注册中……' : '注册'}</Button>
          <Button variant="contained" type="button"><Link href="/auth/login">登录</Link></Button>
        </form>
        {
          registerError.isShow && <Alert severity="error">{registerError.mes}</Alert>
        }
      </div>
    </div>)
})
export default Register