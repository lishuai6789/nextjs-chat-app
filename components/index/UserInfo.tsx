import { Tooltip, Typography } from "@mui/material"
import { memo, ReactElement } from "react"
import styles from '../../styles/UserInfo.module.scss'
interface Props {
  nickname: string;
  signature: string;
  avatar: string;
}
const UserInfo = memo(function UserInfo({nickname, signature, avatar}: Props): ReactElement {
  return (
    <div className={styles.UserInfo}>
      <div className={styles.avatarWrapper}>
        <Tooltip title="点击修改用户信息">
          <img className={styles.avatar} src={avatar} alt="" />
        </Tooltip>
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