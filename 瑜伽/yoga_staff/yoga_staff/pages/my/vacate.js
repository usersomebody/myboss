import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { leaveList, leaveAudit } = api
Page({
    data:{
        list:[],
        page:1,
        count:10,
        totalCount:0,
        checkId:1,
        switchList:[{
            id:1,
            name:'待审批'
        },{
            id:2,
            name:'已处理'
        }],
        showSheet:false,
        refuseMsg:'',
        recordId:'',
        isLast:false,
        statusMap:{
            2:{
                icon:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211026/a4719734a2d559ad16bd20cb58e8d89a.png',
                title:'审核拒绝：'
            },
            3:{
                icon:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211026/3498b28c5ddfa984cc5798e19f36fa5f.png',
                title:'审核通过'
            },
            5:{
                icon:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211026/cd1756b7bccb445c4c5bb6ef67ff1a08.png',
                title:'审核时间：'
            }
        }
    },
    onLoad(options){

    },
    switchTab(e){
        const { checkId } = this.data
        const { id } = e.currentTarget.dataset
        if(checkId == id){
            return
        }
        this.setData({
            list: [],
            totalCount: 0,
            page:1,            
            checkId:id
        })
        this.getBookingList(this.contactList)
    },
    onShow(){
        this.setData({
            page:1,
            list: [],
            isLast:false,
            totalCount: 0,
          })
        this.getBookingList(this.contactList)
    },
    onReachBottom: function () {
        console.log('???',this.data.isLast)
        if (this.data.isLast) return
        this.data.page++
        this.setData({
            page: this.data.page
        })
        this.getBookingList(this.contactList)
    },
    getBookingList(callback){
        let that = this
        const { page, count, checkId } = this.data
        request({
            url:  baseUrl + leaveList,
            data: {
                status:checkId,
                page,
                limit:count,
            },
            isTologin:true,
            method:'POST',
            success(res) {
            if (callback) callback(res.list)
                that.setData({
                    list: that.data.list,
                    totalCount: res.count
                })
                console.log(page, count,that.data.totalCount)
                if (isLast(page, that.data.totalCount, count)) {
                    that.setData({
                        isLast: true
                    })
                }else{
                    that.setData({
                        isLast: false
                    })
                }
                that.setData({
                    loading: false,
                })
            },
        })
    },
    contactList(list) {
        this.data.list = this.data.list.concat(list)
    },
    getTextVal(e){
        const { value } = e.detail
        this.setData({
            refuseMsg:value
        })
    },
    refused(e){
        const { id } = e.currentTarget.dataset
        this.setData({
            recordId:id
        })
        this.setData({
            showSheet:true
        })
    },
    pass(e){
        const { id } = e.currentTarget.dataset
        this.setData({
            recordId:id
        })
        wx.showModal({
            title:'通过请假后，该会员开始时间-结束时间内不可在约课，确认通过？',
            success:(res)=>{
                if(res.confirm){
                    this.passORrefused(3)
                }
            }
        })
    },
    passORrefused(status){
        let that = this
        const { page, count, checkId, refuseMsg, recordId } = this.data
        request({
            url:  baseUrl + leaveAudit,
            data: {
                id:recordId,
                status,
                leave_refuse_cause:refuseMsg
            },
            isTologin:true,
            method:'POST',
            success(res) {
                wx.showModal({
                    title:'操作成功'
                })
                that.data.list = []
                that.setData({
                    page:1,
                    totalCount: 0
                })
                that.getBookingList(this.contactList)
                console.log('res')
            },
        })
    },
    submitRefuse(e){
        this.setData({
            showSheet:false
        })

        this.passORrefused(2)
    }
})