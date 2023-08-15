import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import * as Yup from 'yup';
import styles from '../../styles/register.module.scss';
import { useRouter } from "next/router";
import CopyRight from "../../components/CopyRight";
import { useAxios } from "../../api/useAxios";
import { reqRegister } from "../../api";
import { message } from "antd";
const Register = function Register() {
  const router = useRouter();
  const myAxios = useAxios();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
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
    onSubmit: async (values, actions) => {
      setLoading(true);
      const res = await myAxios(reqRegister(values.username, values.password));
      const data = await res.data
      setLoading(false);
      if (data.code === 200) {
        messageApi.success("成功注册，请登录您的账号");
        router.push('/auth/login')
      } else if (data.code === 400) {
        messageApi.error("输入格式不正确，请重新输入");
      } else if (data.code === 500) {
        messageApi.error("用户名重复，请更换用户名");
        actions.setFieldError("username", "用户名重复")
      }
    }
  });
  return (
    <div className={styles.Register}>
      <Head>
        <title>注册</title>
      </Head>
      {contextHolder}
      <div className={styles.container}>
        <h2>注册新的账号</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit} encType="application/x-www-form-urlencoded" autoComplete="off">
          <div className={styles.inputs}>
            <TextField required
              error={formik.touched.username && formik.errors.username ? true : false}
              helperText={formik.touched.username && formik.errors.username}
              name="username"
              type="text"
              placeholder="请输入你的账户"
              autoFocus={true}
              onBlur={formik.handleBlur}
              variant="standard"
              sx={{ height: '60px' }}
              label="用户名"
              value={formik.values.username}
              onChange={formik.handleChange}></TextField>
            <TextField required
              error={formik.touched.password && formik.errors.password ? true : false}
              name="password"
              type="password"
              placeholder="请输入你的密码"
              variant="standard"
              label="密码"
              helperText={formik.touched.password && formik.errors.password}
              value={formik.values.password}
              sx={{ height: '60px' }}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}></TextField>
            <TextField required
              type="password"
              name="retype"
              placeholder="请重新输入密码"
              variant="standard"
              helperText={formik.touched.retype && formik.errors.retype}
              value={formik.values.retype}
              onBlur={formik.handleBlur}
              sx={{ height: '60px' }}
              label="确认密码"
              error={formik.touched.retype && formik.errors.retype ? true : false}
              onChange={formik.handleChange}></TextField>
          </div>
          <div className={styles.buttons}>
            <Button variant="contained" disabled={loading} type="submit">{loading ? "注册中" : "注册"}</Button>
            <Button variant="contained" type="button"><Link href="/auth/login">登录</Link></Button>
          </div>
        </form>
        <CopyRight />
      </div>
    </div>
  )
}
export default Register