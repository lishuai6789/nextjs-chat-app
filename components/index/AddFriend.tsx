import { Dialog, DialogTitle, TextField, Button, DialogContent, DialogActions, Alert } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import { ChangeEvent, FormEvent, memo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { closeAddFriend } from "../../store/uiSlice"
import styles from '../../styles/AddFriend.module.scss'
import UserInfo from "./UserInfo"
import { UserInfoProps } from "./UserInfo"
import AxiosInstance from "../../utils/aixos/axios"
import { AxiosResponse } from "axios"
import SendIcon from "@mui/icons-material/Send"
const AddFriend = memo(function AddFriend() {
  const toggle: boolean = useSelector((state: RootState): boolean => state.ui.toggleAddFridend)
  const dispatch = useDispatch();
  const handleCloseDialog = () => {
    dispatch(closeAddFriend())
  }
  const [username, setUsername] = useState("");
  const handleInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value.trim())
  }
  const [showResult, setShowResult] = useState<boolean>(false)
  const [result, setResult] = useState<UserInfoProps>(null)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowResult(true)
    if (username === "") {
      return;
    }
    AxiosInstance.post('/profile/searchProfile', {
      username: username
    })
      .then((res: AxiosResponse) => {
        if (res.data.data == null) {
          setResult(null)
        } else {
          setResult({
            "nickname": res.data.data.nickname,
            "avatar": res.data.data.avatarPath,
            "signature": res.data.data.signature,
          })
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  }
  const [buttonState, setButtonState] = useState<{loading: boolean, color: "primary" | "success" | "error"}>({ loading: false, color: "primary" })
  const handleAdd = () => {
    setButtonState({loading: true, color: "primary"})
    AxiosInstance.post("/friend/addFriend")
    .then((res: AxiosResponse) => {
      if (res.data.code === 0) {
        if (res.data.data === null) {
          setButtonState({loading: false, color: "success"})
        }
      }
    })
    .catch(() => {
      setButtonState({ loading: false, color: "error" })
    })
  }
  return (
    <Dialog open={toggle} onClose={handleCloseDialog}>
      <DialogTitle>添加好友</DialogTitle>
      <DialogContent>
        <div className={styles.searchWrapper}>
          <form onSubmit={handleSubmit}>
            <TextField required autoFocus label="用户名" value={username} onChange={handleInput}></TextField>
            <Button type="submit" variant="contained">搜索</Button>
          </form>
        </div>
        {
          showResult && <div className={styles.result}>
            {
              result === null && <Alert severity="error">用户不存在</Alert>
            }
            {
              result !== null && <div className={styles.container}>
                <UserInfo {...result} />
                <LoadingButton
                  size="small"
                  onClick={handleAdd}
                  endIcon={<SendIcon />}
                  loading={buttonState.loading}
                  color={buttonState.color}
                  loadingPosition="end"
                  variant="contained"
                >
                  添加好友
                </LoadingButton>
              </div>
            }
          </div>
        }
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCloseDialog}>关闭</Button>
      </DialogActions>
    </Dialog>
  )
})
export default AddFriend