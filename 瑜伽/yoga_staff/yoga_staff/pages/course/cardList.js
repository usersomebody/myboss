import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { getAllCard } = api
Page({
    data:{
        cardList:[{
           course_type_id:1,
           checkIds:[],
           card_arr:[{
                name:'期限卡',
                type:1,
                checked:false,
                ids:[]
            },{
                name:'次数卡',
                type:2,
                checked:false,
                ids:[]
            },{
                name:'储值卡',
                type:3,
                checked:false,
                ids:[]
            },{
                name:'计时卡',
                type:4,
                checked:false,
                ids:[]
            }]
        },{
            course_type_id:2,
            checkIds:[],
            card_arr:[{
                 name:'期限卡',
                 type:1,
                 checked:false,
                 ids:[]
             },{
                 name:'次数卡',
                 type:2,
                 checked:false,
                 ids:[]
             },{
                 name:'储值卡',
                 type:3,
                 checked:false,
                 ids:[]
             },{
                 name:'计时卡',
                 type:4,
                 checked:false,
                 ids:[]
             }]
         },{
            course_type_id:3,
            checkIds:[],
            card_arr:[{
                 name:'期限卡',
                 type:1,
                 checked:false,
                 ids:[]
             },{
                 name:'次数卡',
                 type:2,
                 checked:false,
                 ids:[]
             },{
                 name:'储值卡',
                 type:3,
                 checked:false,
                 ids:[]
             },{
                 name:'计时卡',
                 type:4,
                 checked:false,
                 ids:[]
             }]
         },{
            course_type_id:4,
            checkIds:[],
            card_arr:[{
                 name:'期限卡',
                 type:1,
                 checked:false,
                 ids:[]
             },{
                 name:'次数卡',
                 type:2,
                 checked:false,
                 ids:[]
             },{
                 name:'储值卡',
                 type:3,
                 checked:false,
                 ids:[]
             },{
                 name:'计时卡',
                 type:4,
                 checked:false,
                 ids:[]
             }]
         }],
        checkedIds:[],
        switchId:1,
        courseType:{
            1:'团课',
            2:'小班课',
            3:'精品课',
            4:'私教课'
        },
        cardType:{
            1:{
                name:'期限卡',
                symbol:''
            },
            2:{
                name:'次数卡',
                symbol:'次'
            },
            3:{
                name:'储值卡',
                symbol:'元'
            },
            4:{
                name:'计时卡',
                symbol:'分钟'
            }
        },
        isLoad:false,
        checkedCardList:[],
    },
    onLoad(){
        this.getAllStore()
        
    },
    onShow(){

    },
    switchChange(e){
        console.log('e',e)
        const { type } = e.currentTarget.dataset
        const { value } = e.detail
        const { cardList, switchId } = this.data
        let checkedCardList = []
        cardList.forEach(item => {
            if(switchId == item.course_type_id){
                item.card_arr.forEach((itm)=>{
                    if(itm.type == type){
                        itm.checked = value
                    }
                    
                })
                checkedCardList =  item.card_arr
            }
            
        });
        this.setData({
            cardList,
            checkedCardList,
        })
    },
    switch(e){
        wx.showLoading()
        const { type } = e.currentTarget.dataset
        console.log('type',type)
        const { cardList, checkedIds, switchId } = this.data
        let switchList = []
        let checkedCardList = []
        if(type == switchId){
            return
        }
        cardList.forEach(element => {
            if(type == element.course_type_id){
                switchList = element.checkIds || []
                checkedCardList = element.card_arr || []
            }
        });
        this.setData({
            checkedCardList,
            checkedIds:switchList,
            switchId:type
        })  
        setTimeout(()=>{
            wx.hideLoading()
        },300)
    },
    getVal(e){
        console.log('e',e)
        const { id, type } = e.currentTarget.dataset
        const { value } = e.detail
        const { cardList, switchId } = this.data
        cardList.forEach(item => {
            item.card_arr.forEach((itm)=>{
                itm.ids.forEach((middle)=>{
                    middle.property = id == middle.id && item.course_type_id == switchId ? value : middle.property
                })
            })
        });
        this.setData({
            cardList
        })
    },
    //数组对象合并
    updateCardList(oldList,newList){
        let selectList = this.toObj(newList)
        let list = oldList.map(item => {
            let head = item
            head = {
                course_type_id:item.course_type_id,
                checkIds:item.checkIds,
                card_arr:item.card_arr.map((itm)=>{
                    let selectObj = selectList[itm.type]
                    let selectArr = selectObj && selectObj.ids.length ? selectObj.ids : []
                    let obj = itm
                    let objs = {}
                    // let allData = this.toObjs(selectObj.ids)
                    // let selectIds = itm.ids.map((v)=>{
                    //     return allData[v.id] ? v : ''
                    // })
                    // let filterSelectIds = selectIds.filter((v)=>{
                    //     return v
                    // })
                    // obj = {
                    //     ...selectObj,
                    //     ids:[...filterSelectIds,...selectArr].reduce((cur,next) => {
                    //         objs[next.id] ? '' : objs[next.id] = true && cur.push(next);
                    //         return cur;
                    //     },[])
                    // }
                    // console.log({itm,selectObj, selectIds, filterSelectIds, selectArr})
                    console.log({itm,selectObj, selectArr})
                    
                    // if(selectObj){
                        obj = {
                            ...itm,
                            ...selectObj,
                            ids:[...itm.ids,...selectArr].reduce((cur,next) => {
                                objs[next.id] ? '' : objs[next.id] = true && cur.push(next);
                                return cur;
                            },[])
                        }
                    // }
                    return obj 
                })
            }
            return head
        });
        return list
    },
    toObjs(list){
        let obj = {}
        list.forEach((item)=>{
            obj[item.id] = item
        })
        return obj
    },
    toObj(list){
        let obj = {}
        list.forEach((item)=>{
            obj[item.type] = item
        })
        return obj
    },
    // 获取当前支持的店铺列表数据
    getAllStore(){
        const { cardList, courseList  } = this.data
        request({
            url:baseUrl + getAllCard,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                let consume_data = wx.getStorageSync('consume_data') || {}
                //更改数据
                res.forEach((middle)=>{
                    middle.ids.forEach((item)=>{
                        if(middle.type != 1){
                            item.property = consume_data[middle.type] || item.property
                        }
                    })
                })
                //数据合并
                let supportList = wx.getStorageSync('supportCard')
                let oldList = supportList.length ? supportList : cardList
                let renderData = this.updateCardList(oldList,res)
                this.setData({
                    cardList:renderData,
                    checkedIds:supportList.length ? supportList[0].checkIds : [], //默认取值
                    checkedCardList:supportList.length ? supportList[0].card_arr : renderData[0].card_arr,
                    isLoad:true,
                    switchId:supportList[0].course_type_id
                })
            }
        })
    },
    onChange(event){
        console.log('event',event)
        const { type } = event.currentTarget.dataset
        const { detail } = event
        const { cardList } = this.data
        cardList.forEach((item)=>{
            if(item.course_type_id == type){
                item.checkIds = detail
            }
        })
        this.setData({
            checkedIds: event.detail,
            cardList,
        });
    },
    back(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    // 存贮当前选择的店铺id  这里的数据和全局storeid不相关 切勿更改
    sure(){
        const { checkedIds, cardList } = this.data
        let selectName = []
        let list = cardList.map((item)=>{
            let arr = []
            item.card_arr.forEach((middle)=>{
                middle.ids.forEach((itm)=>{
                    if(item.checkIds.indexOf(`${itm.id + ''}`) > -1){
                        itm.property = middle.type == 1 ? -1 : itm.property < 0 ? 0 : itm.property
                        itm.type = middle.type
                        arr.push(itm)
                    }
                })
            })
            let obj = {
                type:item.course_type_id,
                checkIds:item.checkIds,
                ids: arr
            }
            return obj 
        })
        console.log('list',list)
        wx.setStorageSync('supportCard', cardList)
        wx.setStorageSync('checkedSupportList',list)
        this.back()
    }
})