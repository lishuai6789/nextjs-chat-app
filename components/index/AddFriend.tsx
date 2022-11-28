import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useFormik } from "formik";
import { memo, useState } from "react";
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
  const [userinfo, setUserinfo] = useState<UserInfoProps>(null)
  const [needAdd, setNeedAdd] = useState<boolean>(false)
  const myAxios = useAxios();
  const [searchLoading, setSearchLoading] = useState(false);
  const searchFormik = useFormik({
    initialValues: {
      username: '',
    },
    validationSchema: object({
      username: string().required("必填")
    }),
    onSubmit: async (values, actions) => {
      setSearchLoading(true);
      const res = await myAxios(reqGetFriendProfile(values.username));
      const data = await res.data;
      setSearchLoading(false);
      if (data.data) {
        setUserinfo({ nickname: data.data.nickname as string, signature: data.data.signature as string, avatar: data.data.avatar as string });
        setNeedAdd(data.data.needAdd as boolean);
      } else {
        actions.setFieldError("username", "查无此人");
      }
    }
  })
  return (
    <Dialog open={toggle} onClose={handleCloseDialog}>
      <DialogTitle>添加好友</DialogTitle>
      <DialogContent>
        <div className={styles.searchWrapper}>
          <form onSubmit={searchFormik.handleSubmit}>
            <TextField required autoFocus
              label="用户名"
              name="username"
              type="text"
              onChange={searchFormik.handleChange}
              value={searchFormik.values.username}
              onBlur={searchFormik.handleBlur}
              error={searchFormik.touched.username && searchFormik.errors.username ? true : false} helperText={searchFormik.touched.username && searchFormik.errors.username}
              sx={{ height: '60px' }}></TextField>
            <Button
              disabled={searchLoading}
              variant="contained"
              type="submit">
              搜索用户
            </Button>
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
              needAdd && <Button
                size="small"
                variant="contained"
              >
                添加好友
              </Button>
            }
          </div>
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