import { Alert, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { ReactElement, useState } from "react";
import * as Yup from 'yup';
import styles from '../../styles/register.module.scss';
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import CopyRight from "../../components/CopyRight";
import { SERVER_URL } from "../../constant/constant";
const Register = function Register(): ReactElement {
  const router = useRouter()
  const [error, setError] = useState("")
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      retype: ''
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
      retype: Yup.string()
        .oneOf([Yup.ref('password'), null], '密码不匹配')
        .required("必填")
    }),
    onSubmit: (values, actions) => {
      const para = new URLSearchParams();
      para.append('username', values.username)
      para.append('password', values.password)
      axios.post(`${SERVER_URL}/auth/register`, para)
        .then(async (res: AxiosResponse) => {
          console.log(res)
          setError("")
          const data = await res.data
          if (res.status >= 500) {
            setError("注册发生了错误")
          } else if (res.status === 400) {
            setError("请求不合法，请重新输入")
          } else if (data.code === 200) {
            setError("")
            router.push('/auth/login')
          } else if (data.code === 500 || data.code === 1) {
            setError("用户名已被注册，请更换用户名")
          }
        })
        .catch((err: AxiosError) => {
          setError("注册发生了错误")
        })
    }
  });
  return (
    <div className={styles.Register}>
      <Head>
        <title>注册</title>
      </Head>
      <div className={styles.container}>
        <h2>注册新的账号</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit} encType="application/x-www-form-urlencoded" autoComplete="off">
          <span>用户名：</span>
          <label>
            <TextField required
              error={formik.touched.username && formik.errors.username ? true : false}
              helperText={formik.touched.username && formik.errors.username}
              name="username"
              type="text"
              placeholder="请输入你的账户"
              autoFocus={true}
              onBlur={formik.handleBlur}
              variant="standard"
              value={formik.values.username}
              onChange={formik.handleChange}></TextField>
          </label>
          <span>密  码：</span>
          <label>
            <TextField required
              error={formik.touched.password && formik.errors.password ? true : false}
              name="password"
              type="password"
              placeholder="请输入你的密码"
              variant="standard"
              helperText={formik.touched.password && formik.errors.password}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}></TextField>
          </label>
          <span>确认密码：</span>
          <label>
            <TextField required
              type="password"
              name="retype"
              placeholder="请重新输入密码"
              variant="standard"
              helperText={formik.touched.retype && formik.errors.retype}
              value={formik.values.retype}
              onBlur={formik.handleBlur}
              error={formik.touched.retype && formik.errors.retype ? true : false}
              onChange={formik.handleChange}></TextField>
          </label>
          <Button variant="contained" type="submit">注册</Button>
          <Button variant="contained" type="button"><Link href="/auth/login">登录</Link></Button>
        </form>
        {
          error !== "" && (
            <Alert severity="error">{error}</Alert>
          )
        }
        <CopyRight />
      </div>
    </div>
  )
}
export default Register