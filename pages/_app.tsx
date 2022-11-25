import 'bootstrap/dist/css/bootstrap.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React, { ErrorInfo, FC, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { wrapper } from '../store/store'
import '../styles/app.scss'
import 'normalize.css/normalize.css'
import { message, } from 'antd'
import { useAxios } from '../api/useAxios'
interface PropsType {
  children?: ReactNode;
}
interface StateType {
  hasError: boolean;
}
class ErrorBoundary extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
export const MessageContext = React.createContext<any>({});
const MyApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const [messageApi, contextHolder] = message.useMessage();
  const myAxios = useAxios();
  return (<ErrorBoundary>
    <Provider store={store}>
      <Head>
        <title>聊天室</title>
      </Head>
      <MessageContext.Provider value={messageApi}>
        {contextHolder}
        <Component {...props.pageProps} />
      </MessageContext.Provider>
    </Provider>
  </ErrorBoundary>
  )
}
export default MyApp;