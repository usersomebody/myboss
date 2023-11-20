import { api, baseUrl } from './api.js'
import { showError } from './showError.js'
import {
  getUserProfile,
  getUserInfoSync,
  getStorageSync,
  setStorageSync,
  removeStorageSync
} from './storageSync.js'
let app = getApp()

// token信息写入本地
function saveToken(data) {
  setStorageSync('auth_token', data)
}

// 查看是否授权 
function isUserProfileAuthed() {
  return !!getUserProfile().nickName;
}

// 尝试弹出自定义授权弹框
function invokeUserProfileAuth() {
  if (!isUserProfileAuthed()) {
    const currentPage = getCurrentPages().pop();
    currentPage.setData({ show_pre_auth_pannel: true })
    return Promise.resolve(1);
  }
  return Promise.resolve(0);
}

// 微信登录
function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: resolve,
      fail: reject
    })
  })
    .then(({code}) => new Promise((resolve, reject) => {
      console.log({code})
      wx.request({
        url: baseUrl + api.wx_login,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          jscode:code
          // device: app.globalData.sysInfo,
          // deviceSource: 'wxApp'
        },
        success(res) {
          console.log('res', res)
          if (res.statusCode !== 200) {
            showError('请求错误', res.data.msg);
            return reject();
          }
          const { code, msg, data } = res.data;
          if (code === 200) {
            saveToken(data.token);
            setStorageSync('userId', data)
            return resolve();
          }
          const isForbidden = [40121, 40122, 4012].indexOf(code) >= 0; //用户身份禁用
          showError(isForbidden ? '温馨提示' : '请求错误', msg);
          return reject();
        },
        fail() {
          showError('', '服务器出错啦～', wx.navigateBack);
          reject();
        },
      })
    })
  )
}


// 验证是否登录
function isLogin() {
  let auth_token = getStorageSync('auth_token')
  return Object.keys(auth_token).length
}

// 确保登陆
function login(callback = () => { }) {
  // 未登录
  if (!isLogin()) {
    return wxLogin()
      .then(callback);
  }else{
    return Promise.resolve()
    .then(callback)
  }
}

export {
  saveToken,
  isLogin,
  login,
  wxLogin,
  getUserInfoSync,
  isUserProfileAuthed,
  invokeUserProfileAuth,
}
