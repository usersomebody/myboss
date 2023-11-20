import moment from '../../utils/moment.js'
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
// import { posterData } from './posterData.js'
const app = getApp()
const { delAnnounce, addAnnounce } = api
Page({
    data:{
        content:'',
        title:'',
        date:'',
        editId:'',
        dateObj:{
            start:'',
            end:''
        },
        currentDate:'',
        radio:'2',
        times:1,
        introList:[{
            name:'生效时间：',
            intro:'设置生效时间，保存后到达指定日期用户登录约课端小程序后展示，不设置默认当天推送'
        },{
            name:'截止时间：',
            intro:'设置截止时间，保存后，截止时间后不再推送，不设置，默认生效日期当天截止'
        },{
            name:'推送次数：',
            intro:'每天用户登录小程序主动推送的次数'
        }],
        noticeType:2
    },
    onLoad(options){
        let { dateObj } = this.data
        dateObj = {
            start:moment().format('YYYY-MM-DD'),
            end:moment().format('YYYY-MM-DD')
        }
        let noticeInfo = wx.getStorageSync('editNoticeInfo')
        if(options.id){
            dateObj = {
                start:noticeInfo.send_start_time,
                end:noticeInfo.send_end_time
            }
        }
        wx.setNavigationBarTitle({
            title:options.id ? '修改公告' : '添加公告'
        })
        this.setData({ 
            currentDate:moment().format('YYYY-MM-DD'),
            date:moment().format('YYYY-MM-DD'),
            dateObj,
            editId:options.id || '',
            title:noticeInfo.title || '',
            content:noticeInfo.content || '',
            times:noticeInfo.send_count || 1,
            radio:noticeInfo.is_unlimited ? noticeInfo.is_unlimited + '' : '2',
            noticeType:noticeInfo.type || 2
        })
    },
    onShow(){

    },
    getTextVal(e){
        console.log('e',e)
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        if(key == 'title'){
            this.setData({
                title:value.length > 20 ? value.slice(0,20) : value
            })
        }else if(key == 'content'){
            this.setData({
                content:value
            })
        }else{
            this.setData({
                times:value
            })
        }
        
    },
    bindDateChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        const { dateObj } = this.data
        dateObj[key] = value
        this.setData({
          date:value,
          dateObj
        })
    },
    onChange(event){
        this.setData({
            radio: event.detail,
        });
    },
    sure(e){
        const { type } = e.target.dataset
        const { editId } = this.data
        if(type == 1 && !editId){
            this.back()
            return
        }
        if(type == 3){
            this.back()
            return
        }
        if(type == 1 && editId){
            wx.showModal({
                title:'确认删除',
                success:(res)=>{
                    if(res.confirm){
                        this.deleteAnnounce(editId)
                    }
                }
            })
           return
        }

        if(type == 2 && editId){
            this.updateAnnounce(editId)
            return
        }

        if(type == 2 && !editId){
            this.addAnnounce()
            return
        }
    },
    back(){
        wx.navigateBack({
            delta: 1
        })
    },
    deleteAnnounce(id){
        request({
            url:baseUrl + delAnnounce,
            isTologin:true,
            data:{
              id,
            },
            method: 'POST',
            success: (res => {
                wx.showModal({
                    title:'删除成功',
                    showCancel:false
                })
                this.back()
            })
        })
    },
    addAnnounce(){
        const { title, content, dateObj, radio, times } = this.data
        request({
            url:baseUrl + addAnnounce,
            isTologin:true,
            data:{
                title,
                content,
                send_start_time:dateObj.start,
                send_end_time:dateObj.end,
                is_unlimited:radio,
                send_count:times
            },
            method: 'POST',
            success: (res => {
                wx.showModal({
                    title:'添加成功',
                    showCancel:false,
                    success:(res)=>{
                        this.back()
                    }
                })
            })
        })
    },
    updateAnnounce(id){
        const { title, content, dateObj, radio, times } = this.data
        request({
            url:baseUrl + addAnnounce,
            isTologin:true,
            data:{
              id,
              title,
              content,
              send_start_time:dateObj.start,
              send_end_time:dateObj.end,
              is_unlimited:radio,
              send_count:times
            },
            method: 'POST',
            success: (res => {
                wx.showModal({
                    title:'修改成功',
                    showCancel:false,
                    success:(res)=>{
                        this.back()
                    }
                })
            })
        })
    }
})