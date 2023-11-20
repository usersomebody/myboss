
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { isLast } from '../../utils/loadMore.js'
import { setStorageSync } from '../../utils/storageSync.js'
import { accDiv, accSub } from '../../utils/common.js'
import { commerceData } from '../../utils/commerce.js'
const { product_detail } = api
const app = getApp()
Page({
    data:{
        swiper:{
            indicatorDots: true,
            left:'40rpx',
            indicatorColor:'rgba(0, 0, 0, 0.2)',
            indicatorActiveColor:'rgb(254, 46, 78)'
        },
        banner:[{
            thumb: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220531/99525956ba54d373014f43cc0430d056.png',
            link: ''
        }],
        productInfo:{},
        stroeInfo:{},
        productSku:[{
            name: '规格一',
            price:'110'
        }],
        btnshowStyle: 1,
        iPhonex:false,
        statusBarHeight: '',
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
        btnshowStyle: 4,
        ratioShow: false
    },
    onLoad(options){
        this.setData({
          statusBarHeight:app.globalData.statusBarHeight,
          iPhonex:app.globalData.isIphoneX || false,
          productId: options.id
        })
        this.getProductDetail()
    },
    onShow(){

    },
    getProductDetail(){
        const { productId } = this.data
        request({
            url:  baseUrl + product_detail,
            data: {
                product_id:productId,
            },
            isTologin:false,
            method:'POST',
            success:res => {
                console.log('res', res)
                res.commission_ratio = accDiv(res.commission_ratio, 100)  + '%'
                res.min_price = accDiv(res.min_price, 100)
                res.dis_sub_price = accSub(res.min_price_float, res.discount_price_float)
                this.setData({
                    productInfo: res
                })
                this.btnStyle()
                // 规格数据展示处理 后台不想改 前台拿到数据处理一次 话说后续的打工人请注意这里 !!!
                this.dealSku(res.skus_arr)
            }
        }).catch((err)=>{
            
        })
    },
    dealSku(skuArr){
        let showData = skuArr.map((item)=>{
            let obj = {
                name: item.productSkuInfo.saleParam.map((v)=>{
                    let name = v.categorys.map(element => {
                        return element.name
                    }).join('-')
                    return name
                }).join(','),
                price: accDiv(item.productSkuInfo.salePrice, 100)
            }
            return obj
        })
        this.setData({
            productSku: showData
        })
    },
    btnStyle(){
        const { is_sample_free, is_sample_buy } = this.data.productInfo
        let btnshowStyle = 4
        // 支持免费领样
        if(is_sample_free == 1 && is_sample_buy != 1){
            btnshowStyle = 1
        }
        // 支持成本领样
        if(is_sample_free != 1 && is_sample_buy == 1){
            btnshowStyle = 2
        }
        // 都支持
        if(is_sample_free == 1 && is_sample_buy == 1){
            btnshowStyle = 3
        }
        // 都不支持
        if(is_sample_free != 1 && is_sample_buy != 1){
            btnshowStyle = 4
        }
        this.setData({
            btnshowStyle
        })
    },
    goStore(e){
        const { id } = e.currentTarget.dataset
        wx.navigateTo({
            url:'/pages/store/index?id=' + id
        })
    },
    actionBtn(e){
        const { id } = e.target.dataset
        const { actionBtn, btnshowStyle  } = this.data
        console.log('id>>>>>>', id)
        // 1 带货 3 成本 4 免费  2 （&& btnshowStyle == 2 成本 ） （&& btnshowStyle == 1 免费 ）
        if(id == 1){
            // 带货
            this.commerceOnToggle()
            return
        }

        if(id == 3 || (id == 2 && btnshowStyle == 2)){
            let data = this.data.productInfo
            if(!data.buy_sample_stock){
                wx.showModal({
                    showCancel: false,
                    title:'已售罄'
                })
                return
            }
            data.leadSample = 1
            setStorageSync('productDetail', data)
            wx.navigateTo({
                url:'/pages/sample/index'
            })
            // 成本
            return
        }
        if(id == 4 || (id == 2 && btnshowStyle == 1)){
            let data = this.data.productInfo
            data.leadSample = 2
            setStorageSync('productDetail', data)
            wx.navigateTo({
                url:'/pages/sample/index'
            })
            // 免费
            return
        }
    },
    // 带货弹层
    commerceOnToggle() {
        const { productId } = this.data
        this.setData({
            commerceId: productId
        })
        this.setData({ showSheet: !this.data.showSheet });
    },
    
    commerceOnSelect(event) {
        const { commerceId } = this.data
        console.log('commerce', event.detail);
        commerceData(commerceId, event.detail.id)
    },
    back(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    toggleRatioShow(){
        const { ratioShow } = this.data
        this.setData({
            ratioShow: !ratioShow
        })
    },
    //分享
    onShareAppMessage() {
        return {
            title: '盈科星选',
            imageUrl:this.data.productInfo.head_img_name[0],
            path: '/pages/productDetail/index?id=' + this.data.productInfo.product_id
          }
    }
})