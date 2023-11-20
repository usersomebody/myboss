import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
const { labelList, labelAdd, labelEdit, labelDel } = api
Page({
    data:{
        list:[],
        showOverlayer:false
    },
    onLoad(){
        
    },
    onShow(){

        this.getCourseList()
    },

    getCourseList() {
        request({
          url:baseUrl + labelList,
          isTologin:true,
          data:{},
          method: 'POST',
          success: (res => {
            this.setData({
              list: res
            })
           
          })
        })
    },
    showModal(e){
        const { id, item, type } = e.currentTarget.dataset
        let data = item
        let that = this
        wx.showModal({
            title: '修改标签',
            content: `${item.name}`,
            confirmText:'添加',
            editable:true,
            placeholderText:'输入标签名称',
            success (res) {
                if (res.confirm) {
                    data.name = res.content
                    data.type = type
                    that.submit({id,data,type:1})
                }
            }
        })
    },
    addModal(e){
        const { type } = e.currentTarget.dataset
        let that = this
        let data = {
            status:1,
            type:type
        }
        wx.showModal({
            title: '新增标签',
            content: '',
            confirmText:'添加',
            editable:true,
            placeholderText:'输入标签名称',
            success (res) {
                if (res.confirm) {
                    data.name = res.content
                    that.submit({data,type:2})
                }
            }
        })
    },
    switchChange(e){
        const { id, item, type } = e.currentTarget.dataset
        const { value } = e.detail
        let data = item
        data.status = value ? 1 : 2
        data.type = type
        this.submit({id,data,type:1})
    },
    delClassroom(e){
        const { id,item, type } = e.currentTarget.dataset
        let data = item
        data.type = type
        this.submit({id,data,type:3})
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
        let url = type == 1 ? labelEdit : type == 2 ? labelAdd : labelDel
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
                      this.getCourseList()
                  }
              })
            })
        })
    }
})