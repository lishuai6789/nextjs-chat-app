import { Dialog, DialogTitle, TextField, Button, DialogContent, DialogActions } from "@mui/material"
import { ChangeEvent, memo, useState } from "react"
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
  const [input, setInput] = useState("");
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }
  const [user, setUser] = useState<UserInfoProps | null>(null);
  const handleSearch = () => {
    if (input === "") {
      return;
    }
    AxiosInstance.post('/friend/search', {
      username: input
    })
    .then((res: AxiosResponse) => {

    })
    .catch((error: any) => {

    })
  }
  return (
    <Dialog open={toggle} onClose={handleCloseDialog}>
      <DialogTitle>添加好友</DialogTitle>
      <DialogContent>
        <div className={styles.searchWrapper}>
          <TextField autoFocus label="用户名" value={input} onChange={handleInput}></TextField>
          <Button variant="contained" onClick={handleSearch}>搜索</Button>
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