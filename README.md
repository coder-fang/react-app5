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
#### a.执行此命令，暴露配置文件
 `yarn eject` 

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
### (7)React Developer Tools 浏览器插件
为了方便调试react项目，建议安装chrome插件。
先科学上网，在chrome网上应用店或 https://www.extfans.com/ 里搜索“React Developer Tools”并安装。
安装完成后，打开chrome DevTools，点击Components按钮，可以清晰的看到react项目代码结构以及各种传参。
### (8)Redux及相关插件
#### a.安装redux 
`yarn add redux`
仅仅安装redux也是可以使用的，但是比较麻烦，redux里更新store中的数据，需要手动订阅（subcribe）更新，可以借助另一个插件（react-redux）提高开发效率。
#### b.安装react-redux
`yarn add react-redux`
react-redux允许通过connect方法，<b>将store中的数据映射到组件的props</b>>,省去了store订阅。原state中读取store的属性改用props读取。
#### c.安装redux-thunk
`yarn add redux-thunk`

redux-thunk允许在actionCreators里传递函数类型的数据。这样可以把业务逻辑（例如接口请求）集中写在actionCreator.js，方便复用的同时，可以使组件的主文件更简洁。

#### d.安装redux浏览器插件

为了更方便跟踪redux状态，建议安装chrome插件。这个插件可记录每次redux的变化，非常便于跟踪调式。

先科学上网，在chrome网上应用店里搜索“Redux DevTools”并安装。

安装完成后还不能直接使用，需要在项目代码中进行配置。

#### e.创建store
安装以上各种插件后，可以store用来管理状态数据了。

如果项目比较简单，只有一两个页面，可以只创建一个总store管理整体项目。目录结构参考如下：
```
    ├─ /src   
+   |  ├─ /store
+   |  |  ├─ actionCreators.js
+   |  |  ├─ constants.js       <-- 定义方法的常量
+   |  |  ├─ index.js
+   |  |  └─ reducer.js
```
以下是各文件的代码：

src/store/index.js：

```js
import { createStore, applyMiddleware, compose } from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk'

// 这里让项目支持浏览器插件Redux DevTools
const composeEnhancers = typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose

const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);

const store = createStore(
  reducer,
  enhancer
)

export default store
```
以上是store的核心代码，支持了Redux DevTools。同时，利用redux的集成中间件（applyMiddleware）功能将redux-thunk集成进来，最终创建了store。

src/store/constants.js：
```js
export const SET_DATA = 'SET_DATA'
```
创建这个定义常量的文件，是因为方便被下面的reducer.js和actionCreators.js同时引用，便于统一修改和管理。

src/store/actionCreators.

```js
import * as constants from './constants'

export const getData = (data) => ({
  type: constans.SET_DATA,
  data
})
```

src/store/reducer.js：

```js
import * as constants from './constants'

// 初始默认的state
const defaultState = {
    myData: null
}

const reducer = (state = defaultState, action) => {
    // 由于state是引用型，不能直接修改，否则是监测不到state发生变化的。因此需要先复制一份进行修改，然后再返回新的state。
    let newState = Object.assign({}, state)
    switch(action.type) {
        case constants.SET_DATA:
            newState.myData = action.data
            return newState
        default:
            return state
    }
}

export default reducer
```
以上代码，在store设置了一个myData。现在，state修改起来还是有点小麻烦，如何更好地解决这个问题，之后会提到。

实际项目中很少只用一个总store库来管理的。因此，在下面章节的分库内容中具体讲述Redux的使用方法。

#### f.复杂项目store分解
当项目的页面较多，如果数据都集中放在一个store里，维护成本将会变高。接下来分享下如何将store分解到各个组件中。

一般来说，每个组件有自己的store（分库），再由src/store作为总集，集成每个组件的store。

以header和login两个组件为例，分别创建组件自己的store，文件结构跟store总集一致。

目录结构变动如下：

```
    |  |  ├─ /components
    |  |  |  └─ /header
+   |  |  |     ├─ /store
+   |  |  |     |  ├─ actionCreators.js
+   |  |  |     |  ├─ constants.js      
+   |  |  |     |  ├─ index.js
+   |  |  |     |  └─ reducer.js
    |  |  |     ├─ header.styl
    |  |  |     └─ index.js
    |  |  ├─ /pages
    |  |  |  ├─ /login
+   |  |  |  |  ├─ /store
+   |  |  |  |  |  ├─ actionCreators.js
+   |  |  |  |  |  ├─ constants.js
+   |  |  |  |  |  ├─ index.js
+   |  |  |  |  |  └─ reducer.js
    |  |  |  |  ├─ login.styl
    |  |  |  |  └─ index.js
```

src/components/header/store/index.js及src/pages/login/store/index.js：

```js
import reducer from './reducer'
import * as actionCreators from './actionCreators'
import * as constants from './constants'

export { reducer, actionCreators, constants}
```

其实就是把当前组件store（分库）下的其他文件集中起来作为统一输出口。

src/components/header/store/constants.js：

```js
const ZONE = 'components/header/'

export const SET_DATA = ZONE + 'SET_DATA'
```
ZONE是用来避免与其他组件的constants重名。

同样的方式，在login下进行创建store。

src/pages/login/store/constants.js：

```js
const ZONE = 'pages/login/'

export const SET_DATA = ZONE + 'SET_DATA'
```
src/components/header/store/actionCreators.js及src/pages/login/store/actionCreators.js：

```js
import * as constants from './constants'

export const setData = (data) => ({
  type: constants.SET_DATA,
  data
})
```

src/components/header/store/reducer.js：

```js
import * as constants from './constants'

// 初始默认的state
const defaultState = {
    myHeaderData: null
}

const reducer = (state = defaultState, action) => {
    // 由于state是引用型，不能直接修改，否则是监测不到state发生变化的。因此需要先复制一份进行修改，然后再返回新的state。
    let newState = Object.assign({}, state)
    switch(action.type) {
        case constants.SET_DATA:
            newState.myHeaderData = action.data
            return newState
        default:
            return state
    }
}

export default reducer
```

同样的方式，src/pages/login/store/reducer.js：

```js
import * as constants from './constants'

// 初始默认的state
const defaultState = {
    myLoginData: null
}

const reducer = (state = defaultState, action) => {
    // 由于state是引用型，不能直接修改，否则是监测不到state发生变化的。因此需要先复制一份进行修改，然后再返回新的state。
    let newState = Object.assign({}, state)
    switch(action.type) {
        case constants.SET_DATA:
            newState.myLoginData = action.data
            return newState
        default:
            return state
    }
}

export default reducer
```

然后修改项目store总集，目录结构变动如下：

```
    ├─ /src   
    |  ├─ /store
-   |  |  ├─ actionCreators.js  <-- 删除
-   |  |  ├─ constants.js       <--删除
    |  |  ├─ index.js
M   |  |  └─ reducer.js
```
src/store/reducer.js重写如下：

```js
import { combineReducers } from 'redux'
import { reducer as loginReducer } from '@/pages/login/store'
import { reducer as headerReducer } from '@/components/header/store'

const reducer = combineReducers({
    login: loginReducer,
    header: headerReducer
})

export default reducer
```

以上代码的作用就是把login和header的store引入，然后通过combineReducers合并在一起，并分别加上唯一的对象key值。

这样的好处非常明显：
- 避免各组件的store数据互相污染。
- 组件独立维护自己的store，减少维护成本。
- 非常建议使用这种方式维护store。



#### g.安装使用immutable
在e小节，提到了store里不能直接修改state，因为state是引用类型，直接修改可能导致监测不到数据变化。

immutable.js从字面上就可以明白，immutable的意思是“不可改变的”。使用immutable创建的数据是不可改变的，对immutable数据的任何修改都会返回一个新的immutable数据，不会改变原始immutable数据。

immutable.js提供了很多方法，非常方便修改对象或数组类型的引用型数据。

安装immutable和redux-immutable，执行：

`yarn add immutable redux-immutable`

然后对代码进行改造：

src/store/reducer.js：

```js
-   import { combineReducers } from 'redux'
+   import { combineReducers } from 'redux-immutable'
    ...(略)
```

以上代码就是把combineReducers换成redux-immutable里的。

然后修改src/pages/login/store/reducer.js：

```js
  import * as constants from './constants'
+   import { fromJS } from 'immutable'
    
    // 初始默认的state
M   const defaultState = fromJS({
        myLoginData: null,
M   })
    
+   const getData = (state, action) => {
+       return state.set('myLoginData', action.data)
+   }
    
    const reducer = (state = defaultState, action) => {
        //  由于state是引用型，不能直接修改，否则是监测不到state发生变化的。因此需要先复制一份进行修改，然后再返回新的state。
-       // let newState = Object.assign({}, state)
        switch (action.type) {
            case constants.SET_DATA:
-               // newState.myLoginData = action.data
-               // return newState
                return getData(state, action)
            default:
                return state
        }
    }
    
    export default reducer
```

ps:immutable的介入，就是利用fromJS方法，把原始的JS类型转化为immutable类型。

由于state已经是immutable类型了，可以使用immutable的set方法进行数据修改，并返回一个新的state。代码简洁很多，不需要手动通过Object.assign等方法去复制再处理了。

header组件的代码修改同理不再赘述。

immutable还有很多其他用法，具体请查看官方文档：https://immutable-js.com/docs/v4.1.0


#### h.对接react-redux与store

下面来对接react-redux与store，让全部组件都能方便引用store。

修改src/index.js:

```js
    import React from 'react'
    import ReactDOM from 'react-dom'
    import { ConfigProvider } from 'antd'
    import zhCN from 'antd/es/locale/zh_CN'
    import App from './App'
+   import { Provider } from 'react-redux'
+   import store from './store'
    // 全局样式
    import '@/common/stylus/frame.styl'
    
    const antdConfig = {
        locale: zhCN,
    }
    
    ReactDOM.render(
        <ConfigProvider {...antdConfig}>
+           <Provider store={store}>
                <App />
+           </Provider>
        </ConfigProvider>,
        document.getElementById('root')
    )
```

以上代码就是用react-redux提供的Provider，把store传给了整个App。

在需要使用store的组件中，要使用react-redux提供的connect方法对组件进行包装。


#### i.在login页面设置并实时读取Redux变量

以login为例，修改src/pages/login/index.js：

```js
    import { useNavigate } from 'react-router-dom'
    import { Button, Input } from 'antd'
    import imgLogo from './logo.png'
    import Header from '@/components/header'
+   import { connect } from 'react-redux'
+   import * as actionCreators from './store/actionCreators'
    import './login.styl'
    
M   function Login(props) {
+       const { myLoginData, setData } = props
    
        // 创建路由钩子
        const navigate = useNavigate()
    
        return (
            <div className="P-login">
                <Header
                    title="login"
                    info={() => {
                        console.log('info:login')
                    }}
                />
                <img src={imgLogo} alt="" className="logo" />
+               <div className="ipt-con">login store: myData = {myLoginData}</div>
+               <div className="ipt-con">
+                   <button onClick={() => {setData('123456')}}>更改login store的myData</button>
+               </div>
                <div className="ipt-con">
                    <Input placeholder="账号" />
                </div>
                <div className="ipt-con">
                    <Input.Password placeholder="密码" />
                </div>
                <div className="ipt-con">
                    <Button
                        type="primary"
                        block={true}
                        onClick={() => {
                            navigate('/home')
                        }}
                    >
                        登录
                    </Button>
                </div>
            </div>
        )
    }
    
+   // 把store中的数据映射到组件的props
+   const mapStateToProps = (state) =>{
+       return {
+           // 数组第一个元素的login，对应的是src/store/reducer.js中定义的login分库名称
+           myLoginData: state.getIn(['login', 'myLoginData']),
+       }
+   } 
+   
+   // 把store的Dispatch映射到组件的props
+   const mapDispatchToProps = (dispatch) => ({
+       setData(data) {
+           const action = actionCreators.setData(data)
+           dispatch(action)
+       },
+   })
   
-   // export default Login
M   export default connect(mapStateToProps, mapDispatchToProps)(Login)
```

关键点说明：

1. 注意代码最后一行，export的数据被connect方法包装了。
2. 通过mapStateToProps和mapDispatchToProps方法，把store里的state和dispatch都映射到了组件的props。这样可以直接通过props进行访问了，store中数据的变化会直接改变props从而触发组件的视图更新。
3. state.getIn()方法是来自于redux-immutable的。

点击按钮后，可以看到页面中显示的myData发生了变化，通过Redux DevTools可进行可视化跟踪查看。


#### j.在header组件实时读取Redux变量
接下来，要实现在header组件中实时读取在login页面设置的myLoginData。

修改src/components/header/index.js：

```js
+   import { connect } from 'react-redux'
    import './header.styl'
    
    function Header(props) {
        
M       // 接收来自父组件及Redux的数据
M       const { title, info, myLoginData } = props
    
        // 如果info存在，则执行info()
        info && info()
    
        return (
            <div className="M-header">
                Header:{title}
+               <span style={{ marginLeft: 20 }}>myLoginData:{myLoginData}</span>
            </div>
        )
    }
    
+   // 把store中的数据映射到组件的props
+   const mapStateToProps = (state) => {
+       return {
+           // 数组第一个元素的login，对应的是src/store/reducer.js中定义的login分库名称
+           myLoginData: state.getIn(['login', 'myLoginData']),
+       }
+   }
    
-   // export default Header
M   export default connect(mapStateToProps, null)(Header)
```

由于在header中只用到了读取Redux的myLoginData，所以不需要mapDispatchToProps方法了。

这里是通过Redux实时获取的，而非通过父子组件传递方式。因此同样的方式可以在其他页面或者组件中直接使用，无需考虑组件的父子关系。

现在点击“更改login store的myData”，可以发现header组件可以正常实时获取myLoginData了。


#### k.Redux开发小结

其实react-redux、redux-thunk、immutable都是围绕如何简化redux开发的。

- react-redux是为了简化redux通过订阅方式修改state的繁琐过程。

- redux-thunk是为了redux的dispatch能够支持function类型的数据，请回顾8.9章节中login页面代码的mapDispatchToProps。

- immutable是为了解决store中的数据不能被直接赋值修改的问题（引用类型数据的变化导致无法监测到数据的变化）。

### (9)基于axios封装公用API库

#### a.安装axios
`yarn add axios`

#### b.封装公用API库
src/api/index.js：

```js
import axios from 'axios'
import { createHashHistory } from 'history'
import { Modal } from 'antd'

let history = createHashHistory()

// 配合教程演示组件外路由跳转使用，无实际意义
export const goto = (path) => {
    history.push(path)
}

// 开发环境地址
let API_DOMAIN = '/api/'
if (process.env.NODE_ENV === 'production') {
    // 正式环境地址
    API_DOMAIN = 'http://xxxxx/api/'
}

// 用户登录信息在localStorage中存放的名称
export const SESSION_LOGIN_INFO = 'loginInfo'; 

// API请求正常，数据正常
export const API_CODE = {
    // API请求正常
    OK: 200,
    // API请求正常，数据异常
    ERR_DATA: 403,
    // API请求正常，空数据
    ERR_NO_DATA: 301,
    // API请求正常，登录异常
    ERR_LOGOUT: 401,
}

// API请求异常统一报错提示
export const API_FAILED = '网络连接异常，请稍后再试'
export const API_LOGOUT = '您的账号已在其他设备登录，请重新登录'

export const apiReqs = {
    // 登录（成功后将登录信息存入localStorage）
    signIn: (config) => {
        axios
            .post(API_DOMAIN + 'login', config.data)
            .then((res) => {
                let result = res.data
                config.done && config.done(result)
                if (result.code === API_CODE.OK) {
                    window.localStorage.setItem(
                        SESSION_LOGIN_INFO,
                        JSON.stringify({
                            uid: result.data.loginUid,
                            nickname: result.data.nickname,
                            token: result.data.token,
                        })
                    )
                    config.success && config.success(result)
                } else {
                    config.fail && config.fail(result)
                }
            })
            .catch(() => {
                config.done && config.done()
                config.fail &&
                config.fail({
                        message: API_FAILED,
                    })
            })
    },
    // 管登出（登出后将登录信息从localStorage删除）
    signOut: () => {
        const { uid, token } = getLocalLoginInfo()
        let headers = {
            loginUid: uid,
            'access-token': token,
        }
        let axiosConfig = {
            method: 'post',
            url: API_DOMAIN + 'logout',
            headers,
        }
        axios(axiosConfig)
            .then((res) => {
                logout()
            })
            .catch(() => {
                logout()
            })
    },
    // 获取用户列表
    getUserList: (config) => {
        config.method = 'get'
        config.url = API_DOMAIN + 'user/getUserList'
        apiRequest(config)
    },
    // 修改用户信息
    modifyUser: (config) => {
        config.url = API_DOMAIN + 'user/modify'
        apiRequest(config)
    },
}

// 从localStorage获取用户信息
export function getLocalLoginInfo() {
    return JSON.parse(window.localStorage[SESSION_LOGIN_INFO])
}

// 失效退出界面
export function logout() {
    window.localStorage.removeItem(SESSION_LOGIN_INFO)
    history.push('/login')
}

/*
 * API请求封装（带验证信息）
 * config.history: [必填]用于页面跳转等逻辑
 * config.method: [必须]请求method
 * config.url: [必须]请求url
 * config.data: 请求数据
 * config.formData: 是否以formData格式提交（用于上传文件）
 * config.success(res): 请求成功回调
 * config.fail(err): 请求失败回调
 * config.done(): 请求结束回调
 */
export function apiRequest(config) {
    const loginInfo = JSON.parse(window.localStorage.getItem(SESSION_LOGIN_INFO))
    if (config.data === undefined) {
        config.data = {}
    }
    config.method = config.method || 'post'

    // 封装header信息
    let headers = {
        loginUid: loginInfo ? loginInfo.uid : null,
        'access-token': loginInfo ? loginInfo.token : null,
    }

    let data = null

    // 判断是否使用formData方式提交
    if (config.formData) {
        headers['Content-Type'] = 'multipart/form-data'
        data = new FormData()
        Object.keys(config.data).forEach(function (key) {
            data.append(key, config.data[key])
        })
    } else {
        data = config.data
    }

    // 组装axios数据
    let axiosConfig = {
        method: config.method,
        url: config.url,
        headers,
    }

    // 判断是get还是post，并加入发送的数据
    if (config.method === 'get') {
        axiosConfig.params = data
    } else {
        axiosConfig.data = data
    }

    // 发起请求
    axios(axiosConfig)
        .then((res) => {
            let result = res.data
            config.done && config.done()
            
            if (result.code === API_CODE.ERR_LOGOUT) {
                // 如果是登录信息失效，则弹出Antd的Modal对话框
                Modal.error({
                    title: result.message,
                    // 点击OK按钮后，直接跳转至登录界面
                    onOk: () => {
                        logout()
                    },
                })
            } else {
                // 如果登录信息正常，则执行success的回调
                config.success && config.success(result)
            }
        })
        .catch((err) => {
            // 如果接口不通或出现错误，则弹出Antd的Modal对话框
            Modal.error({
                title: API_FAILED,
            })
            // 执行fail的回调
            config.fail && config.fail()
            // 执行done的回调
            config.done && config.done()
        })
}
```
这里主要实现了两个方面：
1. 通过apiReqs把项目所有api进行统一管理。
2. 通过apiRequest方法，实现了统一的token验证、登录状态失效报错以及请求错误报错等业务逻辑。

> 为什么signIn和signOut方法没有像getUserList和modifyUser一样调用apiRequest呢？
> 因为signIn和signOut的逻辑比较特殊，signIn并没有读取localStorage，而signOut需要清除localStorage，这两个逻辑是与其他API不同的，所以单独实现了。



#### c.Mock.js安装与使用

在开发过程中，为了方便前端独自调试接口，经常使用Mock.js拦截Ajax请求，并返回预置好的数据。本小节介绍下如何在react项目中使用Mock.js。

执行安装：

`yarn add mockjs`

在src下新建mock.js，代码如下：

```js
import Mock from 'mockjs'

const domain = '/api/'

// 模拟login接口
Mock.mock(domain + 'login', function () {
    let result = {
      code: 200,
      message: 'OK',
      data: {
          loginUid: 10000,
          nickname: '兔子先生',
          token: 'yyds2022'
      }
    }
    return result
})
```
然后在src/index.js中引入mock.js:

```js
    import React from 'react'
    import ReactDOM from 'react-dom'
    import { ConfigProvider } from 'antd'
    import zhCN from 'antd/es/locale/zh_CN'
    import App from './App'
    import { Provider } from 'react-redux'
    import store from './store'
+   import './mock'
    ...（略）
```

这样，在项目中请求/api/login的时候，就会被Mock.js拦截，并返回mock.js中模拟好的数据。

#### d.发起API请求

继续完善login页面，实现一个API请求。

src/pages/login/index.js：

```js
+   import { useState } from 'react'
    import { useNavigate } from 'react-router-dom'
    import { Button, Input } from 'antd'
    import imgLogo from './logo.png'
    import Header from '@/components/header'
    import { connect } from 'react-redux'
    import * as actionCreators from './store/actionCreators'
+   import { apiReqs } from '@/api'
    import './login.styl'
    
    function Login(props) {
        const { myLoginData, setData } = props
        // 创建路由钩子
        const navigate = useNavigate
        
+       // 组件中自维护的实时数据
+       const [account, setAccount] = useState('')
+       const [password, setPassword] = useState('')
        
        // 登录
+       const login = () => {
+           apiReqs.signIn({
+               data: {
+                   account,
+                   password
+               },
+               success: (res) => {
+                   console.log(res)
+                   navigate('/home')
+               }
+           })
+       }

        return (
            <div className="P-login">
                ...（略）
                <div className="ipt-con">
M                   <Input placeholder="账号" value={account} onChange={(e)=>{setAccount(e.target.value)}} />
                </div>
                <div className="ipt-con">
M                   <Input.Password placeholder="密码" value={password} onChange={(e)=>{setPassword(e.target.value)}}  />
                </div>
                <div className="ipt-con">
M                   <Button type="primary" block={true} onClick={login}>登录</Button>
                </div>
                
                ...（略）
```

在login页面点击“登录”按钮，页面正常跳转。

在Console中可以看到mockjs返回的模拟请求数据。

但是在Network的Fetch/XHR里是看不到任何发起的请求的。因为请求被mockjs拦截了，实际上并没有发出真正的请求。


#### e.设置开发环境的反向代理请求

在react开发环境中，发起真正的情况通常会遇到跨域问题。比如，默认情况下当前demo项目执行yarn start后会运行在http://localhost:3000。本地在http://localhost启动了一个API后端服务。由于端口不一致，请求会存在跨域问题。可以借助http-proxy-middleware工具实现反向代理。

执行安装：

`yarn add http-proxy-middleware --dev`

在src下创建setupProxy.js，代码如下：

```js
/**
 * 反向代理配置
 * 只要请求地址是以"/api"开头，那就反向代理到http://localhost域名下，跨域问题解决！大家可以根据实际需求进行修改。
 */
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        // 开发环境API路径匹配规则
        '^/api',
        createProxyMiddleware({
            // 要代理的真实接口API域名
            target: 'http://localhost',
            changeOrigin: true
        })
    )
}
```

一定记得要把mockjs注释掉，否则会被拦截的。

修改src/index.js:
`-   import './mock'`

> 注：setupProxy.js设置后，一定要重启项目才生效。

通过Console可以看到后端API返回的真实数据，在Network里也可以看到发起的请求了。

### (10)build项目
在build前还需要做一步配置，否则build版本网页中的文件引用都是绝对路径，运行后是空白页面。

修改package.json：

```json
    "name": "react-app5",
	"version": "0.1.0",
	"private": true,
+	"homepage": "./",
	...（略）
```

执行：`yarn build`

生成的文件在项目根目录的build目录中，打开index.html即可看到正常运行的项目。
[![Security Status](https://www.murphysec.com/platform3/v3/badge/1610643356967796736.svg)](https://www.murphysec.com/accept?code=71f6be1775ae95bfc344a470ce18426c&type=1&from=2&t=1)
