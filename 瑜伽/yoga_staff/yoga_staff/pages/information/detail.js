import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { formatParam } from '../../utils/common.js'
import WxParse from '../../components/wxParse/wxParse.js'

const app = getApp()
const { informationDetail, setList, addShare } = api
Page({
    data:{
        infoId:'',
        sid:'',
        detail:{},
        like:{
            0:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211123/6d316d0f5c25a410103b428bdfdbff30.png',
            1:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211123/dd037bfc0f306d68125757a2c8ac4dd9.png'
        },
        storeInfo:{},
        posterCover:'',
        iPhonex:false,
        isActionLike:false,
        current_store_info:'',
        posterContent:'',
        showPoster:false,
        redirectUrl:'' 
    },
    onLoad(options){
        console.log('options',options)
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
        console.log('scene',scene)
        this.setData({
            infoId:options.id || scene.id,
            sid:options.sid || scene.sid || '',
            iPhonex:app.globalData.isIphoneX || false,
            current_store_info:wx.getStorageSync('store_info')
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
        this.getDetail()
        
    },
    //获取详情
    getDetail(like){
        const { infoId, sid } = this.data
        request({
          url:  baseUrl + informationDetail,
          data: {
            id:infoId,
            venue_store_id:wx.getStorageSync('store_id') || '',
            share_store_id:sid,
          },
          method:'POST',
          success:res=> {
              const { card_data, qr_data } = res.diy_info
              let storeInfo = {
                name:card_data.name,
                phone:card_data.phone,
                provinces:`${card_data.province_name}${card_data.city_name}${card_data.area_name}`,
                address:card_data.address,
                logo:card_data.brand_logo,
                card_merge_img:card_data.card_merge_img
              }
            //   if(like && !wx.getStorageSync('token')){
            //     res.like = this.data.detail.like == 0 ? 1 : 0
            // }
            let current_store_info = {}
            if(sid){
                current_store_info = {
                    brand_logo:card_data.brand_logo,
                    sto_phone:card_data.phone,
                    sto_name:card_data.name
                }
            }
            //提取文案
            let posterContent1 = res.detail.replace(/\s*/g, "");  //html文字字符串
            let posterContent2 = posterContent1.replace(/<[^>]+>/g, ""); //去掉所有的html标记
            let posterContent3 = posterContent2.replace(/↵/g, "");     //去掉所有的↵符号
            let posterContent = posterContent3.replace(/[\r\n]/g, "").slice(0,50) //去掉回车换行
            this.setData({
                posterContent,
                detail:res,
                storeInfo,
                posterCover:card_data.card_merge_img,
                current_store_info:sid ? current_store_info : this.data.current_store_info,
            })
            WxParse.wxParse('content', 'html', res.detail, this, 0);
            // if(like){
            //     wx.showToast({
            //         title:res.is_like ? '点赞成功' : '取消成功'
            //     })
            // }
          },
        })
    },
    callPhone(e){
        const { phone } = e.currentTarget.dataset
        console.log('phone',phone)
        const { detail } = this.data
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
    // 点赞
    handlePraise(){
        const { infoId, sid, isActionLike, detail } = this.data
        if(isActionLike && !wx.getStorageSync('auth_token')){
            this.setData({
                'detail.new_like_num':detail.is_like == 0 ? detail.new_like_num + 1 : detail.new_like_num - 1,
                'detail.is_like':detail.is_like == 0 ? 1 : 0,
            })
            return
        }
        request({
          url:  baseUrl + setList,
          data: {
            news_id:infoId,
            venue_store_id:wx.getStorageSync('store_id') || 0,
          },
          method:'POST',
          success:res=> {
              this.setData({
                isActionLike:true,
                'detail.new_like_num':detail.is_like == 0 ? detail.new_like_num + 1 : detail.new_like_num - 1,
                'detail.is_like':detail.is_like == 0 ? 1 : 0,
              })
            // this.getDetail(1)
          },
        })
    },
    editBusiness(){
        wx.navigateTo({
            url: '/pages/information/edit'
        })
    },
    share(){
        const { infoId, sid } = this.data
        request({
          url:  baseUrl + addShare,
          data: {
            news_id:infoId || '',
            venue_store_id:wx.getStorageSync('store_id') || sid || 0,
          },
          method:'POST',
          success:res=> {
            console.log('??')
          },
        })
    },
    getCover(obj){
        console.log('obj',obj)
        this.setData({
            posterCover:obj.detail.cover
        })
    },
    editEnCode(){
        const { sid } = this.data
        if(sid){
            return
        }
        wx.navigateTo({
            url: '/pages/information/editQrcode'
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
        let storeId = sid ? sid : wx.getStorageSync('store_id')
        const promise = new Promise(resolve => {
            this.share()
            setTimeout(() => {
              resolve({
                title: detail.title,
                imageUrl:detail.thumb,
                path: `/pages/information/detail?sid=${sid ? sid : wx.getStorageSync('store_id')}&id=${infoId}`,
              })
            }, 500)
        })
        return {
            title: detail.title,
            imageUrl:detail.thumb,
            path: `/pages/information/detail?sid=${sid ? sid : wx.getStorageSync('store_id')}&id=${infoId}`,
            promise 
          }
    },
})