import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import { Button, ButtonGroup, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { InferGetServerSidePropsType } from 'next';
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from 'next/image';
import nookies from 'nookies';
import { FormEvent, memo, ReactElement, Suspense, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState, wrapper } from '../components/index/store';
import { openProfile } from "../components/index/uiSlice";
import { updateAvatar, updateNickname, updateSignature, updateUsername } from "../components/index/userSlice";
import styles from '../styles/index.module.scss';
import { AESDecrypt } from '../utils/crpto/crypto';

const FormDialog = dynamic(() => import('../components/index/FomDialog'))

const UserInfo = memo(function UserInfo(): ReactElement {
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


export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  if (!nookies.get(context).satoken) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }
  const res = await fetch('http://localhost:8080/profile/getProfile', {
    headers: {
      satoken: AESDecrypt(nookies.get(context).satoken)
    },
    method: "POST"
  })
  const data = await res.json();
  if (data.code !== 0) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }
  await store.dispatch(updateNickname(data.data.nickname));
  await store.dispatch(updateUsername(data.data.username));
  await store.dispatch(updateAvatar(data.data.avatarPath));
  await store.dispatch(updateSignature(data.data.signature));
  return {
    props: {

    }
  }
})

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
  const username = useSelector((state: RootState) => state.user.username)
  return (
    <div className={styles.container}>
      <Head>
        <title>{username === '' ? '正在加载中' : username}</title>
      </Head>
      <aside className={styles.side}>
        <UserInfo />
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