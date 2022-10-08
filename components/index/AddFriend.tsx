import SendIcon from "@mui/icons-material/Send";
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { AxiosResponse } from "axios";
import { ChangeEvent, FormEvent, memo, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AxiosContext } from "../../pages";
import { RootState } from "../../store/store";
import { closeAddFriend } from "../../store/uiSlice";
import styles from '../../styles/AddFriend.module.scss';
import UserInfo, { UserInfoProps } from "./UserInfo";
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
  const [searchBut, setSearchBut] = useState<{ loading: boolean, color: "primary" | "success" | "error" }>({ loading: false, color: "primary" })
  const axiosContext = useContext(AxiosContext)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (username === "") {
      return;
    }
    axiosContext.axios.post('/friend/getFriendProfile', {
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
          setNeedAdd(data.needAdd)
        }
        setSearchBut({ loading: false, color: "success" })
      })
      .catch((error: any) => {
        setAlert({show: true, mes: '发生了错误'})
        setUserinfo(null)
        setSearchBut({loading: false, color: "error"})
      })
  }
  const [addButState, setAddButState] = useState<{loading: boolean, color: "primary" | "success" | "error"}>({ loading: false, color: "primary" })
  const handleAdd = () => {
    setAddButState({loading: true, color: "primary"})
    axiosContext.axios.post("/friend/addFriend", {
      friend: username
    })
    .then((res: AxiosResponse) => {
      if (res.data.code === 0) {
        if (res.data.data === null) {
          setAddButState({loading: false, color: "success"})
        }
      }
    })
    .catch((err: Error) => {
      console.log(err)
      setAddButState({ loading: false, color: "error" })
    })
  }
  return (
    <Dialog open={toggle} onClose={handleCloseDialog}>
      <DialogTitle>添加好友</DialogTitle>
      <DialogContent>
        <div className={styles.searchWrapper}>
          <form onSubmit={handleSubmit}>
            <TextField required autoFocus label="用户名" value={username} onChange={handleInput}></TextField>
            <LoadingButton
              endIcon={<SendIcon />}
              loading={searchBut.loading}
              color={searchBut.color}
              loadingPosition="end"
              variant="contained"
              type="submit">
                搜索
            </LoadingButton>
          </form>
        </div>
        {
          userinfo !== null && <div className={styles.container}>
            <UserInfo {...userinfo} />
            {
              !needAdd && <Button
                size="small"
                color="primary"
                variant="contained"
                disabled={true}
              >
                已添加
              </Button>
            }
            {
              needAdd && <LoadingButton
                size="small"
                onClick={handleAdd}
                endIcon={<SendIcon />}
                loading={addButState.loading}
                color={addButState.color}
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