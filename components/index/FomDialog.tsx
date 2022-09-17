import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Input } from "@mui/material"
import { memo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./store"
import { closeProfile } from "./uiSlice"

const FormDialog = memo(function FormDialog() {
  const toggle: boolean = useSelector((state: RootState) => state.ui.toggleProfile)
  const username: string = useSelector((state: RootState) => state.user.username)
  const nickname: string = useSelector((state: RootState) => state.user.nickname)
  const signature: string = useSelector((state: RootState) => state.user.signature)
  const dispatch = useDispatch()
  const handleSubmit = () => {

  }
  const handleCloseProfile = () => {
    dispatch(closeProfile())
  }
  console.log("init FormDialog")
  const [formUsername, setFormUsername] = useState(username);
  const [formNickname, setFormNickname] = useState(nickname);
  const [formSignature, setFormSignature] = useState(signature)
  const handleNickname = (event: any) => {

  }
  const handleSignature = (event:any) => {

  }
  return (
    <Dialog open={toggle} onClose={handleCloseProfile}>
      <DialogTitle>修改用户信息</DialogTitle>
      <DialogContent>
        <TextField disabled value={formUsername} variant="standard" fullWidth placeholder={username} label="用户名"></TextField>
        <TextField fullWidth autoComplete="off" label="昵称" type="text" value={formNickname} variant="standard" onChange={handleNickname}></TextField>
        <TextField autoComplete="off" variant="standard" fullWidth type="text" label="个性签名" value={formSignature} onChange={handleSignature}>
        </TextField>
        <div className="mb-3">
          <label htmlFor="formFileLg" className="form-label">更换新头像</label>
          <input className="form-control form-control-sm" id="formFileLg" type="file" />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCloseProfile}>取消</Button>
        <Button variant="contained" onClick={handleSubmit}>提交</Button>
      </DialogActions>
    </Dialog>
  )
})
export default FormDialog