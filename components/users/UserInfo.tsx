import { memo } from "react";
import styles from '../../styles/UserInfo.module.scss'
import Image from 'next/future/image'
interface Info {
  imgSrc: string,
  username: string,
  signature: string
}
import Vercel from '../../public/vercel.svg'
function UserInfo(props: Info) {
  return (
    <div className={styles.Container}>
      <div className={styles.avatarWrapper}>
        <Image src={Vercel} width={50} height={50} alt="avatar" 
        style={{ border: 'solid 1px black', overflow: 'hidden', borderRadius: '50%'}} />
      </div>
      <div className={styles.userWrapper}>
        <h3>{props.username}</h3>
        <p>{props.signature}</p>
      </div>
    </div>
  )
}
export default memo(UserInfo)