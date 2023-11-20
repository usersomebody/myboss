
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'
import { accSub } from '../../utils/common.js'

const { product_list } = api
const app = getApp()
Page({
    data:{
        searchTitle: [{
            id: 1,
            name: '商品'
        }, {
            id: 2,
            name: '店铺'
        }],
        showTitleSelect:false,
        searchData:{
            title: '',
            title_type: 1,
            searchTitle: '商品'
        },
        active: '',
        scrollviewInto: 'toview0',
        navScrollLeft: 0,
        currentTab: 0,
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
        storeInfo:{
            cover: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220531/99525956ba54d373014f43cc0430d056.png',
            name: '店铺名称',
            is_auth:1
        },
    },
    onLoad(){
        this.setData({
          statusBarHeight:app.globalData.statusBarHeight,
          iPhonex:app.globalData.isIphoneX || false
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
        const { searchData, page, count, filterId, priceSort } = this.data
        request({
          url:  baseUrl + product_list,
          data: {...searchData,...{
            sort_type: filterId == 4 ?  priceSort ? priceSort == 1 ? 4 : 5 : '' :  filterId,
            page,
            limit:count,
          }},
          isTologin:false,
          method:'POST',
          success:res => {
            res.list.forEach((item)=>{
                item.dis_sub_price = accSub(item.min_price_float, item.discount_price_float)
            })
            if (callback) callback(res.list)
            this.setData({
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
    getVal(e){
        const { value } = e.detail
        this.setData({
          'searchData.title':value,
          page:1,
          productList: [],
          isLast:false,
          totalCount: 0,
        })
        this.getList(this.contactList)
    },
    selectSearchTitle(e){
        const { id, name } = e.currentTarget.dataset
        const { searchData } = this.data
        searchData.searchTitle = name
        searchData.title_type = id
        this.setData({
            searchData
        })
        this.toggleShowTitleSelect()
    },
    toggleShowTitleSelect(){
        const { showTitleSelect } = this.data
        this.setData({
            showTitleSelect:!showTitleSelect
        })
    }
})