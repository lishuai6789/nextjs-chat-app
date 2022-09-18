import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import { ChangeEvent, memo, useState, useMemo, useRef, FormEvent, ReactElement, MouseEvent } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./store"
import { closeProfile } from "./uiSlice"
import { client } from "../../utils/alioss/alioss"
import SendIcon from '@mui/icons-material/Send';
import styles from '../../styles/FormDialog.module.scss'
import AxiosInstance from "../../utils/aixos/axios";
import { AxiosError, AxiosResponse } from "axios";

interface PropsInterface {
  username: string;
};

const ModifyNickname = memo(function ModifyNickname(props: PropsInterface): ReactElement {
  const nickname: string = useSelector((state: RootState) => state.user.nickname)
  const [formNickname, setFormNickname] = useState({
    val: nickname,
    isError: nickname.length <= 0 || nickname.length > 20,
    helperText: ''
  });
  const handleNickname = (event: ChangeEvent<HTMLInputElement>) => {
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
  const handleSubmit = (): void => {
    if (formNickname.isError) {
      return;
    }
    setStatus(1)
    AxiosInstance.post('/profile/updateNickname', {
      username: props.username,
      nickname: formNickname.val
    })
      .then((res: AxiosResponse) => {
        setStatus(2)
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
        size="small"
        loading={status === 1}
        endIcon={<SendIcon />}>提交</LoadingButton>
    </div>
  )
})

const ModifySignature = memo(function ModifySignature(props: PropsInterface): ReactElement {
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
  const handleSubmit = (): void => {
    if (formSignature.isError) {
      return;
    }
    setStatus(1)
    AxiosInstance.post('/profile/updateSignature', {
      username: props.username,
      nickname: formSignature.val
    })
      .then((res: AxiosResponse) => {
        if (res.data.code !== 100) {
          console.log("success")
          setStatus(2)
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
        size="small"
        loading={status === 1}
        endIcon={<SendIcon />}> 提交</LoadingButton>
    </div >
  )
})

const MofiyAvatar = memo(function MofiyAvatar(props: PropsInterface): ReactElement {
  const avatarRef = useRef(null)
  const [formAvatarHelpertText, setFormAvatarHelperText] = useState({ helperText: '', isError: false });
  const handleAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;
    if (!files[0].type.includes("image")) {
      setFormAvatarHelperText({ helperText: "仅支持上传图片类型文件", isError: true })
    } else if (files.length !== 1) {
      setFormAvatarHelperText({ helperText: "文件的数量应为1", isError: true });
    } else if (files[0].size >= 1048576) {
      setFormAvatarHelperText({ helperText: "图片的大小应为1MB以下", isError: true });
    } else {
      setFormAvatarHelperText(prev => {
        return { ...prev, isError: false }
      })
    }
  }
  return (
    <div>
      <div className="mb-3">
        <label htmlFor="formFileLg" className="form-label">新头像</label>
        <input ref={avatarRef} required className="form-control form-control-sm" id="formFileLg" type="file" onChange={handleAvatar} accept="image/*" />
        {
          formAvatarHelpertText.isError && <div style={{ padding: '5px' }} className="alert alert-danger" role="alert">
            {formAvatarHelpertText.helperText}
          </div>
        }
      </div>
    </div>
  )
})

const FormDialog = memo(function FormDialog(): ReactElement {
  const toggle: boolean = useSelector((state: RootState) => state.ui.toggleProfile)
  const username: string = useSelector((state: RootState) => state.user.username)
  const dispatch = useDispatch();
  const handleCloseProfile = (): void => {
    dispatch(closeProfile())
  }
  return (
    <Dialog open={toggle} onClose={handleCloseProfile}>
      <DialogTitle>修改用户信息</DialogTitle>
      <DialogContent>
        <TextField disabled value={username} variant="standard" fullWidth label="用户名(不可以修改！！)"></TextField>
        <ModifyNickname username={username} />
        <ModifySignature username={username} />
        <MofiyAvatar username={username} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" type="button" onClick={handleCloseProfile}>取消</Button>
      </DialogActions>
    </Dialog>
  )
})
export default FormDialog