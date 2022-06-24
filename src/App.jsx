import {HashRouter,Route,Routes,Navigate} from 'react-router-dom'
import Login from './pages/login';
import Home from './pages/home';
import Code from './pages/code'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route  path='/home' element={<Home />}></Route>
        <Route  path='/login' element={<Login />}></Route>
        <Route  path='/code' element={<Code />}></Route>
        {/* 路由未匹配，跳转login页面 */}
        <Route path='*' element={<Navigate to="/login"/>}></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
