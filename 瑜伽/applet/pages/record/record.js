// pages/record/record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    week: ['日', '一', '二', '三', '四', '五', '六'],
    year: 0,
    month: 0,
    dateArr: [],
    startWeek: 0,
    currentChecked: 0,
    isTodayWeek: false,
    todayIndex: 0,
    today: 0,
    start_date: '',
    end_date: '',
    dayData: [],
    nodata: false,
    showCover: false,
    weight: 30,
    initWeight: 60,
    styles: {
      line: '#D8D8D8', // 刻度颜色
      bginner: '#ffffff', // 前景色颜色
      bgoutside: '#fffff', // 背景色颜色
      lineSelect: '#A38FFF', // 选中线颜色
      font: '#333333' // 刻度数字颜色
    }
  },
  //获取某一天数据
  get_dayData() {
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    let data = {
      method: 'user.getweight',
      date: this.data.currentChecked
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
      success: (res) => {
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
        } else
        if (res.data.code == 200) {
          this.setData({
            nodata: false,
            dayData: res.data.data,
            initWeight:res.data.data[0].weight
          })
        } else {
          this.setData({
            nodata: true
          })
        }
      }
    })
  },
  //获取本月数据
  get_monthData() {
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    let data = {
      method: 'user.weight.getweightbyday',
      start_date: this.data.start_date,
      end_date: this.data.end_date
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
      success: (res) => {
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else
        if (res.data.code == 200) {
          this.get_dayData();
          let arr = [];
          for (let i in res.data.data) {
            arr.push(res.data.data[i]);
          }
          let dateArr = this.data.dateArr,
            startWeek = Number(this.data.startWeek);
          for (let i in arr) {
            if (arr[i].weight) {
              dateArr[Number(i) + startWeek].weight = arr[i].weight;
            }
          }
          this.setData({
            dateArr
          })
        }
      }
    })
  },
  //选择日期
  checkDay(e) {
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      currentChecked: this.data.dateArr[idx].isToday
    })
    this.get_dayData();
  },
  //体重
  bindWeight(e) {
    this.setData({
      weight: e.detail.value
    })
  },
  // 点击记录
  handleRecord() {
    if (this.data.currentChecked == this.data.today) {
      this.setData({
        showCover: true
      })
    } else {
      wx.showModal({
        content: "只能记录当天体重信息哦~"
      })
    }
  },
  //确定记录
  handleConfirm() {
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    let data = {
      method: 'user.weight.insert',
      weight: this.data.weight
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
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else
        if (res.data.code == 200) {
          wx.showToast({
            title: '记录成功！',
          })
          this.get_dayData();
          this.get_monthData();
          this.setData({
            showCover: false
          })
        }
      })
    })
  },
  //取消记录
  handleCancel() {
    this.setData({
      showCover: false
    })
  },
  //获取日期数组
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }

    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + "-" + (month + 1) + "-" + num,
          dateNum: num,
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      startWeek,
      dateArr,
      start_date: '' + year + "-" + (month + 1) + "-" + 1,
      end_date: '' + year + "-" + (month + 1) + "-" + (arrLen - startWeek),
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
    this.get_monthData();
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
    //   获取当前一周日期
    getWeekTime() {
      let now = new Date();
      let nowTime = now.getTime();
      let day = now.getDay();
      let oneDayLong = 24 * 60 * 60 * 1000;
      let MondayTime = nowTime - (day - 1) * oneDayLong;
      let SundayTime = nowTime + (7 - day) * oneDayLong;
      let monday = new Date(MondayTime);
      let strDate = monday.getDate();
      let sunday = new Date(SundayTime);
      let endDate = sunday.getDate();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      if (month >= 1 && month <= 9) month = "0" + month;
      if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate;
      let seperator1 = "-";
      // 周一
      let startTime = year + seperator1 + month + seperator1 + strDate,
        // 周天
        endTime = year + seperator1 + month + seperator1 + endDate;
      this.getWeekArr(startTime);
      this.setData({
        startTime: startTime,
        endTime: endTime
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token');
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.setData({
      year: year,
      month: month,
      token,
      today: '' + year + "-" + month + "-" + now.getDate(),
      currentChecked: '' + year + "-" + month + "-" + now.getDate()
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.dateInit();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})