import React from 'react';
import ReactDOM from 'react-dom/client';
// 设置antd 为中文
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import './index.css';
import App from './App';
// import App from '@/pages/home';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import store from './store'
// import './mock.js'
// 全局样式
import '@/common/stylus/frame.styl'

const antdConfig = {
    locale: zhCN
}
const root = ReactDOM.createRoot(document.getElementById('root'));

// 设置antd 为中文 
root.render( 
    <ConfigProvider {...antdConfig } >
      {/* react-redux提供的Provider,把store传给了整个App */}
      {/* 在需要使用store的组件中，要使用react-redux提供的connect方法对组件进行包装 */}
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();