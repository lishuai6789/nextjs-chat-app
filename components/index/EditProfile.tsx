import { Button, TextField } from "@mui/material";
import OSS from 'ali-oss';
import { AxiosResponse } from "axios";
import { useFormik } from 'formik';
import { ReactElement, useState, MouseEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { closeProfile } from "../../store/uiSlice";
import { updateAvatar, updateNickname, updateSignature } from "../../store/userSlice";
import styles from '../../styles/EditProfile.module.scss';
import * as Yup from 'yup';
import { useAxios } from '../../api/useAxios';
import { reqUpdateNickname, reqUpdateSignature } from '../../api';
import { Modal, Input, Space, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import Upload from "antd/es/upload/Upload";
import { RcFile } from "antd/es/upload";

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
          sx={{height: '80px'}}
        />
        <Button
          variant="contained"
          disabled={loading}
          type="submit"
          size="small"
          endIcon={<SendOutlined />}>提交</Button>
      </form>
    </div>
  )
}

const ModifySignature = function ModifySignature(): ReactElement {
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
          value={formik.values.signature}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.signature && formik.errors.signature}
          error={formik.touched.signature && formik.errors.signature ? true : false}
          sx={{height: '80px'}}></TextField>
        <Button
          size="small"
          variant="contained"
          disabled={loading}
          endIcon={<SendOutlined />}>提交</Button>
      </form>
    </div >
  )
}

const MofiyAvatar = function MofiyAvatar(): ReactElement {
  const request = useAxios()
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
            
            dispatch(updateAvatar(`https://litaishuai.oss-cn-hangzhou.aliyuncs.com/img/${path}`))
          } else if (res.data.code === 200) {
          }
        })
        .catch((e: any) => {
        })
    } else {
    }
  }
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  return (
    <div className={styles.avatarContainer}>
      <Upload name="avatar" showUploadList={false} beforeUpload={beforeUpload}>
        {}
      </Upload>
    </div>
  )
}

const EditProfile = function FormDialog(): ReactElement {
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
}
export default EditProfile