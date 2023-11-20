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
        list:[],
        initData:{},
        showData:{},
        radio:1,
        actionId:1,
        showDataList:[],
        isPCourse:false,
        isCourse:false,
        showOverlayer:false,
        errorData:{},
        isIphoneX:false
    },
    onLoad(options){
        this.setData({
            actionId:options.id,
            isIphoneX:app.globalData.isIphoneX
        })
        this.getConfigInfo()
    },
    onShow(){

    },
    initShowData({inputVal,radioVal,switchVal, inputVal2, submit}){
        const { showData, actionId } = this.data
        let data = {}
        switch (actionId) {
            case '1':
                data = {
                    title:"团课预约提前",
                    radioList:[{
                        id:1,
                        name:'会员可预约多少天内容',
                        isShowInput:true,
                    },{
                        id:-1,
                        name:'不限制',
                        isShowInput:false,
                    }],
                    submitKey:'',
                    templateType:1,
                    isHassSwitch:false,
                    inputSymbol:'天',
                    switchVal,
                    inputVal,
                    radioVal,
                    info:'',
                    submit
                }
                break;
            case '2':
                data = {
                    title:"开课前多少分钟可预约",
                    radioList:[],
                    submitKey:'',
                    templateType:2,
                    isHassSwitch:false,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:'截至开课前0分钟可预约（例如：设置30分钟，课程9:30开始,会员9点之后将无法预约)'
                }
                break;
            case '3':
                data = {
                    title:"开课前多少分钟可以取消预约",
                    radioList:[],
                    submitKey:'',
                    templateType:2,
                    isHassSwitch:false,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:'截至开课前0分钟可取消（例如：设置30分钟，课程9:30开始,会员9点之后将无法取消)'
                }
                break;
            case '4':
                data = {
                    title:"约课端人数显示",
                    radioList:[{
                        id:1,
                        name:'还可以预约几人',
                        isShowInput:false,
                    },{
                        id:2,
                        name:'已约人数/容纳人数',
                        isShowInput:false,
                    },{
                        id:3,
                        name:'预约满几人开课',
                        isShowInput:false,
                    }],
                    submitKey:'',
                    templateType:1,
                    isHassSwitch:false,
                    isShowInput:false,
                    inputSymbol:'',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:''
                }
                break;
            case '5':
                data = {
                    title:"开课前多少分钟，预约人数未达到课程最少人数， 取消课程",
                    radioList:[],
                    submitKey:'',
                    templateType:2,
                    isHassSwitch:false,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:'截止开课前0分钟未达到最低开课人数，课程开课失败 (例：设置30分钟，课程9:30开始，9点未达到开课人数， 课程自动取消)'
                }
                break;
            case '6':
                data = {
                    title:"自动爽约",
                    radioList:[{
                        id:1,
                        name:'课程开始后，如果学员还是未签到状态，状态变更为已旷课',
                        isShowInput:false,
                    },{
                        id:2,
                        name:'课程结束后多少分钟，如果学员还是未签到状态，状态变更为已旷课',
                        isShowInput:true,
                    }],
                    submitKey:'',
                    templateType:1,
                    isHassSwitch:true,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:'截至开课前0分钟可取消（例如：设置30分钟，课程9:30开始,会员9点之后将无法取消)'
                }
                break;
            case '7':
                data = {
                    title:"候补排队",
                    radioList:[],
                    submitKey:'',
                    templateType:1,
                    isHassSwitch:true,
                    isShowInput:false,
                    inputSymbol:'',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:''
                }
                break;
            case '8':
                data = {
                    title:"私教预约提前",
                    radioList:[{
                        id:1,
                        name:'会员可预约多少天内容',
                        isShowInput:true,
                    },{
                        id:-1,
                        name:'不限制',
                        isShowInput:false,
                    }],
                    submitKey:'',
                    templateType:1,
                    isHassSwitch:false,
                    inputSymbol:'天',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:''
                }
                break;
            case '9':
                data = {
                    title:"开课前多少分钟可预约",
                    radioList:[],
                    submitKey:'',
                    templateType:2,
                    isHassSwitch:false,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:'截至开课前0分钟可预约（例如：设置30分钟，课程9:30开始,会员9点之后将无法预约)'
                }
                break;
            case '10':
                data = {
                    title:"开课前多少分钟可以取消预约",
                    radioList:[],
                    submitKey:'',
                    templateType:2,
                    isHassSwitch:false,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:'截至开课前0分钟可取消（例如：设置30分钟，课程9:30开始,会员9点之后将无法取消)'
                }
                break;
            case '11':
                data = {
                    title:"自动爽约",
                    radioList:[{
                        id:1,
                        name:'课程开始后，如果学员还是未签到状态，状态变更为已旷课',
                        isShowInput:false,
                    },{
                        id:2,
                        name:'课程结束后多少分钟，如果学员还是未签到状态，状态变更为已旷课',
                        isShowInput:true,
                    }],
                    submitKey:'',
                    templateType:1,
                    isHassSwitch:true,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:'截至开课前0分钟可取消（例如：设置30分钟，课程9:30开始,会员9点之后将无法取消)'
                }
                break;
            case '12':
                data = {
                    title:"会员自主签到",
                    radioList:[{
                        id:1,
                        name:'课程当天，会员可在课程开始前多少分钟至课程结束后多少分钟内自主签到',
                        isShowInput:true,
                    }],
                    submitKey:'',
                    templateType:3,
                    isHassSwitch:true,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    inputVal2,
                    radioVal,
                    submit,
                    info:''
                }
                break;
            case '13':
                data = {
                    title:"自动签到",
                    radioList:[{
                        id:1,
                        name:'课程开始后，如果学员还是未签到状态，状态变更为已签到',
                        isShowInput:false,
                    },{
                        id:2,
                        name:'课程结束后多少分钟，如果学员还是未签到状态，状态变更为已签到',
                        isShowInput:true,
                    }],
                    submitKey:'',
                    templateType:1,
                    isHassSwitch:true,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:''
                }
                break;
            case '14':
                data = {
                    title:"会员自主签到",
                    radioList:[{
                        id:1,
                        name:'课程当天，会员可在课程开始前多少分钟至课程结束后多少分钟内自主签到',
                        isShowInput:true,
                    }],
                    submitKey:'',
                    templateType:3,
                    isHassSwitch:true,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    inputVal2,
                    radioVal,
                    submit,
                    info:''
                }
                break;
            case '15':
                data = {
                    title:"自动签到",
                    radioList:[{
                        id:1,
                        name:'课程开始后，如果学员还是未签到状态，状态变更为已签到',
                        isShowInput:false,
                    },{
                        id:2,
                        name:'课程结束后多少分钟，如果学员还是未签到状态，状态变更为已签到',
                        isShowInput:true,
                    }],
                    submitKey:'',
                    templateType:1,
                    isHassSwitch:true,
                    isShowInput:true,
                    inputSymbol:'分钟',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:''
                }
                break;
            case '16':
                data = {
                    title:"预约情况展示",
                    radioList:[
                    //     {
                    //     id:0,
                    //     name:'禁止所有人查看预约情况',
                    //     isShowInput:false,
                    // },
                    {
                        id:1,
                        name:'允许会员查看预约情况',
                        isShowInput:false,
                    },{
                        id:2,
                        name:'允许所有人查看预约情况',
                        isShowInput:false,
                    }],
                    submitKey:'',
                    templateType:1,
                    isHassSwitch:true,
                    isShowInput:false,
                    inputSymbol:'',
                    switchVal,
                    inputVal,
                    radioVal,
                    submit,
                    info:''
                }
                break;
        } 
        this.setData({
            showData:data,
        })
    },
    onChange(event){
        const { showData } = this.data
        showData.radioVal = event.detail
        this.setData({
            showData,
        });
    },
    switchChange(e){
        const { value } = e.detail
        const { showData } = this.data
        showData.switchVal = value ? 1 : 0
        this.setData({
            showData
        })
    },
    getVal(e){
        const { key, type } = e.currentTarget.dataset
        const { value } = e.detail
        const { showData, showDataList } = this.data
        console.log('value',value)
        if(type == 1){
            showData[key] = value
            return
        }
        let list  = showDataList.map((item)=>{
            let obj = item
            obj.inputVal = item.submitKey == key ? value : item.inputVal
            return obj
        })
        this.setData({
            showDataList:list
        })
    },
    getConfigInfo(){
        const { list, actionId } = this.data
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
                this.setData({
                    initData:res
                })
                let obj = {}
                let course = ['2','3','5','12'] //逻辑调整 actionId 2 、3 、5 一起处理
                let p_course = ['9','10', '14'] //逻辑调整 actionId 9 、10 一起处理
                if(course.indexOf(actionId) > -1){
                    let showData = [{
                        title:"开课前多少分钟可预约",
                        submitKey:'before_the_course_subscribe',
                        templateType:4,
                        inputSymbol:'分钟',
                        inputVal:before_the_course_subscribe,
                        info:`截至开课前${before_the_course_subscribe}分钟可预约（例如：设置30分钟，课程9:30开始,会员9点之后将无法预约)`
                    },{
                        title:"开课前多少分钟可以取消预约",
                        submitKey:'before_the_course_cancel_subscribe',
                        templateType:4,
                        inputSymbol:'分钟',
                        inputVal:before_the_course_cancel_subscribe,
                        info:`截至开课前${before_the_course_cancel_subscribe}分钟可取消（例如：设置30分钟，课程9:30开始,会员9点之后将无法取消)`
                    },{
                        title:"开课前多少分钟，预约人数未达到课程最少人数， 取消课程",
                        submitKey:'is_auto_stop_course',
                        templateType:4,
                        inputSymbol:'分钟',
                        inputVal:is_auto_stop_course,
                        info:`截止开课前${is_auto_stop_course}分钟未达到最低开课人数，课程开课失败 (例：设置30分钟，课程9:30开始，9点未达到开课人数， 课程自动取消)`
                    }]
                    let data = {
                        title:"会员自主签到",
                        radioList:[{
                            id:1,
                            name:'课程当天，会员可在课程开始前多少分钟至课程结束后多少分钟内自主签到',
                            isShowInput:true,
                        }],
                        submitKey:'',
                        templateType:3,
                        isHassSwitch:true,
                        isShowInput:true,
                        inputSymbol:'分钟',
                        switchVal:before_the_course_sign || after_the_course_sign ? 1 : 0,
                        inputVal:before_the_course_sign,
                        inputVal2:after_the_course_sign,
                        radioVal:1,
                        submit:{
                            1:'before_the_course_sign',
                            2:'after_the_course_sign',
                        },
                        info:''
                    }
                    this.setData({
                        showDataList:showData,
                        showData:data,
                        isCourse:true
                    })
                }else if(p_course.indexOf(actionId) > -1){
                    let showData = [{
                        title:"开课前多少分钟可预约",
                        submitKey:'p_before_the_course_subscribe',
                        templateType:4,
                        inputSymbol:'分钟',
                        inputVal:p_before_the_course_subscribe,
                        info:`截至开课前${p_before_the_course_subscribe}分钟可预约（例如：设置30分钟，课程9:30开始,会员9点之后将无法预约)`
                    },{
                        title:"开课前多少分钟可以取消预约",
                        submitKey:'p_before_the_course_cancel_subscribe',
                        templateType:4,
                        inputSymbol:'分钟',
                        inputVal:p_before_the_course_cancel_subscribe,
                        info:`截至开课前${p_before_the_course_cancel_subscribe}分钟可取消（例如：设置30分钟，课程9:30开始,会员9点之后将无法取消)`
                    }]
                    let data = {
                        title:"会员自主签到",
                        radioList:[{
                            id:1,
                            name:'课程当天，会员可在课程开始前多少分钟至课程结束后多少分钟内自主签到',
                            isShowInput:true,
                        }],
                        submitKey:'',
                        templateType:3,
                        isHassSwitch:true,
                        isShowInput:true,
                        inputSymbol:'分钟',
                        switchVal:p_before_the_course_sign || p_after_the_course_sign ? 1 : 0,
                        inputVal:p_before_the_course_sign,
                        inputVal2:p_after_the_course_sign,
                        radioVal:1,
                        submit:{
                            1:'p_before_the_course_sign',
                            2:'p_after_the_course_sign',
                        },
                        info:''
                    }
                    this.setData({
                        showDataList:showData,
                        showData:data,
                        isPCourse:true
                    })
                }else{
                    switch (actionId) {
                        case '1':
                            obj = {
                                inputVal:!advance_reservation_days || advance_reservation_days == -1 ? 0 : advance_reservation_days,
                                radioVal:advance_reservation_days == -1 ? advance_reservation_days : 1,
                                switchVal:0,
                                submit:{
                                    1:'advance_reservation_days',
                                }
                            }
                            break;
                        case '4':
                            obj = {
                                inputVal:'',
                                radioVal:show_word,
                                switchVal:0,
                                submit:{
                                    1:'show_word'
                                }
                            }
                            break;
                        case '6':
                            obj = {
                                inputVal:is_auto_truancy_time,
                                radioVal:is_auto_truancy,
                                switchVal:is_auto_truancy ? 1 : 0,
                                submit:{
                                    1:'is_auto_truancy',
                                    2:'is_auto_truancy_time'
                                }
                            }
                            break;
                        case '7':
                            obj = {
                                inputVal:'',
                                radioVal:1,
                                switchVal:is_open_queue ? 1 : 0,
                                submit:{
                                    1:'is_open_queue',
                                }
                            }
                            break;
                        case '8':
                            obj = {
                                inputVal:!p_advance_reservation_days || p_advance_reservation_days == -1 ? 0 : p_advance_reservation_days,
                                radioVal:p_advance_reservation_days == -1 ? p_advance_reservation_days : 1,
                                switchVal:0,
                                submit:{
                                    1:'p_advance_reservation_days',
                                }
                            }
                            break;
                        case '11':
                            obj = {
                                inputVal:p_is_auto_truancy_time,
                                radioVal:p_is_auto_truancy,
                                switchVal:p_is_auto_truancy ? 1 : 0,
                                submit:{
                                    1:'p_is_auto_truancy',
                                    2:'p_is_auto_truancy_time',
                                }
                            }
                            break;
                        case '13':
                            obj = {
                                inputVal:is_auto_sign_course_time,
                                radioVal:is_auto_sign_course,
                                switchVal:is_auto_sign_course ? 1 : 0,
                                submit:{
                                    1:'is_auto_sign_course',
                                    2:'is_auto_sign_course_time',
                                }
                            }
                            break;
                        case '15':
                            obj = {
                                inputVal:p_is_auto_sign_course_time,
                                radioVal:p_is_auto_sign_course,
                                switchVal:p_is_auto_sign_course ? 1 : 0,
                                submit:{
                                    1:'p_is_auto_sign_course',
                                    2:'p_is_auto_sign_course_time',
                                }
                            }
                        case '16':
                            obj = {
                                inputVal:'',
                                radioVal:is_show_course_to_member,
                                switchVal:is_show_course_to_member,
                                submit:{
                                    1:'is_show_course_to_member'
                                }
                            }
                            break;
                    } 
                    this.initShowData(obj)
                }
            })
          })
    },
    back(){
        wx.navigateBack({
            delta: 1, 
        }) 
    },
    sure(){
        const { initData, showData, actionId, showDataList } = this.data
        if(['1','8'].indexOf(actionId) > -1){
            initData[showData.submit[1]] = showData.radioVal == '-1' ? '-1' : !showData.inputVal ? 0 : showData.inputVal
        }
        // else if(['2','9'].indexOf(actionId) > -1){
        //     initData[showData.submit[1]] = showData.inputVal
        // }else if(['3','10'].indexOf(actionId) > -1){
        //     initData[showData.submit[1]] = showData.inputVal
        // }
        else if(['6','11'].indexOf(actionId) > -1){
            initData[showData.submit[1]] = !showData.switchVal ? 0 : showData.radioVal 
            initData[showData.submit[2]] = showData.radioVal == 1 ? 0 : showData.inputVal
        }else if(['12','14'].indexOf(actionId) > -1){
            initData[showData.submit[1]] = showData.inputVal 
            initData[showData.submit[2]] = showData.inputVal2
        }else if(['13','15'].indexOf(actionId) > -1){
            initData[showData.submit[1]] = !showData.switchVal ? 0 : showData.radioVal 
            initData[showData.submit[2]] = showData.radioVal == 1 ? 0 : showData.inputVal
        }
        switch (actionId) {
            case '4':
                initData[showData.submit[1]] = showData.radioVal
                break;
            // case '5':
            //     initData[showData.submit[1]] = showData.inputVal 
            //     break;
            case '7':
                initData[showData.submit[1]] = showData.switchVal
                break;
            case '16':
                initData[showData.submit[1]] = showData.switchVal ? showData.radioVal : 0
                break;
        }
        showDataList.forEach(element => {
            initData[element.submitKey] = element.inputVal
        });
        this.setData({
            initData,
        })
        this.editSettingConfig()
    },
    // 更新数据
    editSettingConfig(){
        const { initData, showOverlayer } = this.data
        request({
            url:baseUrl + editSettingConfig,
            data:initData,
            method: 'POST',
            isTologin:true,
            isWarning:0,
            success: (res => {
                wx.showModal({
                    title:'操作成功',
                    showCancel:false,
                    success:()=>{
                        wx.navigateBack({
                            delta: 1, 
                        })
                    }
                })
            }),
            fail:(err=>{
                console.log('error',err)
                const { msg } = err
                let errorData = {msg,...err.content}
                this.setData({
                    showOverlayer:!showOverlayer,
                    errorData
                })
            })
        })
    },
    cancleBox(){
        const { showOverlayer } = this.data
        this.setData({
            showOverlayer:!showOverlayer,
            
        })
    }
})