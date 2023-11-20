import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { getIdentityList } = api
Page({
    data:{
        identityList:[],
        isLoaded:false,
    },
    
    onLoad(options){

    },
    onShow(){
        this.getALLRole()
        app.globalData.identityData = ''
    },

    getALLRole(){
        const { store_id } = this.data
        request({
            url:baseUrl + getIdentityList,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    identityList:res,
                    isLoaded:true
                })
            }
        })
    },
    goSetIdentityRoot(e){
        const { id, name, type, issystem } = e.currentTarget.dataset
        const { identityList } = this.data
        let auth_code = []
        if(type == 1){
            if(name == '超级管理员'){
                return
            }
            auth_code = identityList.filter(element => {
                return element.id == id
            });

            app.globalData.identityData = {
                checkCodes:auth_code[0].auth_code,
                data_range:auth_code[0].data_range,
                is_system:auth_code[0].is_system,
                name,
                id,
                isRoot:name == '超级管理员' ? 1 : 0,
                isTeacher:name == '老师/教练' ? 1 : 0,
            }
        }
        let url = `/pages/baseConfig/permissionSet${type == 1 ? '?id=' + id + '&issystem=' + issystem : ''}`
        wx.navigateTo({
            url: url
        })
    }
})