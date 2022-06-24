import {useNavigate} from 'react-router-dom'
import { Button, Input } from 'antd'
import imgLogo from '@/common/images/wentian.png'
import './login.styl'
import Header from '@/components/header'
import {connect} from 'react-redux'
import * as actionCreators from './store/actionCreators'
import {useState} from 'react'
import {apiReqs} from '@/api'

function Login(props) {
    const {myLoginData,setData} = props
    // 创建路由钩子
    const navigate = useNavigate()

    // 组件中自维护的实时数据
    const [account,setAccount] = useState('')
    const [password,setPassword] = useState('')

    // 登录
    const login = () => {
        apiReqs.signIn({
            data:{
                account,
                password
            },
            success: (res)=>{
                console.log(res);
                navigate('/home')
            }
        })
    }

    return (
        <div className="P-login">
            <Header title='login' info={()=>{console.log('info:login')}}/>
            <img src={imgLogo} alt="" className="logo" />
            <div className="ipt-con">login store: myData = {myLoginData}</div>
            <div className="ipt-con">
                <button onClick={()=>{setData('987')}}>更改login store 的myData</button>
            </div>
            <div className="ipt-con">
                <Input placeholder="账号" value={account} onChange={(e)=>{setAccount(e.target.value)}}/>
            </div>
            <div className="ipt-con">
                <Input.Password placeholder="密码" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
            </div>
            <div className="ipt-con">
                <Button type="primary" block={true} onClick={login}>
                    登录
                </Button>
            </div>
        </div>
    )
}

// 把store中的数据映射到组件的props
const mapStateToProps = (state) => {
    return {
        // 数组的第一个元素的login,对应的是src/store/reducer.js 中定义的Login分库名称
        myLoginData: state.getIn(['login','myLoginData'])
    }
}

// 把store 的Dispatch 映射到组件的props
const mapDispatchToProps = (dispatch) => ({
    setData(data) {
        const action = actionCreators.setData(data)
        dispatch(action)
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(Login)

/**
 * 关键点说明：
 *  1.注意代码最后一行，export的数据被connect方法包装了。
 *  2.通过mapStateToProps和mapDispatchToProps方法，把store里的state和dispatch都映射到了组件的props。这样就可以直接通过props进行访问了，store中数据的变化胡直接改变props从而触发组件的视图更新
 *  3.state.getIn() 方法是来自于redux-immutable 的。
 * 
 * 点击按钮后，可以看到页面中显示的myData发生了变化，通过Redux DevTools 可以进行可视化跟踪查看
 */