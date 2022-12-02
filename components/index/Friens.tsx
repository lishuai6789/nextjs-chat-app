import { Button, TextField } from "@mui/material"
import { AxiosError, AxiosResponse } from "axios"
import { useFormik } from "formik"
import { ReactElement } from "react"
import { object, string } from 'yup'
import styles from '../../styles/Friends.module.scss'
import { useAxios } from "../../api/useAxios"

const SearchBar = (): ReactElement => {
  const request = useAxios()
  const formik = useFormik({
    initialValues: {
      friendName: ''
    },
    enableReinitialize: false,
    validationSchema: object({
      friendName: string()
    }),
    onSubmit: (values) => {
      const param = new URLSearchParams();
      param.append('friendName', values.friendName)
      request.post('/friend/getFriendProfile', param)
        .then(async (_res: AxiosResponse) => {

        })
        .catch((_err: AxiosError) => {

        })
    }
  })
  return (
    <div className={styles.SearchBar}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          className={styles.input}
          placeholder="搜索你的朋友"
          size="small"
          variant='filled'
          onChange={formik.handleChange}
          label="搜索" />
        <Button
          className={styles.button}
          type="submit"
          variant="contained"
          value={formik.values.friendName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}>搜索</Button>
      </form>
    </div>
  )
}
const FriendsList = () => {
  return (<div>

  </div>)
}
const Friends = () => {
  return (<div>
    <SearchBar />
    <FriendsList />
  </div>)
}
export default Friends;