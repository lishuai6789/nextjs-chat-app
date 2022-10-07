import { memo, ReactElement, ReactNode, useReducer } from 'react'
import { LoadingButton } from '@mui/lab'
import SendIcon from '@mui/icons-material/Send';
import { AxiosResponse, AxiosError } from 'axios'
type PropsType = {
  children: ReactNode;
  color?: "error" | "inherit" | "primary" | "secondary" | "info" | "success" | "warning"
  size?: 'small'
  | 'medium'
  | 'large';
  variant?: 'contained'
  | 'outlined'
  | 'text';
  submit: (args: any) => Promise<AxiosError | AxiosResponse>;
  args?: any;
};
type ActionType = {
  type: "loading" | "success" | "error";
};
type StateType = {
  loading: boolean;
  color: "error" | "inherit" | "primary" | "secondary" | "info" | "success" | "warning"
};
function reducer(state: StateType, action: ActionType) {
  let retVal: StateType
  switch (action.type) {
    case "loading":
      retVal = { loading: true, color: state.color }
      return retVal
    case "success":
      retVal = { loading: false, color: "success" }
      return retVal
    case "error":
      retVal = { loading: false, color: "error" }
      return retVal
    default:
      throw new Error("wrong action type");
  }
}
function SubmitButton({ children, color = "primary", size = "medium", variant = "text", submit, args }: PropsType): ReactElement {
  const init: StateType = { loading: false, color: color }
  const [state, dispatch] = useReducer(reducer, init)
  const handleClick = () => {
    dispatch({ type: "loading" })
    submit(args)
      .then((res: AxiosResponse) => {
        dispatch({ type: "success" })
      })
      .catch((err: AxiosError) => {
        dispatch({ type: "error" })
      })
  }
  return (
    <LoadingButton
      loading={state.loading}
      color={state.color}
      size={size}
      endIcon={<SendIcon />}
      onClick={handleClick}
      variant={variant}>{children}</LoadingButton>
  )
}
export default memo(SubmitButton)
