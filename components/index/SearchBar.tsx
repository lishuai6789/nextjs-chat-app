import { LoadingButton } from "@mui/lab"
import { TextField } from "@mui/material"
import { AxiosError, AxiosResponse } from "axios"
import { useFormik } from "formik"
import { memo, ReactElement, useReducer } from "react"
import { object, string } from 'yup'
import styles from '../../styles/SearchBar.module.scss'
import {useAxios} from "../../api/useAxios"
const SearchBar = memo(function SearchBar(): ReactElement {
  const request = useAxios()
  const [butState, dispatch] = useReducer((_state: any, action: { type: string; }) => {
    if (action.type === 'load') {
      return { loading: true, color: 'primary' };
    } else if (action.type === 'success') {
      return { loading: false, color: 'success' };
    } else if (action.type === 'error') {
      return { loading: false, color: 'error' }
    } else {
      throw new Error("Wrong Action Type")
    }
  }, { loading: false, color: 'primary' })
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
        <TextField className={styles.input} placeholder="搜索你的朋友" size="small" variant='standard' />
        <LoadingButton
          className={styles.button}
          type="submit"
          variant="contained"
          value={formik.values.friendName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          loading={butState.loading}>搜索</LoadingButton>
      </form>
    </div>
  )
})
export default SearchBar