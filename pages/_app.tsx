import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import '../styles/app.scss'
import AxiosInstance from '../utils/aixos/axios'
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    AxiosInstance.get('/auth/isLogin')
    .then((res) => {
      if (res.data.msg === 'false') {
        router.push('/auth/login')
      } else if (res.data.msg === 'true') {
        if (router.pathname === '/auth/login') {
          router.push('/')
        }
      }
    })
    .catch((err) => {
      router.push('/auth/login')
    })
  }, [])
  return (<div>
    <Head>
      <title>聊天室</title>
    </Head>
    <Component {...pageProps} />
  </div>)
}