import { ReactElement, memo, useState, ChangeEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import { TextField, Button } from "@mui/material";
import styles from '../styles/register.module.scss'
import _ from 'lodash'
const Register = memo(function RegisterMemo(): ReactElement {
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [isFirst, setIsFirst] = useState(true)
  const handleSubmit = async () => {
    let res = await fetch('http://localhost:9000/login');
    res.json();
    // TODO: 待完善
  }
  const handleInput = _.debounce((event: any) => {
    setIsFirst(false)
    let name = event.target.getAttribute('name')
    if (name === 'account') {
      setAccount(event.target.value)
    } else if (name === 'password') {
      setPassword(event.target.value)
    }
  })
  return (
    <div className={styles.Register}>
      <Head>
        <title>注册</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>注册新的账号</h2>
          <label>账户：
            <TextField required error={!isFirst && account === ""} helperText="账户名不能为空" name="account" type="text" placeholder="请输入你的账户" autoFocus={true} variant="standard" value={account} onChange={handleInput}></TextField>
          </label>
          <label>密码：
            <TextField required error={!isFirst && password.length < 6 || password.length > 16} name="password" type="password" placeholder="请输入你的密码" variant="standard" helperText="密码长度在8-16位" value={password} onChange={handleInput}></TextField>
          </label>
          <div className={styles.buttons}>
            <Button variant="contained" type="submit">注册</Button>
            <Button variant="contained" type="button"><Link href="/register">登录</Link></Button>
          </div>
        </form>
      </div>
    </div>)
})
export default Register