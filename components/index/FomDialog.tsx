import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Input } from "@mui/material"
import { ChangeEvent, memo, useState, useMemo, useRef, FormEvent } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./store"
import { closeProfile } from "./uiSlice"
import { client } from "../../utils/alioss/alioss"
const FormDialog = memo(function FormDialog() {
  const toggle: boolean = useSelector((state: RootState) => state.ui.toggleProfile)
  const username: string = useSelector((state: RootState) => state.user.username)
  const nickname: string = useSelector((state: RootState) => state.user.nickname)
  const signature: string = useSelector((state: RootState) => state.user.signature)
  const dispatch = useDispatch()
  const handleCloseProfile = () => {
    dispatch(closeProfile())
  }
  const [formNickname, setFormNickname] = useState({ val: nickname, isError: false, helperText: '' });
  const [formSignature, setFormSignature] = useState({ val: signature, isError: false, helperText: '' });
  const [formAvatarHelpertText, setFormAvatarHelperText] = useState({ helperText: '', isError: false });
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
  const avatarRef = useRef(null)
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
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formNickname.isError || formSignature.isError || formAvatarHelpertText.isError) {
      return;
    }
  }
  return (
    <Dialog open={toggle} onClose={handleCloseProfile}>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <DialogTitle>修改用户信息</DialogTitle>
        <DialogContent>
          <TextField disabled required value={username} variant="standard" fullWidth label="用户名"></TextField>
          <TextField fullWidth required autoComplete="off" label="昵称" type="text" value={formNickname.val} variant="standard" onChange={handleNickname} error={formNickname.isError} helperText={formNickname.helperText}></TextField>
          <TextField required autoComplete="off" variant="standard" fullWidth type="text" label="个性签名" value={formSignature.val} onChange={handleSignature} helperText={formSignature.helperText} error={formSignature.isError}></TextField>
          <div className="mb-3">
            <label htmlFor="formFileLg" className="form-label">新头像</label>
            <input ref={avatarRef} required className="form-control form-control-sm" id="formFileLg" type="file" onChange={handleAvatar} accept="image/*" />
            {
              formAvatarHelpertText.isError && <div style={{ padding: '5px' }} className="alert alert-danger" role="alert">
                {formAvatarHelpertText.helperText}
              </div>
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="button" onClick={handleCloseProfile}>取消</Button>
          <Button variant="contained" type="submit">提交</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
})
export default FormDialog