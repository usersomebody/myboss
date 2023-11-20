import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
const { memberList, coachStaff, editCoachStaff } = api
Page({
    data:{
        list:[],
        statusMap:{
            1:{
                name:'已定时',
                color:'#FA9552'
            },
            2:{
                name:'已推送',
                color:'#9B77F4'
            }
        }
    },
    onLoad(){
    },
    onShow(){
        this.getCourseList()
    },

    getCourseList() {
        request({
          url:baseUrl + coachStaff,
          isTologin:true,
          data:{},
          method: 'POST',
          success: (res => {
            this.setData({
              list: res,
            })
          })
        })
    },
    switchChange(e){
        const { id, item } = e.currentTarget.dataset
        const { value } = e.detail
        let data = item
        data.is_show_applet = value ? 1 : 2
        this.submit({id,data,type:1})
    },
    submit({id,data,type}){
        request({
            url:baseUrl + editCoachStaff,
            isTologin:true,
            data:data,
            method: 'POST',
            success: (res => {
              wx.showModal({
                  title:'修改成功',
                  showCancel:false,
                  success:()=>{
                    this.getCourseList()
                  }
              })
            })
        })
    }
})