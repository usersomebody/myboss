import { showError } from './showError'
import { param } from './param';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function request(opt) {
  const method = (opt.method || 'GET').toUpperCase();
  const host = getApp().globalData.baseUrl
  const token = wx.getStorageSync('token');
  let header = token ? {
    token,
  } : {}
  if (!/^https?/.test(opt.url)) {
    opt.url = `${host}${opt.url}`;
  }
  opt.data = opt.data || {};
  opt.data.store_id = opt.data.store_id || wx.getStorageSync('store_id'); 
  return new Promise((resolve, reject) => {
    wx.request({
      method,
      url: opt.url,
      // data: method === 'GET' ? opt.data : param(opt.data),
      data: opt.data,
      header: opt.header || header || {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        // 请求发送失败
        if (res.statusCode !== 200) {
          showError('', '服务器出错啦～', wx.navigateBack)
          return reject({ message: '服务器出错啦～' });
        }
        // 服务器响应数据
        const { code, message, data = {} } = res.data || {};
        // 响应数据正常
        if (code === 200) {
          if (typeof opt.success === 'function') {
            opt.success(data)
          }
          return resolve(data);
        }
        //重新登录
        if(code == 400 && opt.isTologin){
          let redirect = opt.redirectUrl
          let toLogin = '/pages/login/login'
          let redirectPath = redirect ? `${toLogin}?path=${encodeURIComponent(redirect)}` : toLogin
          wx.removeStorageSync('token')
          wx.redirectTo({
              url: toLogin,
          })
          return reject({ code, message })
        }

        if(code == 500 && opt.isPassValue && opt.isPassValue == 'array'){
          if (typeof opt.success === 'function') {
            opt.success([])
          }
          return resolve([]);
        }
        if(code == 500 && !opt.errorShow){
          showError('提示', message)
          return reject({ code, message });
        }
        
        if (typeof opt.fail === 'function') {
          opt.fail({ code, message })
        }
        return reject({ code, message });
      },
      fail() {
        wx.hideLoading()
        showError('请求失败', '数据加载失败～')
        reject({ message: '请求失败，数据加载失败～' });
      },
      complete() {
        if (!opt.hasLoading) {
          wx.hideLoading()
        }
      }
    })
  })
    .catch(({ code, message }) => {
      return Promise.reject({ code, message })
    })

}
export {
 formatTime,
 request
}
