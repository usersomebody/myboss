import { api, baseUrl } from './api.js'
import { request } from './util.js'
import { login } from './auth.js'
const { promoter_list, checkProductStatus } = api
function commerceData(pid, type) {
    // type 1视频好 2 小商店
    login(()=>{
        // 验证是否存在推客账号
        return new Promise((resolve, reject) => {
            request({
                url:  baseUrl + promoter_list,
                data: {},
                isTologin:false,
                method:'POST',
                success:res => {
                    resolve(res.total)
                }
              }).catch((err)=>{
                reject(err)
            })
        }).then((total)=>{
            if(total == 0){
                wx.showModal({
                    title:'未授权推客账号',
                    content:'请前往授权推客账号',
                    showCancel:false,
                    success:result=>{
                        wx.navigateTo({
                            url: '/pages/pushCustomers/index',
                        })
                    }
                })
                return
            }
            // 验证产品是否在联盟库
            return new Promise((resolve, reject) => {
                request({
                    url:  baseUrl + checkProductStatus,
                    data: {
                        productId:pid
                    },
                    isTologin:false,
                    method:'POST',
                    success:res => {
                        if(type == 1){
                            wx.setClipboardData({
                                data: pid.toString(10),
                                success (res) {
                                    console.log('res', res)
                                    // 跳转
                                    // 视频号
                                    goCommerceVideo()
                                    return
                                    
                                },
                                fail(err){
                                    console.log('err', err)
                                }
                            })
                            return
                        }
                        if(type == 2){
                            // 小商店
                            goCommerceMini(pid)
                            return
                        }
                        resolve(res.total)
                    }
                  }).catch((err)=>{
                    reject(err)
                })
            })
        })
    })
}
function goCommerceVideo(){
      wx.navigateToMiniProgram({
        appId: 'wx2cea70df4257bba8',
        path:'',
        extraData:{
          foo:'bar'
        },
        envVersion:'release',
        success(res){

        }
    })
}
function goCommerceMini(productId){
      var jPath = `/cps/pages/cpsGoodsDetail/cpsGoodsDetail?jumpParams={"traceId":"","sourceType":4,"originalProductId":"${productId}"}`
      wx.navigateToMiniProgram({
        appId: 'wx4aedf8c9edf9fd72',
        path:'common/pages/login/login?navStartTime=1652323798492&redirect_url='+encodeURIComponent(jPath),
        extraData:{
          foo:'bar'
        },
        envVersion:'release',
        success(res){

        }
      })
}
export {
    commerceData
}