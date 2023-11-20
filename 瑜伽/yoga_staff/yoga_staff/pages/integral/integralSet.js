import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
const { accountConfig, editAccountConfig } = api
Page({
    data:{
        sign:1,
        radio:'1',
        buyCard:1,
        consumption:'',
        integralNum:'',
        courseList:[],
        sign_upper_limit:'0',
        limit_period:'',
        sign_upper_limit_period:2,

        statusArr:[{
            id:1,
            name:'每周'
        },{
            id:2,
            name:'每月'
        },{
            id:3,
            name:'每年'
        }],
        statusName:'每月',
        statusShow:false,
    },
    onLoad(){
        this.getIntergalConfig()
    },
    switchChange(e){
        const { value } = e.detail
        const { key } = e.target.dataset
        if(key == 'sign'){
            let sign = value ? 1 : 2
            this.setData({
                sign
            })
        }else{
            let buyCard = value ? 1 : 2
            this.setData({
                buyCard
            })
        }
    },
    onChange(event){
        this.setData({
            radio: event.detail,
        });
    },
    onChangeLimit(event){
        this.setData({
            sign_upper_limit: event.detail,
        });
    },
    getIntergalValue(e){
        const { key, item } = e.currentTarget.dataset
        const { value } = e.detail
        const { courseList } = this.data
        courseList.forEach(itm => {
            itm[key] = item.course_type_id == itm.course_type_id ? value : itm[key]
        });
        this.setData({
            courseList
        })
    },

    getTextVal(e){
        console.log('e',e)
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        if(key == 'consumption'){
            this.setData({
                consumption:value
            })
        }else{
            this.setData({
                limit_period:value
            })
        }     
    },

    // 获取积分配置
    getIntergalConfig(){
        let that = this
        request({
            url:  baseUrl + accountConfig,
            data: {
                account_type:'credit',
            },
            isTologin:true,
            method:'POST',
            success(res) {
                const { base, config_extend } = res 
                that.setData({
                    sign:base.is_open_sign + '',
                    radio:base.sign_type + '',
                    consumption:base.consume_ratio,
                    courseList:config_extend,
                    buyCard:base.consume_ratio > 0 ? 1 : 0,
                    sign_upper_limit:base.sign_upper_limit == 0 ? '0' : '1',
                    sign_upper_limit_period:base.sign_upper_limit_period,
                    limit_period:base.sign_upper_limit == 0 ? '' : base.sign_upper_limit
                })
            },
          })
    },
    // 修改积分配置
    updateIntegralConfig(){
        let that = this
        const {
            sign,
            radio,
            consumption,
            courseList,
            sign_upper_limit,
            limit_period,
            buyCard,
            sign_upper_limit_period
        } = this.data
        if(buyCard == 1 && !consumption){
            wx.showModal({
                title:'请输入消费金额',
                showCancel:false
            })
            return
        }
        let submitData = {
                account_type:'credit',
                is_open_sign:sign,
                sign_type:radio,
                consume_ratio:consumption,
                config_extend:courseList,
                sign_upper_limit:sign_upper_limit == '0' ? 0 : limit_period,
                sign_upper_limit_period:sign_upper_limit_period
        }
        request({
            url:  baseUrl + editAccountConfig,
            data: submitData,
            isTologin:true,
            method:'POST',
            success(res) {
                wx.showModal({
                    title:'设置成功',
                    showCancel:false
                })
                that.getIntergalConfig()
            },
          })
    },
    back(){
        wx.navigateBack({
            delta: 1
        })
    },
    showStatus(){
        this.setData({
            statusShow:!this.data.statusShow
        })
    },
    getStatus(e){
        const { id, name } = e.currentTarget.dataset
        const { sign_upper_limit_period } = this.data
        if(id == sign_upper_limit_period){
            return
        }
        this.setData({
            sign_upper_limit_period:id,
            statusName:name,
        })
        this.showStatus()
    },
})