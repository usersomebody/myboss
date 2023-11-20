import  moment  from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api } from '../../utils/api.js'
const app = getApp();
const defaulteProgress = [{
    percentage:'0',
    name:5
},{
    percentage:'0',
    name:4
},{
    percentage:'0',
    name:3
},{
    percentage:'0',
    name:2
},{
    percentage:'0',
    name:1
}]
Component({
    data: {
        // showEvaluateAction:true,
        showOverlayer:true,
        evaluateInfo:{
            score:"0.0",
            starts:5,
            count:0
        },
        progressList:[],
        list:[],
        fabulousType:{
            '-1':'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220212/adc7f3696ffcae3c4f0933255908b220.png',
            1:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220212/7071a811d5a9e84b18e4ceb6bc4e4318.png'
        },
        satisfiedType:{
            1:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220214/ae976ba4e4dde1a8fc0f693ab591cc3d.png',
            2:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220214/369bdb7a4c4e8473471b6d5917640748.png',
        },
        satisfiedLabel:{},
        satisfiedLabelList:[],
        submitData:{
            star:5,
            avatar:'',
            is_satisfy:1,
            content:'',
            is_anonymity:false,
            label_content:[]
        },
        isLoad:false,
        user_id:'',
        isLoaded:false
    },
    properties: {
        storeId:{
            type: String,
            value: ''
        },
        showEvaluateList:{
            type:Boolean,
            value:true
        },
        teachername:{
            type: String,
            value: ''
        },
        teacherimg:{
            type: String,
            value: ''
        },
        bindid:{
            type:String,
            value:''
        },
        caid:{
            type:String,
            value:''
        },
        cseid:{
            type:String,
            value:''
        },
        evaluate:{
            type:Number,
            value:2//2没有评论 1已经评论
        },
        canevaluate:{
            type:String,
            value:''
        },
        islogin:{
            type:Boolean,
            value:false
        },
        isSign:{
            type:Boolean,
            value:false
        }
    },
    lifetimes: {
        attached: function() {
            this.setData({
                user_id:wx.getStorageSync('user_id')
            })
            this.getLabelList()
            this.getCommentList()
            this.getScore()
        },
    },

    methods:{
        closeEvaluate(){
            const { showEvaluateList } = this.properties
            this.triggerEvent('updateShowStatus',{isShowEvaluate:false,showEvaluateList:true,successEvaluate:2})
        },
        onChange(e){
            const { evaluateInfo } = this.data
            evaluateInfo.starts = e.detail
            this.setData({
                evaluateInfo,
            });
        },
        onItemChange(e){
            const { submitData } = this.data
            submitData.star = e.detail
            this.setData({
                submitData,
            }); 
        },
        switchSatisfied(e){
            console.log('e',e)
            const { id } = e.target.dataset
            const { submitData, satisfiedLabel, satisfiedLabelList } = this.data
            if(id ==  submitData.is_satisfy){
                return
            }
            submitData.is_satisfy = id
            this.setData({
                submitData,
                satisfiedLabelList:satisfiedLabel[id]
            })
        },
        // 选择标签
        labelChecked(e){
            const { id } = e.currentTarget.dataset
            const { satisfiedLabelList } = this.data
            let list = satisfiedLabelList.map((item)=>{
                let obj = item
                obj.checked = item.id == id ? !item.checked : item.checked
                return obj  
            })
            
            this.setData({
                satisfiedLabelList:list
            })
        },
        getTextVal(e){
            const { value } = e.detail
            const { submitData } = this.data
            submitData.content = value
            this.setData({
                submitData
            })
        },
        //匿名
        isAnonymous(event){
            const { submitData } = this.data
            submitData.is_anonymity = event.detail
            this.setData({
                submitData,
            });
        },
        //去评价
        goComment(){
            this.triggerEvent('updateShowStatus',{showEvaluateList:false,isShowEvaluate:true,successEvaluate:2})
        },
        goCommentDetail(e){
            const { storeId, caid } = this.properties
            const { list, islogin } = this.data
            const { id } = e.currentTarget.dataset
            if(!islogin){
                wx.navigateTo({
                    url: '/pages/login/login',
                })
                return
            }
            let storageData = list.filter((item)=>{
                return item.id == id
            })
            wx.setStorageSync('comment-detail', storageData)
            // 去详情
            wx.navigateTo({
                url:`/pages/evaluate/index?store_id=${storeId}&caid=${id}`
            })
        },
        toObj(data){
            const info = {}
            data.forEach(item => {
                info[item.name] = item
            });
            return info
        },
        //获取列表
        getCommentList(){
            const { storeId, submitData, satisfiedLabel, caid, isSign, cseid } = this.data
            let header = {},
              token = wx.getStorageSync('token');
            if (token) {
              header = {
                token
              }
            }
            request({
                url:app.globalData.baseUrl + '/applet/comment',
                data:{
                    method: 'comment.list',
                    course_arrange_id:caid,
                    course_id:cseid,
                    store_id:storeId || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
                },
                header,
                // isTologin:true,
                // redirectUrl,
                method: 'POST',
                success: (res) => {
                    if(res == null && !isSign){
                        wx.showModal({
                            title:'暂无评价',
                            showCancel:false
                        })
                        return
                    }
                    if(res != null){
                        res.forEach(element => {
                            element.deleteShow = false
                        });
                    }
                  this.setData({
                    list:res,
                    isLoaded:true,
                  })
                }
            })
        },
        //获取标签
        getLabelList(){
            const { storeId, submitData, satisfiedLabel  } = this.data
            let header = {},
              token = wx.getStorageSync('token');
            if (token) {
              header = {
                token
              }
            }
            request({
                url:app.globalData.baseUrl + '/applet/comment',
                data:{
                    method: 'comment.label',
                    store_id:storeId || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
                },
                header,
                // isTologin:true,
                // redirectUrl,
                method: 'POST',
                success: (res) => {
                  res.forEach(element => {
                    element.checked = false
                  });
                  let labelType1 = res.filter((item)=>{
                      return item.type == 1
                  })
                  let labelType2 = res.filter((item)=>{
                    return item.type == 2
                  })
                  satisfiedLabel[1] = labelType1
                  satisfiedLabel[2] = labelType2
                  this.setData({
                    satisfiedLabel,
                    satisfiedLabelList:satisfiedLabel[1]
                  })
                  console.log('satisfiedLabel',satisfiedLabel)
                }
            })
        },
        //获取评分
        getScore(){
            const { storeId, submitData, satisfiedLabel, caid, evaluateInfo, cseid  } = this.data
            let header = {},
              token = wx.getStorageSync('token');
            if (token) {
              header = {
                token
              }
            }
            request({
                url:app.globalData.baseUrl + '/applet/comment',
                data:{
                    method: 'comment.index',
                    course_arrange_id:caid,
                    course_id:cseid,
                    store_id:storeId || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
                },
                header,
                method: 'POST',
                success: (res) => {
                    const { star = 0, count = 0, list = []} = res || {}
                    let obj = this.toObj(list)
                    let progress = defaulteProgress.map((item)=>{
                        let info = item
                        info.percentage = obj[item.name] ? obj[item.name].percent : '0'
                        return info
                    })
                    console.log('progress',progress)
                    this.setData({
                        evaluateInfo:{
                            starts:Math.floor(star),
                            score:star,
                            count
                        },
                        progressList:progress,
                        isLoad:true
                    })
                }
              })
        },
        // 点赞
        isLike(e){
            const { storeId, islogin } = this.data
            if(!islogin){
                wx.navigateTo({
                    url: '/pages/login/login',
                })
                return
            }
            const { id, islike } = e.currentTarget.dataset
            let header = {},
              token = wx.getStorageSync('token');
            if (token) {
              header = {
                token
              }
            }
            request({
                url:app.globalData.baseUrl + '/applet/comment',
                data:{
                    method: 'comment.star',
                    id,
                    type:islike == '-1' ? 1 : 2,
                    store_id:storeId || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
                },
                header,
                isTologin:true,
                // redirectUrl,
                method: 'POST',
                success: (res) => {
                    this.getCommentList()
                }
              })
        },

        //进行评论
        togoComment(){
            const { storeId, satisfiedLabel, satisfiedLabelList, submitData, bindid, islogin } = this.data
            if(!islogin){
                wx.navigateTo({
                    url: '/pages/login/login',
                })
                return
            }
            const label_content_filter = satisfiedLabelList.filter((item)=>{
                return item.checked
            })
            const label_content = label_content_filter.map((item)=>{
                return item.name
            })
            let data = {
                ...submitData,
                ...{
                    label_content,
                    is_anonymity:submitData.is_anonymity ? 1 : 2,
                    user_id:wx.getStorageSync('user_id'),
                    subscribe_id:bindid,
                    method: 'comment.add',
                    store_id:storeId || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
                }}
            let header = {},
                token = wx.getStorageSync('token');
            if (token) {
                header = {
                token
                }
            }
            request({
                url:app.globalData.baseUrl + '/applet/comment',
                data:data,
                header,
                // isTologin:true,
                // redirectUrl,
                method: 'POST',
                success: (res) => {
                   wx.showToast({title:'评论成功'})
                   this.triggerEvent('updateShowStatus',{isShowEvaluate:false,showEvaluateList:true,successEvaluate:1})
                }
            })
        },
        showDeleteIcon(e){
            const { id } = e.currentTarget.dataset
            const { list } = this.data 
            list.forEach(element => {
                if(element.id == id ){
                    element.deleteShow = !element.deleteShow
                }
            });
            this.setData({
                list
            })
        },
        deleteReply(e){
            const { id } = e.currentTarget.dataset
            const { storeId } = this.data
            let header = {},
              token = wx.getStorageSync('token');
            if (token) {
              header = {
                token
              }
            }
            wx.showModal({
                title:'确认删除',
                content:'删除后评论将不可恢复',
                success:(res)=>{
                    if(res.confirm){
                        request({
                            url:app.globalData.baseUrl + '/applet/comment',
                            data:{
                                method: 'comment.del',
                                id,
                                store_id:storeId || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
                            },
                            header,
                            isTologin:true,
                            // redirectUrl,
                            method: 'POST',
                            success: (res) => {
                                this.setData({
                                    list:[]
                                })
                                this.getCommentList()
                            }
                        })
                    }
                }
            })
        }
    }
    
})
