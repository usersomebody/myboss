import { request, alertError } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
const { 
    isNotActiveMemberDown,//不活跃会员本周课表下载
} = api
const photosAlbum = 'scope.writePhotosAlbum'

Page({
    data:{
        showLayer:true,
        prePage:'',
        list:[{
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/share-add-class.png',
            name:'新增排课',
            info:'新增课程',
            link:'/pages/course/scheduleEdit?close=1',
            type:'1'
        },
        // {
        //     cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/share-add-vip.png',
        //     name:'新增会员',
        //     info:'新增会员',
        //     link:"/pages/vip/vip"
        // },
        {
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/share-class-table.png',
            name:'分享课表',
            info:'分享课表',
            link:'/pages/course/schedule',
            type:'2'
        }],
        album:'',
        cover_url:'',
    },
    onLoad(){
        this.checkSetting()
    },
    onShow(){
        let pages = getCurrentPages();
        let prepageList = pages[0].__displayReporter.showReferpagepath.split('.')
        let prepage = prepageList[0]
        this.setData({
            prePage:'/' + prepage
        })
        this.getCourseImg()
        
    },
    close(){
        const { prePage } = this.data
        console.log('prePage',prePage)
        let tabbar = ["/pages/index/index","pages/appointment/appointment","pages/vip/vip","pages/my/my"]
        if(tabbar.indexOf(prePage) == -1){
            wx.switchTab({url: '/pages/index/index'})
            return
        }
        wx.switchTab({url: prePage})
    },
    gotoPage(e){
        const { link,type } = e.currentTarget.dataset
        if(type == 2){
            this.checkSaveStatus()
            return
        }
        wx.navigateTo({
            url: link,
        })
    },
    getCourseImg(){
        let that = this
        request({
            url:  baseUrl + isNotActiveMemberDown,
            data: {},
            isTologin:true,
            method:'POST',
            success(res) {
                that.setData({
                    cover_url:res.url
                })
            },
        })
    },
    
})