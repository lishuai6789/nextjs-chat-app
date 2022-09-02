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
      <nav>
        <ul>
          {
            arr.map((i) => {
              return <li key={i.to}><Link href={i.to}><a>{i.name}</a></Link></li>
            })
          }
        </ul>
      </nav>
    </div>
  )
}
