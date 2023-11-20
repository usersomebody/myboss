
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'
import { commerceData } from '../../utils/commerce.js'
import { accSub } from '../../utils/common.js'

const { store_product_list } = api
const app = getApp()
Page({
    data:{
        searchWord: '',
        active: '',
        scrollviewInto: 'toview0',
        navScrollLeft: 0,
        currentTab: 0,
        allianceBond: false,//是否含有联盟券
        filterId: 2,//筛选Id
        priceSort: '',
        page:1,
        count: 10,
        totalCount: 0,
        isLast:false,
        productList:[],
        
        filterList: [{
            id: 2,
            name: '高佣金'
        }, {
            id: 3,
            name: '销量'
        }, {
            id: 4,
            name: '价格',
            top:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/8e31f647b0bef7d4818e5ce0bbe8ddc2.png',
            bottom: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/98dda731e2d6d7f512c843cfe073634c.png',
            normal: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/66cfb5c1fa671ae44e8478eb7adf8188.png'
        }],
        banner:[{
            thumb: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220531/99525956ba54d373014f43cc0430d056.png',
            link: ''
        }],
        storeInfo:{},
        authId: '',
        showSheet: false,
        sheetAction: [
            {
              id:1,
              name: '视频号带货',
            },
            {
              id:2,
              name: '小商店带货',
            }
        ],
    },
    onLoad(options){
        this.setData({
          statusBarHeight:app.globalData.statusBarHeight,
          iPhonex:app.globalData.isIphoneX || false,
          authId: options.id || ''
        })
    },
    onShow(){
        this.setData({
            page:1,
            productList: [],
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
        let that = this
        const { page, count, filterId, authId, priceSort } = this.data
        request({
          url:  baseUrl + store_product_list,
          data: {
            authorizer_appid: authId,
            page,
            limit:count,
            sort_type: filterId == 4 ?  priceSort ? priceSort == 1 ? 4 : 5 : '' :  filterId,
          },
          isTologin:false,
          method:'POST',
          success:res => {
            res.list.forEach((item)=>{
                item.dis_sub_price = accSub(item.min_price_float, item.discount_price_float)
            })
            if (callback) callback(res.list)
            this.setData({
                storeInfo: res.store,
                productList: this.data.productList,
                totalCount: res.total
            })
            if (isLast(page, this.data.totalCount, count)) {
                this.setData({
                    isLast: true
                })
            }else{
                this.setData({
                    isLast: false
                })
            }
            this.setData({
              loading: false
            })
          }
        }).catch((err)=>{
            this.setData({
                isLast: true
            })
        })
    },
    contactList(list) {
        this.data.productList = this.data.productList.concat(list)
    },
    togoweb(e){
        const { url } = e.currentTarget.dataset
        if(!url){
            return
        }
        // wx.navigateTo({
        //     url:'/pages/webViewActivity/index?url=' + url
        // })
    },
    isHasBond(event){
        this.setData({
            allianceBond: event.detail,
        });
    },
    // 筛选切换
    switchFilterItem(e){
        const { id } = e.currentTarget.dataset
        const { priceSort } = this.data
        this.setData({
            filterId: id,
            priceSort: id == 4 ? priceSort ? priceSort == 1 ? 2 : 1 : 1 : '',
            page: 1,
            count: 10,
            productList: [],
            isLast: false
        })
        this.getList(this.contactList)
    },
    goDetail(e){
        const { id } = e.currentTarget.dataset
        wx.navigateTo({
            url:'/pages/productDetail/index?id=' + id
        })
    },
    // 带货弹层
    commerceOnToggle(e) {
        console.log('e',e)
        const { id } = e.currentTarget.dataset
        this.setData({
            commerceId: id
        })
        this.setData({ showSheet: !this.data.showSheet });
    },
    
    commerceOnSelect(event) {
        const { commerceId } = this.data
        console.log('commerce', event.detail);
        commerceData(commerceId, event.detail.id)
    },
})