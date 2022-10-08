import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material"
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useFormik } from "formik"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { memo, ReactElement, useState } from "react"
import * as Yup from 'yup'
import { SERVER_URL } from "../../constant/constant"
import styles from '../../styles/login.module.scss'
const CopyRight = memo(function CopyRight(): ReactElement {
  return (
    <p>
      Copyright © 李帅的网站
    </p>
  )
})
export default function Login(): ReactElement {
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      rememberMe: true
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, '用户名长度不能少于三个字符')
        .max(20, '用户名长度不嫩那个超过20个字符')
        .required("必填"),
      password: Yup.string()
        .min(8, '密码长度过短')
        .max(20, '密码过长')
        .required("必填"),
      rememberMe: Yup.boolean()
    }),
    onSubmit: (values, actions) => {
      setLoading(true)
      axios.post(`${SERVER_URL}/auth/login`, {
        username: values.username,
        password: values.password,
        rememberMe: values.rememberMe,
      }, {
        withCredentials: true
      })
        .then(async (res: AxiosResponse) => {
          setLoading(false)
          console.log(res)
          if (res.status === 500) {
          } else if (res.status >= 400) {
          } else {
            let data = await res.data
            if (data.code === 200) {
              console.log("inovke")
              router.push('/')
            }
          }
        })
        .catch((error: any) => {
          setLoading(false)
          if (error instanceof AxiosError) {
            if (error.response.status === 500) {

            } else {

            }
          }
        })
    }
  });
  const [loading, setLoading] = useState(false)
  return (
    <div className={styles.Login}>
      <Head>
        <title>登录</title>
      </Head>
      <div className={styles.container}>
        <h2>登录网上聊天室</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <TextField required
            error={formik.errors.username ? true : false}
            helperText={formik.errors.username}
            name="username"
            type="text"
            placeholder="请输入你的账户"
            autoFocus={true}
            variant="standard"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="账户名"></TextField>
          <TextField required
            error={formik.errors.password ? true : false}
            name="password"
            type="password"
            placeholder="请输入你的密码"
            variant="standard"
            helperText={formik.errors.password}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            label="密码"></TextField>
          <FormControlLabel
            value={formik.values.rememberMe}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            control={<Checkbox defaultChecked name="remeberMe" />} label="记住我"></FormControlLabel>
          <br />
          <Button variant="contained" type="submit" disabled={loading}>{loading ? '登陆中' : '登录'}</Button>
          <Button variant="contained" type="button"><Link href="/auth/register">注册</Link></Button>
        </form>
        <CopyRight />
      </div>
    </div>)
}