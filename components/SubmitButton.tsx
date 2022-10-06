import { memo, ReactElement, ReactNode, useReducer } from 'react'
import { LoadingButton } from '@mui/lab'
import SendIcon from '@mui/icons-material/Send';
import { AxiosResponse, AxiosError } from 'axios'
type PropsType = {
  children: ReactNode;
  color?: 'inherit'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning';
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
  color: 'inherit'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning';
};
function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case "loading":
      return { loading: true, color: state.color }
    case "success":
      return { loading: false, color: "success" }
    case "error":
      return { loading: false, color: "error" }
    default:
      throw new Error("wrong action type");
  }
}
function SubmitButton({ children, color = "primary", size = "medium", variant = "text", submit, args }: PropsType): ReactElement {
  const [state, dispatch] = useReducer(reducer, { loading: false, color: color })
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
