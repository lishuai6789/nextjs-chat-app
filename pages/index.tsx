import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import { Button, ButtonGroup, IconButton, TextField } from '@mui/material';
import { InferGetServerSidePropsType } from 'next';
import Head from "next/head";
import nookies from 'nookies';
import { FormEvent, memo, ReactElement, useState } from 'react';
import { useSelector } from "react-redux";
import BasicMenu from '../components/index/Menu';
import UserInfo from '../components/index/UserInfo';
import { RootState, wrapper } from '../store/store';
import { updateAvatar, updateNickname, updateSignature, updateUsername } from "../store/userSlice";
import styles from '../styles/index.module.scss';

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
  console.log("getServerSideProps", JSON.stringify(nookies.get(context)))
  const res = await fetch('http://localhost:8080/profile/getProfile', {
    method: 'POST',
    credentials: "include",
    headers: {
      "Cookie": `satoken=${nookies.get(context)["satoken"]}`
    }
  })
  const data = await res.json();
  console.log("res", data)
  if (data.code !== 0) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }
  store.dispatch(updateNickname(data.data.nickname));
  store.dispatch(updateUsername(data.data.username));
  store.dispatch(updateAvatar(data.data.avatarPath));
  store.dispatch(updateSignature(data.data.signature));
  return {
    props: {

    }
  }
})

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
  const username = useSelector((state: RootState) => state.user.username)
  const nickname: string = useSelector((state: RootState) => state.user.nickname)
  const signature: string = useSelector((state: RootState) => state.user.signature)
  const avatar: string = useSelector((state: RootState) => state.user.avatarUrl)
  return (
    <div className={styles.container}>
      <Head>
        <title>{username === '' ? '正在加载中' : username}</title>
      </Head>
      <aside className={styles.side}>
        <section>
          <UserInfo {...{ nickname, signature, avatar }} />
          <BasicMenu />
        </section>
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