// pages/classAppointment/classAppointment.js
import moment from '../../utils/moment.js'
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { setStoreId } from '../../utils/common.js'
import { param } from '../../utils/param.js'
const app = getApp();
const { groupCourseList, courseTypeList } = api
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
    courseSpecies:[{
      id:1,
      name:'团课'
    },{
      id:2,
      name:'小班课'
    },{
      id:3,
      name:'精品课'
    },{
      id:4,
      name:'私教课'
    }],
    privateCourseList:[{
      id:1,
      nickname:'陈老师',
      
    }],
    showPersonalData:[],
    user_type:'',
    statusArr:{
      1:{
          name:'正常',
          icon:''
      },
      2:{
          name:'开课成功',
          icon:''
      },
      3:{
          name:'开课失败',
          icon:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211015/9d97d1e220a75ff4a0ace43d1ec49047.png'
      },
      4:{
          name:'已完课',
          icon:''
      },
      5:{
          name:'已完课',
          icon:''
      }
    },
    iPhonex:false,
    x:0,
    y:0,
    scheduleShow:false,
    toView:'',
    swiperArr:[],
    swiperCurrentIndex: 4,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.store_id){
      setStoreId(options.store_id)
    }
    this.setData({
      iPhonex:app.globalData.isIphoneX || false
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
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
    this.setData({
      user_type:wx.getStorageSync('user_type') || '',
      swiperCurrentIndex: wx.getStorageSync('swiper_current_index') || 4
    })
    this.getCourseTypeList()
    console.log('????????????')
    this.getNowFormatDate();
    this.getWeekTime();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let store_id = wx.getStorageSync('store_id')
    return {
      title: '',
      path: `/pages/appointment/appointment?store_id=${store_id}`,
      imageUrl: ''
    }
  },
  getSwiperCurrentIndex(e){
    const { current } = e.detail;
    wx.setStorageSync('swiper_current_index', current)
  },
  //获取团课
  get_class() {
    const { checkedNav, checkedDate } = this.data
    request({
      url:baseUrl + groupCourseList,
      isTologin:true,
      data:{
        course_type_ids:checkedNav,
        date_time:checkedDate,
        store_id:wx.getStorageSync('store_id'),
        limit:50
      },
      method: 'POST',
      success: (res => {
        // 团课私教课 课程数据结构不一致 分别处理
        if(checkedNav != 4 ){
          this.setData({
            classList:res.list
          })
        }else{
          /** 展示数据整合处理  */
          let showData = this.formatPersonalData(res.list)
          this.setData({
            showPersonalData:showData,
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
    let MondayTime = nowTime - (day + 27 ) * oneDayLong
    let SundayTime = nowTime + (7 - day) * oneDayLong;
    if (day == 0) {
      MondayTime = nowTime - 6 * oneDayLong;
      SundayTime = nowTime;
    }
    let monday = new Date(MondayTime);
    let strDate = monday.getDate();
    let sunday = new Date(SundayTime);
    let endDate = sunday.getDate();
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
    for (let i = 0; i < 63; i++) {
      let idx = (i % 7)
      arr.push({
        date: this.GetDate(monday, i).date,
        month: this.GetDate(monday, i).month,
        week: this.data.week[idx],
        day: this.GetDate(monday, i).day,
        id:this.GetDate(monday, i).date == this.data.today ? 'a1' : ''
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

    let splitIdx = 0
    let swiperArr = arr.map((item,index)=>{
      if(splitIdx != index){
        return ''
      }
      let obj = {
        id:index + 1,
        list:arr.slice(splitIdx,splitIdx + 7)
      }
      splitIdx +=7  
      return obj
    })
    this.setData({
      date: arr,
      checkedDate,
      checkedWeek,
      toView:'a1',
      swiperArr:swiperArr.filter((item)=>{
        return item
      })
    })
    wx.setStorageSync('checkedWeek', checkedWeek)
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
    const { checkedNav } = this.data
    const idx = e.currentTarget.dataset.idx;
    console.log('e',e)
    const { date, week } = e.currentTarget.dataset
    this.setData({
      checkedDate: date,
      checkedWeek: week,
    })
    wx.setStorageSync('checkedDate', date)
    wx.setStorageSync('checkedWeek', week)
    // wx.showLoading()
    this.get_class()

  },
  // 选择课程类型
  checkNav(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      checkedNav: id,
    })
    this.get_class()
  },
  //获取当前时间
  getNowFormatDate() {
    // if(wx.getStorageSync('checkedDate')){
    //   this.setData({
    //     today: wx.getStorageSync('checkedDate')
    //   })
    //   return
    // }
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
  },
  goBooking(e){
    const { id, cid } = e.currentTarget.dataset
    const { checkedNav, checkedDate } = this.data
    wx.navigateTo({
      url: `/pages/booking/booking?courseId=${id}&type=${checkedNav}&checkDate=${checkedDate}&cid=${cid}`,
    })
  },
  goBookingDetail(e){
    const { id, cid } = e.currentTarget.dataset
    const { checkedNav, checkedDate } = this.data
    wx.navigateTo({
        url:`/pages/booking/bookingDetail?courseId=${id}&courseType=${checkedNav}&courseDate=${checkedDate}&cid=${cid}`
    })
  },
  //私教课数据处理
  formatPersonalData(data){
    let showData = data.map((item)=>{
      let obj = item
      obj.unfold = false
      return obj
    })
    return showData
  },
  //查看课表
  goSchedule(){
    // const { scheduleShow } = this.data
    // if(!scheduleShow){
    //   this.setData({
    //     scheduleShow:!scheduleShow
    //   })
    //   return
    // }
    wx.navigateTo({
      url: '/pages/course/schedule',
    })
    // this.setData({
    //   scheduleShow:!scheduleShow
    // })
  },
  //获取课程类型分类
  getCourseTypeList(){
    const { list } = this.data
    request({
        url:baseUrl + courseTypeList,
        data:{},
        method:'POST',
        isTologin:true,
        success:(res)=>{
            this.setData({
              courseSpecies:res,
            })
        }
    })
  },
  scrollEnd(e){
    console.log('e',e)
  }
})