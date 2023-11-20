import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
Page({
    data:{
        radioList:[{
            id:1,
            name:'不限制'
        },{
            id:2,
            name:'不允许'
        },{
            id:3,
            name:'允许'
        }],
        radio:1,
        inputList:[{
            name:'可请假次数',
            require:true,
            placeholder:'必填',
            val:"",
            key:'leave_limit_num'
        },{
            name:'单次请假购买（元）',
            placeholder:'选填',
            require:false,
            val:"",
            key:'leave_deduct'
        },{
            name:'最小请假天数限制',
            placeholder:'选填',
            require:false,
            val:"",
            key:'leave_limit_day'
        },{
            name:'最大请假天数限制',
            placeholder:'选填',
            require:false,
            val:"",
            key:'leave_limit_day_max'
        }],
    },
    onLoad(){
        const { inputList, radio } = this.data
        let limit = app.globalData.leaveLimit
        if(limit && limit.is_leave_infinite){
            inputList.forEach((item)=>{
                item.val = limit[item.key] ? limit[item.key] : ''
            })
            this.setData({
                radio:limit['is_leave_infinite'] == 1 ? 1 : limit['leave_limit_num'] ? 3 : 2,
                inputList
            })
        }
        
    },
    onChange(event){
        this.setData({
            radio: event.detail,
        });
        
    },
    //获取input值
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { inputList } = this.data
        inputList.forEach((item)=>{
            if(item.key == key){
                item.val = value
            }
        })
        this.setData({
            inputList
        })
    },
    cancle(){
        wx.navigateBack({
            delta: 1, 
        })
    },
    sure(){
        const { inputList, radio } = this.data
        let obj = {}
        inputList.forEach(element => {
            obj[element.key] = element.val
        });
        if(radio == 3 && !obj['leave_limit_num']){
            wx.showModal({
                title:'请输入可请假次数',
                showCancel:false
            })
            return
        }
        
        obj.is_leave_infinite = radio
        obj.is_leave_infinite_name = radio == 1 ? '不限制' : radio == 2 ? '不允许' : '允许'
        app.globalData.leaveLimit = obj
        this.cancle()
    }
})