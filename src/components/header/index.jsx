import './header.styl'
// 实现Header组件实时读取某个页面（分库）的Redux变量
import {connect} from 'react-redux'

function Header(props){
    // 接收来自父组件及Redux的数据 
    const {title,info,myLoginData,myCodeData} = props
    console.log('Header获取的myCodeData');
    // 如果info存在，则执行info()
    info && info()
    return (
        <div className='M-header'>Header:{title}
            <span style={{marginLeft: 20}}>myLoginData:{myLoginData}| myCodeData:{myCodeData}</span>
        </div>
    )
}

// 把store中的数据映射到组件的props
const mapStateToProps = (state) =>{
    return {
        // 数组第一个元素的login,对应的是src/store/reducer.js中的login分库名称
        myLoginData: state.getIn(['login','myLoginData']),
        myCodeData: state.getIn(['code','myCodeData'])
    }
}
// export default Header
export default connect(mapStateToProps,null)(Header)