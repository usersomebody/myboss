import { request } from './util';
import { api } from './api';
import {
  saveUserInfoSync,
  getUserInfoSync,
  saveUserProfileSync,
  setStorageSync
} from './storageSync';
import { isUserProfileAuthed } from './auth';

function submitUserInfo(userInfo = {}) {
  if (!userInfo.nickName) {
    return;
  }
  return request({
    method: 'POST',
    url: api.set_user_info,
    data: { userInfo }
  })
}


// 获取微信用户会员信息
function getUserProfileByWx(desc) {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: desc || '用于完善会员资料',
      success: (res) => {
        console.log('res______', res)
        resolve(res.userInfo);
        saveUserProfileSync(res.userInfo);
        setStorageSync('loginData',res)
      },
      fail: reject
    })
  })
}

async function updateLocalAndRemoteUserinfo(info) {
  let userInfo = info || {};
  if (!userInfo.nickName) {
    userInfo = await getUserProfileByWx();
  }
  console.log('userInfo', userInfo)
  // await submitUserInfo(userInfo);
  saveUserInfoSync(userInfo);
  saveUserProfileSync(userInfo);
  setValidUserInfoToData();
}

// 获取服务器存储的用户信息
function getUserInfoFromDb() {
  return request({
    url: api.get_user_info,
    method: 'POST'
  })
    .then((data = {}) => {
      const {
        userId = '',
        nickname = '',
        headimgurl = 'https://res01.feekr.com/wap/avatar/fxb-avatar-180X180.jpg'
      } = data;
      return {
        userId,
        nickName: nickname,
        avatarUrl: headimgurl.replace(/^http:/, 'https:')
      }
    })
}

async function setValidUserInfoToData() {
  const currentPage = getCurrentPages().pop();
  let userInfo = getUserInfoSync();
  if (!userInfo.avatarUrl || !userInfo.nickName) {
    userInfo = await getUserInfoFromDb();
  }
  currentPage.setData({ userInfo });
  saveUserInfoSync(userInfo);
}

function promiseAuthedCallback(cb) {
  if (isUserProfileAuthed()) {
    cb();
  } else {
    updateLocalAndRemoteUserinfo()
      .then(cb)
  }
}

export {
  setValidUserInfoToData,
  updateLocalAndRemoteUserinfo,
  promiseAuthedCallback
}
