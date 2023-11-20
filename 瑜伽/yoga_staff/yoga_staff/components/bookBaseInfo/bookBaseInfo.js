import moment from '../../utils/moment.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
const app = getApp();
const { courseBookingDetail } = api
Component({
    data: {
        teacher:{},
        width:'0%'
    },
    properties: {
        courseId: {
            type: String,
            value: ''
        },
        type: {
            type: String,
            value: ''
        },
        courseType:{
            type: String,
            value: ''
        },
        courseDate:{
            type: String,
            value: ''
        },
        cid:{
            type: String,
            value: ''
        },
        changeNumber:{
            type:Number,
            value:''
        }
    },
     observers: {
        'courseId': function(val) {
            if(val){
                this.getBaseInfo()
            }
        },
        'courseType':function(val) {
            console.log('val',val)
        },
        'courseDate':function(val) {
            console.log('val',val)
        },
        "changeNumber":function(val){
            console.log('val触发了',val)
            if(val){
                this.getBaseInfo()
            }
        }
    },
    attached() {
    },
    pageLifetimes: {
        show: function() {
         this.getBaseInfo()
        },
    },
    methods: {
        getBaseInfo(){
            // 拉取基本信息
            let that = this
            const { courseId } = this.properties
            if(!courseId){
                return
            }
            
            request({
              url: baseUrl + courseBookingDetail,
              data: {
                id:courseId
              },
              isTologin:true,
              method:'POST',
              success(res) {
                that.setData({
                    teacher:res
                })
                that.judgePriceValid()
              },
            })
        },
        judgePriceValid(){
            const { preengage_num, sign_count, max_user, status } = this.data.teacher
            if(!preengage_num  ){
                return
            }
            let width = '0%'
            if(status == 2){
                width = accDiv(sign_count,preengage_num) > 1 ? 1 : accDiv(sign_count,preengage_num)
                width = this.toPercent(width)
            }else{
                width = accDiv(preengage_num,max_user) > 1 ? 1 : accDiv(preengage_num,max_user)
                width = this.toPercent(width)
            }
            console.log('width',width)
            this.setData({
                width,
            })
        },
        toPercent(point){
            var str=Number(point*100).toFixed(1);
            str+="%";
            return str;
        },
        goBooking(){
            const { courseId, courseType, courseDate, cid } = this.properties
            wx.navigateTo({
                url:`/pages/booking/bookingDetail?courseId=${courseId}&courseType=${courseType}&courseDate=${courseDate}&cid=${cid}`
            })
        }
    }

})
