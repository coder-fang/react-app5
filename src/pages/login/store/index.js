// 其实就是把当前组件store(分库)下的其他文件集中起来作为统一输出口

import reducer from './reducer'
import * as actionCreators from './actionCreators'
import * as constants from './constants'
export { reducer, actionCreators, constants }