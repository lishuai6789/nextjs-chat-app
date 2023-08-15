import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import { Button, ButtonGroup, IconButton } from '@mui/material';
import Head from "next/head";
import nookies from 'nookies';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import BasicMenu from '../components/index/Menu';
import Friends from '../components/index/Friens';
import UserInfo from '../components/index/UserInfo';
import { RootState, wrapper } from '../store/store';
import { closeAddFriend, closeNotLogin, closeProfile } from '../store/uiSlice';
import { updateAvatar, updateNickname, updateSignature, updateUsername } from "../store/userSlice";
import styles from '../styles/index.module.scss';

const Bottom = () => {
  return (
    <div className={styles.Bottom}>
      <Button variant='contained'>词云</Button>
      <Button variant='contained'>+</Button>
    </div>
  )
}
const MainHeader = () => {
  return (
    <div className={styles.MainHeader}>
      <div>
        {/* <UserInfo /> */}
      </div>
      <div>

      </div>
    </div>
  )
}
const ChatArea = () => {
  return (
    <div className={styles.ChatArea}>

    </div>
  )
}
const InputChat = () => {
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
}

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
  store.dispatch(updateUsername(data.data.username));
  store.dispatch(updateNickname(data.data.nickname));
  store.dispatch(updateSignature(data.data.signature));
  store.dispatch(updateAvatar(data.data.avatarPath))
  return {
    props: {
    }
  }
})

export default function Home() {
  // FIXME: 放在页面的顶级组件上，一定会有性能问题，况且还没有使用memo
  const username = useSelector((state: RootState) => state.user.username);
  const nickname: string = useSelector((state: RootState) => state.user.nickname);
  const signature: string = useSelector((state: RootState) => state.user.signature);
  const avatar: string = useSelector((state: RootState) => state.user.avatarUrl);
  const dispatch = useDispatch();
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
        <header>
          {/* FIXME: 此处将会产生性能问题 */}
          <UserInfo {...{ nickname, signature, avatar }} />
          <BasicMenu />
        </header>
        <main>
          <Friends />
        </main>
        <footer>
          <Bottom />
        </footer>
      </aside>
      <main className={styles.main}>
        <MainHeader />
        <ChatArea />
        <InputChat />
      </main>
    </div>
  )
}