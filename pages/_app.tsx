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
    axios('http://localhost:8080/auth/tokenLogin', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getCookie('token')}`
      }
    })
    .then((res: AxiosResponse) => {
      router.push(`/users/${res.data.username}`)
    })
    .catch(() => {
      // router.push("/login")
    })
  }, [])
  return (<div>
    <Head>
      <title>聊天室</title>
    </Head>
    <Component {...pageProps} />
  </div>)
}