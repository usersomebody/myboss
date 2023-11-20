import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import { accMul } from '../../utils/common';
const app = getApp()
const { searchBookingUser, vipCardList, privateCourseList, subscribeCourse, bookingCardCost } = api
Page({
    data:{
        courseId:'',
        courseBookingDate:'',
        vipList: [],
        timeList:[],
        content:'',
        selectDate:"",
        countNum:1,
        searchList:[],
        inputVal:'',
        showSearchList:false,
        userId:'',
        vipCardId:'',
        isPersonal:'',
        searchWord:'',
        cid:'',
        cardType:{
            1:{
                name:'剩余天数:',
                key:'day',
                symbol:'天',
                type:'期限卡'
            },
            2:{
                name:'剩余次数:',
                key:'assets_num',
                symbol:'次',
                type:'次数卡'
            },
            3:{
                name:'剩余金额:',
                key:'assets_money',
                symbol:'元',
                type:'储值卡'
            },
            4:{
                name:'剩余时间:',
                key:'assets_time',
                symbol:'分钟',
                type:'计时卡'
            }
        },
        tipsImg:{
            1:'#ffffff',
            2:'#FFE7E9',
            3:'#D7FFFA',
            4:'#FFF7E6'
        },
        tipsImgList:[
            {
                id:1,
                color:'#ffffff',
                name:'可约'
            },
            {
                id:2,
                color:'#FFF7E6',
                name:'休息'
            },{
                id:3,
                color:'#FFE7E9',
                name:'已满'
            },{
                id:4,
                color:'#E7FFFC',
                name:'团课'
            }
        ],
        cardCost:'',
        cost:''
    },
    onLoad(options){
        this.setData({
            courseId:options.courseId,
            cid:options.cid,
            isPersonal:options.courseType,
            courseBookingDate:options.courseDate
        })
        if(options.courseType == 4){
            this.getSubscribeCourse()
        }
    },
    //输入查询
    inputValue(e){
        const { value } = e.detail
        this.setData({
            searchWord:value,
        })

        this.throttle(this.getMemebrValue,null,500,value)//节流处理input时间 可以不用
    },
    getMemebrValue(){
        const { searchWord } = this.data
        request({
            url:baseUrl + searchBookingUser,
            data:{
                name:searchWord
            },
            method: 'POST',
            isTologin:true,
            success: (res => {
                this.setData({
                    searchList:res
                })
            })
          })
        this.setData({
            showSearchList:true
        })
    },
    throttle(fn, context, delay, text) {
        clearTimeout(fn.timeoutId);
        fn.timeoutId = setTimeout(function () {
          fn.call(context, text);
        }, delay);
    },
    radioChange(e) {
        const items = this.data.vipList
        let vipCardType = 1
        let card_id = ''
        for (let i = 0, len = items.length; i < len; ++i) {
            if(items[i].id == e.detail.value){
                items[i].checked = true
                vipCardType = items[i].type
                card_id = items[i].card_id
            }
        }
        this.setData({
            vipList:items,
            vipCardId:e.detail.value,
            vipCardType:vipCardType
        })
        this.getCardCost(card_id)
    },
    getTextVal(e){
        const { value } = e.detail
        this.setData({
            content:value
        })
    },
    switchTab(e){
        const { date, valid, tip, msg } = e.currentTarget.dataset
        const { timeList } = this.data
        let idx = ''
        if(!valid){
            wx.showModal({
                title:'提示',
                content:'当前日期不可选',
                showCancel: false,

            })
            return
        }
        if(tip == 5){
            wx.showModal({
                title:'提示',
                content:'休息时间会被占用',
                showCancel: false,
            })
        }
        if(msg){
            wx.showModal({
                title:'提示',
                content:msg,
                showCancel: false,
            })
        }
        timeList.forEach((item,index) => {
            if(date == item.date && item.valid){
                item.selected = true
                idx = index
            }else{
                item.selected = false
            }
        });
        if(idx < timeList.length - 1){
            timeList[idx + 1].selected = true
        }
        this.setData({
            selectDate:date,
            timeList,
        })
    },
    // input 增减
    getCount(e){
        const { type } = e.currentTarget.dataset
        const { cost } = this.data
        if(type == 1){
            this.data.countNum = this.data.countNum + 1
        }else if(type == 2 && this.data.countNum > 1){
            this.data.countNum = this.data.countNum - 1
        }else{
            this.data.countNum = 1
        }
        this.setData({
            countNum:this.data.countNum,
            cardCost:cost == -1 || !cost ? '--' : accMul(cost, this.data.countNum)
        })
    },
    booking(){
        let isPass = this.verifyValid()
        if(!isPass){
            return 
        }
        const { userId, courseId, content, countNum, vipCardId, courseBookingDate, selectDate, isPersonal } = this.data
        request({
            url:baseUrl + subscribeCourse,
            data:{
                id:userId,
                card_id:vipCardId,
                schedule_id:courseId,
                num:countNum,
                memo:content,
                dates:isPersonal == 4 ? `${courseBookingDate} ${selectDate}` : ''
            },
            method: 'POST',
            isTologin:true,
            success: (res => {
                wx.showModal({
                    title:'预约成功',
                    showCancel:false,
                    success:()=>{
                        wx.navigateBack({
                            delta: 1, // 回退前 delta(默认为1) 页面
                        })
                    }
                })
            })
        })
    },
    checkResult(e){
        const { id, name, value } = e.currentTarget.dataset
        this.setData({
            showSearchList:false,
            // inputVal:name,
            searchWord:value,
            userId:id
        })
        this.getUserCanBookingCard()
    },
    getCardCost(card_id){
        // 获取会员卡消耗
        const { cardType, courseId, isPersonal, vipCardId, vipCardType, cid } = this.data
        request({
            url:baseUrl + bookingCardCost,
            data:{
                card_id,
                schedule_id:courseId,
                course_id:cid,
                type:vipCardType,
            },
            method: 'POST',
            isTologin:true,
            success: (res => {
                this.setData({
                    cost:res,
                    cardCost:res == -1 ? '--' : res
                })
            })
        })
    },
    // 获取可用的会员卡
    getUserCanBookingCard(){
        const { userId, courseId, isPersonal, cid } = this.data
        request({
            url:baseUrl + vipCardList,
            data:{
                id:userId,
                course_id:cid,
                course_type_id:isPersonal
            },
            method: 'POST',
            isTologin:true,
            success: (res => {
                if(res.length){
                    this.setData({
                        vipList:res,
                        vipCardId:res[res.length - 1].id || '',
                        vipCardType:res[res.length - 1].type || ''
                    })
                    this.getCardCost(res[res.length - 1].card_id)
                }
            })
        })
    },
    //获取私教课程预约时间段
    getSubscribeCourse(){
        const { userId, courseId, courseBookingDate } = this.data
        request({
            url:baseUrl + privateCourseList,
            data:{
                schedule_id:courseId,
                dates:courseBookingDate
            },
            method: 'POST',
            isTologin:true,
            success: (res => {
                this.setData({
                    timeList:this.foramtValidTimes(res)
                })
            })
        })
    },
    foramtValidTimes(data){
        let list = data.map((item)=>{
            let obj = {
                date:item.times,
                valid:item.status, //0可用1不可用
                tip:item.tip, //1空 2满 3团占用 4休息 5休息部分占用
                msg:item.msg, //只有数组第一项才会存在 同个用户约课信息提示
                selected:false
            }
            return obj
        })
        return list 
    },
    verifyValid(){
        const { userId, courseId, content, countNum, vipCardId, vipList, isPersonal, selectDate } = this.data
        if(!vipList.length){
            wx.showModal({
                title:'提示',
                content:'暂无会员卡',
                showCancel: false,
            })
            return false 
        }

        if(!vipCardId){
            wx.showModal({
                title:'提示',
                content:'请选择会员卡',
                showCancel: false,
            })
            return false 
        }

        if(!userId){
            wx.showModal({
                title:'提示',
                content:'请选择预约人',
                showCancel: false,
            })
            return false 
        }

        if(isPersonal == 4 && !selectDate){
            wx.showModal({
                title:'提示',
                content:'请选择预约时间',
                showCancel: false,
            })
            return false 
        }

        return true
    }
})