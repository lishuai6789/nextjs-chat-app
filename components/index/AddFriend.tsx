import { Dialog, DialogTitle, TextField, Button, DialogContent, DialogActions } from "@mui/material"
import { ChangeEvent, FormEvent, memo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./store"
import { closeAddFriend } from "./uiSlice"
import styles from '../../styles/AddFriend.module.scss'
import UserInfo from "./UserInfo"
import { UserInfoProps } from "./UserInfo"
import AxiosInstance from "../../utils/aixos/axios"
import { AxiosResponse } from "axios"
const AddFriend = memo(function AddFriend() {
  const toggle: boolean = useSelector((state: RootState): boolean => state.ui.toggleAddFridend)
  const dispatch = useDispatch();
  const handleCloseDialog = () => {
    dispatch(closeAddFriend())
  }
  const [username, setUsername] = useState("");
  const handleInput = (event: ChangeEvent<HTMLInputElement>):void => {
    setUsername(event.target.value.trim())
  }
  const [user, setUser] = useState<UserInfoProps | null>(null);
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (username === "") {
      return;
    }
    AxiosInstance.post('/profile/getProfile', {
      username: username
    })
    .then((res: AxiosResponse) => {
      console.log(res)
    })
    .catch((error: any) => {

    })
  }
  return (
    <Dialog open={toggle} onClose={handleCloseDialog}>
      <DialogTitle>添加好友</DialogTitle>
      <DialogContent>
        <div className={styles.searchWrapper}>
          <form onSubmit={handleSearch}>
            <TextField required autoFocus label="用户名" value={username} onChange={handleInput}></TextField>
            <Button type="submit" variant="contained">搜索</Button>
          </form>
        </div>
        <div className={styles.show}>
          {
            user !== null && <UserInfo {...user} />
          }
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCloseDialog}>关闭</Button>
      </DialogActions>
    </Dialog>
  )
})
export default AddFriend