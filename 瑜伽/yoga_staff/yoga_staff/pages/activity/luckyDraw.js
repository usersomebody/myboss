import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import { param } from '../../utils/param.js';

const app = getApp()
const { uploadImg, addActivityLotto, editActivityLotto, getActivityInfo } = api

Page({
    data:{
        showlist:[{
            id:1,
            name:'活动名称',
            placeholder:'请输入活动名称',
            key:'name',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:true,
            styleType:1
        },{
            id:2,
            name:'活动开始时间',
            placeholder:'请选择活动开始时间',
            key:'start_time',
            selectId:'',
            value:'',
            isHandle:true,
            inputBox:false,
            styleType:1
        },
        {
            id:3,
            name:'活动结束时间',
            placeholder:'请选择活动结束时间',
            key:'end_time',
            selectId:'',
            value:'',
            isHandle:true,
            inputBox:false,
            styleType:1
        },{
            id:4,
            name:'活动封面图',
            placeholder:'上传封面',
            key:'desc_img',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:false,
            styleType:2
        },{
            id:5,
            name:'活动说明',
            placeholder:'上传规则图片',
            key:'rule_imgs',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:false,
            styleType:2
        },{
            id:6,
            name:'活动规则',
            placeholder:'请输入活动规则',
            key:'rule',
            selectId:'',
            value:'',
            isHandle:false,
            inputBox:false,
            styleType:2
        },],
        popupShow:false,
        popupData:{},
        checkedId:'',
        checkedName:'',
        showData:[],
        canUseCard:[],
        showKey:'',
        selectInfo:{},
        actId:'',
        isChecked:false,
        isSelect:1,

        //日期
        dateShow:true,
        week: ['日', '一', '二', '三', '四', '五', '六'],
        year: 0,
        month: 0,
        dateArr: [],
        startWeek: 0,
        currentChecked: 0,
        today: 0,
        start_date: '',
        end_date: '',

        // 时间
        showDate:true,
        hoursList:[],
        minutesList:[],
        swiperHoursIdx:0,
        swiperMinutesIdx:0,
        currentDate: '00:00',
        timeSelectArr:['00','00'],

        //图片上传
        upyunFilePath: '',
        uploadFileIdx: 0,

        imgFileList:[],
        alyunFilePath: [],
        alloadFileIdx: 0,
        isAction:2,
        width:375,//宽度
        height: 275,//高度
        imgSrc:'',


        prizeData:[],
        fictitious:[],
        // 二维码
        qr_code_info:{
            qr_type:'3',
            redeem_start_time:'',
            redeem_end_time:'',
            other_head_img:'',
            qr_img:'',
            other_name:'',
            guide:''
        },
        //抽奖限制
        draw_limit:{
            lotto_total_limit:'0',
            lotto_total_limit_number:'',
            lotto_day_limit:'',
            winning_total_limit:'',
            winning_day_limit:'0',
            winning_day_limit_number:''
        },
        toDayDate:'',
        is_open_winning_info:1,
        isIphoneX:false
    },
    onLoad(options){
        let year = moment().format('YYYY-MM-DD')
        let today = year.split('-')[2]
        let hoursList = []
        let minutesList = []
        hoursList = this.setHours(24,0,1)
        minutesList = this.setHours(60,0,1)
        this.setData({
            hoursList,
            minutesList,
            today,
            actId:options.id || '',
            isAction:options.isAction,
            toDayDate:moment().format('YYYY-MM-DD'),
            isIphoneX:app.globalData.isIphoneX
            
        })
        //编辑数据初始化
        if(options.id){
            this.getActivityInfo()
        }
        this.dateInit()
    },
    onShow(){
        this.setData({
            prizeData:wx.getStorageSync('prizeData'),
            fictitious:wx.getStorageSync('fictitious')
        })
    },
    //获取活动详情
    getActivityInfo(){
        const { actId } = this.data
        request({
            url:baseUrl + getActivityInfo,
            data:{
                id:actId || ''
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                const {
                    qr_type,
                    redeem_start_time,
                    redeem_end_time,
                    other_head_img,
                    qr_img,
                    other_name,
                    guide,
                    lotto_total_limit,
                    lotto_total_limit_number,
                    lotto_day_limit,
                    winning_total_limit,
                    winning_day_limit,
                    winning_day_limit_number,
                    prize_list,
                    vm_winning_content,
                    is_open_winning_info
                } = res
                let qr_code_info = {
                    qr_type:qr_type + '',
                    redeem_start_time:redeem_start_time.split(' ')[0],
                    redeem_end_time:redeem_end_time.split(' ')[0],
                    other_head_img,
                    qr_img,
                    other_name,
                    guide
                }
                //抽奖限制
                let draw_limit = {
                    lotto_total_limit:lotto_total_limit == 0 ? '0' : '1',
                    lotto_total_limit_number:lotto_total_limit == 0 ? 0 :lotto_total_limit,
                    lotto_day_limit,
                    winning_total_limit,
                    winning_day_limit:winning_day_limit == 0 ? '0' : '1',
                    winning_day_limit_number:winning_day_limit == 0 ? 0 : winning_day_limit
                }
                this.setData({
                    qr_code_info,
                    draw_limit,
                    is_open_winning_info,
                    prize_list,
                    vm_winning_content
                })
                wx.setStorageSync('prizeData', prize_list)
                wx.setStorageSync('fictitious', vm_winning_content)
                // list[1].list = res
                this.dataInit(res)
            }
        })
    },
    dataInit(data){
        const { isAction } = this.data
        let defaultValue = data
        const { showlist } = this.data
        showlist.forEach(item => {
            item.value = defaultValue[item.key]
            if(isAction !=2 ){
                item.isHandle = false
                item.inputBox = false
            }
        });
        console.log
        this.setData({
            showlist,
            alyunFilePath:defaultValue['rule_imgs'] || []
        })
    },
    //组件盒子显示
    toggelePopup(e){
        const { canUseCard } = this.data
        const { item } = e.currentTarget.dataset
        let obj = { name:item.name, key:item.key, selectId:item.selectId, value:item.value}
        if(!item.isHandle){
            return
        }
        this.setData({
            showData:item.key == 'card_id' ? canUseCard : this.data[item.key],
            popupShow:!this.data.popupShow,
            popupData:obj,
            checkedId:item.selectId || '',
            checkedName:item.value || '',
            showKey:item.key
        })
        if(item.value && (item.key == 'start_time' || item.key == 'end_time')){
            let selectArr = obj.value.split(' ')
            let dateArr = selectArr[0].split('-')
            let timeArr = selectArr[1]
            this.dateInit(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2]);
            this.getSelectTimeIdx(timeArr)
        }
        
    },
    searchCourseResult(e){
        const { value } = e.detail
        this.setData({
            searchWord:value
        })
    },
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { showlist } = this.data
        showlist.forEach(item => {
            item.value = item.key == key ? value : item.value
        });
        this.setData({
            showlist, 
        })
    },
    getMemoValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { showlist } = this.data
        showlist.forEach(item => {
            item.value = item.key == key ? value : item.value
        });
        this.setData({
            showlist, 
        })
    },
    switchTab(e){
        const { id, name, item, key } = e.currentTarget.dataset
        const { checkedId  } = this.data
        if(id == checkedId){
            return
        }
        this.setData({
            checkedId:id,
            checkedName:name,
            selectInfo:item
        })
    },
    saveData(){
        const { showKey, showlist, selectInfo, checkedId, checkedName, isChecked, currentChecked, currentDate} = this.data
        if( showKey == 'start_time'){
            // 数据对比 所选开始时间不可小于结束时间
            let date = currentDate ? currentDate : '00:00'
            let checkedTime = currentChecked + ' ' + date
            if(showlist[2].value && moment(checkedTime).isAfter(showlist[2].value)){
                wx.showModal({
                    title:'开始时间不可小于结束时间'
                })
                return
            }
            showlist[1].value = checkedTime
            showlist[1].selectId = checkedTime
        }
        if( showKey == 'end_time'){
            let date = currentDate ? currentDate : '00:00'
            let checkedTime = currentChecked + ' ' + date
            if(showlist[1].value && moment(showlist[1].value).isAfter(checkedTime)){
                wx.showModal({
                    title:'结束时间不可小于开始时间'
                })
                return
            }
            showlist[2].value = checkedTime
            showlist[2].selectId = checkedTime
        }

        this.setData({
            popupShow:!this.data.popupShow,
            showlist,
        })
        console.log('showlist',showlist)
    },
    close(){
        this.setData({
            popupShow:false
        })
    },
    cancle(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    sure(){
        const { showlist, actId } = this.data
        let submitData = {}
        let reqUrl = actId ? editActivityLotto : addActivityLotto
        let objData = this.verifyData()
        if(!objData){
            return
        }
        if(actId){
            submitData = {...objData,id:actId}
        }else{
            submitData = {...objData}
        }
        console.log('submitData',submitData)
        request({
            url:baseUrl + reqUrl,
            data:submitData,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:actId ? '修改成功' : '添加成功',
                    showCancel: false,
                    success:()=> {
                        setTimeout(()=>{
                            this.cancle()
                        },1000)
                    }
                })
            }
        })
    },
    verifyData(){
        const { showlist, qr_code_info, draw_limit, is_open_winning_info } = this.data
        let prizes_list = wx.getStorageSync('prizeData')
        let fictitious = wx.getStorageSync('fictitious')
        let draw_limit_copy = Object.assign({},draw_limit)
        draw_limit_copy.lotto_total_limit = draw_limit_copy.lotto_total_limit == 0 ? '0' : draw_limit_copy.lotto_total_limit_number
        draw_limit_copy.winning_day_limit = draw_limit_copy.winning_day_limit == 0 ? '0' : draw_limit_copy.winning_day_limit_number
        let submitDataList = this.toObj(showlist)
        let validData = {...submitDataList,...qr_code_info,...draw_limit_copy,prizes_list:prizes_list,vm_winning_content:fictitious,is_open_winning_info}
        console.log('validData',validData)
        for(let key in submitDataList){
            if(!submitDataList[key] && key != 'rule_imgs' && key != 'rule'){
                wx.showModal({
                    title:'请完善信息',
                    showCancel: false,
                })
                return false
            }
        }
        return validData
        
    },
    toObj(list){
        let info = {}
        let idArr = []
        list.forEach((item)=>{
            if(idArr.indexOf(item.id) > -1){
                info[item.key] = item.selectId
            }else{
                info[item.key] = item.value
            }
        })
        return info
    },
    // 日期
    //月份切换
    toggleDate(e) {
        //全部时间的月份都是按0~11基准，显示月份才+1
        const { year, month } = this.data
        const { type } = e.currentTarget.dataset
        // 月份切换 
        // type: 1---上一个月 2---下一个月 3---上一年 4----下一年
        let setYear = ''
        let setMonth = ''
        switch (type) {
        case "1":
            setYear = month - 2 < 0 ? year - 1 : year;
            setMonth = month - 2 < 0 ? 11 : month - 2;
            break;
        case "2":
            setYear = month > 11 ? year + 1 : year;
            setMonth = month > 11 ? 0 : month;
            break;
        case "3":
            setYear = year - 1;
            setMonth = month - 1;
            break;
        case "4":
            setYear = year + 1;
            setMonth = month - 1;
        break;
        }
        this.setData({
        year: setYear,
        month: (setMonth + 1)
        })
        //这里入值月份不做加1处理
        this.dateInit(setYear, setMonth);
    },
    //获取日期数组
    dateInit(setYear, setMonth, setDay) {
        const { today } = this.data
        //全部时间的月份都是按0~11基准，显示月份才+1
        let dateArr = []; //最终展示界面得date日期数组
        let arrLen = 0; //dateArr的数组长度
        let now = setYear ? new Date(setYear, setMonth) : new Date();
        let year = setYear || now.getFullYear();
        let month = (parseInt(setMonth) || now.getMonth()) + 1;
        let nextYear = 0;
        let nextMonth = month > 11 ? 1 : month;
        let day = setDay || now.getDate()
        let startWeek = new Date(`${year}/${month}/01`).getDay(); //目标月1号对应的星期
        let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
        let obj = {};
        //月份超过12月 年份自动增加1 月份置为1月
        if (month > 11) {
        nextYear = year + 1;
        dayNums = new Date(nextYear, nextMonth, 0).getDate();
        }
        arrLen = startWeek + dayNums;
        for (let i = 0; i < arrLen; i++) {
        if (i >= startWeek) {
            let day = i - startWeek + 1;
            obj = {
            date: `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`,
            day,
            }
        } else {
            obj = {};
        }
        // dateArr[i] = obj;
        dateArr = [...dateArr,{...obj}]
        }
        this.setData({
            startWeek,
            dateArr,
            year,
            month,
            currentChecked:`${year}-${month > 9 ? month : '0' + month}-${setDay ? setDay : today}`,
            start_date: `${year}-${month > 9 ? month : '0' + month}-${setDay ? setDay : today}`,
            end_date: `${year}-${month > 9 ? month : '0' + month}-${(arrLen - startWeek)}`,
        })
    },
    //选择日期
    checkDay(e) {
        // let idx = e.currentTarget.dataset.idx;
        const { date } = e.currentTarget.dataset
        this.setData({
            currentChecked: date
        })
    },
    //小时
    setHours(length, start, type){
        let list = []
        for(let i = start; i<length; i+=1){
            let str = `${i < 10 ? '0' + i : i}`
            list.push(str)
        }
        return list
    },
    getTimeValue(event){
        const { hoursList, minutesList, swiperHoursIdx, swiperMinutesIdx, currentDate, timeSelectArr } = this.data
        const { detail, currentTarget } = event
        let current = detail.current
        let type = currentTarget.dataset.type
        let timeSelect = currentDate
        let timeArr = timeSelectArr
        if(type == 1){
            timeArr[0] = hoursList[current]
        }else{
            timeArr[1] = minutesList[current]
        }
        timeSelect = `${timeArr[0]}:${timeArr[1]}`
        this.setData({
            timeSelectArr:timeArr,
            currentDate:timeSelect,
            swiperHoursIdx:type == 1 ? current : swiperHoursIdx,
            swiperMinutesIdx:type == 2 ? current : swiperMinutesIdx
        })
    },
    //计算默认下表并选中
    getSelectTimeIdx(currentDate){
        let dateStr = currentDate ? currentDate : '00:00'
        let selectArr = dateStr.split(':')
        const { hoursList, minutesList, swiperHoursIdx, swiperMinutesIdx, timeSelectArr } = this.data
        // 查找下标
        let hoursIdx = hoursList.indexOf(selectArr[0])
        let minutesIdx = minutesList.indexOf(selectArr[1])
        this.setData({
            timeSelectArr:selectArr,
            swiperHoursIdx:hoursIdx,
            swiperMinutesIdx:minutesIdx
        })
    },
    getImg() {
        const { isAction } = this.data
        if(isAction != 2){
            return
        }
        let that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compress'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.data.upyunFilePath = res.tempFilePaths[0]
                that.setData({
                    imgSrc:that.data.upyunFilePath
                })
                that.cropper = that.selectComponent("#image-cropper");
            }
        })
    },
    getImgs() {
        const { isAction } = this.data
        let that = this
        if(isAction != 2){
            return
        }
        wx.chooseImage({
            count:9 - that.data.imgFileList.length, // 默认9
            sizeType: ['compress'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.data.imgFileList = that.data.imgFileList.concat(res.tempFilePaths)
                that.setData({
                    imgFileList: that.data.imgFileList,
                })
                wx.uploadFile({
                    url: baseUrl + uploadImg,
                    filePath:res.tempFilePaths[0],
                    name:'image',
                    formData:{
                        image:res.tempFilePaths
                    },
                    success: function(res){
                        let imgInfo = JSON.parse(res.data)
                        if(res.statusCode == 200) {
                            that.data.alyunFilePath.push(imgInfo.content.url)
                            that.data.showlist[4].value = that.data.alyunFilePath
                            that.setData({
                                showlist:that.data.showlist,
                                alyunFilePath:that.data.alyunFilePath
                            })
                        }
                    },
                })
            }
        })

    },
    delImg(e) {
        let idx = e.currentTarget.dataset.idx
        this.data.alyunFilePath.splice(idx, 1)
        this.setData({
            alyunFilePath: this.data.alyunFilePath
        })
    },
    formatArrayData(obj){
        let objData = {}
        for(let key in obj){
            if(Array.isArray(obj[key])){
                obj[key].forEach((item,index)=>{
                    objData[`${key}[${index}]`]=item
                })
            }
        }
        console.log('objData',objData)
        return {...obj,...objData}
    },
    //获取到image-cropper实例
    cropperload(e){
        console.log("cropper初始化完成");
    },
    loadimage(e){
        console.log("图片加载完成",e.detail);
        wx.hideLoading();
        this.cropper.imgReset();
    },
    clickcut(e) {
        console.log(e.detail);
    },
    effectiveImg(){
        let that = this
        wx.showLoading({
            title:'上传中'
        })
        this.cropper.getImg((obj) => {
            console.log('obj.url',obj.url)
            wx.uploadFile({
                url: baseUrl + uploadImg,
                filePath:obj.url,
                name:'image',
                formData:{
                    image:obj.url
                },
                success:(result)=>{
                    let imgInfo = JSON.parse(result.data)
                    if(result.statusCode == 200) {
                        that.data.upyunFilePath = imgInfo.content.url
                        that.data.showlist[3].value = that.data.upyunFilePath
                        that.setData({
                            showlist:that.data.showlist,
                            imgSrc:''
                        })
                        wx.hideLoading()
                    }
                }
            })
        });
    },
    cancleTailoring(){
        this.setData({
            imgSrc: ''
        })
    },


    // 奖品设置
    onChange(event) {
        const {  qr_code_info } = this.data
        qr_code_info.qr_type = event.detail 
        this.setData({
            qr_code_info,
        });
    },
    lottoLimit(e){
        const { type } = e.currentTarget.dataset
        const {  draw_limit } = this.data
        draw_limit[type] = e.detail
        this.setData({
            draw_limit,
        });
    },
    getLimitTmes(e){
        const { type } = e.currentTarget.dataset
        const {  draw_limit } = this.data
        draw_limit[type] = e.detail.value
        this.setData({
            draw_limit,
        });
    },
    bindDateChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        const { qr_code_info } = this.data
        qr_code_info[key] = value
        this.setData({
            qr_code_info
        })
    },
    getQrVal(e){
        console.log('e',e)
        const { type } = e.currentTarget.dataset
        const { qr_code_info } = this.data
        const { value } = e.detail
        qr_code_info[type] = value
        this.setData({
            qr_code_info
        })
    },
    getQRcodeImg(e) {
        console.log('e',e)
        const { type } = e.currentTarget.dataset
        const { isAction, qr_code_info } = this.data
        let that = this
        if(isAction != 2){
            return
        }
        wx.chooseImage({
            count:1, // 默认9
            sizeType: ['compress'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.uploadFile({
                    url: baseUrl + uploadImg,
                    filePath:res.tempFilePaths[0],
                    name:'image',
                    formData:{
                        image:res.tempFilePaths
                    },
                    success: function(res){
                        let imgInfo = JSON.parse(res.data)
                        if(res.statusCode == 200) {
                            qr_code_info[type] = imgInfo.content.url
                            that.setData({
                                qr_code_info
                            })
                        }
                    },
                })
            }
        })
    },
    switchChange(e){
        const { is_open_winning_info } = this.data
        const { value } = e.detail
        this.setData({
            is_open_winning_info:value ? 1 : 2
        })
    },
    goSetPrize(){
        wx.navigateTo({
            url: '/pages/activity/prizeDataSet'
        })
    },
    goSetFictitious(){
        wx.navigateTo({
            url: '/pages/activity/fictitiousData'
        })
    }
})