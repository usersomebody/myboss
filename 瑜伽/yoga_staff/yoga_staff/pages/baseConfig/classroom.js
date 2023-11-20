import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
const app = getApp()
const { classroom, classroomSet, classroomAdd, classroomDel } = api
Page({
    data:{
        page:1,
        limit:10,
        list:[],
        isLast:false,
        totalCount:0,
        statusMap:{
            1:{
                name:'已定时',
                color:'#FA9552'
            },
            2:{
                name:'已推送',
                color:'#9B77F4'
            }
        },
        showOverlayer:false
    },
    onLoad(){
        
    },
    onShow(){
        this.setData({
            list:[],
            page:1,
            limit:10,
            isLast:false,
            totalCount:0
        })
        this.getCourseList(this.contactList)
    },
    onReachBottom: function () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getCourseList(this.contactList)
    },
    getCourseList(callback) {
        const { limit, page } = this.data
        request({
          url:baseUrl + classroom,
          isTologin:true,
          data:{
            page,
            limit,
          },
          method: 'POST',
          success: (res => {
            if (callback) callback(res.list)
            this.setData({
              list: this.data.list,
              totalCount: res.count
            })
            if (isLast(this.data.page, this.data.totalCount, this.data.limit)) {
                this.setData({
                isLast: true
              })
            }
            this.setData({
              loading: false
            })
          })
        })
    },
    contactList(list) {
        this.data.list = this.data.list.concat(list)
    },
    showModal(e){
        const { id, item } = e.currentTarget.dataset
        let data = item
        let that = this
        wx.showModal({
            title: '修改教室',
            content: `${item.name}`,
            confirmText:'添加',
            editable:true,
            placeholderText:'输入教室名称',
            success (res) {
                if (res.confirm) {
                    data.name = res.content
                    that.submit({id,data,type:1})
                }
            }
        })
    },
    addModal(){
        let that = this
        let data = {
            status:1
        }
        wx.showModal({
            title: '新增教室',
            content: '',
            confirmText:'添加',
            editable:true,
            placeholderText:'输入教室名称',
            success (res) {
                if (res.confirm) {
                    data.name = res.content
                    that.submit({data,type:2})
                }
            }
        })
    },
    switchChange(e){
        const { id, item } = e.currentTarget.dataset
        const { value } = e.detail
        let data = item
        data.status = value ? 1 : 2
        this.submit({id,data,type:1})
    },
    delClassroom(e){
        const { id,item } = e.currentTarget.dataset
        this.submit({id,data:item,type:3})
    },
    // 修改
    submit({id,data,type}){
        if(!data.name && (type == 1 || type == 2)){
            wx.showModal({
                title:'名称不可以为空',
                showCancel:false
            })
            return
        }
        let url = type == 1 ? classroomSet : type == 2 ? classroomAdd : classroomDel
        request({
            url:baseUrl + url,
            isTologin:true,
            data:data,
            method: 'POST',
            success: (res => {
              wx.showModal({
                  title:type == 1 ? '修改成功' : type == 2 ? '添加成功' : '删除成功',
                  showCancel:false,
                  success:()=>{
                    this.setData({
                        list:[],
                        page:1,
                        limit:10,
                        isLast:false,
                        totalCount:0
                    })
                    this.getCourseList(this.contactList)
                  }
              })
            })
        })
    }
})