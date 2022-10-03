import { LoadingButton } from "@mui/lab";
import { AxiosError, AxiosResponse } from "axios";
import { ReactNode, useState, ReactElement } from 'react'
interface PropType {
  children: ReactNode;
  submit: () => Promise<AxiosError | AxiosResponse>;
  variant?: "text" | "outlined" | "contained";
};
// FIXME: 真的有必要封装这个组件吗？
// 组件的可扩展性怎么样？
export default function MyLoadingButton({children, submit, variant = "text"}: PropType): ReactElement {
  const [buttonState, setButtonState] = useState<{ loading: boolean, color: "primary" | "success" | "error" }>({ loading: false, color: "primary" })
  const handleClick = () => {
    setButtonState({ loading: true, color: "primary" })
    submit()
      .then((res: AxiosResponse) => {
        setButtonState({ loading: false, color: "success" })
      })
      .catch((err: AxiosError) => {
        setButtonState({ loading: false, color: "error" })
      })
  }
  return (
    <LoadingButton
      loading={buttonState.loading}
      color={buttonState.color}
      onClick={handleClick}
      variant={variant}>{children}</LoadingButton>
  )
}