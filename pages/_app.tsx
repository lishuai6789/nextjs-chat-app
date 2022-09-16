import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import '../styles/app.scss'
import AxiosInstance from '../utils/aixos/axios'
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(true);
  useEffect(() => {
    AxiosInstance.get('/auth/isLogin')
      .then(async (res) => {
        if (res.data.msg === 'false') {
          await router.push('/auth/login')
          setIsPending(false)
        } else if (res.data.msg === 'true') {
          if (router.pathname === '/auth/login') {
            router.push('/')
          }
          setIsPending(false)
        }
      })
      .catch(async (err) => {
        await router.push('/auth/login')
        setIsPending(false)
      })
  }, [])
  return (<div>
    <Head>
      <title>聊天室</title>
    </Head>
    {
      !isPending && <Component {...pageProps} />
    }
  </div>)
}