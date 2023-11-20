import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { accDiv } from '../../utils/common.js'
import { isLast } from '../../utils/loadMore.js'

const app = getApp()
const { 
    sendMsgInfo,//发送消息
    moneyInsufficient,//余额不足卡card列表 type:2,3次数卡   储值卡 2 次数卡 3
    isNotActiveMember,//不活跃会员 4
    brithMember,//生日会员 1
    expireMember,//即将到期会员 5
    isNotActiveMemberDown,//不活跃会员本周课表下载
    brithMsg //生日消息
} = api
Page({
    data:{
        list:[],
        page:1,
        limit:10,
        totalCount: 0,
        loading:false,
        isLast:false,
        type:1,
        showList:[],
        cardType:{
            2:{
                name:'剩余次数：',
                key:'assets_num',
                symbol:'次'
            },
            3:{
                name:'剩余金额：',
                key:'assets_money',
                symbol:'元'
            },
            4:{
                name:'剩余时间：',
                key:'assets_time',
                symbol:'分'
            }
        },
        titleType:{
            1:{
                name:'生日会员'
            },
            2:{
                name:'次数卡'
            },
            3:{
                name:'储值卡'
            },
            4:{
                name:'不活跃会员'
            },
            5:{
                name:'即将到期会员'
            }
        },
        sendImg:{
            1:{
                cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211025/c2b5bd6f06816df2b58fd153d7fc6cef.png',
                msg:''
            },
            2:{
                cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211025/ace4ce03e6b2c0e82d910b008983316c.png',
                msg:'请联系业务人员配置企业微信相关功能'
            },
            3:{
                cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211025/ace4ce03e6b2c0e82d910b008983316c.png',
                msg:'该用户还不是您的企业微信好友暂不支持直接发送信息'
            }
        },
        showSheet:false,
        sendMsg:'',
        sendList:[],
        msgIdx:0,
        cover_url:'',
        unionid:'',
        phone:"",
        statusShow:false,
        statusName:'15天',
        statusId:15,
        statusArr:[{
            id:15,
            name:'15天'
        },{
            id:30,
            name:'30天'
        },{
            id:60,
            name:'60天'
        }],
        noCard:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220114/cf26c677ddd15ece873e7513ec2a85e0.png',
        noVip:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220114/4ee05b2179276d9b9065422cc431f557.png'
    },
    onLoad(options){
        const { titleType } = this.data
        this.setData({
            type:options.type,
            apiAddress:this.getAddress(options.type)
        })
        wx.setNavigationBarTitle({
            title: titleType[options.type].name
        })
        if(options.type == 4){
            this.getCourseImg()
        }
    },
    onShow(){
        this.setData({
          page:1,
          list: [],
          isLast:false,
          totalCount: 0,
        })
        this.getList(this.contactList)
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getList(this.contactList)
      },
    getList(callback){
        wx.showLoading()
        let that = this
        const { page, limit, apiAddress, type, statusId } = this.data
        let data = {
            page,
            limit:limit,
            type:type == 2 || type == 3 ? type : ''
        }
        if(type == 4){
            data.day = statusId
        }
        request({
            url:  baseUrl + apiAddress,
            data: data,
            isTologin:true,
            method:'POST',
            success(res) {
            if (callback) callback(res.list)
                that.setData({
                    list: that.data.list,
                    totalCount: res.count
                })
                //card_type_name 状态 1成功 2取消 3完成(表示正常上课) 4未上课 5开课失败 6 排队中 7 排队失败
                if (isLast(page, that.data.totalCount, limit)) {
                    that.setData({
                        isLast: true
                    })
                }
                that.setData({
                    loading: false
                })
                wx.hideLoading()
            },
        })
    },
    contactList(list) {
        const { type } = this.data
        let data = list
        if(type == 5){
            data = list.map((item)=>{
                let obj = item
                obj.assets_money = obj.assets_money || 0
                return obj
            })
        }
        this.data.list = this.data.list.concat(data)
    },
    // 取对应接口
    getAddress(type){
        let address = ''
         //接口地址
         switch (type) {
            case '1':
            address = brithMember;
                break;
            case '2':
            address = moneyInsufficient;
                 break;
            case '3':
            address = moneyInsufficient;
                 break;
            case '4':
            address = isNotActiveMember;
                 break;
            case '5':
            address = expireMember;
                break;
        }
        return address
    },
    //获取发送生日消息
    getSendBirthInfo(id){
        let that = this
        const { msgIdx } = this.data
        request({
            url:  baseUrl + brithMsg,
            data: {
                unionid:id
            },
            isTologin:true,
            method:'POST',
            success(res) {
                that.setData({
                    sendMsg:res.message[msgIdx].name,
                    sendList:res.message,
                    showSheet:true,
                })
            },
        })
    },
    send(e){
        const { sendImg, type } = this.data
        const { unionid, phone, status } = e.currentTarget.dataset
        console.log({status})
        if(status !=1 ){
            wx.showModal({
                title:sendImg[status].msg,
                showCancel:false
            })
            return
        }
        this.setData({
            unionid,
            phone
        })
        if(type == 1){
            this.getSendBirthInfo(unionid)
            return
        }
        this.setData({
            showSheet:true
        })
    },
    callPhone(e){
        const { phone } = e.currentTarget.dataset
        if(!phone){
            wx.showModal({
                title:'号码不可以为空',
                showCancel:false
            })
            return 
        }
        wx.makePhoneCall({
            phoneNumber: phone //仅为示例，并非真实的电话号码
        })
    },
    // 换一个
    chanValue(){
        const { sendList, msgIdx } = this.data
        let index = msgIdx == sendList.length - 1 ? 0 : msgIdx + 1
        this.setData({
            msgIdx:index,
            sendMsg:sendList[index].name
        })
    },
    getTextVal(e){
        const { value } = e.detail
        this.setData({
            sendMsg:value
        })
    },
    sendFriend(e){
        let that = this
        const { msgIdx, sendMsg, unionid, phone, cover_url, type } = this.data
        const { sub } = e.target.dataset
        if(sub == 1){
            this.setData({
                showSheet:false
            })
            return
        }
        wx.showLoading({
            title:'加载中',
            mask:true
        })
        let submitData = {
            type: type == 4 ? 4 : 1,	
            touser:[{
                unionid:unionid,
                phone:phone
            }],	
            title:'',	
            content:sendMsg,	
            cover_url:type == 4 ? cover_url : '',	
            page_url:''
        }
        request({
            url:  baseUrl + sendMsgInfo,
            data: submitData,
            isTologin:true,
            method:'POST',
            success(res) {
                wx.hideLoading()
                wx.showModal({
                    title:'发送成功',
                    content:'请前往企业微信给客户推送消息'
                })
                that.setData({
                    showSheet:false
                })
                console.log('res',res)
            },
        }).catch(()=>{
            wx.hideLoading()
        })
    },
    getCourseImg(){
        let that = this
        request({
            url:  baseUrl + isNotActiveMemberDown,
            data: {
                date:moment().format('YYYY-MM-DD')
            },
            isTologin:true,
            method:'POST',
            success(res) {
                that.setData({
                    cover_url:res.url
                })
            },
        })
    },
    getStatus(e){
        const { id, name } = e.currentTarget.dataset
        const { statusId } = this.data
        if(id == statusId){
            return
        }
        this.setData({
            statusId:id,
            statusName:name,
            page:1,
            limit:10,
            totalCount:0,
            list:[],
            isLast:false
        })
        this.showStatus()
        this.getList(this.contactList)
    },
    showStatus(){
        this.setData({
            statusShow:!this.data.statusShow
        })
    },
})