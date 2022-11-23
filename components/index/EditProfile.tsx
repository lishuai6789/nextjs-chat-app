import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import OSS from 'ali-oss';
import { AxiosError, AxiosResponse } from "axios";
import { useFormik } from 'formik';
import { ChangeEvent, DragEvent, memo, ReactElement, useContext, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { closeProfile } from "../../store/uiSlice";
import { updateAvatar, updateNickname, updateSignature } from "../../store/userSlice";
import styles from '../../styles/EditProfile.module.scss';
import * as Yup from 'yup';
import { useAxios } from '../../api/useAxios';
// TODO: 使用formik改进表单!!!!!
type ButtonStateType =
  | { loading: false, color: 'primary' }
  | { loading: true, color: 'primary' }
  | { loading: false, color: 'success' }
  | { loading: false, color: 'error' }
type ButActionType =
  | { type: 'success' }
  | { type: "error" }
  | { type: 'load' };
const ModifyNickname = memo(function ModifyNickname(): ReactElement {
  const request = useAxios()
  const [butState, dispatchBut] = useReducer((state: ButtonStateType, action: ButActionType) => {
    if (action.type === 'success') {
      return { loading: false, color: 'success' } as ButtonStateType
    } else if (action.type === 'error') {
      return { loading: false, color: 'error' } as ButtonStateType
    } else if (action.type === 'load') {
      return { loading: true, color: 'primary' } as ButtonStateType
    } else {
      throw new Error()
    }
  }, { color: 'primary', loading: false } as ButtonStateType)
  const dispatch = useDispatch()
  const nickname = useSelector((state: RootState) => state.user.nickname)
  const formik = useFormik({
    initialValues: {
      nickname: nickname
    },
    validationSchema: Yup.object({
      nickname: Yup.string()
        .min(1, "昵称的长度不能少于1个字符")
        .max(20, "昵称的长度不能超过20个字符")
        .required("必填")
    }),
    enableReinitialize: false,
    onSubmit: (values, actions) => {
      dispatchBut({ type: 'load' })
      const para = new URLSearchParams()
      para.append("nickname", values.nickname)
      request.post("/profile/updateNickname", para)
        .then((res: AxiosResponse) => {
          dispatchBut({ type: 'success' })
          dispatch(updateNickname(values.nickname))
        })
        .catch((err: AxiosError) => {
          dispatchBut({ type: 'error' })
        })
    }
  })
  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          autoComplete="off"
          label="昵称"
          type="text"
          name="nickname"
          placeholder='请输入新的昵称'
          value={formik.values.nickname}
          variant="standard"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nickname && formik.errors.nickname ? true : false}
          helperText={formik.touched.nickname && formik.errors.nickname}></TextField>
        <LoadingButton
          variant='contained'
          loading={butState.loading}
          type="submit"
          sx={{ height: "80%", width: "max-content" }}
          color={butState.color}
          endIcon={<SendIcon />}>提交</LoadingButton>
      </form>
    </div>
  )
})
const ModifySignature = memo(function ModifySignature(): ReactElement {
  const dispatch = useDispatch()
  const request = useAxios()
  const signature = useSelector((state: RootState) => state.user.signature)
  const [butState, dispatchBut] = useReducer((state: ButtonStateType, action: ButActionType) => {
    if (action.type === 'success') {
      return { loading: false, color: 'success' } as ButtonStateType
    } else if (action.type === 'error') {
      return { loading: false, color: 'error' } as ButtonStateType
    } else if (action.type === 'load') {
      return { loading: true, color: 'primary' } as ButtonStateType
    } else {
      throw new Error()
    }
  }, { color: 'primary', loading: false } as ButtonStateType)
  const formik = useFormik({
    initialValues: {
      signature: signature
    },
    enableReinitialize: false,
    validationSchema: Yup.object({
      signature: Yup.string()
        .max(20, "个性签名的长度不能超过三十个字符")
        .required("必填")
    }),
    onSubmit: (values, actions) => {
      dispatchBut({ type: 'load' })
      const para = new URLSearchParams();
      para.append("signature", values.signature)
      request.post("/profile/updateSignature", para)
        .then(async (res: AxiosResponse) => {
          const data = await res.data
          if (data.code === 200) {
            dispatch(updateSignature(values.signature))
            dispatchBut({ type: 'success' })
          } else {
            dispatchBut({ type: 'error' })
          }
        })
        .catch((err: any) => {
          dispatchBut({ type: 'error' })
        })
    }
  })
  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit}>
        <TextField autoComplete="off"
          variant="standard"
          fullWidth
          type="text"
          name="signature"
          label="个性签名"
          value={formik.values.signature}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.signature && formik.errors.signature}
          error={formik.touched.signature && formik.errors.signature ? true : false}></TextField>
        <LoadingButton
          variant="contained"
          color={butState.color}
          type="submit"
          loadingPosition="end"
          sx={{ height: "80%", width: "max-content" }}
          loading={butState.loading}
          endIcon={<SendIcon />}>提交</LoadingButton>
      </form>
    </div >
  )
})

const MofiyAvatar = memo(function MofiyAvatar(): ReactElement {
  const request = useAxios()
  const [helperText, setHelperText] = useState({ helperText: '', status: false });
  const checkType = (files: FileList): boolean => {
    if (files.length !== 1) {
      setHelperText({ helperText: "文件的数量应为1", status: true });
    } else if (!files[0].type.includes("image")) {
      setHelperText({ helperText: "仅支持上传图片类型文件", status: true })
    } else if (files[0].size >= 1048576) {
      setHelperText({ helperText: "图片的大小应为1MB以下", status: true });
    } else {
      setHelperText(prev => {
        return { ...prev, status: false }
      })
      return true
    }
    return false;
  }
  const dispatch = useDispatch()
  const uploadImg = async (files: FileList) => {
    const headers = {
      'Cache-Control': 'no-cache'
    }
    let path = `${(new Date()).valueOf()}${files[0].name}`
    const client = new OSS({
      accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
      accessKeySecret: process.env.NEXT_PUBLIC_ACCESS_KEY_SECRET,
      bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      region: process.env.NEXT_PUBLIC_REGION
    })
    const result = await client.put(`img/${path}`, files[0], { headers })
    if (result.res.status === 200) {
      request.post('/profile/updateAvatar', {
        avatar: path
      })
        .then((res: AxiosResponse) => {
          if (res.data.code === 0) {
            setHelperText({ helperText: '头像上传成功', status: true })
            dispatch(updateAvatar(`https://litaishuai.oss-cn-hangzhou.aliyuncs.com/img/${path}`))
          } else if (res.data.code === 200) {
            setHelperText({ helperText: '头像上传失败', status: true })
          }
        })
        .catch((e: any) => {
          setHelperText({ helperText: '头像上传失败', status: true })
        })
    } else {
      setHelperText({ helperText: '头像上传失败', status: true })
    }
  }
  const handleAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (checkType(event.target.files)) {
      uploadImg(event.target.files);
    }
  }
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (checkType(event.dataTransfer.files)) {
      uploadImg(event.dataTransfer.files)
    }
  }
  return (
    <div className={styles.avatarContainer}
      onDragOver={(e: DragEvent<HTMLDivElement>): void => e.preventDefault()}
      onDragLeave={(e: DragEvent<HTMLDivElement>): void => e.preventDefault()}
      onDragEnter={(e: DragEvent<HTMLDivElement>): void => e.preventDefault()}
      onDrop={handleDrop}
      draggable="true">
      <label>
        点击或拖放至此区域即可更换头像
        <input type="file" onChange={handleAvatar} accept="image/*" style={{ display: 'none' }} />
        {
          helperText.helperText.length !== 0 &&
          <Alert severity={helperText.status ? 'success' : 'error'}>{helperText.helperText}</Alert>
        }
      </label>
    </div>
  )
})

const EditProfile = memo(function FormDialog(): ReactElement {
  const toggle: boolean = useSelector((state: RootState): boolean => state.ui.toggleProfile)
  const username: string = useSelector((state: RootState): string => state.user.username)
  const dispatch = useDispatch();
  const handleCloseProfile = (): void => {
    dispatch(closeProfile())
  }
  return (
    <Dialog open={toggle} onClose={handleCloseProfile}>
      <DialogTitle>修改用户信息</DialogTitle>
      <DialogContent>
        <TextField disabled value={username} variant="standard" fullWidth label="用户名(不可以修改！！)"></TextField>
        <ModifyNickname />
        <ModifySignature />
        <MofiyAvatar />
      </DialogContent>
      <hr />
      <DialogActions>
        <Button variant="contained" type="button" onClick={handleCloseProfile}>关闭</Button>
      </DialogActions>
    </Dialog>
  )
})
export default EditProfile