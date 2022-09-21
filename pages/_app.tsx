import 'bootstrap/dist/css/bootstrap.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement } from 'react'
import '../styles/app.scss'

export default function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (<div>
    <Head>
      <title>聊天室</title>
    </Head>
    <Component {...pageProps} />
  </div>)
}