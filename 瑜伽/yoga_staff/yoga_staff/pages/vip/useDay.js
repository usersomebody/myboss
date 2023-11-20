import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'

Page({
    data:{
        radioList:[{
            id:1,
            name:'是'
        },{
            id:2,
            name:'否'
        }],
        radio:1,
        day:''
    },
    onLoad(options){
        let dayInfo = wx.getStorageSync('useday')
        this.setData({
            radio:dayInfo.radio || 1,
            day:dayInfo.day || ''
        })
    },
    onChange(event) {
        this.setData({
          radio: event.detail,
        });
    },
    cancle(){
        wx.navigateBack({
            delta: 1, 
        })
    },
    getNumberValue(e){
        const { value } = e.detail
        this.setData({
            day:value, 
        })
    },
    sure(){
        const { radio, day } = this.data
        if(radio == 2 && !day){
            wx.showModal({
                title:'请填写有效期',
                showCancel:false,
            })
            return
        }
        wx.setStorageSync('useday', {radio, day:radio == 1 ? '长期有效' : day})
        wx.navigateBack({
            delta: 1, 
        })
    }
})