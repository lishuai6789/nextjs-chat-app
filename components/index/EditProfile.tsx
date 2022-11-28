import { Alert, TextField } from "@mui/material";
import OSS from 'ali-oss';
import { AxiosResponse } from "axios";
import { useFormik } from 'formik';
import { ChangeEvent, DragEvent, memo, ReactElement, useState, MouseEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { closeProfile } from "../../store/uiSlice";
import { updateAvatar, updateNickname, updateSignature } from "../../store/userSlice";
import styles from '../../styles/EditProfile.module.scss';
import * as Yup from 'yup';
import { useAxios } from '../../api/useAxios';
import { reqUpdateNickname, reqUpdateSignature } from '../../api';
import { Modal, Button, Input, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
const ModifyNickname = function ModifyNickname(): ReactElement {
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
        <Input
          addonBefore="昵称"
          type="text"
          value={formik.values.nickname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="nickname"
          placeholder='请输入新的昵称'
        />
        <Button
          type="primary"
          disabled={loading}
          loading={loading}
          htmlType="submit"
          size="middle"
          icon={<SendOutlined />}
          shape='round'
          onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}>提交</Button>
      </form>
    </div>
  )
}
const ModifySignature = memo(function ModifySignature(): ReactElement {
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
          variant="filled"
          fullWidth
          type="text"
          name="signature"
          label="个性签名"
          value={formik.values.signature}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.signature && formik.errors.signature}
          error={formik.touched.signature && formik.errors.signature ? true : false}></TextField>
        <Button
          type="primary"
          htmlType="submit"
          disabled={loading}
          loading={loading}
          icon={<SendOutlined />}>提交</Button>
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
  const handleCloseProfile = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    dispatch(closeProfile())
  }
  return (
    <Modal open={toggle} title="修改用户信息" centered={true} footer={null} destroyOnClose={true} onCancel={handleCloseProfile}>
      <Space direction="vertical">
        <Input size="large" value={username} disabled={true}
          addonBefore={"用户名不可修改"} /><br></br>
        <ModifyNickname />
        <ModifySignature />
        <MofiyAvatar />
      </Space>
    </Modal>
  )
})
export default EditProfile