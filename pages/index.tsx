import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import { Button, ButtonGroup, IconButton, Snackbar } from '@mui/material';
import { InferGetServerSidePropsType } from 'next';
import Head from "next/head";
import nookies from 'nookies';
import { createContext, memo, ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import BasicMenu from '../components/index/Menu';
import SearchBar from '../components/index/SearchBar';
import UserInfo from '../components/index/UserInfo';
import { RootState, wrapper } from '../store/store';
import { closeAddFriend, closeNotLogin, closeProfile } from '../store/uiSlice';
import { updateAvatar, updateNickname, updateSignature, updateUsername } from "../store/userSlice";
import styles from '../styles/index.module.scss';
export const AxiosContext = createContext(null)

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
  const res = await fetch('http://localhost:8080/profile/getOwnProfile', {
    method: 'POST',
    credentials: "include",
    headers: {
      "Cookie": `satoken=${nookies.get(context)["satoken"]}`
    }
  })
  const data = await res.json();
  if (res.status === 401) {
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
  const toggleNotLogin = useSelector((state: RootState) => state.ui.toggleNotLoginWarm)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(closeAddFriend())
    dispatch(closeNotLogin())
    dispatch(closeProfile())
  }, [])
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
      <Snackbar
        open={toggleNotLogin}
        autoHideDuration={6000}
        message="您未登录"
      />
    </div>
  )
}