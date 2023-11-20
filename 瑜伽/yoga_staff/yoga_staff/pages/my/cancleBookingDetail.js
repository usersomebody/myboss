import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
const { courseBookingList } = api
Page({
    data:{
        showList:[],
        course_id:'',
        cardType:{
            1:{
                name:'剩余天数:',
                key:'remain_days',
                symbol:'天',
                type:'期限卡',
                sale:'consume_days'
            },
            2:{
                name:'剩余次数:',
                key:'assets_num',
                symbol:'次',
                type:'次数卡',
                sale:"consume_num"
            },
            3:{
                name:'剩余金额:',
                key:'assets_money',
                symbol:'元',
                type:'储值卡',
                sale:'consume_price'
            },
            4:{
                name:'剩余时间:',
                key:'assets_time',
                symbol:'分钟',
                type:'计时卡',
                sale:'consume_time'

            }
        }
    },
    onLoad(options){
        this.setData({
            course_id:options.id
        })
        this.getList()
    },
    getList(){
        const { course_id } = this.data
        request({
            url:baseUrl + courseBookingList,
            data:{
                id:course_id,
                course_type:'1',
                cancel_type:'2'
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    showList:res.list
                })
            }
          })
    }
})