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
  const [alert, setAlert] = useState({show: false, mes: ''})
  const [userinfo, setUserinfo] = useState<UserInfoProps>(null)
  const [needAdd, setNeedAdd] = useState<boolean>(false)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (username === "") {
      return;
    }
    AxiosInstance.post('/friend/getFriendProfile', {
      friend: username
    })
      .then(async (res: AxiosResponse) => {
        const data = await res.data;
        if (data.data == null) {
          setUserinfo(null)
          setAlert({show: true, mes: '查无此人'})
        } else {
          setAlert({show: false, mes: ''})
          setUserinfo({
            "nickname": data.data.nickname,
            "avatar": data.data.avatarPath,
            "signature": data.data.signature,
          })
          setNeedAdd(data.data.needAdd)
        }
      })
      .catch((error: any) => {
        setAlert({show: true, mes: '发生了错误'})
        setUserinfo(null)
        setButtonState({loading: false, color: "error"})
      })
  }
  const [buttonState, setButtonState] = useState<{loading: boolean, color: "primary" | "success" | "error"}>({ loading: false, color: "primary" })
  const handleAdd = () => {
    setButtonState({loading: true, color: "primary"})
    AxiosInstance.post("/friend/addFriend", {
      friend: username
    })
    .then((res: AxiosResponse) => {
      if (res.data.code === 0) {
        if (res.data.data === null) {
          setButtonState({loading: false, color: "success"})
        }
      }
    })
    .catch((err: Error) => {
      console.log(err)
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
          userinfo !== null && <div className={styles.container}>
            <UserInfo {...userinfo} />
            {
              needAdd && <LoadingButton
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
            }
          </div>
        }
        {
          alert.show && <Alert severity="error">{alert.mes}</Alert>
        }
      </DialogContent>
      <hr />
      <DialogActions>
        <Button variant="contained" onClick={handleCloseDialog}>关闭</Button>
      </DialogActions>
    </Dialog>
  )
})
export default AddFriend