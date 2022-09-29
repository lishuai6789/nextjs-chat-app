import { Tooltip, Typography } from "@mui/material"
import { memo, ReactElement } from "react"
import styles from '../../styles/UserInfo.module.scss'
export interface UserInfoProps {
  nickname: string;
  signature: string;
  avatar: string;
}
const UserInfo = memo(function UserInfo({ nickname, signature, avatar }: UserInfoProps): ReactElement {
  return (
    <div className={styles.UserInfo}>
      <div className={styles.avatarWrapper}>
        <img className={styles.avatar} src={avatar} alt="" />
      </div>
      <div className={styles.userWrapper}>
        <Typography variant="h6">
          {nickname}
        </Typography>
        <p>{signature}</p>
      </div>
    </div>
  )
})
export default UserInfo