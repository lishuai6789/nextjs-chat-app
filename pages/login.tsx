import Head from "next/head"
import { ChangeEvent, ReactElement, useState, memo } from "react"
import styles from '../styles/login.module.scss'
import { Button, TextField } from "@mui/material"
import Link from "next/link"
const CopyRight = memo(function CopyRight():ReactElement {
  return (
    <p>
      Copyright © 李帅的网站
    </p>
  )
})
export default memo(function Login(): ReactElement {
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [isFirst, setIsFirst] = useState(true)
  const handleSubmit = async () => {
    let res = await fetch('http://localhost:9000/login');
    res.json();
    // TODO: 待完善
  }
  const handleInput = (event: any) => {
    setIsFirst(false)
    let name = event.target.getAttribute('name')
    if (name === 'account') {
      setAccount(event.target.value)
    } else if (name === 'password') {
      setPassword(event.target.value)
    }
  }
  return (
    <div className={styles.Login}>
      <Head>
        <title>登录</title>
      </Head>
      <div className={styles.container}>
        <h2>登录网上聊天室</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>账户：
            <TextField required error={!isFirst && account === ""} helperText="账户名不能为空" name="account" type="text" placeholder="请输入你的账户" autoFocus={true} variant="standard" value={account} onChange={handleInput}></TextField>
          </label>
          <label>密码：
            <TextField required error={!isFirst && password.length < 6 || password.length > 16} name="password" type="password" placeholder="请输入你的密码" variant="standard" helperText="密码长度在8-16位" value={password} onChange={handleInput}></TextField>
          </label>
          <div className={styles.buttons}>
            <Button variant="outlined" type="submit">登录</Button>
            <Button variant="outlined" type="button"><Link href="/register">注册</Link></Button>
          </div>
        </form>
        <CopyRight />
      </div>
    </div>)
}) 