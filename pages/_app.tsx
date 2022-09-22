import 'bootstrap/dist/css/bootstrap.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { FC, ReactElement } from 'react'
import { Provider } from 'react-redux'
import { wrapper } from '../components/index/store'
import '../styles/app.scss'

const MyApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (<Provider store={store}>
    <Head>
      <title>聊天室</title>
    </Head>
    <Component {...props.pageProps} />
  </Provider>)
}
export default MyApp;