import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
const { system_service } = api
const app = getApp()
Page({
    data:{
        serviceInfo:{}
    },
    onLoad(){
        this.getServiceInfo()
    },
    getServiceInfo(){
        request({
            url:  baseUrl + system_service,
            data: {},
            method:'POST',
            success:res => {
              this.setData({
                serviceInfo: res
              })
            }
          }).catch((err)=>{
              
          })
    },
    callPhone(){
        wx.makePhoneCall({
        phoneNumber: this.data.serviceInfo.customer_service_link //仅为示例，并非真实的电话号码
        })
    }
})