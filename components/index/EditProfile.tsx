import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import OSS from 'ali-oss';
import { AxiosResponse } from "axios";
import { ChangeEvent, DragEvent, memo, ReactElement, useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AxiosContext } from '../../pages';
import { RootState } from "../../store/store";
import { closeProfile } from "../../store/uiSlice";
import { updateAvatar, updateNickname, updateSignature } from "../../store/userSlice";
import styles from '../../styles/FormDialog.module.scss';
const ModifyNickname = memo(function ModifyNickname(): ReactElement {
  const nickname: string = useSelector((state: RootState): string => state.user.nickname)
  const dispatch = useDispatch()
  const [formNickname, setFormNickname] = useState({
    val: nickname,
    isError: nickname.length <= 0 || nickname.length > 20,
    helperText: ''
  });
  const handleNickname = (event: ChangeEvent<HTMLInputElement>): void => {
    let newV = event.target.value.trim();
    if (newV.length === 0) {
      setFormNickname({ val: newV, helperText: "昵称不能为空", isError: true })
    } else if (newV.length >= 21) {
      setFormNickname({ val: newV, helperText: "昵称的最大长度为20", isError: true })
    } else {
      setFormNickname({ val: newV, helperText: '', isError: false })
    }
  }
  const [status, setStatus] = useState(0) // 0 初始状态；1 加载中；2 成功；3 错误
  const color = useMemo((): "primary" | "success" | "error" | "inherit" | "secondary" | "info" | "warning" => {
    if (status === 0 || status === 1) {
      return "primary"
    } else if (status === 2) {
      return "success"
    } else {
      return "error"
    }
  }, [status])
  const axiosContext = useContext(AxiosContext)
  const handleSubmit = (): void => {
    if (formNickname.isError) {
      return;
    }
    setStatus(1)
    axiosContext.axios.post('/profile/updateNickname', {
      nickname: formNickname.val
    })
      .then((res: AxiosResponse) => {
        setStatus(2)
        dispatch(updateNickname(formNickname.val))
      })
      .catch((err: any) => {
        setStatus(3)
      })
  }
  return (
    <div className={styles.container}>
      <TextField
        fullWidth
        autoComplete="off"
        label="昵称"
        type="text"
        value={formNickname.val}
        variant="standard"
        onChange={handleNickname}
        error={formNickname.isError}
        helperText={formNickname.helperText}></TextField>
      <LoadingButton
        variant="contained"
        color={color}
        onClick={handleSubmit}
        loadingPosition="end"
        sx={{ height: "80%", width: "max-content" }}
        loading={status === 1}
        endIcon={<SendIcon />}>提交</LoadingButton>
    </div>
  )
})

const ModifySignature = memo(function ModifySignature(): ReactElement {
  const axiosContext = useContext(AxiosContext)
  const signature: string = useSelector((state: RootState) => state.user.signature)
  const [formSignature, setFormSignature] = useState({
    val: signature,
    isError: signature.length <= 0 || signature.length > 30,
    helperText: ''
  });
  const handleSignature = (event: ChangeEvent<HTMLInputElement>) => {
    let newV = event.target.value.trim();
    if (newV.length <= 0 || newV.length >= 31) {
      setFormSignature({
        val: newV,
        isError: true,
        helperText: '个性签名的长度在1到30之间'
      })
    } else {
      setFormSignature({
        val: newV,
        isError: false,
        helperText: ''
      })
    }
  }
  const [status, setStatus] = useState(0) // 0 初始状态；1 加载中；2 成功；3 错误
  const color = useMemo((): "primary" | "success" | "error" | "inherit" | "secondary" | "info" | "warning" => {
    if (status === 0 || status === 1) {
      return "primary"
    } else if (status === 2) {
      return "success"
    } else {
      return "error"
    }
  }, [status])
  const dispatch = useDispatch()
  const handleSubmit = (): void => {
    if (formSignature.isError) {
      return;
    }
    setStatus(1)
    axiosContext.axios.post('/profile/updateSignature', {
      signature: formSignature.val
    })
      .then((res: AxiosResponse) => {
        if (res.data.code === 0) {
          setStatus(2)
          dispatch(updateSignature(formSignature.val))
        } else if (res.data.code === 200) {
          setStatus(3);
        }
      })
      .catch((err: any) => {
        setStatus(3)
      })
  }
  return (
    <div className={styles.container}>
      <TextField autoComplete="off"
        variant="standard"
        fullWidth
        type="text"
        label="个性签名"
        value={formSignature.val}
        onChange={handleSignature}
        helperText={formSignature.helperText}
        error={formSignature.isError}></TextField>
      <LoadingButton
        variant="contained"
        color={color}
        onClick={handleSubmit}
        loadingPosition="end"
        sx={{ height: "80%", width: "max-content" }}
        loading={status === 1}
        endIcon={<SendIcon />}> 提交</LoadingButton>
    </div >
  )
})

const MofiyAvatar = memo(function MofiyAvatar(): ReactElement {
  const axiosContext = useContext(AxiosContext)
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
      axiosContext.axios.post('/profile/updateAvatar', {
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