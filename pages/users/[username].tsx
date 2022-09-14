import axios from 'axios'
import styles from '../../styles/user.module.scss'
import { FormEvent, memo, useEffect, useState } from 'react'
import { Button, ButtonGroup, IconButton, TextField } from '@mui/material'
import Vercel from '../../public/vercel.svg'
import Image from 'next/image'
import { Editable, Slate, withReact } from 'slate-react'
import { createEditor } from 'slate'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AxiosInstance from '../../utils/aixos/axios'
interface UserInfo {
  imgSrc?: string,
  username?: string,
  signature?: string
}
const UserInfo = memo(function UserInfo(props: UserInfo) {
  const [mes, setMes] = useState("")
  useEffect(() => {
    AxiosInstance.get("/api/sayHello")
      .then((res) => {
        console.log(res)
      })
      .catch((err) => console.log(err))
  })
  return (
    <div className={styles.UserInfo}>
      <div className={styles.avatarWrapper}>
        <Image src={Vercel} width={50} height={50} alt="avatar"
          style={{ border: 'solid 1px black', overflow: 'hidden', borderRadius: '50%' }} />
      </div>
      <div className={styles.userWrapper}>
        <h3>{props.username}</h3>
        <p>{props.signature}</p>
      </div>
      <div>{mes}</div>
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
        <TextField className={styles.input} size="small" variant='standard' />
        <Button className={styles.button} type="submit" variant="contained" value={search} onChange={handleChange} placeholder="请问你想找点什么?">搜索</Button>
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
export default function User() {
  return (
    <div className={styles.container}>
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
    </div>
  )
}