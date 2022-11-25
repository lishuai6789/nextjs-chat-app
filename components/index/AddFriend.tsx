import SendIcon from "@mui/icons-material/Send";
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useFormik } from "formik";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { closeAddFriend } from "../../store/uiSlice";
import styles from '../../styles/AddFriend.module.scss';
import UserInfo, { UserInfoProps } from "./UserInfo";
import { object, string } from 'yup'
import { useAxios } from "../../api/useAxios";
import { reqGetFriendProfile } from '../../api/index'

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
  const [alert, setAlert] = useState({ show: false, mes: '' })
  const [userinfo, setUserinfo] = useState<UserInfoProps>(null)
  const [needAdd, setNeedAdd] = useState<boolean>(false)
  const [searchBut, setSearchBut] = useState<{ loading: boolean, color: "primary" | "success" | "error" }>({ loading: false, color: "primary" })
  const myAxios = useAxios();
  const searchFormik = useFormik({
    initialValues: {
      username: '',
    },
    validationSchema: object({
      username: string().required("必填")
    }),
    onSubmit: async (values, actions) => {
      const res = await myAxios(reqGetFriendProfile(values.username));
      const data = await res.data;
      setUserinfo({nickname: data.data.nickname as string, signature: data.data.signature as string, avatar: data.data.avatar as string});
    }
  })
  return (
    <Dialog open={toggle} onClose={handleCloseDialog}>
      <DialogTitle>添加好友</DialogTitle>
      <DialogContent>
        <div className={styles.searchWrapper}>
          <form onSubmit={searchFormik.handleSubmit}>
            <TextField required autoFocus label="用户名" value={username}
              name="username"
              type="text"
              onChange={searchFormik.handleChange}
              onBlur={searchFormik.handleBlur}
              error={searchFormik.touched.username && searchFormik.errors.username ? true : false} helperText={searchFormik.touched.username && searchFormik.errors.username}
              sx={{height: '60px'}}></TextField>
            <LoadingButton
              endIcon={<SendIcon />}
              loading={searchBut.loading}
              color={searchBut.color}
              loadingPosition="end"
              variant="contained"
              type="submit">
              搜索用户
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