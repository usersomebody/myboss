
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'
import { login } from '../../utils/auth.js'
import { removeStorageSync } from '../../utils/storageSync.js'
import { commerceData } from '../../utils/commerce.js'
import { accSub } from '../../utils/common.js'
const { product_list, cate_list, index_banner} = api
const app = getApp()
Page({
    data:{
        searchWord: '',
        active: '',
        scrollviewInto: 'toview0',
        navScrollLeft: 0,
        currentTab: 0,
        allianceBond: false,//是否含有联盟券
        filterId: 1,//筛选Id
        priceSort: '',
        page:1,
        count: 10,
        totalCount: 0,
        isLast:false,
        productList:[],
        filterShow: false,
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
        filterList: [{
            id: 1,
            name: '推荐'
        }, {
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
        typeList:[],
        swiper:{
            indicatorDots: true,
            left:'40rpx',
            indicatorColor:'rgba(0, 0, 0, 0.2)',
            indicatorActiveColor:'rgb(254, 46, 78)'
        },
        banner:[],
        cat_id: '',
        commerceId: ''
    },
    onLoad(){
        this.setData({
          statusBarHeight:app.globalData.statusBarHeight,
          iPhonex:app.globalData.isIphoneX || false
        })
        removeStorageSync('addressInfo')
        removeStorageSync('productDetail')
    },
    onShow(){
        this.setData({
            page:1,
            productList: [],
            isLast:false,
            totalCount: 0,
          })
        this.getList(this.contactList)
        this.getCateList()
        this.getBannerList()
    },
    onReachBottom: function () {
        console.log('触发')
        if (this.data.isLast) return
        console.log('_______')
        this.data.page++
        this.setData({
          page: this.data.page
        })
        this.getList(this.contactList)
    },
    getBannerList(){
        request({
            url:  baseUrl + index_banner,
            data: {},
            isTologin:false,
            method:'POST',
            success:res => {
                this.setData({
                    banner: res.list
                })
            }
          }).catch((err)=>{
              
          })
    },
    getCateList(){
        request({
            url:  baseUrl + cate_list,
            data: {},
            isTologin:false,
            method:'POST',
            success:res => {
                res.unshift({
                    cat_id: 0,
                    name: '全部'
                })
                this.setData({
                    typeList: res
                })
            }
          }).catch((err)=>{
              
          })
    },
    getList(callback){
        const { page, count, filterId, allianceBond, currentTab, typeList, cat_id, priceSort } = this.data
        request({
          url:  baseUrl + product_list,
          data: {
            unionid: '',
            cat_ids: cat_id == 0 ? '' : cat_id,
            has_coupon: allianceBond ? 1 : 2,
            sort_type: filterId == 4 ?  priceSort ? priceSort == 1 ? 4 : 5 : '' :  filterId,
            page,
            limit:count,
          },
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
                console.log('>>>>>>>>>')
                
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
    search(){

    },
    getVal(e){
        const { value } = e.detail
        this.setData({
          searchWord:value
        })
    },
    // TAB切换
    switchTab(e){
        const { idx, id } = e.currentTarget.dataset
		//每个tab选项宽度占1/5
		let singleNavWidth = app.globalData.windowWidth / 4;
		
		if (this.data.currentTab == idx) {
		  return false;
		} else {
		  this.setData({
            navScrollLeft: (idx - 2) * singleNavWidth,
            page: 1,
            count: 10,
            productList: [],
            isLast: false,
            currentTab: idx,
            cat_id: id
		  })
        }
        this.getList(this.contactList)
        
    },
    togoweb(e){
        const { id, url, type } = e.currentTarget.dataset
        if(type == 2 && url){
            wx.navigateTo({ 
                url:`/pages/webViewAuth/index?url=` + encodeURIComponent(url)
            })
        }else{
            wx.navigateTo({
                url:'/pages/theme/index?id=' + id
            })
        }
    },
    isHasBond(event){
        this.setData({
            allianceBond: event.detail,
        });
        this.setData({
            page:1,
            productList: [],
            isLast:false,
            totalCount: 0,
          })
        this.getList(this.contactList)
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

    // 带货弹层
    commerceOnToggle(e) {
        const { id } = e.currentTarget.dataset
        this.setData({
            commerceId: id
        })
        this.setData({ showSheet: !this.data.showSheet });
    },
    cancleToggle(){
        this.setData({ showSheet: !this.data.showSheet });
        
    },
    commerceOnSelect(event) {
        const { commerceId } = this.data
        commerceData(commerceId, event.detail.id)
    },
    toggleFilterSheet(){
        this.setData({ filterShow: !this.data.filterShow });
    },
    filterOnSelect(event){
        const { id } = event.currentTarget.dataset
        const { cat_id } = this.data
        if(id == cat_id){
            return
        }
        this.setData({
            cat_id: id,
            page: 1,
            productList: [],
            isLast: false
        })
        this.toggleFilterSheet()
        this.getList(this.contactList)
    },
    goDetail(e){
        const { id } = e.currentTarget.dataset
        wx.navigateTo({
            url:'/pages/productDetail/index?id=' + id
        })
    },
    gosearch(){
        wx.navigateTo({
            url:'/pages/index/search'
        })
    },
    // 带货
    //分享
    onShareAppMessage() {
        
    }
})