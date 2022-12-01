import { Button, TextField } from "@mui/material";
import { useFormik } from 'formik';
import { ReactElement, useState, MouseEvent, FormEvent, ChangeEvent, DragEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { closeProfile } from "../../store/uiSlice";
import { updateAvatar, updateNickname, updateSignature } from "../../store/userSlice";
import styles from '../../styles/EditProfile.module.scss';
import * as Yup from 'yup';
import { useAxios } from '../../api/useAxios';
import { reqUpdateAvatar, reqUpdateNickname, reqUpdateSignature } from '../../api';
import { Modal, Input, Space, message, Avatar } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const ModifyNickname = (): ReactElement => {
  const request = useAxios()
  const dispatch = useDispatch()
  const nickname = useSelector((state: RootState) => state.user.nickname)
  const [loading, setLoading] = useState(false);
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
    onSubmit: async (values, actions) => {
      setLoading(true);
      const para = new URLSearchParams();
      para.append("nickname", values.nickname);
      try {
        const res = await request(reqUpdateNickname(values.nickname));
        const data = await res.data;
        if (data.code === 200) {
          dispatch(updateNickname(values.nickname))
        }
      } catch (error: any) {
      } finally {
        setLoading(false);
      }
    }
  })
  return (
    <div className={styles.container}>
      <form onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.stopPropagation();
        formik.handleSubmit(event);
      }}>
        <TextField
          label="昵称"
          type="text"
          value={formik.values.nickname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="nickname"
          placeholder='请输入新的昵称'
          fullWidth
          error={formik.errors.nickname ? true : false}
          helperText={formik.touched.nickname && formik.errors.nickname}
          sx={{ height: '80px' }}
        />
        <Button
          variant="contained"
          disabled={loading}
          type="submit"
          size="small"
          endIcon={<SendOutlined />}>{loading ? "提交中" : "提交"}</Button>
      </form>
    </div>
  )
}

const ModifySignature = (): ReactElement => {
  const dispatch = useDispatch()
  const request = useAxios()
  const signature = useSelector((state: RootState) => state.user.signature)
  const [loading, setLoading] = useState(false);
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
    onSubmit: async (values, actions) => {
      const para = new URLSearchParams();
      para.append("signature", values.signature)
      setLoading(true);
      try {
        const res = await request(reqUpdateSignature(values.signature));
        const data = await res.data;
        if (data.code === 200) {
          dispatch(updateSignature(values.signature))
        }
      } catch (error: any) {

      } finally {
        setLoading(false);
      }
    }
  })
  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit}>
        <TextField autoComplete="off"
          fullWidth
          type="text"
          name="signature"
          label="个性签名"
          placeholder="输入您的新签名"
          value={formik.values.signature}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.signature && formik.errors.signature}
          error={formik.touched.signature && formik.errors.signature ? true : false}
          sx={{ height: '80px' }}></TextField>
        <Button
          size="small"
          variant="contained"
          disabled={loading}
          endIcon={<SendOutlined />}>{loading ? "提交中" : "提交"}</Button>
      </form>
    </div >
  )
}
const MofiyAvatar = (): ReactElement => {
  const myAxios = useAxios()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<{ dataUrl: string, type: string }>({ dataUrl: "", type: "" });
  const handleSubmit = async (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (avatar.dataUrl.length === 0) {
      message.error({ content: "请选择新的头像" });
    } else {
      try {
        setLoading(true);
        const res = await myAxios(reqUpdateAvatar(avatar.dataUrl.replace(/^data:image\/\w+;base64,/, ""), avatar.type));
        const data = await res.data;
        if (data.code === 200) {
          message.success({ content: "图片上传成功" });
          dispatch(updateAvatar(data.data.avatar));
        } else if (data.code === 500) {
          message.error({ content: "图片上传失败" });
        }
      } catch (err) {

      } finally {
        setLoading(false);
      }
    }
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files.length === 0) {
      return;
    }
    if (!/\bimage\/*/.exec(event.target?.files[0].type)) {
      message.error({ content: "只能上传图片" });
    } else {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setAvatar({ dataUrl: e.target.result as string, type: event.target.files[0].type });
        console.log(e.target.result);
      }
      fileReader.readAsDataURL(event.target.files[0]);
    }
  }
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const { dataTransfer } = event;
    if (dataTransfer.files.length === 0) {
      message.error({ content: "请选择文件" })
    } else if (dataTransfer.files.length > 1) {
      message.error({ content: "只能选择一个文件" });
    } else {
      let fileType = dataTransfer.files[0].type;
      if (!/\bimage\/*/.exec(fileType)) {
        message.error({ content: "只能上传图片" });
      } else {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          setAvatar({ dataUrl: e.target.result as string, type: fileType });
        }
        fileReader.readAsDataURL(dataTransfer.files[0]);
      }
    }
  }
  return (
    <div className={styles.uploadContainer}>
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={styles.dragContainer}
      >
        拖放至此，或者是点击都可以上传头像
        <input id="avatar" hidden type="file" accept="image/*" name="avatar" onChange={handleChange} />
      </label>
      {
        avatar.dataUrl === null && <div></div>
      }
      {
        avatar.dataUrl != null && <Avatar src={avatar.dataUrl} size={100} shape="square" />
      }
      <Button disabled={loading} onClick={handleSubmit} variant="contained">
        {loading ? "提交中" : "提交"}
      </Button>
    </div>
  )
}

const EditProfile = (): ReactElement => {
  const toggle: boolean = useSelector((state: RootState): boolean => state.ui.toggleProfile)
  const username: string = useSelector((state: RootState): string => state.user.username)
  const dispatch = useDispatch();
  const handleCloseProfile = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    dispatch(closeProfile())
  }
  return (
    <Modal open={toggle} title="修改用户信息" centered={true} footer={null} destroyOnClose={true} onCancel={handleCloseProfile}>
      <Space direction="vertical">
        <Input size="large" value={username} disabled={true}
          addonBefore={"用户名不可修改"} />
        <ModifyNickname />
        <ModifySignature />
        <MofiyAvatar />
      </Space>
    </Modal>
  )
}
export default EditProfile