import { updateLocalAndRemoteUserinfo } from '../../utils/userInfo';
import { getUserProfile } from '../../utils/storageSync.js'

import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
const { updateUserInfo } = api
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    info: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: ''
    },
    hideCancel: {
      type: Boolean,
      value: false
    }
  },
  data: {
    mini_program_name: '盈科星选'
  },
  methods: {
    pipeResult(res) {
      console.log('res>>>>', res)
      this.triggerEvent('pipeResult', res || {})
      this.hideAuthPanel(res);
      if(res == 1){
        this.updateUser()
      }
    },
    onGetUserProfile() {
      updateLocalAndRemoteUserinfo()
        .finally(() => this.pipeResult(1));
    },
    hideAuthPanel(auth) {
      const currentPage = getCurrentPages().pop();
      currentPage.setData({ show_pre_auth_pannel: false })
    },
    updateUser(){
      let userInfo = getUserProfile()
      request({
          url:  baseUrl + updateUserInfo,
          data: {
              head_img: Object.keys(userInfo).length ? userInfo.avatarUrl : '',
              nickname: Object.keys(userInfo).length ? userInfo.nickName : ''
          },
          isTologin:false,
          method:'POST',
          success:res => {
              console.log('res', res)
              // wx.showToast({
              //   title:'授权成功'
              // })
          }
      }).catch((err)=>{
          
      })  
  }
  }
});