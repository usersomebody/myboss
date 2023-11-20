import { api } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { formatParam } from '../../utils/common.js'
const app = getApp()
const { information  } = api
const { baseUrl } = app.globalData
Page({
    data:{
        storeInfo:{},
        infoId:'',
        sid:'',
        detail:{},
        like:{
            0:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211123/6d316d0f5c25a410103b428bdfdbff30.png',
            1:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211123/dd037bfc0f306d68125757a2c8ac4dd9.png'
        },
        isActionLike:false,
        current_store_info:'',
        posterContent:'',
        showPoster:false,
        redirectUrl:'' 
    },
    onLoad(options){
        const scene = {};
        try {
          if (options.scene) {
            JSON.parse('{"' + decodeURIComponent(options.scene).replace(/&/g, '","').replace(/=/g, '":"') + '"}', (k, v) => {
              scene[k] = v
            })
          }
        } catch (error) {
          console.error(error);
        }
        this.setData({
            infoId:options.id || scene.id,
            sid:options.sid || scene.sid || '',
            iPhonex:app.globalData.isIphoneX || false,
            storeInfo:wx.getStorageSync('store_info')
        })
        let url = 'pages/information/detail'
        let str = formatParam(options)
        let formatUrl = `/${url}${str ? '?' + str : ''}`
        let redirectUrl = encodeURIComponent(formatUrl)
        this.setData({
            redirectUrl
        })
    },
    onShow(){
        this.setData({
            isActionLike:false
        })
        this.getDetail()
        this.get_store()
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
    getDetail(like){
        const { sid } = this.data
        let header = {},
        token = wx.getStorageSync('token');
        if (token) {
            header = {
            token
            }
        }
        wx.request({
          url:  baseUrl + information,
          data: {
            id:this.data.infoId,
            store_id: sid || wx.getStorageSync('store_id'),
            method:'notice.get'
          },
          header,
          method:'POST',
          success:res=> {
            if (res.data.code == 400) {
                wx.removeStorageSync('token')
                this.getDetail()
              } else if(res.data.code == 200){
                let content = res.data.data
                content.read_num = content.page_view + content.vm_page_view
                content.like_all_num = content.like_num + content.vm_like_num
                //提取文案
                let posterContent1 = content.detail.replace(/\s*/g, "");  //html文字字符串
                let posterContent2 = posterContent1.replace(/<[^>]+>/g, ""); //去掉所有的html标记
                let posterContent3 = posterContent2.replace(/↵/g, "");     //去掉所有的↵符号
                let posterContent = posterContent3.replace(/[\r\n]/g, "").slice(0,50) //去掉回车换行
                this.setData({
                    posterContent,
                    posterCover:content.diy_info.card_merge_img,
                    detail: content,
                    storeInfo:res.data.data.diy_info
                })
              }
          },
        })
    },
    // 点赞
    handlePraise(){
        const { infoId, sid, isActionLike, detail } = this.data
        if(isActionLike && !wx.getStorageSync('token')){
            this.setData({
                'detail.like_all_num':detail.like == 0 ? detail.like_all_num + 1 : detail.like_all_num - 1,
                'detail.like':detail.like == 0 ? 1 : 0,
            })
            return
        }
        request({
          url:  baseUrl + information,
          data: {
            method:'notice.like',
            id:infoId,
            store_id:sid || wx.getStorageSync('store_id') || 0,
          },
          method:'POST',
          success:res=> {
            this.setData({
                isActionLike:true,
                'detail.like_all_num':detail.like == 0 ? detail.like_all_num + 1 : detail.like_all_num - 1,
                'detail.like':detail.like == 0 ? 1 : 0,
            })
          },
        })
    },
    // 分享
    share(){
        const { infoId, sid } = this.data
        request({
          url:  baseUrl + information,
          data: {
            method:'notice.share',
            id:infoId || '',
            store_id:sid || wx.getStorageSync('store_id') || 0,
          },
          method:'POST',
          success:res=> {
            console.log('??')
          },
        })
    },
    //门店列表
  get_store() {
      const { sid } = this.data
    let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
    wx.request({
      url:app.globalData.baseUrl + '/applet/store',
      data:{
        method: 'store.getlist',
        store_id:sid || wx.getStorageSync('store_id')
      },
      header,
      method: 'POST',
      success: (res) => {
        const { data, code } = res.data
        if (code == 200) {
         this.setData({
            current_store_info:data[0]
         })
        }
      }
    })
    },
    toggleCanvas(){
        const { showPoster } = this.data
        this.setData({
            showPoster:!showPoster
        })
    },
    onShareAppMessage(){
        const {infoId, sid, detail} = this.data
        let storeId = sid || wx.getStorageSync('store_id')
        const promise = new Promise(resolve => {
            this.share()
            setTimeout(() => {
              resolve({
                title: detail.title,
                imageUrl:detail.thumb,
                path: '/pages/information/detail?id=' + infoId + '&sid=' + storeId,
              })
            }, 500)
        })
        console.log('...','/pages/information/detail?id=' + infoId + '&sid=' + storeId)
        return {
            title: detail.title,
            imageUrl:detail.thumb,
            path: '/pages/information/detail?id=' + infoId + '&sid=' + storeId,
            promise 
          }
    },
})