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
    ```
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
```
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
```
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
