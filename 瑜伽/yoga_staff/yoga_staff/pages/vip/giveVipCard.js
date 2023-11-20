import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'

const app = getApp()
const { canUseCardList, addCard } = api
Page({
    data:{
        showlist:[{
            id:1,
            name:'卡名称',
            placeholder:'请选择卡名称',
            key:'card_id',
            selectId:'',
            value:'',
            isHandle:true,
            inputBox:false
        },{
            id:2,
            name:'售卖金额',
            placeholder:'-',
            key:'sale_money',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:false
        },{
            id:3,
            name:'实收金额',
            placeholder:'请填写实收金额',
            key:'money',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:true
        },{
            id:12,
            name:'充值金额',
            placeholder:'请填写充值金额',
            key:'recharge_num',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:true
        },{
            id:5,
            name:'生效方式',
            placeholder:'请选择生效方式',
            key:'use_type',
            selectId:0,
            value:'',
            isHandle:true,
            inputBox:false
        },{
            id:4,
            name:'使用天数',
            placeholder:'请选择期限',
            key:'day',
            selectId:'',
            value:'',
            isHandle:true,
            inputBox:false
        },{
            id:6,
            name:'请假次数限制',
            placeholder:'0',
            key:'leave_limit_num',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:true
        },{
            id:7,
            name:'请假次数购买',
            placeholder:'0',
            key:'leave_deduct',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:true
        },{
            id:8,
            name:'请假天数最小限制',
            placeholder:'0',
            key:'leave_limit_day',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:true
        },{
            id:11,
            name:'请假天数最大限制',
            placeholder:'0',
            key:'leave_limit_day_max',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:true
        },{
            id:9,
            name:'支付方式',
            placeholder:'请选择支付方式',
            key:'payment_type',
            selectId:'',
            value:'',
            isHandle:true,
            inputBox:false
        },{
            id:10,
            name:'备注',
            placeholder:'请填写充值备注',
            key:'memo',
            selectId:'',
            value:'',
            inputBox:false,
            isHandle:false
        }],
        use_type:[{
            id:0,
            name:'立即生效'
        },{
            id:1,
            name:'约课生效'
        },{
            id:2,
            name:'限定用卡时间'
        }],
        payment_type:[{
            id:1,
            name:'现金'
        },{
            id:2,
            name:'刷卡'
        },{
            id:3,
            name:'支付宝'
        },{
            id:4,
            name:'微信'
        },{
            id:5,
            name:'其他'
        }],
        cardType:{
            1:{
                id:1,
                name:'期限卡',
                key:'---'
            },
            2:{
                id:2,
                name:'次数卡',
                key:'assets_num',
                inputName:'次数'
            },
            3:{
                id:3,
                name:'储值卡',
                key:'assets_money',
                inputName:'金额'
            },
            4:{
                id:4,
                name:'计时卡',
                key:'assets_time',
                inputName:'时长'
            }
        },
        popupShow:false,
        popupData:{},
        checkedId:'',
        checkedName:'',
        showData:[],
        canUseCard:[],
        showKey:'',
        selectInfo:{},
        card_info:{},
        vipId:'',
        isChecked:false,
        isSelect:1,
        vipType:1,
        dateObj:{
            start:'',
            end:''
        },
        currentDate:''
    },
    onLoad(options){
        this.getVipCardList()
        const { dateObj } = this.data
        dateObj.start = moment().format('YYYY-MM-DD')
        this.setData({
            vipId:options.id || '',
            vipType:options.vipType || '',
            addvip:options.addvip || '',
            currentDate:moment().format('YYYY-MM-DD'),
            dateObj
        })
    },
    // 获取所有会员卡
    getVipCardList(){
        const { searchWord } = this.data
        request({
            url:baseUrl + canUseCardList,
            data:{
                name:searchWord || ''
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    canUseCard:res,
                    showData:res
                })
                // list[1].list = res
            }
        })
    },
    //组件盒子显示
    toggelePopup(e){
        const { canUseCard } = this.data
        const { item } = e.currentTarget.dataset
        let obj = { name:item.name, key:item.key, selectId:item.selectId, value:item.value}
        if(!item.isHandle){
            return
        }
        if(item.key == 'day'){
            this.setData({
                showData:[],
                popupShow:!this.data.popupShow,
                popupData:obj,
                checkedId:item.selectId,
                checkedName:item.value,
                showKey:item.key
            })
            return
        }
        this.setData({
            showData:item.key == 'card_id' ? canUseCard : this.data[item.key],
            popupShow:!this.data.popupShow,
            popupData:obj,
            checkedId:item.selectId,
            checkedName:item.value,
            showKey:item.key
        })
    },
    searchCourseResult(e){
        const { value } = e.detail
        this.setData({
            searchWord:value
        })
    },
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { showlist } = this.data
        showlist.forEach(item => {
            item.value = item.key == key ? value : item.value
        });
        this.setData({
            showlist, 
        })
    },
    getMemoValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { showlist } = this.data
        showlist.forEach(item => {
            item.value = item.key == key ? value : item.value
        });
        this.setData({
            showlist, 
        })
    },
    switchTab(e){
        const { id, name, item, key } = e.currentTarget.dataset
        const { checkedId, dateObj, card_info  } = this.data
        if(id == checkedId){
            return
        }
        if(key == 'use_type'){
            dateObj.end = card_info.addDay > 0 ? moment(dateObj.start).add(`${card_info.addDay}`, 'day').format('YYYY-MM-DD') : dateObj.start
        }
        this.setData({
            checkedId:id,
            checkedName:name,
            selectInfo:item,
            dateObj
        })
    },
    saveData(){
        const { showKey, showlist, selectInfo, checkedId, card_info, checkedName, isChecked, cardType, dateObj } = this.data
        let cardInfo = {}
        if( showKey == 'card_id'){
            showlist[0].value = selectInfo.name
            showlist[0].selectId = selectInfo.id
            showlist[1].value = selectInfo.price
            showlist[3].name = selectInfo.type != 1 ? '充值' + cardType[selectInfo.type].inputName : ''
            showlist[3].placeholder = selectInfo.type != 1 ? '请填写' + cardType[selectInfo.type].inputName : ''
            showlist[3].isShow = selectInfo.type != 1 ? false : true
            showlist[5].value = selectInfo.is_unlimited == 1 ? '长期有效' : selectInfo.day

            showlist[4].value = selectInfo.use_type == 1 ? '约课生效' : selectInfo.use_type == 2 ? '限定用卡时间' : '立即生效'
            showlist[4].selectId = selectInfo.use_type
            showlist[6].value = selectInfo.leave_limit_num
            showlist[7].value = selectInfo.leave_deduct
            showlist[8].value = selectInfo.leave_limit_day
            showlist[9].value = selectInfo.leave_limit_day_max
            showlist[11].value = selectInfo.memo || ''
            // recharge_num = selectInfo.type != 1 ? selectInfo[cardType[selectInfo.type].key] : ''
            cardInfo = {
                is_unlimited:isChecked ? '1' : selectInfo.is_unlimited,
                is_leave_infinite:selectInfo.is_leave_infinite,
                type:'1' || selectInfo.type,
                addDay:selectInfo.day
            }

            this.setData({
                isChecked:selectInfo.is_unlimited ? true : false
            })
        }

        if(showKey == 'use_type'){
            showlist[4].value = checkedName
            showlist[4].selectId = checkedId
            cardInfo = card_info
            if(checkedId !=1 && (!dateObj.start || !dateObj.end)){
                wx.showModal({
                    title:'请选择时间',
                    showCancel:false
                })
                return
            }
            showlist[5].value = checkedId == 1 ? card_info.addDay : moment(dateObj.end).diff(dateObj.start, 'day')
        }

        if(showKey == 'payment_type'){
            showlist[10].value = checkedName
            showlist[10].selectId = checkedId
            cardInfo = card_info
        }
        if(showKey == 'day'){
            showlist[5].value = isChecked ? '长期有效' : showlist[5].value
            card_info.is_unlimited = isChecked ? 1 : 0
            cardInfo = card_info
        }
        this.setData({
            popupShow:!this.data.popupShow,
            showlist,
            card_info:cardInfo,
        })
        console.log('showlist',showlist)
    },
    close(){
        this.setData({
            popupShow:false
        })
    },
    cancle(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    verifyData(){
        const { showlist } = this.data
        let submitDataList = this.toObj(showlist)
        let noVerify = ['leave_limit_day','leave_limit_day_max', 'leave_limit_num','leave_deduct', 'memo', 'use_type', "recharge_num"]
        for(let key in submitDataList){
            if(!submitDataList[key] && noVerify.indexOf(key) == -1){
                wx.showModal({
                    title:'请完善信息',
                    showCancel: false,
                })
                return false
            }
        }
        return submitDataList
        
    },
    sure(){
        const { card_info, showlist, vipId, isChecked, addvip, vipType, dateObj } = this.data
        let submitData = {}
        let objData = this.toObj(showlist)
        let isPass = this.verifyData()
        if(!isPass){
            return
        }
        submitData = {...objData,...card_info,...{id:vipId,user_card_type:vipType,use_start_time:dateObj.start,use_end_time:dateObj.end}}
        submitData.day = submitData.is_unlimited == 1 ? 0 : submitData.day
        //添加会员页面进入保存数据不做提交
        if(addvip){
            let sendCardList = wx.getStorageSync('sendCardList') || []
            submitData.id = ''
            submitData.card_name = showlist[0].value
            sendCardList.push(submitData)
            wx.setStorageSync('sendCardList', sendCardList)
            wx.showModal({
                title:'发卡成功',
                content:'如还需给该会员发卡，可以点击继续发卡',
                cancelText:'返回',
                confirmText:'继续发卡',
                success:(res)=>{
                    if (res.confirm) {
                        this.restList()
                      } else if (res.cancel) {
                        wx.navigateBack({
                            delta: 1, 
                        })
                      }
                }
            })
            return
        }
        request({
            url:baseUrl + addCard,
            data:submitData,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:'添加成功',
                    showCancel: false,
                    success:()=> {
                        setTimeout(()=>{
                            if(vipType == 2){
                                wx.switchTab({
                                    url: '/pages/vip/vip'
                                })
                            }else{  
                                this.cancle()
                            }
                        },1000)
                    }
                })
               
                
            }
        })
    },
    toObj(list){
        let info = {}
        let idArr = [1,5,9]
        list.forEach((item)=>{
            if(idArr.indexOf(item.id) > -1){
                info[item.key] = item.selectId
            }else{
                info[item.key] = item.value
            }
        })
        return info
    },
    checkboxChange(e){
        console.log('checkbox发生change事件，携带value值为：', e)
        const { value } = e.detail
        if(value.length){
            this.setData({
                isChecked:true
            })
            
        }else{
            this.setData({
                isChecked:false
            })
        }
    },
    //清空数据
    restList(){
        const { showlist } = this.data
        showlist.forEach((item)=>{
            item.value = ''
            item.selectId = ''
        })
        this.setData({
            showlist 
        })
    },
    bindDateChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        const { dateObj, showlist } = this.data
        dateObj[key] = value
        console.log('dateObj',dateObj)
        if(moment(dateObj.end).diff(dateObj.start, 'day') <= 0){
            wx.showModal({
                title:'结束时间不可小于开始时间',
                showCancel:false
            })
            return
        }
        showlist[5].value = moment(dateObj.end).diff(dateObj.start, 'day')
        this.setData({
          dateObj
        })
    },
})