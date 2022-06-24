import Mock from "mockjs";
const domain = '/api/'
    // 模拟login接口
Mock.mock(domain + 'login', function() {
    let result = {
        code: 200,
        message: 'OK',
        data: {
            loginUid: 10000,
            nickname: '杉菜酱子_',
            token: 'yyds2022'
        }
    }
    return result
})