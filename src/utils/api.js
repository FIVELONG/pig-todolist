import Taro from '@tarojs/taro'
import { logError } from './errorLog.js'

const HTTP_STATUS = {
  SUCCESS: 200,
  CLIENT_ERROR: 400,
  AUTHENTICATE: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

export default {
  baseOptions(params, method = 'GET') {
    let { url, data } = params
    const token = Taro.getStorageSync('userInfo')
    console.log('token', token)
    // let token = getApp().globalData.token
    // if (!token) login()
    console.log('params', params)
    let contentType = 'application/json;charset=utf-8' //application/x-www-form-urlencoded
    contentType = params.contentType || contentType
    const option = {
      isShowLoading: false,
      loadingText: '正在加载',
      url,
      data: data,
      method: method,
      header: { 'content-type': contentType, 'Cookie': `userid=${token ? token.user_id : ''}` },
      success(res) {
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data
        }
      },
      error(e) {
        logError('api', '请求接口出现问题', e)
      }
    }
    return Taro.request(option)
  },
  get(url, data = '') {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post: function (url, data, contentType) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  }
}
