// 将login和header的store 引用，然后通过combineReducers合并在一起，并分别加上唯一的对象key值
/**
 * 好处：
 *    1. 避免各组件的store数据互相污染
 *    2. 组件独立维护自己的store,减少维护成本
 */

// import { combineReducers } from 'redux'
import { combineReducers } from 'redux-immutable'
import { reducer as loginReducer } from '@/pages/login/store'
import { reducer as headerReducer } from '@/components/header/store'
import { reducer as codeReducer } from '@/pages/code/store'

// 初始默认的state
const reducer = combineReducers({
    login: loginReducer,
    header: headerReducer,
    code: codeReducer
})
export default reducer