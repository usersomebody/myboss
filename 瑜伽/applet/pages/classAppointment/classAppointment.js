// pages/classAppointment/classAppointment.js
import moment from '../../utils/moment.js'
import { api } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { setStoreId } from '../../utils/common.js'
import { param } from '../../utils/param.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_name:'',
    checkedDate: "",
    today: "",
    date: [],
    checkedWeek: '',
    week: ['一', '二', '三', '四', '五', '六', '日'],
    checkedNav: 1,
    checkedTeacher: true,
    weigh_info: false,
    weigh_data: false,
    typeList:[{
      id:1,
      name:'全部课程'
    },{
      id:2,
      name:'全部时段'
    }],
    list:[],
    courseList:[],
    timeList:[{
      id:0,
      name:'全部时段',
      select:false
    },{
        id:1,
        name:'00:00-09:00',
        start:'00:00',
        end:'09:00',
        select:false
    },
    {
        id:2,
        name:'09:00-15:00',
        start:'09:00',
        end:'15:00',
        select:false
    },
    {
        id:3,
        name:'15:00-18:00',
        start:'15:00',
        end:'18:00',
        select:false
        
    },
    {
        id:4,
        name:'18:00-21:00',
        start:'18:00',
        end:'21:00',
        select:false
    },
    {
        id:5,
        name:'21:00-24:00',
        start:'21:00',
        end:'23:59',
        select:false
    }],
    store_list:[],//子店铺列表
    courseLimit:[],
    timeLimit:[],
    courseType:1, //1课程 2时间段
    limitShow:false,
    courseSpecies:[],
    privateCourseList:[{
      id:1,
      nickname:'陈老师',
      
    }],
    unfold:false,
    currentDayData:'',
    climtStr:'',
    tlimtStr:'',
    showPersonalData:[],
    isCanBooking:true,
    isBeforeNow:false,
    user_type:'',
    iPhonex:false,
    storeAddress:"",
    isShowCourseMember:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.store_id){
      setStoreId(options.store_id)
    }
    this.setData({
      weigh_info: this.options.weigh_info,
      currentDayData:moment().format('YYYY-MM-DD'),
      iPhonex:app.globalData.isIphoneX || false,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user_type = wx.getStorageSync('user_type')
    let show_preengage_member = wx.getStorageSync('show_preengage_member')
    this.setData({
      courseLimit:[],
      timeLimit:[],
      climtStr:'',
      tlimtStr:[],
      user_type:wx.getStorageSync('user_type') || '',
      isShowCourseMember:show_preengage_member == 2 || (show_preengage_member == 1 && user_type == 1),
      isLogin: wx.getStorageSync('token') ? true : false,
      token: wx.getStorageSync('token') || '',
      limitShow:false
    })
    this.getNowFormatDate();
    if (wx.getStorageSync('token')) {
      this.get_weighInfo()
    }
    this.getChildStoreList().then(()=>{
      this.getCourseType()
      this.getWeekTime();
    })

   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let store_id = wx.getStorageSync('store_id')
    return {
      title: '',
      path: `/pages/classAppointment/classAppointment?store_id=${store_id}`,
      imageUrl: ''
    }
  },
  //获取体重信息
  get_weighInfo() {
    let url = app.globalData.baseUrl + '/applet/weight';
    let data = {
      method: 'user.getweight',
      date: this.data.today,

    }
    let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
    wx.request({
      url,
      data,
      header,
      method: 'POST',
      success: (res => {
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
        } else
        if (res.data.code == 200) {
          this.setData({
            weigh_data: res.data.data[0]
          })
        } else {
          this.setData({
            weigh_data: false
          })
        }
      })

    })
  },
  // 计算当前是否在开课时间和上课开始时间之间
  calculatTime(openTime,startTime){
    let open = moment(openTime).format('YYYY-MM-DD HH:mm:ss')
    let current = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
    return moment().isBetween(open, current,'seconds')
  },
  //获取团课
  get_class() {
    const { checkedNav, checkedDate, climtStr, tlimtStr, timeList } = this.data
    let url = app.globalData.baseUrl + '/applet/courseArrange',
      // store_id = wx.getStorageSync('store_id'),
      store_id = wx.getStorageSync('store_child_id'),//小程序分店改版 取用子分店的id
      that = this;

    let data = {
      method: 'course.arrange.get',
      date: checkedDate,
      course_type_id:checkedNav + '',
      store_id,
    }
    if(climtStr){
      data.course_id = climtStr
    }
    if(tlimtStr.length){
      data.time_quantum = JSON.stringify(tlimtStr)
    }
    let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }

    wx.request({
      url,
      data,
      header,
      method: 'POST',
      success: (res => {
        wx.hideLoading()
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
        } else
        if (res.data.code == 200) {
          let classList = this.btnStatus(res.data.data);
          timeList.forEach((item)=>{
            item.start_time = checkedDate + ' ' + item.start
            item.end_time = checkedDate + ' ' + item.end
          })
          classList.forEach((item)=>{
            item.isInstartOpen = this.calculatTime(item.curriculum_time * 1000, checkedDate + ' ' + item.start_time)
            item.isInRealstartOpen = this.calculatTime(item.date + ' ' + item.start_time, item.date + ' ' + item.end_time)
            item.course_stars = "★★★★★☆☆☆☆☆".slice(5 - item.course_detail.difficulty_star, 10 - item.course_detail.difficulty_star);
          })
          this.setData({
            classList,
            timeList,
          })
        } else {
          this.setData({
            classList: [],
          })
        }
      })
    })
  },
  // 获取当前两周日期
  getWeekTime() {
    let now = new Date();
    let nowTime = now.getTime();
    let day = now.getDay();
    let oneDayLong = 24 * 60 * 60 * 1000;
    let MondayTime = nowTime - (day - 1) * oneDayLong;
    let SundayTime = nowTime + (7 - day) * oneDayLong;
    if (day == 0) {
      MondayTime = nowTime - 6 * oneDayLong;
      SundayTime = nowTime;
    }
    let monday = new Date(MondayTime);
    let strDate = monday.getDate();
    let sunday = new Date(SundayTime);
    let endDate = sunday.getDate();
    //周一的年份日期
    console.log( new Date(MondayTime).getFullYear())
    let currentYear = moment().format('YYYY')
    let MondayYear = moment(MondayTime).format('YYYY')
    let year =  currentYear == MondayYear ? currentYear : MondayYear;

    // 时间问题以后代排查
    let month =  monday.getMonth() + 1;
    let month2 = new Date(SundayTime).getMonth() + 1;
    if (month >= 1 && month <= 9) month = "0" + month;
    if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate;
    let seperator1 = "-";
    // 周一
    let startTime = year + seperator1 + month + seperator1 + strDate,
      // 周天
      endTime = year + seperator1 + month2 + seperator1 + endDate;
     this.getWeekArr(startTime);
  },
  //获取两周内的日期数组
  getWeekArr(monday) {
    //传入周一日期
    let arr = [];
    for (let i = 0; i < 14; i++) {
      let idx = (i % 7)
      arr.push({
        date: this.GetDate(monday, i).date,
        month: this.GetDate(monday, i).month,
        week: this.data.week[idx],
        day: this.GetDate(monday, i).day
      });

    }
    let checkedDate, checkedWeek;
    for (let item of arr) {
      if (item.date == this.data.today) {
        checkedWeek = item.week;
        checkedDate = item.date;
      }
    }
    if(wx.getStorageSync('checkedDate')){
      checkedDate=wx.getStorageSync('checkedDate');
    }
    this.setData({
      date: arr,
      checkedDate,
      checkedWeek,
      isBeforeNow:moment(checkedDate).isBefore(moment(),'day')
    })
    wx.setStorageSync('checkedWeek', checkedWeek)
    if(this.data.checkedNav == 4){
      this.getPersonalclass()
      return      
    }
    this.get_class();
  },
  //获取n天后日期
  GetDate(currentDate, AddDayCount) {
    var dd = new Date(currentDate);
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日
    var y = dd.getFullYear();
    var m =
      dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
    let dateTime = y + "-" + m + "-" + d;
    let date = {
      date: dateTime,
      day: d,
      month:m
    }
    return date;
  },
  //  选择日期
  checkDate(e) {
    const { checkedNav, timeList } = this.data
    const idx = e.currentTarget.dataset.idx;
    timeList.forEach((item)=>{
      item.start_time = this.data.date[idx].date + ' ' + item.start
      item.end_time = this.data.date[idx].date + ' ' + item.end
    })
    this.setData({
      checkedDate: this.data.date[idx].date,
      checkedWeek: this.data.date[idx].week,
      checkedTeacher: false,
      timeList,
      isBeforeNow:moment(this.data.date[idx].date).isBefore(moment(),'day')
    })
    wx.setStorageSync('checkedDate', this.data.date[idx].date)
    wx.setStorageSync('checkedWeek', this.data.date[idx].week)
    wx.showLoading()
    if(checkedNav == 4){
      this.getPersonalclass()
      return
    }
    this.get_class()

  },
  // 选择课程类型
  checkNav(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      checkedNav: id,
      checkedTeacher: false
    })
    if(id == 4){
      this.getPersonalclass()
      return
    }
    this.get_class()
    this.getCourseList()
  },
  //选择私教老师
  checkTeacher() {
    this.setData({
      checkedTeacher: true
    })
  },
  //约课
  handleBooking(e) {
    // if (!this.data.isLogin) {
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   })
    //   return false
    // }
    let id = e.currentTarget.dataset.id;
    app.globalData.personalBookingTime = {}
    wx.navigateTo({
      url: `/pages/courseBooking/courseBooking?id=${id}&date=${this.data.checkedDate}&week=${this.data.checkedWeek}&checkType=${this.data.checkedNav}&canevaluate=1`,
    })
  },
  //关闭体重显示
  handleClose() {
    this.setData({
      weigh_info: false
    })
  },
  //获取当前时间
  getNowFormatDate() {
    if(wx.getStorageSync('checkedDate')){
      this.setData({
        today: wx.getStorageSync('checkedDate')
      })
      return
    }
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    this.setData({
      today: currentdate
    })
  },
  switchTab(e){
    wx.showLoading()
    console.log('e',e)
    const { id } = e.target.dataset
    const { courseList, timeList, courseType, limitShow, store_list } = this.data
    this.setData({
      limitShow:id == courseType && limitShow ? false : true,
      courseType:id,
      user_type:wx.getStorageSync('user_type') || '',
      list:id == 1 ? courseList : id == 2 ? timeList : store_list
    })
    wx.hideLoading()
  },
  updateSelectData(obj){
    // 获取更新数据
    //修改数据
    //1确定 2清空 3选择
    const { data, key, type, id = '' } = obj.detail
    const { list, courseType, courseList, timeList, store_list, store_name, storeAddress } = this.data
    let submitData = []
    if(type == 1){
        //课程数据筛选 + 处理
        let courseLimit = courseList.filter(item=>{
          return item.id !=0 && item.select
        })
        let climtStr = courseLimit.length ? courseLimit.map(item=>{
          return item.id
        }).join(',') : ''
        //时间数据筛选 + 处理
        let timeLimit = timeList.filter(item=>{
          return item.id != 0 && item.select
        })
        let tlimtStr = timeLimit.length ? timeLimit.map(item=>{
          let obj = {
            start_time:item.start_time,
            end_time:item.end_time
          }
          return obj
        }) : ''
        // 店铺数据筛选 + 处理
        let storeLimt = store_list.filter((item)=>{
          return item.select
        })
        console.log({storeLimt})
        if(storeLimt.length){
          wx.setStorageSync('store_child_id', storeLimt[0].id) //小程序分店改版 取用子分店的id 店铺更换 储存新子店铺id
          this.setData({
            storeAddress:storeLimt[0].address
          })
        }
        this.setData({
          courseLimit:courseLimit,
          timeLimit:timeLimit,
          climtStr,
          tlimtStr,
          limitShow:false,
          store_name:storeLimt.length ? storeLimt[0].name : store_name
        })
        //更新数据
        this.get_class()
      // 这里数据一定是最终确定筛选得数据
      return
    }
    if(type == 2){
      list.forEach(element => {
        element.select = false
      });
      this.setData({
        list:list
      })
      return    
    }
    if(key != 3){
      // 全选 复选 反选 
      list.forEach((item)=>{
        if(id == 0){
          item.select = true
        }else if(item.id == id){
          item.select = !item.select
        }
      })
      let isNotSelectAll = list.some(item=>{
        return item.id != 0 && !item.select
      })
      list[0].select = isNotSelectAll ? false : true
    }else{
      // 单选
      list.forEach((item)=>{
        item.select = item.id == id ? true : false
      })
    }
    
    this.setData({
      list,
    })
  },
  //toggle
  toggle(e){
    const { id } = e.currentTarget.dataset
    const { showPersonalData } = this.data
    showPersonalData.forEach(item => {
      if(item.id == id ){
        item.unfold = !item.unfold
      }
    });
    this.setData({
      showPersonalData,
    })
    // this.setData({
    //   unfold:!this.data.unfold
    // })
  },
  goBooking(e){
    let item = e.currentTarget.dataset.item;
    app.globalData.personalList = item
    app.globalData.personalBookingTime = {}
    wx.navigateTo({
      url: `/pages/courseBooking/courseBooking?id=${item[0].id}&date=${this.data.checkedDate}&week=${this.data.checkedWeek}&checkType=${this.data.checkedNav}&teacherId=${item[0].tid}&courseId=${item[0].cid}&appoint=1`,
    })
  },
  getPersonalclass() {
    let url = app.globalData.baseUrl + api.personalCourse,
      store_id = wx.getStorageSync('store_child_id'),
      that = this;
    let data = {
      method: 'course.getprivatecoursearrange',
      date: this.data.checkedDate,
      coach_staff_id:'',
      store_id
    }
    let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }

    request({
      url,
      data,
      header,
      isPassValue:'array',
      method: 'POST',
      success: (res => {
        wx.hideLoading()
        
        /** 展示数据整合处理  */
        let showData = this.formatPersonalData(res)
        // let classList = this.btnStatus(res)
        this.setData({
          showPersonalData:showData,
        })
      })
    })
  },
  getCourseType() {
    let url = app.globalData.baseUrl + api.course,
      store_id = wx.getStorageSync('store_child_id'), //小程序分店改版 取用子分店的id
      that = this;
    let data = {
      method: 'course.getcoursetype',
      store_id,
    }
    let header = {}
    //   token = wx.getStorageSync('token');
    // if (token) {
    //   header = {
    //     token
    //   }
    // }

    request({
      url,
      data,
      header,
      method: 'POST',
      success: (res => {
        this.setData({
          courseSpecies:res
        })
        this.getCourseList()
      })
    })
  },
  getCourseList() {
    const { checkedNav } = this.data
    let url = app.globalData.baseUrl + api.course,
      store_id = wx.getStorageSync('store_child_id'), //小程序分店改版 取用子分店的id
      that = this;
    let data = {
      method: 'course.get',
      store_id,
      course_type_id: checkedNav + ''
    }
    let header = {};
    //   token = wx.getStorageSync('token');
    // if (token) {
    //   header = {
    //     token
    //   }
    // }

    request({
      url,
      data,
      header,
      method: 'POST',
      success: (res => {
        if(!res || !res.length){
          this.setData({
            courseList:res,
            list:res
          })
          return
        }
        res.forEach(item=>{
          item.select = false
          item.split_name = item.name.length > 6 ? item.name.slice(0,6) : item.name
        })
        res = [...[{id:0,name:'全部课程',select:false}],...res]
        this.setData({
          courseList:res,
          list:res
        })
      })
    })
  },
  //brnStatus
  btnStatus(data){
    if(!data || !data.length){
      return []
    }
    data.forEach((item)=>{
      item.preengage_status = item.preengage_num >= item.max_user ? 3 : item.preengage_num >= Math.ceil(item.max_user / 2) ? 2 : 1
    })
    return data
  },
  //私教课数据处理
  formatPersonalData(data){
    
    let showData = data.map((item,idx)=>{
      let obj = {
        id:idx + 1,
        teacherName:item[0][0].course_detail.coach_staff.name,
        teacherId:item[0][0].coach_staff_id,
        head_img:item[0][0].course_detail.coach_staff.head_img,
        cover_img:item[0][0].course_detail.cover_img,
        unfold:false,
        info:item.map((itm)=>{
          return itm.map((s)=>{
            let infoData = {
              name:s.course_detail.name,
              id:s.id,
              date:s.date,
              end:s.date + ' ' + s.end_time,
              start:s.date + ' ' + s.start_time,
              interval:s.course_detail.duration,
              tid:s.coach_staff_id,
              cid:s.course_id,
              is_sub:s.is_sub || '',
            }
            return infoData
          })
        //   let middleObj = {
        //     list: itm.map((s)=>{
        //       let infoData = {
        //         name:s.course_detail.name,
        //         id:s.id,
        //         date:s.date,
        //         end:s.date + ' ' + s.end_time,
        //         start:s.date + ' ' + s.start_time,
        //         interval:30,
        //         tid:s.coach_staff_id,
        //         cid:s.course_id
        //       }
        //       return infoData
        //     }),
        //     status:1
        //   }
        //  return middleObj
          
        }),
      }
      return obj
    })
    return showData
  },
  toObj(data){
    let info = {}
    data.forEach((item)=>{
      info[item.course_arrange_id] = item
    })
    return info
  },
  //获取子店铺列表
  getChildStoreList(){
    let url = app.globalData.baseUrl + api.storeList;
    let store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'store.getchildlist',
      store_id,
    }
    let header = {};
    return request({
      url,
      data,
      header,
      method: 'POST',
    }).then( t => {
      let store_child_id = wx.getStorageSync('store_child_id')
      let store_id = wx.getStorageSync('store_id')
      let storeInfo = t[0]
      let filter_id = store_child_id ? store_child_id : store_id
      if(filter_id){
        let filterInfo = t.filter(s=>{
          return s.id == filter_id
        })
        storeInfo = filterInfo[0]
      }
      this.setData({
        store_name:storeInfo.name,
        store_id:storeInfo.id,
        store_list:t,
        storeAddress:storeInfo.address
      })
      wx.setStorageSync('store_child_id',storeInfo.id) //小程序分店改版 取用子分店的id 默认存贮数据第一条子店铺id（貌似返回的是主店）
    })
  }
})