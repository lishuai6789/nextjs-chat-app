import { LoadingButton } from "@mui/lab";
import { AxiosError, AxiosResponse } from "axios";
import { ReactNode, useState, ReactElement } from 'react'
interface PropType {
  children: ReactNode;
  submit: () => any;
  variant?: "text" | "outlined" | "contained";
  type?: "submit" | "button"
};

export default function MyLoadingButton({children, submit, variant = "text", type="button"}: PropType): ReactElement {
  const [buttonState, setButtonState] = useState<{ 
    loading: boolean, 
    color: "primary" | "success" | "error" }>({ loading: false, color: "primary" })
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
      type={type}
      variant={variant}>{children}</LoadingButton>
  )
}