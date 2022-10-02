import 'bootstrap/dist/css/bootstrap.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React, { ErrorInfo, ReactNode } from 'react'
import { FC } from 'react'
import { Provider } from 'react-redux'
import { wrapper } from '../store/store'
import '../styles/app.scss'
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

    // Return children components in case of no error

    return this.props.children
  }
}
const MyApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (<ErrorBoundary>
    <Provider store={store}>
      <Head>
        <title>聊天室</title>
      </Head>
      <Component {...props.pageProps} />
    </Provider>
  </ErrorBoundary>
  )
}
export default MyApp;