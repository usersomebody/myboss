import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
const app = getApp()
Page({
    data:{
        settingList:[{
            name:'首页轮播图设置',
            value:'',
            editName:'设置',
            link:'/pages/baseConfig/bannerSetting'
        },
        // {
        //     name:'公告管理',
        //     value:'',
        //     editName:'编辑',
        //     link:'/pages/baseConfig/noticeManagerList'
        // },
        {
            name:'教练首页显示',
            value:'',
            editName:'设置',
            link:'/pages/baseConfig/coach'
        },{
            name:'评价设置',
            value:'',
            editName:'设置',
            link:'/pages/baseConfig/comment'
        }]
    },
    onLoad(){

    },
    godetail(e){
        const { link } = e.currentTarget.dataset
        if(!link){
            return
        }
        wx.navigateTo({
            url: link
        })
    }
})