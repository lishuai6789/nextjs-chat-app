import Head from "next/head"
import Link from "next/link"
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import { createContext, FormEvent, memo, useEffect, useState } from 'react'
import { Button, ButtonGroup, IconButton, TextField } from '@mui/material'
import Vercel from '../public/vercel.svg'
import Image from 'next/image'
import AxiosInstance from "../utils/aixos/axios";
import styles from '../styles/index.module.scss'
import { AxiosError, AxiosResponse } from "axios";
interface UserInfo {
  imgSrc?: string,
  username?: string,
  signature?: string
}
const UserInfo = memo(function UserInfo(props: UserInfo) {
  return (
    <div className={styles.UserInfo}>
      <div className={styles.avatarWrapper}>
        <Image src={Vercel} width={50} height={50} alt="avatar" />
      </div>
      <div className={styles.userWrapper}>
        <h3>{props.username}</h3>
        <p>{props.signature}</p>
      </div>
    </div>
  )
})
const SearchBar = memo(function SearchBar() {
  const [search, setSearch] = useState("")
  const handleSubmit = (event: FormEvent) => {

  }
  const handleChange = (event: any) => {
    setSearch(event.target.value)
  }
  return (
    <div className={styles.SearchBar}>
      <form onSubmit={handleSubmit}>
        <TextField className={styles.input} placeholder="请问你想找点什么?" size="small" variant='standard' />
        <Button className={styles.button} type="submit" variant="contained" value={search} onChange={handleChange} >搜索</Button>
      </form>
    </div>
  )
})
const FriendList = memo(function FriendList() {
  return (
    <div className={styles.FriendList}>

    </div>
  )
})
const Bottom = memo(function Bottom() {
  return (
    <div className={styles.Bottom}>
      <Button variant='contained'>词云</Button>
      <Button variant='contained'>+</Button>
    </div>
  )
})
const MainHeader = memo(function MainHeader() {
  return (
    <div className={styles.MainHeader}>
      <div>
        <UserInfo />
      </div>
      <div>

      </div>
    </div>
  )
})
const ChatArea = memo(function ChatArea() {
  return (
    <div className={styles.ChatArea}>

    </div>
  )
})
const InputChat = memo(function InputChat() {
  return (
    <div className={styles.InputChat}>
      <div className={styles.menu}>
        <ButtonGroup variant='contained'>
          <IconButton color="primary">
            <EmojiEmotionsIcon />
          </IconButton>
          <IconButton color="primary">
            <SearchIcon />
          </IconButton>
        </ButtonGroup>
        <Button variant='contained' endIcon={<SendIcon />} className={styles.send}>发送</Button>
      </div>
    </div>
  )
})
const UserContext = createContext({username: ''})
export default function Home() {
  const [userInfo, setUserInfo] = useState({ username: '' })
  useEffect(() => {
    AxiosInstance.get('/auth/getUsername')
    .then((res: AxiosResponse) => {
      setUserInfo({ username: res.data.data })
    })
    .catch((err: any) => {
      if (err instanceof AxiosError) {
        
      }
    })
  }, [])
  return (
    <div className={styles.container}>
      <UserContext.Provider value={userInfo}>
        <Head>
          <title>{userInfo.username === '' ? '正在加载中' : userInfo.username}</title>
        </Head>
        <aside className={styles.side}>
          <UserInfo imgSrc='../../public/vercel.svg' username='test' signature='这是一段话qdqdqdqqdqfafwfd' />
          <SearchBar />
          <FriendList />
          <Bottom />
        </aside>
        <main className={styles.main}>
          <MainHeader />
          <ChatArea />
          <InputChat />
        </main>
      </UserContext.Provider>
    </div>
  )
}
