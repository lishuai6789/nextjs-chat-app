import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Input } from "@mui/material"
import { ChangeEvent, memo, useState, useMemo } from "react"
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
  const [formNickname, setFormNickname] = useState(nickname);
  const [formSignature, setFormSignature] = useState(signature)
  const handleNickname = (event: any) => {
    setFormNickname(event.target.value.trim())
  }
  const nicknameHelperText = useMemo((): string => {
    if (formNickname.length === 0) {
      return "昵称不能为空"
    } else if (formNickname.length >= 21) {
      return "昵称的最大长度为20"
    } else {
      return ""
    }
  }, [formNickname.length > 0 && formNickname.length <= 20])
  const handleSignature = (event: any) => {
    setFormSignature(event.target.value)
  }

  const signatureHelperText = useMemo((): string => {
    if (formSignature.length === 0) {
      return "昵称不能为空"
    } else if (formSignature.length >= 21) {
      return "昵称的最大长度为20"
    } else {
      return ""
    }
  }, [formSignature.length > 0 && formSignature.length <= 30])
  const handleAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    let files = event.target.files;
    console.log(files);
    if (files.length !== 1) {
      return;
    }
    
    // client.multipartUpload(files.);
  }
  const handleSubmit = () => {

  }
  return (
    <Dialog open={toggle} onClose={handleCloseProfile}>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <DialogTitle>修改用户信息</DialogTitle>
        <DialogContent>
          <TextField disabled required value={username} variant="standard" fullWidth label="用户名"></TextField>
          <TextField fullWidth required autoComplete="off" label="昵称" type="text" value={formNickname} variant="standard" onChange={handleNickname} error={formNickname.length === 0 || formNickname.length > 20} helperText={nicknameHelperText}></TextField>
          <TextField required autoComplete="off" variant="standard" fullWidth type="text" label="个性签名" value={formSignature} onChange={handleSignature} helperText={signatureHelperText} error={formSignature.length === 0 || formSignature.length > 30}></TextField>
          <div className="mb-3">
            <label htmlFor="formFileLg" className="form-label">更换新头像</label>
            <input required className="form-control form-control-sm" id="formFileLg" type="file" onChange={handleAvatar} accept="image/*" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="button" onClick={handleCloseProfile}>取消</Button>
          <Button variant="contained" type="submit" onClick={handleSubmit}>提交</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
})
export default FormDialog