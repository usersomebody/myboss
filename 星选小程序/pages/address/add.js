
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'

const app = getApp()
const  { get_pca_all, del_address, edit_address, add_address, get_address_detail } = api
Page({
    data:{
        addressInfo:{
            realname: '',
            mobile: '',
            address: '',
            isdefault: 1,
            province: '请选择',
            city: '',
            area: '',
            province_code: '',
            city_code: '',
            area_code: '110102',
        },
        checkRule:{
            realname: '联系人',
            mobile: '手机号',
            address: '详细地址',
            province: '省市区',
            city: '省市区',
            area: '省市区',
            province_code: '省市区',
            city_code: '省市区',
            area_code: '省市区',
        },
        areaList:{},
        editId: '',
        popupshow: false
    },
    onLoad(options){
        this.setData({
            editId: options.id ? options.id : ''
        })
        console.log('???')
        this.getpcaData()
        if(options.id){
            this.getAddressDetail()
        }
    },
    onPopupClose() {
        this.setData({ popupshow: !this.data.popupshow });
      },
    isDefaultAddress(event){
        console.log('event', event)
        this.setData({
            'addressInfo.isdefault': event.detail ? 1 : 2,
        });
    },
    getVal(e){
        console.log('e',e)
        const { key } = e.target.dataset
        const { addressInfo } = this.data
        addressInfo[key] = e.detail.value
        this.setData({
            addressInfo
        })
    },
    getChangeValue(e){
        console.log('val', e)
        const { values } = e.detail
        const { addressInfo } = this.data
        this.onPopupClose()
        addressInfo.province = values[0].name,
        addressInfo.city = values[1].name,
        addressInfo.area = values[2].name,
        addressInfo.province_code = values[0].code,
        addressInfo.city_code = values[1].code,
        addressInfo.area_code = values[2].code,
        this.setData({
            addressInfo
        })
    },
    // 获取省市区数据
    getpcaData(){
        console.log('省市区')
        wx.showLoading({title:'加载中..'})
        request({
            url:  baseUrl + get_pca_all,
            data: {
            
            },
            isTologin:false,
            method:'POST',
            success:res => {
                let areaList = {
                    province_list: this.toObj(res.province),
                    city_list: this.toObj(res.city),
                    county_list: this.toObj(res.area),
                }
                this.setData({
                    areaList
                })
                wx.hideLoading()
                console.log('res', res)
            }
        }).catch((err)=>{
            wx.hideLoading()
        })
    },
    getAddressDetail(){
        const { addressInfo, editId } = this.data
        let param = {id: editId}
        const that = this
        request({
            url:  `${baseUrl}${get_address_detail}`,
            data: param,
            isTologin:true,
            method:'POST',
            success:res => {
                let codeList = res.pca_code.split(' ')
                res.province_code = codeList[0]
                res.city_code = codeList[1]
                res.area_code = codeList[2]
                this.setData({
                    addressInfo: res
                })
                
            },
            refreshToken(){
                that.getAddressDetail()
            }
        }).catch((err)=>{
            
        })
    },
    addAddress(){
        const { addressInfo, editId } = this.data
        if(!this.checkeInfo()){
            return
        }
        let param = editId ? {...addressInfo, ...{id: editId}} : addressInfo
        const that = this
        request({
            url:  `${baseUrl}${editId ? edit_address : add_address}`,
            data: param,
            isTologin:true,
            method:'POST',
            success:res => {
                wx.showToast({
                    title:'操作成功'
                })
                setTimeout(()=>{
                    wx.navigateBack({
                        delta: 1, 
                    })
                },500)
                
            },
            refreshToken(){
                that.addAddress()
            }
        }).catch((err)=>{
            
        })
    },
    delAddress(){
        const { addressInfo, editId } = this.data
        let param = {id: editId}
        const that = this
        wx.showModal({
            title:'确认删除',
            success:(res)=>{
                if(res.confirm){
                    request({
                        url:  `${baseUrl}${del_address}`,
                        data: param,
                        isTologin:true,
                        method:'POST',
                        success:res => {
                            wx.navigateBack({
                                delta: 1, 
                            })
                        },
                        refreshToken(){
                            that.delAddress()
                        }
                    }).catch((err)=>{
                        
                    })
                }
            }
        })
    },
    // 省市区数据转换
    toObj(data){
        let info = {}
        data.forEach(item => {
            info[item.id] = item.name    
        });
        return info
    },
    checkeInfo(){
        const { addressInfo, checkRule  } = this.data
        let filterData = ['update_time', 'isdefault', 'unionid', 'zipcode', 'id', 'deleted', 'create_time', 'pca_code']
        for(let key in addressInfo){
            if(!addressInfo[key] && filterData.indexOf(key) == '-1'){
                wx.showModal({
                    showCancel: false,
                    content: checkRule[key] + '不可为空'
                })
                return false
            }
        }
        return true
    }
})