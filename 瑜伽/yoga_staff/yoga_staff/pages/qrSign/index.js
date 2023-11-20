import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
const { getQrCode } = api
Page({
    data:{
        qrcode:'',
    },
    onLoad(){
        this.getCode()
    },
    getCode(){
        request({
            url:baseUrl + getQrCode,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    qrcode:res
                })
            }
        })
    }
})