// pages/teacher/teacher.js
import moment from '../../utils/moment.js'
import { api } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { formatParagraph, filterEOF } from '../../utils/common.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseSpecies:[],
    checkedNav: 1,
    checkedTeacher: true,
    user_type:'',
    resume:'',
    currentNav: 0,
    checkedDate: "",
    checkedWeek: '',
    today: "",
    skill: [],
    date: [],
    personal_style: [],
    staff_id: null,
    week: ['一', '二', '三', '四', '五', '六', '日'],
    classList: [{
      coach_staff_id: 44,
      course_detail: {
        id: 2,
        name: "小班课（产后塑形）",
        store_id: 1,
        coach_staff_id: 44,
        support_card_id: "",
        type: 1,
        duration: 60,
        cover_img: "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210408/67f1d8701d4277acebb78e4c0591d6b4.png",
        create_time: "2021-03-24 11:21:40",
        store: {
          address: "三墩镇丰盛九玺12幢8楼",
          admin_id: 1,
          applets_qrcode: "http://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/1e79596878b2320cac26dd792a6c51c9.png",
          area: "330106",
          brand: "瑜伽舍",
          brand_logo: "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210204/2d8de363ade4767f14324273943a1746.png",
          city: "330100",
          create_time: null,
          expire_time: 1646380606,
          facade_img: "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210204/6183af54a5b573d136dd6a4da4099a16.jpg,https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210204/7e73a30e0ea46c397edb10874779b036.jpg,https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210204/c72768d20f61b2c7d491d4ec061fe132.jpg",
          id: 1,
          latitude: "30.3304060",
          longitude: "120.0713650",
          mobile: "",
          name: "杭州瑜伽舍",
          phone: "18858877125",
          province: "330000",
          code: 1,
          synopsis: "云何梵文化艺术有限公司位于美丽的杭州西湖区丰盛九玺，公司从事专业瑜伽教学，花艺，茶道，香道等艺术培训课程，旗下场馆以提供瑜伽课程为主，禅意文化，生活气息，回归身心灵，自然和谐统一，以茶会友。茶禅一味，瑜（与）你分享。",
          update_time: "2021-02-04 15:07:17",
          wechat: "YangLL_is",
          wechat_name: "",
          wechat_qrcode: "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210204/b24e2a7e83ebe0b3aba1224f35a6d00d.png",
          wechat_synopsis: "阿斯顿发送到"
        },
      },

      course_id: 2,
      create_time: "2021-04-08 15:03:54",
      date: "2021-04-14",
      end_time: "09:00",
      id: 49,
      max_user: 5,
      min_user: 1,
      preengage_num: 0,
      sign_msg: 1,
      start_time: "08:00",
      code: 1,
      store_id: 1,
      subscribe: 0,
      update_time: null
    }]
  },
  //获取老师信息
  get_teacher() {
    let url = app.globalData.baseUrl + '/applet/staff',
      that = this;
    let data = {
      method: 'staff.getstaffinfo',
      staff_id: that.data.staff_id
    }
    wx.request({
      url,
      data,
      method: 'POST',
      success: (res) => {
        if(res.data.code == 400){
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }else
        if (res.data.code == 200) {
          let personal_style = res.data.data.personal_style,
            skill = res.data.data.skill_name;
          if (personal_style) {
            personal_style = JSON.parse(personal_style);
          }
          let resume = res.data.data.resume || []
          if(resume.length){
            resume = formatParagraph(filterEOF(res.data.data.resume))
          }
          that.setData({
            teacher: res.data.data,
            personal_style,
            skill,
            resume
          })
        }
      }
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
    let url = app.globalData.baseUrl + '/applet/courseArrange',
      store_id = wx.getStorageSync('store_id'),
      that = this;
    let data = {
      method: 'course.arrange.get',
      date: this.data.checkedDate,
      coach_staff_id: this.data.staff_id,
      store_id,
      course_type_id:this.data.checkedNav + ''
    }
    let header = {},
      token = wx.getStorageSync('token');
    console.log(token)
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
        if(res.data.code == 400){
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }else
        if (res.data.code == 200) {
          let classList = this.btnStatus(res.data.data);
          classList.forEach((item)=>{
            item.isInstartOpen = this.calculatTime(item.curriculum_time * 1000, item.date + ' ' + item.start_time)
            item.isInRealstartOpen = this.calculatTime(item.date + ' ' + item.start_time, item.date + ' ' + item.end_time)
            item.course_stars = "★★★★★☆☆☆☆☆".slice(5 - item.course_detail.difficulty_star, 10 - item.course_detail.difficulty_star);
          })
          that.setData({
            classList,
          })
        } else {
          that.setData({
            classList: [],
          })
        }
      })
    })
  },
  //选择导航
  checkNav(e) {
    let flag = e.currentTarget.dataset.flag;
    this.setData({
      currentNav: flag
    })
  },
  //约课
  handleBooking(e) {
    let token = wx.getStorageSync('token');
    // if (!token) {
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   })
    //   return false
    // }
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let week = this.data.checkedWeek.slice(-1)
    wx.navigateTo({
      url: '/pages/courseBooking/courseBooking?id=' + id + '&date=' + this.data.checkedDate + '&week=' + week + '&checkType=' + type,
    })
  },
  // 获取当前两周日期
  getWeekTime() {
    // let now = new Date('2021-08-31');
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
    let year = now.getFullYear();
    let month = monday.getMonth() + 1;
    let month2 = new Date(SundayTime).getMonth() + 1;
    // console.log(month, month2)
    if (month >= 1 && month <= 9) month = "0" + month;
    if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate;
    let seperator1 = "-";
    // 周一
    let startTime = year + seperator1 + month + seperator1 + strDate,
      // 周天
      endTime = year + seperator1 + month2 + seperator1 + endDate;
    // console.log(startTime)
    this.getWeekArr(startTime);
  },
  //获取两周内的日期数组
  getWeekArr(monday) {
    // console.log(monday)
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
    this.setData({
      date: arr,
      checkedDate,
      checkedWeek
    })
    console.log('checkedWeek',checkedWeek)
    this.get_class();
  },
  //获取n天后日期
  GetDate(currentDate, AddDayCount) {
    var dd = new Date(currentDate);
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    // console.log(dd)
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
    this.setData({
      checkedDate: this.data.date[idx].date,
      checkedWeek: this.data.date[idx].week,
      checkedTeacher: false
    })
    wx.setStorageSync('checkedDate', this.data.date[idx].date)
    wx.setStorageSync('checkedWeek', this.data.date[idx].week)
    if(checkedNav == 4){
      this.getPersonalclass()
      return
    }
    this.get_class();
  },
  //获取今天日期
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
      today: currentdate,
    })
  },
  //课程类型
  getCourseType() {
    let url = app.globalData.baseUrl + api.course,
      store_id = wx.getStorageSync('store_id'),
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
        // this.getCourseList()
      })
    })
  },
  getPersonalclass() {
    let url = app.globalData.baseUrl + api.personalCourse,
      store_id = wx.getStorageSync('store_id'),
      that = this;
    let data = {
      method: 'course.getprivatecoursearrange',
      date: this.data.checkedDate,
      coach_staff_id:that.data.staff_id,
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
        console.log('showData',res)
        /** 展示数据整合处理  */
        let showData = this.formatPersonalData(res)
        // let classList = this.btnStatus(res)
        this.setData({
          showPersonalData:showData,
        })
      })
    })
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
  // 选择课程类型
  switchkNav(e) {
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
  },
  //选择私教老师
  checkTeacher() {
    this.setData({
      checkedTeacher: true
    })
  },
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
    let item = e.currentTarget.dataset.item;
    app.globalData.personalList = item
    app.globalData.personalBookingTime = {}
    wx.navigateTo({
      url: `/pages/courseBooking/courseBooking?id=${item[0].id}&date=${this.data.checkedDate}&week=${this.data.checkedWeek}&checkType=${this.data.checkedNav}&teacherId=${item[0].tid}&courseId=${item[0].cid}&appoint=1`,
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
  previewImg(e){
    const { personal_style } = this.data
    const { url } = e.currentTarget.dataset
    let urls = personal_style.map((item)=>{
      let obj = item
      return obj.url
    })
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls:urls // 需要预览的图片http链接列表
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let staff_id = options.staff_id || 40;
    this.setData({
      staff_id,
      user_type:wx.getStorageSync('user_type') || '',
      show_preengage_member:wx.getStorageSync('show_preengage_member') || 0,
      
    })
    this.get_teacher();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCourseType()
    this.getNowFormatDate();
    this.getWeekTime();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})