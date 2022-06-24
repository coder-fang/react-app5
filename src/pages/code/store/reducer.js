import * as constants from './constants'
import { fromJS } from 'immutable'
/**
 * immuable的介入，就是利用fromJS方法，把原始的JS类型转化为immuable类型。
 * 由于state已经是immuable类型了，可以使用immuable的set方法进行数据修改，并返回一个新的state。不再需要手动通过Object.assign()等方法去复制再处理了
 * 
 */

// 初始默认的state
const defaultState = fromJS({
    myCodeData: null
})

const getData = (state, action) => {
    return state.set('myCodeData', action.data)
}

const reducer = (state = defaultState, action) => {
    // 由于state是引用型，不能直接修改，否则是监测不到state发生变化的。因此需要先复制一份进行修改，然后再返回新的state
    // let newState = Object.assign({}, state)
    switch (action.type) {
        case constants.SET_DATA:
            // newState.myHeaderData = action.data
            // return newState
            return getData(state, action)
        default:
            return state
    }
}
export default reducer