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
  const token = wx.getStorageSync('auth_token');
  const isWarning = opt.isWarning == 0 ? false : true
  let header = token ? {
    token,
  } : {}
  if (!/^https?/.test(opt.url)) {
    opt.url = `${host}${opt.url}`;
  }
  opt.data = opt.data || {};
  opt.data.store_id = opt.data.store_id || wx.getStorageSync('store_id'); 
  return new Promise((resolve, reject) => {
    console.log('???',opt)
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
        const { code, message, msg, content = {} } = res.data || {};
        // 响应数据正常
        if (code === 200) {
          if (typeof opt.success === 'function') {
            opt.success(content)
          }
          return resolve(content);
        }
        //重新登录
        if(code == 400 && opt.isTologin){
          console.log('redirectUrl',opt)
          let redirect = opt.redirectUrl
          let toLogin = '/pages/login/login'
          let redirectPath = redirect ? `${toLogin}?path=${redirect}` : toLogin
          // let redirectPath = redirect ? decodeURIComponent(redirect) : toLogin
          wx.removeStorageSync('auth_token')
          wx.redirectTo({
              url: redirectPath,
          })
          return reject({ code, msg })
        }
        if((code != 200 || code != 400) && isWarning){
          showError('提示', msg)
          wx.hideLoading()
          return reject({ code, msg });
        }
        // if(code == 500 && opt.isPassValue && opt.isPassValue == 'array'){
        //   if (typeof opt.success === 'function') {
        //     opt.success([])
        //   }
        //   return resolve([]);
        // }
        // if(code == 500 && !isWarning){
        //   showError('提示', msg)
        //   return reject({ code, msg });
        // }
        if (typeof opt.fail === 'function') {
          opt.fail({ code, msg, content })
        }
        return reject({ code, msg });
      },
      fail(err) {
        console.log('err',err)
        wx.hideLoading()
        showError('请求失败', err)
        reject({ message: '请求失败，数据加载失败～' });
      },
      complete() {
        if (!opt.hasLoading) {
          // wx.hideLoading()
        }
      }
    })
  })
    .catch(({ code, message }) => {
      return Promise.reject({ code, message })
    })

}

function getUrlParam(url, name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

// 错误提示
function alertError(content, callback) {
  wx.showModal({
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        if (callback && typeof callback == 'function') {
          callback()
        }
      }
    }
  })
}
export {
 formatTime,
 request,
 getUrlParam,
 alertError
}
