import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material"
import { message } from "antd"
import { useFormik } from "formik"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import * as Yup from 'yup'
import { reqLogin } from "../../api"
import {useAxios} from "../../api/useAxios"
import CopyRight from "../../components/CopyRight"
import styles from '../../styles/login.module.scss'
export default function Login(): ReactElement {
  const router = useRouter()
  const myAxios = useAxios();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
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
    }),
    onSubmit: async (values, actions) => {
      setLoading(true);
      const res = await myAxios(reqLogin(values.username, values.password, values.rememberMe));
      const data = await res.data;
      setLoading(false);
      if (data.code === 200) {
        messageApi.success({content: "成功登录"});
        router.push("/");
      } else {
        messageApi.error({content: "用户名或者密码错误，请重新输入"});
      }
    }
  });
  return (
    <div className={styles.Login}>
      <Head>
        <title>登录</title>
      </Head>
      {contextHolder}
      <div className={styles.container}>
        <h2>登录网上聊天室</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <TextField required
            error={formik.touched.username && formik.errors.username ? true : false}
            helperText={formik.touched.username && formik.errors.username}
            name="username"
            type="text"
            placeholder="请输入你的账户"
            autoFocus={true}
            variant="standard"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{ height: '60px' }}
            label="账户名"></TextField>
          <TextField required
            error={formik.touched.password && formik.errors.password ? true : false}
            name="password"
            type="password"
            placeholder="请输入你的密码"
            variant="standard"
            helperText={formik.touched.password && formik.errors.password}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            sx={{ height: '60px' }}
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