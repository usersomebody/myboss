import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import { param } from '../../utils/param.js';
import { formatShowList } from '../../utils/actionMap.js'
import { accDiv, accAdd, accSub } from '../../utils/common';
const app = getApp()
const { getOperaAllCard, operaCard } = api

Page({
    data:{
        showList:[],
        popupShow:false,
        popupData:{},
        vipId:'',
        actionType:'',
        payment_type:[{
            id:'0',
            name:'扣除次数'
        },{
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
        checkedId:'',
        selectInfo:{},
        cardType:{
            1:{
                id:1,
                name:'期限卡',
                key:'day'
            },
            2:{
                id:2,
                name:'次数卡',
                key:'assets_num'
            },
            3:{
                id:3,
                name:'储值卡',
                key:'assets_money'
            },
            4:{
                id:4,
                name:'计时卡',
                key:'assets_time'
            }
        },
        typeList:{
            3:'续卡',
            4:'延卡',
            5:'赠送',
            6:'停卡',
            7:'恢复',
            8:'扣卡',
            9:'请假'
        },
        selectCardInfo:{},
        canUseCard:[],
        selectData:{
            card:{},
            pay:{}
        }
    },
    onLoad(options){
        const { typeList, payment_type } = this.data
        let showList = formatShowList(Number(options.type))
        this.setData({
            vipId:options.id,
            actionType:options.type,
            currentDate:moment().format('YYYY-MM-DD'),
            showList
        })
        wx.setNavigationBarTitle({
            title:typeList[options.type]
        })
        if(options.type == 6){
            showList.forEach((item)=>{
                if(item.key == 'leave_start_time'){
                    item.value = moment().format('YYYY-MM-DD')
                    item.disable = true
                }else if(item.key == 'leave_end_time'){
                    item.isShow = true
                }
                
            })
            this.setData({
                showList
            })
        }

        if(options.type == 4 || options.type == 6 || options.type == 3){
            this.setData({
                payment_type:payment_type.slice(1),
            })
        }
        this.getVipCardList()

    },
    dataInit(){

    },
    bindDateChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        let showList = this.updateAssignment(key,value,1)
        this.setData({
          date: value,
          showList
        })
    },
    switchChange(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        let switchVal = value ? 1 : 0
        this.setData({
            showList:this.updateAssignment(key,switchVal,1)
        })
    },
    // 获取所有会员卡
    getVipCardList(){
        const { searchWord, actionType, vipId } = this.data
        request({
            url:baseUrl + getOperaAllCard,
            data:{
                // name:searchWord || '',
                id:vipId,
                type:actionType
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    canUseCard:res,
                    showData:res
                })
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
        let showData = item.key == 'card_id' ? canUseCard : this.data[item.key]
        let selectInfo = showData.filter((itm)=>{
            return itm.id == item.selectId
        })
        this.setData({
            showData,
            popupShow:!this.data.popupShow,
            popupData:obj,
            checkedId:item.selectId,
            showKey:item.key,
            selectInfo:selectInfo[0] || {}
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
        const { actionType, selectData, showList } = this.data
        if(parseInt(value,10) < 0 && (key == 'giving' || key == 'money')){
            wx.showModal({
                title:'金额不可以小于0',
                showCancel:false
            })
            this.setData({
                showList:this.updateAssignment(key,0,1)
            })
            return
        }

        if(actionType == 8 && key == 'giving' && parseInt(value) > showList[2].value || 0){
            this.setData({
                showList:this.updateAssignment(key,showList[2].value,1)
            })
        }else{
            this.setData({
                showList:this.updateAssignment(key,value,1)
            })
        }
    },
    getMemoValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { showList } = this.data
        showList.forEach(item => {
            item.value = item.key == key ? value : item.value
        });
        this.setData({
            showList
        })
    },
    switchTab(e){
        const { id, name, item, key } = e.currentTarget.dataset
        const { checkedId  } = this.data
        if(id == checkedId){
            return
        }
        this.setData({
            checkedId:id,
            selectInfo:item,
        })
    },
    saveData(){
        const { showKey, showList, selectInfo, checkedId, isChecked, currentChecked, currentDate, selectData} = this.data
        if(showKey == 'card_id'){
            selectData.card = selectInfo.id ? selectInfo : selectData.card
            selectData.card.remain_num = Number(accSub(selectData.card.leave_limit_num,selectData.card.counts)) < 0 ? 0 : accSub(selectData.card.leave_limit_num,selectData.card.counts)
        }else if(showKey == 'payment_type'){
            selectData.pay = selectInfo.id ? selectInfo : selectData.pay
        }
        this.setData({
            selectCardInfo:showKey == 'card_id' ? selectInfo : {},
            popupShow:!this.data.popupShow,
            showList:this.updateAssignment(showKey,selectInfo.card_type_name || selectInfo.name,3,selectInfo.id),
            selectData
        })
    },
    updateAssignment(key,value,type,selectId){
        const { showList, selectInfo, cardType, actionType, selectCardInfo } = this.data
        if(type == 1){
            showList.forEach((item)=>{
                if(item.key == key){
                    item.value = value
                }
            })
        }else if(type == 2){
            showList.forEach((item)=>{
                if(item.key == key){
                    let selectData = item.list.filter((itm,idx)=>{
                        return idx == value ? {id:itm.id,name:itm.name,index:idx} : ''
                    })
                    item.selectId = selectData[0].id ? selectData[0].id :''
                    item.value = selectData[0].name ? selectData[0].name : ''
                    item.index = selectData[0].index ? selectData[0].index : ''
                }
            })
        }else if(type == 3){
            showList.forEach((item)=>{
                if(item.key == key){
                    item.value = value
                    item.selectId = selectId
                }
            })
        }

        //会员卡影响其他数据
        if(key == 'card_id'){
            showList.forEach((item)=>{
                if(item.key == 'valid_time' && Object.keys(selectInfo).length){
                    item.value = selectInfo.is_unlimited == 1 ? '长期有效' : `${selectInfo.use_start_time}-${selectInfo.use_end_time}`
                }else if(item.key == 'remain_content'){
                    // item.value = selectInfo.type != 1 ? selectInfo[cardType[selectInfo.type].key] : '长期有效'
                    item.value = selectInfo[cardType[selectInfo.type].key]
                }
            })
        }

        if(key == 'giving' || key == 'postpone_day'){
            let remain_content = showList.filter((item)=>{
                return item.key == 'remain_content'
            })
            showList.forEach((item)=>{
                if(item.key == 'giving_remain' && key == 'giving'){
                    item.value = actionType !=8 ? accAdd(remain_content[0].value,value) : accSub(remain_content[0].value,value) <= 0 ? '0' : accSub(remain_content[0].value,value)
                }else if(item.key == 'postpone_validity' && key == 'postpone_day' && Object.keys(selectInfo).length){
                    item.value = selectInfo.is_unlimited == 1 ? '长期有效' : moment(selectCardInfo.use_end_time).add(value, 'days').format('YYYY-MM-DD');
                }
            })
        }
        if(key == 'stop_end_time'){
            let stop_content = showList.filter((item)=>{
                return item.key == 'stop_end_time'
            })
            showList.forEach((item)=>{
                if(item.key == 'leave_end_time'){
                    item.isShow = stop_content[0].value ? false : true
                }else if(item.key == 'is_delay'){
                    item.value = !stop_content[0].value ? 0 : item.value
                }
            })
        }

        if(key == 'is_delay'){
            showList.forEach((item)=>{
                if(value == 1){
                    if(item.key == 'leave_end_time'){
                        item.isShow = false
                    }else if(item.key == 'stop_end_time'){
                        item.value = 1
                        
                    }
                }
            })
            
        }
        return showList
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
    sure(){
        const { actionType } = this.data
       let isPass = this.verifyData()
       if(!isPass){
           return
       }
       isPass.type = actionType
       isPass.id = isPass.card_id
       isPass.value = isPass.giving || isPass.postpone_day
       isPass.is_delay = isPass.is_delay || 0
       isPass.leave_clear = isPass.leave_clear || 0
       isPass.is_set = isPass.stop_end_time || 0
       isPass.stop_end_time = isPass.stop_end_time ?  isPass.leave_end_time : ''
       request({
        url:baseUrl + operaCard,
        data:isPass,
        method:'POST',
        isTologin:true,
        success:(res)=>{
            wx.showModal({
                title:'保存成功',
                showCancel:false,
                success(){
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
        }
    })
    },
    verifyData(){
        const { showList } = this.data
        let submitDataList = this.toObj(showList)
        let noVerify = ['is_delay','leave_clear','stop_end_time', 'memo', 'leave_end_time', 'payment_type', 'remain_content']
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
    toObj(list){
        let info = {}
        let idArr = ['card_id','payment_type']
        list.forEach((item)=>{
            if(idArr.indexOf(item.key) > -1){
                info[item.key] = item.selectId
            }else{
                info[item.key] = item.value
            }
        })
        return info
    },
})