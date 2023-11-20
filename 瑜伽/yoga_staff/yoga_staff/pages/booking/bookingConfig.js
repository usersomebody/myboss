import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
const {  getSettingConfig, editSettingConfig } = api
const showWordRule = {
    1:'还可预约几人',
    2:'已约人数/容纳人数',
    3:'预约满几人开课'
}
Page({
    data:{
        list:[{
            id:1,
            title:'预约设置',
            settingList:[{
                id:1,
                name:'团课预约提前',
                info:'会员可预约',
                val:'7天',
                tips:'内的课程',
                type:1,
                courseType:1,
            },
            {
                id:2,
                name:'预约/签到设置',
                info:'开课前多少分钟可预约、可取消、可签到及预约人数未达到自动取消时间设置',
                val:'',
                tips:'',
                type:1,
                courseType:1,
            },
            // {
            //     id:2,
            //     name:'开课前多少分钟可预约',
            //     info:'截至开课前',
            //     val:'7分钟',
            //     tips:'可预约（例如：设置30分钟，课程9:30开始,会员9点之后将无法预约)',
            //     type:1,
            //     courseType:1,
            // },{
            //     id:3,
            //     name:'团课取消时间',
            //     info:'截至开课前',
            //     val:'7分钟',
            //     tips:'可取消（例如：设置30分钟，课程9:30开始,会员9点之后将无法取消)',
            //     type:1,
            //     courseType:1,
                
            // },
            {
                id:16,
                name:'预约情况展示',
                info:'',
                val:'',
                tips:'',
                switchVal:0,
                courseType:1,
                type:2
            },{
                id:4,
                name:'约课端人数显示',
                info:'显示还可预约几人',
                val:'',
                tips:'',
                courseType:1,
                type:1
            },
            // {
            //     id:5,
            //     name:'课程开课失败',
            //     info:'课程开始',
            //     val:'7',
            //     tips:'分钟，预约人数未达到课程人数，课程自动取消',
            //     courseType:1,
            //     type:1
            // },
            {
                id:7,
                name:'候补排队',
                info:'',
                val:'',
                tips:'',
                switchVal:0,
                courseType:1,
                type:2
            },
            {
                id:6,
                name:'自动爽约',
                info:'课程开始',
                val:'',
                tips:'如果学员还是未签到状态，状态变更为已旷课',
                switchVal:0,
                courseType:1,
                type:2
            },{
                id:8,
                name:'私教预约提前',
                info:'会员可预约',
                val:'7天',
                tips:'内的课程',
                switchVal:0,
                courseType:2,
                type:1
            },{
                id:9,
                name:'预约/签到设置',
                info:'开课前多少分钟可预约、可取消',
                val:'',
                tips:'',
                switchVal:0,
                courseType:2,
                type:1
            },
            // {
            //     id:9,
            //     name:'开课前多少分钟可预约',
            //     info:'截至开课前',
            //     val:'7分钟',
            //     tips:'可预约（例如：设置30分钟，课程9:30开始,会员9点之后将无法预约)',
            //     switchVal:0,
            //     courseType:2,
            //     type:1
            // },{
            //     id:10,
            //     name:'私教取消时间',
            //     info:'截至开课前',
            //     val:'7分钟',
            //     tips:'可取消（例如：设置30分钟，课程9:30开始,会员9点之后将无法取消)',
            //     switchVal:0,
            //     courseType:2,
            //     type:1
            // },
            {
                id:11,
                name:'自动爽约',
                info:'课程开始',
                val:'',
                tips:'如果学员还是未签到状态，状态变更为已旷课',
                switchVal:0,
                courseType:2,
                type:2
            }]
        },{
            id:2,
            // title:'签到设置',
            settingList:[
            //     {
            //     id:12,
            //     name:'会员自主签到',
            //     info:'课程开始后，如果会员还未签到，状态变更为已签到',
            //     val:'',
            //     tips:'',
            //     switchVal:0,
            //     courseType:1,
            //     type:1
            // },
            {
                id:13,
                name:'自动签到',
                info:'课程开始后，如果会员还未签到，状态变更为已签到',
                val:'',
                tips:'',
                switchVal:0,
                courseType:1,
                type:2
            },
            // {
            //     id:14,
            //     name:'会员自主签到',
            //     info:'课程开始后，如果会员还未签到，状态变更为已签到',
            //     val:'',
            //     tips:'',
            //     switchVal:0,
            //     courseType:2,
            //     type:1
            // },
            {
                id:15,
                name:'自动签到',
                info:'课程开始后，如果会员还未签到，状态变更为已签到',
                val:'',
                tips:'',
                switchVal:0,
                courseType:2,
                type:2
            }]
        }],
        setType:1,
        initData:{}
    },
    onLoad(options){
        this.setData({
            setType:options.type == 4 ? 1 : 2
        })
    },
    onShow(){
        this.getConfigInfo()
    },
    switchChange(e){
        const { id } = e.currentTarget.dataset
        const { list, initData } = this.data
        list.forEach(element => {
            element.settingList.forEach((item)=>{
                if(item.id == id){
                    item.switchVal = item.switchVal == 1 ? 0 : 1
                }
            })
        });
        switch (id) {
            case 6:
                initData.is_auto_truancy = initData.is_auto_truancy ? 0 : 1
                break;
            case 7:
                initData.is_open_queue = initData.is_open_queue ? 0 :1
                break;
            case 11:
                initData.p_is_auto_truancy = initData.p_is_auto_truancy ? 0 : 1
                break;
            case 13:
                initData.is_auto_sign_course = initData.is_auto_sign_course ? 0 : 1
            case 15:
                initData.p_is_auto_sign_course = initData.p_is_auto_sign_course ? 0 : 1
            case 16:
                initData.is_show_course_to_member = initData.is_show_course_to_member ? 0 : 1
        } 
        this.setData({
            list,
            initData
        })
        this.editSettingConfig()
    },
    goSet(e){
        const { id } = e.currentTarget.dataset
        wx.navigateTo({
            url: '/pages/booking/setting?id=' + id
        })
    },
    getConfigInfo(){
        const { list } = this.data
        request({
            url:baseUrl + getSettingConfig,
            data:{},
            method: 'POST',
            isTologin:true,
            success: (res => {
                const { 
                    advance_reservation_days,// 0当天 -1不限制 x:实际天数
                    before_the_course_subscribe,
                    before_the_course_cancel_subscribe,
                    show_word,//预约人数展示文案:  1 还可预约几人  2  已约人数/容纳人数  3  预约满几人开课
                    is_auto_stop_course,//团课人数不足自动取消时间（单位 ：秒 ;开课前多少小时内未达到最少开课人数，则该节团课自动取消所有预约，如设置为1，则在开课前1小时，预约人数未达到最少开课人数时，该节团课自动取消所有已预约会员的预约。如设置为0，无论预约人数是否达到最少开课人数，均不会自动取消预约。)
                    is_auto_truancy,//0 不自动爽约  1 课程开始自动爽约  2 课程结束（关联字段is_auto_truancy_time）
                    is_auto_truancy_time,//课程结束  x 小时后自动爽约 , 默认为0 单位 秒
                    is_open_queue,//1是 0否（如果启用候补预约功能，在团课课程约满后，其他会员可进行候补预约，当有其他会员取消预约时，候补会员会根据顺序自动递补预约，如开课后仍没有空缺则系统自动取消候补。）
                    before_the_course_sign,
                    after_the_course_sign,
                    is_auto_sign_course,//0 不自动签到  1 课程开始自动签到  2 课程结束（关联字段is_auto_sign_course_time）
                    is_auto_sign_course_time,
                    is_show_course_to_member,// 对会员展示课程预约人数  0 禁止所有人查看  1允许会员查看 2允许所有人查看
                    p_advance_reservation_days,
                    p_before_the_course_subscribe,
                    p_before_the_course_cancel_subscribe,
                    p_is_auto_truancy,
                    p_is_auto_truancy_time,
                    p_before_the_course_sign,
                    p_after_the_course_sign,
                    p_is_auto_sign_course,
                    p_is_auto_sign_course_time
                } = res
                let showList = list.map(item => {
                    let obj = item
                    obj = {
                        id:item.id,
                        title:item.title,
                        settingList:item.settingList.map((itm)=>{
                            let objs = itm
                            switch (objs.id) {
                                case 1:
                                    objs.val = !advance_reservation_days ? '当天' : advance_reservation_days == -1 ? '任意时间' : advance_reservation_days + '天';
                                    break;
                                case 2:
                                    // objs.val = before_the_course_subscribe + '分钟'
                                    break;
                                case 3:
                                    objs.val = before_the_course_cancel_subscribe + '分钟'
                                    break;
                                case 4:
                                    objs.info = showWordRule[show_word]
                                    break;
                                case 5:
                                    objs.val = is_auto_stop_course + '分钟'
                                    break;
                                case 6:
                                    objs.switchVal = is_auto_truancy ? 1 : 0
                                    objs.info = is_auto_truancy == 1 ? '课程开始' : '课程结束'
                                    objs.val = is_auto_truancy == 1 ? '后' :  is_auto_truancy == 2 ? `${is_auto_truancy_time}分钟` : ''
                                    break;
                                case 7:
                                    objs.switchVal = is_open_queue
                                    break;
                                case 8:
                                    objs.val = !p_advance_reservation_days ? '当天' : p_advance_reservation_days == -1 ? '任意时间' : p_advance_reservation_days ;
                                    break;
                                case 9:
                                    // objs.val = p_before_the_course_subscribe + '分钟'
                                    break;
                                case 10:
                                    objs.val = p_before_the_course_cancel_subscribe + '分钟'
                                    break;
                                case 11:
                                    objs.switchVal = p_is_auto_truancy ? 1 : 0
                                    objs.info = p_is_auto_truancy == 1 ? '课程开始' : '课程结束'
                                    objs.val = p_is_auto_truancy == 1 ? '后' :  p_is_auto_truancy == 2 ? `${p_is_auto_truancy_time}分钟` : ''
                                    break;
                                case 12:
                                    // objs.switchVal = before_the_course_sign || after_the_course_sign ? 1 : 0
                                    objs.info = `课程当天，会员可在课程开始前${before_the_course_sign}分钟至课程结束后${after_the_course_sign}分钟内自主签到`
                                    break;
                                case 13:
                                    objs.switchVal = is_auto_sign_course ? 1 : 0
                                    objs.info = is_auto_sign_course == 2 ? `课程结束${is_auto_sign_course_time}分钟，如果会员还未签到，状态变更为已签到` : is_auto_sign_course == 1 ? '课程开始后，如果会员还未签到，状态变更为已签到' : ''
                                case 14:
                                    // objs.switchVal = p_before_the_course_sign || p_after_the_course_sign ? 1 : 0 
                                    objs.info = `课程当天，会员可在课程开始前${p_before_the_course_sign}分钟至课程结束后${p_after_the_course_sign}分钟内自主签到`
                                    break;
                                case 15:
                                    objs.switchVal = p_is_auto_sign_course ? 1 : 0
                                    objs.info = p_is_auto_sign_course == 2 ? `课程结束${p_is_auto_sign_course_time}分钟，如果会员还未签到，状态变更为已签到` : p_is_auto_sign_course == 1 ? '课程开始后，如果会员还未签到，状态变更为已签到' : ''
                                case 16:
                                    objs.switchVal = is_show_course_to_member
                                    break;
                            } 
                            return objs
                        })
                    }
                    return obj
                });
                this.setData({
                    list:showList,
                    initData:res
                })
            })
          })
    },
    // 更新数据
    editSettingConfig(){
        const { initData } = this.data 
        const submitData = initData
        const { list } = this.data
        request({
            url:baseUrl + editSettingConfig,
            data:submitData,
            method: 'POST',
            isTologin:true,
            success: (res => {
                console.log('res',res)
                wx.showModal({
                    title:'操作成功'
                })
                this.getConfigInfo()
            }),
            fail:(res=>{
                this.getConfigInfo()
            })
        })
    }
})