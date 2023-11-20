import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'

const { searchScheduleName } = api
let weekEn = {
    0:'sunday',
    1:'monday',
    2:'tuesday',
    3:'wednesday',
    4:'thursday',
    5:'friday',
    6:'saturday',
}
Component({
    data: {
        checkedId:1,
        checkedName:'',
        showList:true,
        searchWord:'',
        numberValue:'',

        showDate:false,
        currentDate: '07:00',
        minHour: 7,
        maxHour: 24,

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
        
        courseInfo:{},
        hoursList:[],
        minutesList:[],
        swiperHoursIdx:0,
        swiperMinutesIdx:0,
        timeSelect:"07:00",
        timeSelectArr:['07','00'],
        courseId:[],
        staffInfo:{}
    },
    properties: {
        name: {
            type: String,
            value: ''
        },
        list: {
            type: Array,
            value: ''
        },
        key: {
            type: String,
            value: ''
        },
        selectId:{
            type:String,
            value:''
        },
        valName:{
            type:String,
            value:''
        },
        courseType:{
            type:String,
            value:''
        }
    },
    observers: {
        // 'list': function(val) {
        //     if(val){
        //         this.setData({
        //             list:val
        //         })
        //     }
        // },
        'valName': function(val) {
            if(val){
                this.setData({
                    checkedName:val
                })
            }
        },
    },
    attached() {
        const { selectId, key, name, valName } = this.properties
        console.log({ selectId, key, name, valName })
        let isNotCommonStyle = ['5', '6', '7', '8', '9']
        let year = moment().format('YYYY-MM-DD')
        let today = year.split('-')[2]
        let hoursList = []
        let minutesList = []
        hoursList = this.setHours(24,7,1)
        minutesList = this.setHours(60,0,1)
        this.setData({
             hoursList,
             minutesList,
        })
        this.setData({
            checkedId:selectId || '',
            checkedName:valName || '',
            numberValue:selectId,
            currentDate:selectId,
            currentChecked:selectId,
            showList: isNotCommonStyle.indexOf(key) > -1 ? false : true,
            courseId:wx.getStorageSync('courseId') || [],
            today
        })
        if(key == 6){
            this.getSelectTimeIdx(selectId)
        }
        if(key == 5){
            this.dateInit()
        }
    },


    methods: {
        saveData(){
            const { checkedId, checkedName, numberValue, currentDate, currentChecked, courseInfo, courseType, courseId, staffInfo  } = this.data
            const { key } = this.properties
            if(key == 8 || key == 9){
                this.triggerEvent('updataData',{id:numberValue,name:numberValue,key:key})
            }else if(key == 6 || key == 7){
                let date = currentDate ? currentDate : '07:00'
                console.log('date',date)
                this.triggerEvent('updataData',{id:date,name:date,key:key})
            }else if(key == 5){
                if(courseType == 4){
                    let staff = wx.getStorageSync('staff-info').private_time_frame
                    if(staff[weekEn[moment(currentChecked).day()]].switch == 2){
                        wx.showModal({
                            title:'提示',
                            showCancel:false,
                            content:'该时间段非老师上班时间，不可排课，可前往员工处调整作息时间。'
                        })
                        return
                    }
                }
                this.triggerEvent('updataData',{id:currentChecked,name:currentChecked,key:key})
            }else if(key == 2 && courseType != 4){
                wx.setStorageSync('course-info', courseInfo)
                this.triggerEvent('updataData',{id:checkedId,name:checkedName,key:key})
            }else if(key == 2 && courseType == 4){
                wx.setStorageSync('courseId',courseId)
                let ids = courseId.map((item)=>{
                    let obj = item.id
                    return obj
                })
                let name = courseId.map((item)=>{
                    let obj = item.name
                    return obj
                })
                this.triggerEvent('updataData',{id:ids,name:name.join(','),key:key})
            }else if(key == 3 && courseType == 4){
                wx.setStorageSync('staff-info', staffInfo)
                this.triggerEvent('updataData',{id:checkedId,name:checkedName,key:key})
            }else{
                this.triggerEvent('updataData',{id:checkedId,name:checkedName,key:key})
            }
        },
        toObj(courseId){
            let obj = {}
            courseId.forEach((item)=>{
                obj[item.id] = item
            })
            return obj
        },
        switchPrivate(e){
            const { item } = e.currentTarget.dataset
            const { courseId,list } = this.data
            const { key } = this.properties
            let restList = courseId
            if(restList.length){
                let selectObj = this.toObj(courseId)
                if(selectObj[item.id]){
                    restList = restList.filter((v)=>{
                        return v.id != item.id
                    })
                }else{
                    restList.push(item)
                }
            }else{
                restList.push(item)
            }
            let ids = restList.map((item)=>{
                let obj = item.id
                return obj
            })
            
            list.forEach(element => {
                element.checked = ids.indexOf(element.id) > -1 ? true : false
            });
            this.setData({
                courseId:restList,
                list
            })
        },
        switchTab(e){
            const { id, name, item } = e.currentTarget.dataset
            const { checkedId, courseType } = this.data
            const { key } = this.properties
            if(key == 2 && courseType == 4){
                this.switchPrivate(e)
                return
            }
            if(id == checkedId){
                return
            }
            this.setData({
                checkedId:key == 10 ? item : id,
                checkedName:key == 10 ? item : name,
                courseInfo: key == 2 ? item : '',
                staffInfo: key == 3 && courseType == 4 ? item : ''
            })
        },
        searchCourseResult(e){
            const { value } = e.detail
            this.setData({
                searchWord:value
            })
        },
        search(){
            const { searchWord } = this.data
            // 拉取接口搜索结果
            request({
                url:baseUrl + searchScheduleName,
                data:{
                    course_type_ids: this.data.courseType || '',
                    name:searchWord
                },
                method:'POST',
                isTologin:true,
                success:(res)=>{
                    this.setData({
                        list:res
                    })
                    // this.triggerEvent('updataData',{isRest:true,list:res})
                }
            })
        },
        getNumberValue(e){
            const { value } = e.detail
            const { selectId, key, name, valName } = this.properties
            let min_max = wx.getStorageSync('maxMinNum')
            // 8 小 9 大
            let min = min_max.filter((v)=>{
                return v.key == 8
            })
            let max = min_max.filter((v)=>{
                return v.key == 9
            })
            if(key == 8 && max[0].value && parseInt(max[0].value) < parseInt(value)){
                wx.showToast({ title: '最小值不合法', icon: 'none' });
                return
            }
            if(key == 9 && min[0].value && parseInt(min[0].value) > parseInt(value)){
                wx.showToast({ title: '最大值不合法', icon: 'none' });
                return
            }
            this.setData({
                numberValue:value
            })
        },
        delete(){
            this.setData({
                numberValue:''
            })
        },
        toggleDatePickr(){
            this.setData({
                showDate:!this.data.showDate
            })
        },
        // onTimeInput(event) {
        //     this.setData({
        //       currentDate: event.detail,
        //     });
        // },
        onChange(event) {
            let temp  = event.detail.getValues()

            const ttr = temp[0] + ":" + temp[1]
            this.setData({
              currentDate: ttr,
            });
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
            let month = (setMonth || now.getMonth()) + 1;
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
        checkBirth(){
            const { currentChecked } = this.data
            let year = new Date().getFullYear();
            let birthYear = ''
            let age = 0
            if(currentChecked){
                birthYear = new Date(currentChecked).getFullYear()
                age = year - birthYear < 0 ? 0 : year - birthYear
            }
            this.setData({
                dateShow:false,
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
        let dateStr = currentDate ? currentDate : '07:00'
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
    }
  }
})
