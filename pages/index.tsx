import Head from "next/head"
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import React, { Context, createContext, FormEvent, memo, useContext, useEffect, useState, useLayoutEffect, Suspense, ReactElement } from 'react'
import Vercel from '../public/vercel.svg'
import { Button, ButtonGroup, IconButton, TextField, Typography, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material'
import AxiosInstance from "../utils/aixos/axios";
import styles from '../styles/index.module.scss'
import { AxiosError, AxiosResponse } from "axios";
import Image from 'next/image'
import { RootState, store } from '../components/index/store'
import { Provider, useDispatch, useSelector } from "react-redux";
import { updateAvatar, updateNickname, updateSignature, updateUsername } from "../components/index/userSlice";
import { openProfile, closeProfile } from "../components/index/uiSlice";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
const FormDialog = dynamic(() => import('../components/index/FomDialog'))

const UserInfo = memo(function UserInfo(props: any): ReactElement {
  const nickname: string = useSelector((state: RootState) => state.user.nickname)
  const signature: string = useSelector((state: RootState) => state.user.signature)
  const avatar: string = useSelector((state: RootState) => state.user.avatarUrl)
  const toggle: boolean = useSelector((state: RootState) => state.ui.toggleProfile)
  const dispatch = useDispatch()
  const handleOpenProfile = () => {
    dispatch(openProfile())
  }
  return (
    <div className={styles.UserInfo}>
      <div className={styles.avatarWrapper}>
        <Tooltip title="点击修改用户信息">
          <span>
            <Button variant="text" onClick={handleOpenProfile} disabled={toggle} >
              {
                avatar !== '' && <Image referrerPolicy="origin" className={styles.avatar} src={avatar} alt="" width={50} height={50} />
              }
            </Button>
          </span>
        </Tooltip>
      </div>
      <div className={styles.userWrapper}>
        <Typography variant="h6">
          {nickname}
        </Typography>
        <p>{signature}</p>
      </div>
      {
        toggle && <Suspense>
          <FormDialog />
        </Suspense>
      }
    </div>
  )
})

const SearchBar = memo(function SearchBar(): ReactElement {
  const [search, setSearch] = useState("")
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
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
const FriendList = memo(function FriendList(): ReactElement {
  return (
    <div className={styles.FriendList}>

    </div>
  )
})
const Bottom = memo(function Bottom(): ReactElement {
  return (
    <div className={styles.Bottom}>
      <Button variant='contained'>词云</Button>
      <Button variant='contained'>+</Button>
    </div>
  )
})
const MainHeader = memo(function MainHeader(): ReactElement {
  return (
    <div className={styles.MainHeader}>
      <div>
        {/* <UserInfo /> */}
      </div>
      <div>

      </div>
    </div>
  )
})
const ChatArea = memo(function ChatArea(): ReactElement {
  return (
    <div className={styles.ChatArea}>

    </div>
  )
})
const InputChat = memo(function InputChat(): ReactElement {
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

function Home(): ReactElement {
  const username = useSelector((state: RootState) => state.user.username)
  const dispatch = useDispatch();
  useEffect(() => {
    AxiosInstance.post('/profile/getProfile')
      .then(async (res: AxiosResponse) => {
        let data = res.data.data
        dispatch(updateUsername(data.username))
        dispatch(updateNickname(data.nickname))
        dispatch(updateSignature(data.signature))
        dispatch(updateAvatar(data.avatarPath))
      })
      .catch((err: any) => {
        if (err instanceof AxiosError) {

        }
      })
  }, [])
  return (
    <div className={styles.container}>
      <Head>
        <title>{username === '' ? '正在加载中' : username}</title>
      </Head>
      <aside className={styles.side}>
        <UserInfo signature='这是一段话qdqdqdqqdqfafwfdggggggggggggdt' />
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
export default function HomeWrapper() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  )
}
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   context.req.headers
//   return {
//     props: {}
//   }
// }