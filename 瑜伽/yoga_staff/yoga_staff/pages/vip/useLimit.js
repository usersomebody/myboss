import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import moment from '../../utils/moment.js'
const app = getApp()
Page({
    data:{
        radioList:[{
            id:1,
            name:'全时段'
        },{
            id:2,
            name:'自定义'
        }],
        radio:1,
        currentDate:"",
        dateObj:{
            use_start_date:'',
            use_end_date:'',
            use_start_time:'',
            use_end_time:'',
            limit_num:'',
            limit_type:1
        },
        weekList:[{
            id:'1',
            name:'一',
            checked:false
        },{
            id:'2',
            name:'二',
            checked:false
        },{
            id:'3',
            name:'三',
            checked:false
        },{
            id:'4',
            name:'四',
            checked:false
        },{
            id:'5',
            name:'五',
            checked:false
        },{
            id:'6',
            name:'六',
            checked:false
        },{
            id:'0',
            name:'日',
            checked:false
        }],
        bookingRdio:1,
        bookingRadioList:[{
            id:1,
            name:'每日可约次数限制(次)'
        },{
            id:2,
            name:'每周可约次数限制(次)'
        },{
            id:3,
            name:'每月可约次数限制(次)'
        }],
    },
    onLoad(){
        const { weekList } = this.data
        this.setData({
            currentDate:moment().format('YYYY-MM-DD'),
        })
        if(app.globalData.useLimit && app.globalData.useLimit.limit_type){
            let useLimit = app.globalData.useLimit
            weekList.forEach((item)=>{
                item.checked = useLimit.use_week.indexOf(item.id) > -1 ? true : false
            })
            this.setData({
                dateObj:app.globalData.useLimit,
                bookingRdio:useLimit.limit_type,
                weekList,
                radio:useLimit.use_radio
            })
        }
    },
    onChange(event){
        this.setData({
            radio: event.detail,
        });
    },
    bookingChange(event){
        this.setData({
            bookingRdio: event.detail,
        });
    },
    bindDateChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        const { dateObj } = this.data
        dateObj[key] = value
        console.log('dateObj',dateObj)
        this.setData({
          dateObj
        })
    },
    switch(e){
        const { id } = e.currentTarget.dataset
        const { weekList } = this.data
        weekList.forEach(element => {
            element.checked = element.id == id ? !element.checked : element.checked 
        });
        this.setData({
            weekList
        })
    },
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { dateObj } = this.data
        dateObj.limit_num = value
        this.setData({
            dateObj
          })
    },
    cancle(){
        wx.navigateBack({
            delta: 1,
        })
    },
    checkData(dateObj){
        const { radio } = this.data
        console.log('dateObj',dateObj)
        if(radio == 2){
            // for(let key in dateObj){
            if(!(dateObj['use_end_date'] && dateObj['use_start_date']) && !(dateObj['use_end_time'] && dateObj['use_start_time']) && !dateObj.use_week.length){
                wx.showModal({
                    title:'请完善信息',
                    showCancel:false,
                })
                return false
            }
            // }
        }
        return true
       
    },
    sure(){
        const { dateObj, radio, bookingRdio, weekList } = this.data
        dateObj.use_week = weekList.map((item)=>{
            return item.checked ?  item.id : ''
        })
        dateObj.use_week = dateObj.use_week.filter((item)=>{
            return item
        })
        let ispass = this.checkData(dateObj)
        if(radio == 2 && !ispass){
            return
        }
        
        dateObj.limit_type = bookingRdio
        dateObj.use_radio = radio
        app.globalData.useLimit = dateObj
        this.cancle()
    },
    clearDateValue(e){
        const { dateObj } = this.data
        const { type } = e.currentTarget.dataset
        if(type == 1){
            dateObj.use_start_date = ''
            dateObj.use_end_date = ''
        }else{
            dateObj.use_start_time = ''
            dateObj.use_end_time = ''
        }
        this.setData({
            dateObj
        })
    }
})