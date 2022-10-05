import { Typography } from "@mui/material";
import Image from "next/image";
import { memo, ReactElement } from "react";
import styles from '../../styles/UserInfo.module.scss';
export interface UserInfoProps {
  nickname: string;
  signature: string;
  avatar: string;
}
const UserInfo = memo(function UserInfo({ nickname, signature, avatar }: UserInfoProps): ReactElement {
  return (
    <div className={styles.UserInfo}>
      <div className={styles.avatarWrapper}>
        <Image className={styles.avatar} src={avatar} alt="" width={50} height={50} />
      </div>
      <div className={styles.userWrapper}>
        <Typography variant="h6">
          {nickname}
        </Typography>
        <Typography variant="body1">
          {signature === "" ? '此人无签名' : signature}
        </Typography>
      </div>
    </div>
  )
})
export default UserInfo