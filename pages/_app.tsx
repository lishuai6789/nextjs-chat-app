import axios, { AxiosResponse } from 'axios'
import { getCookie } from 'cookies-next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import '../styles/app.scss'
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    // Bmob.User.login('lishuai', 'qq1735612628')
    // .then((res) => console.log(res))
    // .catch((err) => {
    //   router.push("/login")
    // })
  }, [])
  return (<div>
    <Head>
      <title>聊天室</title>
    </Head>
    <Component {...pageProps} />
  </div>)
}