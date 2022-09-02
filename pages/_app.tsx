import type { AppProps } from 'next/app'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import '../styles/app.scss'
import Head from 'next/head'
import Footer from '../components/footer'
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  // if (error) {
    
  //   return (<div>
  //     检查登录失败，页面将自动刷新
  //   </div>)
  // }
  // if (!data) {
  //   return (<div>
  //     Checking authening
  //   </div>)
  // }
  return (<div>
    <Head>
      
    </Head>
    <Component {...pageProps} />
    <Footer />
  </div>)
}