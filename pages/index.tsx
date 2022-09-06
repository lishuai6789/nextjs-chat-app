import Head from "next/head"
import Link from "next/link"
import styles from '../styles/index.module.scss'
export default function Home() {
  const arr = [
    {to: '/', name: 'index'},
    {to: '/login', name: 'login'},
    {to: '/register', name: 'register'}
  ]
  return (
    <div className={styles.container}>
      <Head>
        <title>网上聊天室</title>
      </Head>
      <div>
        检查登陆中...请不要离开
      </div>
    </div>
  )
}
