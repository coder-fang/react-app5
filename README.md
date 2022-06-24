# 如何实现一个React全家桶项目（附完整教程）
## 1.相关命令：

### 运行项目： `yarn start`

### 项目打包： `yarn build`

### 暴露配置项： `yarn eject`

## 2.项目目录结构设计：

```
├─ config      webpack配置目录
│  ├─ env.js
│  ├─ getHttpsConfig.js
│  ├─ jest
│  │  ├─ babelTransform.js
│  │  ├─ cssTransform.js
│  │  └─ fileTransform.js
│  ├─ modules.js
│  ├─ paths.js
│  ├─ webpack
│  │  └─ persistentCache
│  │     └─ createEnvironmentHash.js
│  ├─ webpack.config.js
│  └─ webpackDevServer.config.js
├─ package-lock.json
├─ package.json
├─ public     
│  ├─ favicon.ico  网页图标
│  ├─ index.html   HTML页模板
│  └─ manifest.json
├─ README.md
├─ scripts       node编译脚本
│  ├─ start.js
│  └─ test.js
├─ src
│  ├─ api   api目录
│  │  └─ index.js  api库
│  ├─ App.css
│  ├─ App.jsx     项目主模块
│  ├─ App.test.js 
│  ├─ common    全局公用目录
│  │  ├─ fonts   字体文件目录
│  │  ├─ images   图片文件目录
│  │  │  └─ wentian.png
│  │  ├─ js     公用js文件目录
│  │  └─ stylus    公用样式文件目录
│  │     ├─ frame.styl     全部公用样式（import本目录其他全部目录styl）
│  │     ├─ global.styl    全局公用样式
│  │     └─ reset.styl     清零样式（如果使用Ant Design，就无需此文件）
│  ├─ components    公共模块组件目录
│  │  └─ header     头部导航模块
│  │     ├─ header.styl   header样式文件
│  │     ├─ index.jsx     header主文件
│  │     └─ store
│  │        ├─ actionCreators.js
│  │        ├─ constants.js
│  │        ├─ index.js
│  │        └─ reducer.js
│  ├─ index.css
│  ├─ index.jsx  项目入口文件
│  ├─ logo.svg
│  ├─ mock.js   mock模拟接口
│  ├─ pages     页面组件目录
│  │  ├─ code       code页目录
│  │  │  ├─ code.styl    code样式目录
│  │  │  ├─ index.jsx    code主文件
│  │  │  └─ store        
│  │  │     ├─ actionCreators.js
│  │  │     ├─ constants.js
│  │  │     ├─ index.js
│  │  │     └─ reducer.js
│  │  ├─ home         home页面
│  │  │  ├─ home.styl
│  │  │  ├─ index.jsx
│  │  │  └─ store
│  │  │     ├─ actionCreators.js
│  │  │     ├─ constants.js
│  │  │     ├─ index.js
│  │  │     └─ reducer.js
│  │  └─ login       登录页面
│  │     ├─ index.jsx
│  │     ├─ login.styl
│  │     └─ store
│  │        ├─ actionCreators.js
│  │        ├─ constants.js
│  │        ├─ index.js
│  │        └─ reducer.js
│  ├─ reportWebVitals.js
│  ├─ setupProxy.js    配置反向代理
│  ├─ setupTests.js
│  └─ store
│     ├─ index.js
│     └─ reducer.js
└─ yarn.lock

```

## 3.项目的主要依赖版本：
```
Node.js 16.13.2
create-react-app 5.0.0
react 17.0.2
react-router-dom 6.2.1
antd 4.18.7
node-sass 7.0.1
sass-loader 12.3.0
less 4.1.2
less-loader 10.2.0
stylus 0.56.0
stylus-loader 6.2.0
axios 0.26.0
history 4.10.1
immutable 4.0.0
mockjs 1.1.0
react-redux 7.2.6
redux 4.1.2
redux-immutable 4.0.0
redux-thunk 2.4.1
babel-plugin-import 1.13.3
http-proxy-middleware 2.0.3
```
## 4.本项目内容
### （1）初始化项目：npx create-react-app react-app5
    如果一直报错you are running create-react-app 4.0.3 which is behind the latest release (5.0.0)，说明你使用了旧版本的create-react-app，需要先清除npx缓存，执行`npx clear-npx-cache`,然后再执行`npx create-react-app react-app5`。
### （2）webpack配置：
####    a.执行此文件，暴露配置文件： `yarn eject` 
    eject之前必须确保当前工程所有文件已经提交git,否则会报以下错误：Remove untracked files, stash or commit any changes, and try again.
    需要先在根目录下执行，提交git: 
    ```
        git add .
        git commit -m "init project before eject"
    ```
    然后再执行：
    ```
        yarn eject
    ```
    即可完成webpack的暴露，这时项目中会多出一个config文件夹，里面是webpack的相关配置文件。
#### b.支持Sass/Scss
    eject之后，虽然package.json以及webpack.config.js中有了sass相关代码，但是要正确使用Sass/Scss，还要安装node-sass。
    先设置node-sass的淘宝镜像，下载node-sass模块。
    ```
        yarn config set SASS_BINARY_SITE http://npm.taobao.org/mirrors/node-sass
    ```
    如果还没有常规设置registry的淘宝镜像，也一并设置下：
    ```
        yarn config set registry https://registry.npm.taobao.org/
    ```
    执行以下命令,使得项目支持Sass/Scss：
    ```
       yarn add node-sass --dev 
    ```
#### c.支持Less
    首先需要安装less和less-loader：
    ```
        yarn add less less-loader --dev
    ```
    然后修改config/webpack.config.js：

```js
          // style files regexes
    const cssRegex = /\.css$/;
    const cssModuleRegex = /\.module\.css$/;
    const sassRegex = /\.(scss|sass)$/;
    const sassModuleRegex = /\.module\.(scss|sass)$/;
+   const lessRegex = /\.less$/;
+   const lessModuleRegex = /\.module\.less$/;
    ...(略)
    // Opt-in support for SASS (using .scss or .sass extensions).
    // By default we support SASS Modules with the
    // extensions .module.scss or .module.sass
	{
		test: sassRegex,
		exclude: sassModuleRegex,
		use: getStyleLoaders(
		  {
		    importLoaders: 3,
		    sourceMap: isEnvProduction && shouldUseSourceMap,
		  },
		  'sass-loader'
		),
		// Don't consider CSS imports dead code even if the
		// containing package claims to have no side effects.
		// Remove this when webpack adds a warning or an error for this.
		// See https://github.com/webpack/webpack/issues/6571
		sideEffects: true,
	},
	// Adds support for CSS Modules, but using SASS
	// using the extension .module.scss or .module.sass
	{
	  test: sassModuleRegex,
	  use: getStyleLoaders(
	    {
	      importLoaders: 3,
	      sourceMap: isEnvProduction && shouldUseSourceMap,
	      modules: {
	        getLocalIdent: getCSSModuleLocalIdent,
	      },
	    },
	    'sass-loader'
	  ),
	},
+   // 支持less
+   {
+     test: lessRegex,
+     exclude: lessModuleRegex,
+     use: getStyleLoaders(
+       {
+         importLoaders: 3,
+         sourceMap: isEnvProduction
+           ? shouldUseSourceMap
+           : isEnvDevelopment,
+         modules: {
+           mode: 'icss',
+         },
+       },
+       'less-loader'
+     ),
+     sideEffects: true,
+   },
+   {
+     test:lessModuleRegex,
+     use: getStyleLoaders(
+       {
+         importLoaders: 3,
+         sourceMap: isEnvProduction
+           ? shouldUseSourceMap
+           : isEnvDevelopment,
+         modules: {
+           mode: 'local',
+           getLocalIdent: getCSSModuleLocalIdent,
+         },
+       },
+       'less-loader'
+     ),
+   },
```

    其实就是把上面sass配置代码复制一遍，改成less。按照以上操作后，项目已支持less。
#### d.支持Stylus
支持Stylus和Less一样，首先安装stylus和stylus-loader：
执行：
```
    yarn add stylus stylus-loader --dev
```
安装完成后，按照上面的支持less的方法，修改config/webpack.config.js：
```js
   // style files regexes
    const cssRegex = /\.css$/;
    const cssModuleRegex = /\.module\.css$/;
    const sassRegex = /\.(scss|sass)$/;
    const sassModuleRegex = /\.module\.(scss|sass)$/;
    const lessRegex = /\.less$/;
    const lessModuleRegex = /\.module\.less$/;
+   const stylusRegex = /\.styl$/;
+	const stylusModuleRegex = /\.module\.styl$/;

    ...(略)
 
+   // 支持stylus
+   {
+     test: stylusRegex,
+     exclude: stylusModuleRegex,
+     use: getStyleLoaders(
+       {
+         importLoaders: 3,
+         sourceMap: isEnvProduction
+           ? shouldUseSourceMap
+           : isEnvDevelopment,
+         modules: {
+           mode: 'icss',
+         },
+       },
+       'stylus-loader'
+     ),
+     sideEffects: true,
+   },
+   {
+     test:stylusModuleRegex,
+     use: getStyleLoaders(
+       {
+         importLoaders: 3,
+         sourceMap: isEnvProduction
+           ? shouldUseSourceMap
+           : isEnvDevelopment,
+         modules: {
+           mode: 'local',
+           getLocalIdent: getCSSModuleLocalIdent,
+         },
+       },
+       'stylus-loader'
+     ),
+   },  
```
#### e.设置路径别名
为了方便项目使用相对路径，可以给项目设置路径别名。
修改config/webpack.config.js:

```js
alias: {
    // Support React Native Web
    // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
    'react-native': 'react-native-web',
    // Allows for better profiling with ReactDevTools
    ...(isEnvProductionProfile && {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
    }),
    ...(modules.webpackAliases || {}),
+   	'@': path.join(__dirname, '..', 'src'),
    },
```

这样在js代码开头的import路径中，直接使用@表示"src根目录"，不用自己去数有多少个“../”了。
#### f.禁止build项目时生成map文件
map文件，即js的source map文件，是为了解决被混淆压缩的js在调试的时候，能够快速定位到压缩前的源代码的辅助性文件。这个文件发布出去，会暴露源代码。因此，建议直接禁止build时生成map文件。

修改config/webpack.config.js，把shouldUseSourceMap的值改为false：
```
-   // const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
+   const shouldUseSourceMap =false;
```
### (3)项目架构搭建
    根据第二部分的项目目录开始构建项目。
#### a. 设置全局共用样式
本教程以Stylus为csst预处理语言。
在frame.styl里引入其他公用样式。
src/common/stylus/frame.styl：
```css
@import './reset.styl';
@import './global.styl';
```
src/common/stylus/global.styl：
```css
/*清浮动*/
.clearfix:after
  content: "."
  display: block
  height: 0
  clear: both
  visibility: hidden
.clearfix
  display:block

.G-col-error
  color: #f81d22

.G-col-succ
  color: #0b8235
```
src/common/stylus/reset.styl：
创建文件后，代码为空即可。因为本教程后续要引入Ant Design，因此不需要自行设置reset样式。
然后在src/index.js里引入frame.styl：
```js
   import React from 'react'
	import ReactDOM from 'react-dom'
	import App from './App'
+	// 全局样式
+	import '@/common/stylus/frame.styl'
	
	ReactDOM.render(<App />, document.getElementById('root'))
```
这样在所有页面里就可以直接使用全局样式了。

### (4) 引入Ant Design
执行：
```
yarn add antd
```
#### a.实现按需加载
Ant Design 的样式非常多，但项目中可能只使用了其中个别的组件，没有必要加载全局样式。我们可以使用babel-plugin-import实现样式的按需加载。
安装babel-plugin-import:
```
yarn addd babel-plugin-import --dev
```
修改package.json:
```js
 "babel": {
        "presets": [
            "react-app"
M       ],
+       "plugins": [
+           [
+               "import",
+               {
+                   "libraryName": "antd",
+                   "style": "css"
+               }
+           ]
+       ]
    }
```
然后修改src/App.jsx 来验证下Antd：
```js
import { Button } from 'antd'

function App() {
    return (
        <div className="App">
            <h1>React-App5</h1>
            <Button type="primary">Button</Button>
        </div>
    )
}
export default App
```
执行`yarn start`:
[图片https://pic1.zhimg.com/80/v2-53c18eaaa208aa3bbc80432ab152c8ac_1440w.jpg]

可以看到Antd的Button组件正常显示出来了，而且Antd的页面reset样式也生效了。
#### b.设置Antd为中文语言
Antd 默认语言是英文，需进行以下设置调整为中文。
修改src/index.js
```js
 import React from 'react'
    import ReactDOM from 'react-dom'
+   import { ConfigProvider } from 'antd'
+   import zhCN from 'antd/es/locale/zh_CN'
    import App from './App'
    // 全局样式
	import '@/common/stylus/frame.styl'
    
+   const antdConfig = {
+       locale: zhCN,
+   }
    
M   ReactDOM.render(
+       <ConfigProvider {...antdConfig}>
+           <App />
+       </ConfigProvider>,
+       document.getElementById('root')
+   )
```
### (5)页面开发
本教程包含两个页面，login和home。
在pages文件夹下新建home和login文件夹，home下新建index.js和home.styl,login下新建index.js和login.styl。
#### a.构建login页面
src/pages/login/index.jsx：
```jsx
import { Button, Input } from 'antd'
import imgLogo from './logo.png'
import './login.styl'

function Login() {

    return (
        <div className="P-login">
            <img src={imgLogo} alt="" className="logo" />
            <div className="ipt-con">
                <Input placeholder="账号" />
            </div>
            <div className="ipt-con">
                <Input.Password placeholder="密码" />
            </div>
            <div className="ipt-con">
                <Button type="primary" block={true}>
                    登录
                </Button>
            </div>
        </div>
    )
}

export default Login
```
src/pages/login/login.styl：
```css
.P-login
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    background: #7adbcb
    .logo
        display: block
        margin: 50px auto 20px
    .ipt-con
        margin: 0 auto 20px
        width: 400px
        text-align: center
```
暂时修改下入口文件代码，把原App页面换成login页面，看看效果：
src/index.js：
```js
-   import App from './App'
+   import App from '@/pages/login'
```
#### b.构建home页面
src/pages/home/index.js：
```js
import { Button } from 'antd'
import './home.styl'

function Home() {

    return (
        <div className="P-home">
            <h1>Home Page</h1>
            <div className="ipt-con">
                <Button>返回登录</Button>
            </div>
        </div>
    )
}

export default Home
```
src/pages/home/home.styl：
```css
.P-home
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    background: linear-gradient(#f48c8d,#f4c58d)
    h1
        margin-top: 50px
        text-align: center
        color: #fff
    .ipt-con
        margin: 20px auto 0
        text-align: center
```
暂时修改下入口文件代码，把初始页面换成home页面，看一下效果：
src/index.js
```js
-   import App from '@/pages/login'
+   import App from '@/pages/home'
```

#### c.实现页面路由跳转
安装react-router-dom：`yarn add react-router-dom`
现在，App.jsx正式作为路由配置项，进行代码重构。
```jsx
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from '@/pages/login'
import Home from '@/pages/home'

function App() {
    return (
        <HashRouter>
            <Routes>
                {/* 路由精确匹配"/home"，跳转Home页面 */}
                <Route exact path="/home" element={<Home />} />
                {/* 路由精确匹配"/login"，跳转Login页面 */}
                <Route exact path="/login" element={<Login />} />
                {/* 未匹配，则跳转Login页面 */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </HashRouter>
    )
}

export default App
```
不要忘记把src/index.js入口文件中初始页面改为App.jsx
src/index.js中：
```js
-   import App from '@/pages/home'
+   import App from './App'
```
执行`yarn start`启动项目，输入对应的路由地址，就可以正常访问对应的页面了。
> login页面：localhost:3000/#/login
> home页面：localhost:3000/#/home

#### d.在React组件中实现页面路由跳转
下面要实现的功能是，点击login页面的“登录”按钮，跳转至home页面。
修改src/pages/login/index.jsx：
```jsx
+   import { useNavigate } from 'react-router-dom'
    import { Button, Input } from 'antd'
    import imgLogo from './logo.png'
    import './login.styl'
    
    function Login() {
    
+       // 创建路由钩子
+       const navigate = useNavigate()
    
        return (

            ...（略）
    
            <div className="ipt-con">
M               <Button type="primary" block={true} onClick={()=>{navigate('/home')}}>登录</Button>
            </div>

            ...（略）
```
同样的方法，再来实现点击home页面的“返回登录”按钮，跳转至login页面。
修改src/pages/home/index.jsx:
```jsx
+   import { useNavigate } from 'react-router-dom'
    import { Button } from 'antd'
    import './home.styl'
    
    function Home() {
    
+       // 创建路由钩子
+       const navigate = useNavigate()
    
        return (
            <div className="P-home">
                <h1>Home Page</h1>
                <div className="ipt-con">
M                   <Button onClick={()=>{navigate('/login')}}>返回登录</Button>
                </div>
            </div>
        )
    }
    
    export default Home
```
现在，点击按钮进行页面路由跳转已经实现了。
#### e.在非React组件中实现页面路由跳转
在实际项目中，经常需要在非React组件中进行页面跳转。比如，当进行API请求的时候，如果发现登录认证已失效，就直接跳转至login页面；当API请求失效时，进行统一的报错提示。
以上这些情况的统一处理，当然是封装成公用的模块最合适。但往往这些纯功能性的模块都不是React组件，也就是纯原生js。所有就没办法使用useNavigate()了。

如何实现在非React组件中进行页面路由跳转：
需要安装额外的history依赖包。
执行`yarn add history@4.10.1`
安装完成后，新建目录及文件，src/api/index.js：
```js
import { createHashHistory } from 'history'

let history = createHashHistory()

export const goto = (path) => {
    history.push(path)
}
```
在src/pages/home/index.jsx中调用goto方法：
```js
  import { useNavigate } from 'react-router-dom'
    import { Button } from 'antd'
+   import { goto } from '@/api'
    import './home.styl'
    
    function Home() {
    
        // 创建路由钩子
        const navigate = useNavigate()
    
        return (
            <div className="P-home">
                <h1>Home Page</h1>
+               <div className="ipt-con">
+                   <Button onClick={()=>{goto('/login')}}>组件外跳转</Button>
+               </div>
                <div className="ipt-con">
                    <Button onClick={()=>{navigate('/login')}}>返回登录</Button>
                </div>
            </div>
        )
    }
    
    export default Home
```
在home页点击“组件外跳转”按钮，可以正常跳转至login页面了，而实际执行跳转的代码是在src/api/index.js（非React组件）中，这样就非常适合封装统一的处理逻辑。
### (6)组件开发
#### a.创建Header组件
目录结构变动如下：
>    |  ├─ /components   <-- 公共模块组件目录
>+   |  |  ├─ /header    <-- 公用header组件
>+   |  |  |  ├─ index.js 
>+   |  |  |  └─ header.styl

src/components/header/index.js代码：
```js
import './header.styl'

function Header() {
    return <div className="M-header">Header</div>
}

export default Header
```
src/components/header/header.styl：
```css
.M-header
    height: 40px
    line-height: 40px
    font-size: 36px
    color: #fff
    background: #409EFF
```
#### b.引入Header组件
在login页面里引入Header组件。
src/pages/login/index.js：
```js
  import { useNavigate } from 'react-router-dom'
    import { Button, Input } from 'antd'
    import imgLogo from './logo.png'
+   import Header from '@/components/header'
    import './login.styl'

    function Login() {
	    // 创建路由钩子
	    const navigate = useNavigate()

	    return (
	        <div className="P-login">
M	            <Header />
	            <img src={imgLogo} alt="" className="logo" />
	            <div className="ipt-con">
	                <Input placeholder="账号" />
	            </div>

	            ...（略）
```
同样的方式在home页面里引入Header组件。

src/pages/home/index.js：
```js
  import { useNavigate } from 'react-router-dom'
    import { Button } from 'antd'
+   import Header from '@/components/header'
    import { goto } from '@/api'
    import './home.styl'
    
    function Home() {
        // 创建路由钩子
        const navigate = useNavigate()
    
        return (
            <div className="P-home">
+               <Header />
                <h1>Home Page</h1>
```
运行项目，Header组件已经成功加入。
#### c.组件传参
使用过vue的同学都知道，vue组件有data和props。

data是组件内的数据；

props用来接收父组件传递来的数据。

在React中，如果使用的是Class方式定义的组件：

state是组件内的数据；

props用来接收父组件传递来的数据。

如果使用的是function方式定义的组件（也叫无状态组件）：

使用useState()管理组件内的数据（hook）；

使用props接收父组件传递来的数据。

Class组件有明确的声明周期管理，但是代码相对来说不如无状态组件简洁优雅。

无状态组件通过hook管理声明周期，效率更高。因此本教程全程使用无状态组件进行讲解。

下面简单演示下如何实现向子组件传递数据。

通过login和home分别向Header组件传递不同的值，并显示在Header组件中。

修改src/pages/login/index.js：
```js
   ...（略）
M   <Header title="login" info={()=>{console.log('info:login')}}/>
    ...（略）
```
修改src/pages/home/index.js：
```js
    ...（略）
M   <Header title="home" info={()=>{console.log('info:home')}}/>
    ...（略）
```
修改src/components/header/index.js：
```js
   import './header.styl'
    
M   function Header(props) {
    
+       // 接收来自父组件的数据
+       const { title, info } = props
    
+       // 如果info存在，则执行info()
+       info && info()
    
M       return <div className="M-header">Header:{title}</div>
    }
    
    export default Header
```
运行看下已经生效。
#### d.React Developer Tools 浏览器插件
为了方便调试react项目，建议安装chrome插件。
