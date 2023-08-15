import { Typography } from "@mui/material";
import { memo } from "react";
import styles from '../../styles/UserInfo.module.scss';
export interface UserInfoProps {
  nickname: string;
  signature: string;
  avatar: string;
}
const UserInfo = memo(function UserInfo({ nickname, signature, avatar }: UserInfoProps) {
  return (
    <div className={styles.UserInfo}>
      <div className={styles.avatarWrapper}>
        <img className={styles.avatar} src={avatar} alt="avatar" />
      </div>
      <div className={styles.userWrapper}>
        <Typography variant="body1">
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