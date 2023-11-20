import {showError} from './showError.js'

function getStorageSync(key) {
  try {
    var value = wx.getStorageSync(key)
    return value || {}
  } catch (e) {
    showError('', e)
    return {}
  }
}

function setStorageSync(key,data) {
  try {
    wx.setStorageSync(key, data)
  } catch (e) {
    showError('', e)
    return false
  }
}

function clearStorageSync() {
  try {
    wx.clearStorageSync()
  } catch (e) {
    showError('', e)
    return false
  }
}

function removeStorageSync(key) {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    showError('', e)
    return false
  }
}

// 保存用户信息
function saveUserInfoSync(data) {
  setStorageSync('auth_userinfo', data)
}
// 获取用户信息
function getUserInfoSync() {
  return getStorageSync('auth_userinfo');
}

// 缓存授权会员信息
function saveUserProfileSync(data) {
  setStorageSync('auth_user_profile', data)
}
// 获取授权会员信息
function getUserProfile() {
  return getStorageSync('auth_user_profile');
}

export {
  saveUserInfoSync,
  getUserInfoSync,
  getStorageSync,
  setStorageSync,
  clearStorageSync,
  removeStorageSync,
  saveUserProfileSync,
  getUserProfile

}