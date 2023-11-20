// pages/weighRecord/weighRecord.js
const app = getApp()
import * as echarts from '../../ec-canvas/echarts';
import { accAdd, accSub } from '../../utils/common.js'
let chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var option = {};
  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head_url: '/imgs/head_url.png',
    nickname: '',
    today: '',
    history: [],
    currentWeightInfo: {},
    yData: [],
    ecLine: {
      onInit: initChart
    },
    total: 0,

    redirectToLink:true,//重定向跳转的页面 根据用户当前的体重记录处理
    weekDay:{
      0:'Mon',
      1:'Tue',
      2:'Wed',
      3:'Thu',
      4:'Fri',
      5:'Sat',
      6:'Sun'
    },
    suggest_content:'',
    suggest_cover:'',
    differNum:0,
    MAXWEIGHT:0,
    MINWEIGHT:0,
  },
  //获取月数据
  get_monthData() {
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    let data = {
      method: 'user.weight.getweightbyday',
      start_date: this.data.start_date,
      end_date: this.data.end_date
    }
    let header = {},token=wx.getStorageSync('token');
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
        } else if (res.data.code == 200) {
          that.get_todayWeight();
          let echartData = this.dealEchartData(res.data.data)

          let yData = [],
            xData = [];
          for (let i in echartData) {
              yData.push(echartData[i].weight)
              xData.push(i)
          }
          that.setData({
            total: res.data.data.days
          })
          let option = that.drawLine(xData, yData);
          setTimeout(function () {
            //要延时执行的代码 
            console.log('chart',chart)
            chart.setOption(option);
          }, 300)

        } else {
          // let history = [];
          // for (let i = 0; i <=6; i++) {
          //   history.push({})
          // }
          // that.setData({
          //   history
          // })
        }
        
      }
    })
  },
  //获取历史数据
  get_historyData() {
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    let data = {
      method: 'user.weight.getweightbyday'
    }
    let header = {},token=wx.getStorageSync('token');
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
          let list =  Object.assign({},res.data.data)
          let i = 0
         for(let key in list){
           list[key] = {...list[key]}
           list[key].idx = i
           list[key].day = key.split('-')[2]
           i+=1
         }
          that.setData({
            history:list,
            total: res.data.data.days
          })
        }
      }
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
    let usedMonth = accAdd(month,1);
    let nextMonth = usedMonth > 11 ? 1 : usedMonth;
    let startWeek = new Date(year + '-' + (usedMonth > 9 ? usedMonth : '0' + usedMonth) + '-' + '01').getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (usedMonth > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + "-" + (usedMonth > 9 ? usedMonth : '0' + usedMonth) + "-" + num > 9 ? num : '0' + num,
          dateNum: num,
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    let dateObj = {
      year,
      month:usedMonth > 9 ? usedMonth : '0' + usedMonth,
      day:arrLen - startWeek > 9 ? arrLen - startWeek : '0' + (arrLen - startWeek)
    }
    this.setData({
      startWeek,
      dateArr,
      start_date: `${dateObj.year}-${dateObj.month}-01`,
      end_date: `${dateObj.year}-${dateObj.month}-${dateObj.day}`
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
  //折线图
  drawLine(xData, yData) {
    console.log({xData,yData})
    var option = {
      color: ["#37A2DA", "#21DBC3", "#9FE6B8"],
      renderAsImage: true,
      animationDuration: 1500,
      legend: {
        data: ['日期', '体重'],
        top: 20,
        left: 'center',
        backgroundColor: '#fff',
        z: 100
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          for (let x in params) {
            return "时间:" + params[x].name + "\n" + "体重:" + params[x].data + 'kg';
          }

        }

      },
      xAxis: {
        splitLine: {
          show: false
        },
        type: 'category',
        boundaryGap: true,
        data: xData,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#707070"
          }
        },
        minInterval: 0,
        xAxisIndex: [0],
      },
      yAxis: {
        splitLine: {
          show: false
        },
        type: "value",
        name: "体重(kg)",
        max: Math.max(5, Math.max.apply(null, yData)),
        axisLine: {
          show: true,
          lineStyle: {
            color: "#707070"
          },
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#707070',
            type: 'solid',
          }
        }
      },
      series: [{
        name: '',
        type: 'line',
        smooth: true,
        data: yData,
        itemStyle: {
          normal: {
            color: '#9169FB',
            lineStyle: {
              color: "#9169FB",
              width: 1
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#FFFFFF'
              }, {
                offset: 1,
                color: '#9169FB'
              }]),
            }
          }
        },
      }]
    };
    return option;
  },
  //获取当前体重详情
  get_todayWeight() {
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    let data = {
      method: 'user.weight.getweightrecord'
    }
    let header = {},token=wx.getStorageSync('token');
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
        } else if (res.data.code == 200) {
          console.log('????')
          that.get_historyData();
          that.setData({
            currentWeightInfo: res.data.data
          })
        }
      }
    })
  },
  //获取用户信息
  get_weighInfo() {
    let url = app.globalData.baseUrl + '/applet/user',
      that = this,
      store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'user.getuserinfo',
      store_id
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
        } else if (res.data.code == 200) {
          const { age, sex, height, weight } = res.data.data
          if(age && sex && height && weight){
            that.setData({
              redirectToLink:false
            })
          }
        }
      }
    })
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
    this.setData({
      start_month: startTime,
      end_month: endTime
    })
  },
  //  去记录
  toRecord() {
    wx.navigateTo({
      url: '/pages/record/record',
    })
  },
  //查看体重报告
  lookReport() {
    const { redirectToLink } = this.data
    let url = redirectToLink ? '/pages/editInfo/editInfo' : '/pages/weightReport/weightReport'

    wx.navigateTo({
      url,
    })
  },
  //获取体重报告
  get_report() {
    const { toIndex } = this.data
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    let data = {
      method: 'user.weight.report'
    }
    let header={};
    if (that.data.token) {
      header = {
        token: that.data.token
      }
    }
    wx.request({
      url,
      data,
      header,
      method: 'POST',
      success: (res) => {
        if(res.data.code == 400){
          wx.removeStorageSync('token');
          wx.navigateTo({
            url: `/pages/login/login?toIndex=${toIndex}`,
          })
        }else
        if (res.data.code == 200) {
          let suggest_content = '',
            suggest_cover = '',
            bmiLeft = 0,
            bfpLeft = 0,
            sex = res.data.data.sex,
            bmi = Number(res.data.data.bmi),
            bfp = Number(res.data.data.body_fat);
          switch (true) {
            case (bmi <= 18.4):
              bmiLeft = (78 / 18.4) * bmi;
              suggest_content = '偏瘦';
              suggest_cover = 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210902/5ab38430aed6e47731542963bba45b8a.png'
              break;
            case (bmi >= 18.5 && bmi <= 24):
              bmiLeft = 78 + ((bmi - 18.5) / 5.4) * 165;
              suggest_content = '正常';
              suggest_cover = 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210902/95130ff8766fac8c6658e87ee8e1b640.png'
              break;
            case (bmi > 24.0 && bmi <= 28):
              bmiLeft = 78 + ((bmi - 18.5) / 9.4) * 330;
              suggest_content = '过重';
              suggest_cover = 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210902/5296ae743695d43e95f16832bc3e0ae8.png'
              break;
            case (bmi > 28.0):
              suggest_content = '肥胖';
              suggest_cover = 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210902/5296ae743695d43e95f16832bc3e0ae8.png'
              bmiLeft = 600;
              break;
          }

          that.setData({
            report: res.data.data,
            suggest_content,
            suggest_cover,
            bmiLeft: parseInt(bmiLeft),
            differNum:Math.abs(accSub(res.data.data.best_weight,res.data.data.weight))
          })
        }
      }
    })
  },
  //echartDATA处理
  dealEchartData(data){
    const { today } = this.data
    let showData = []
    let list = []
    //过滤有效值
    for(let i in data){
      if(data[i].weight){ 
        list.push(data[i])
      }
    }
    //取最大最小值
    let Max_Min = list.sort((current,next)=>{
      return accSub(current.weight, next.weight)
    })

    console.log('Max_Min',Max_Min)
    let MAX = Max_Min[Max_Min.length-1]
    let MIN = Max_Min[0]

    this.setData({
      MAXWEIGHT:MAX,
      MINWEIGHT:MIN
    })
    //取当前日期的值
    let currentVal = list.filter(item=>{
      return item.date == today
    })
    showData = [...[MIN],...currentVal,...[MAX]]
    let Max_Min_Time = showData.sort((current,next)=>{
      return accSub(current['max(timeline)'],next['max(timeline)'])
    })
    console.log('Max_Min_Time',Max_Min_Time)
    let ECHARTDATA = this.toObj(Max_Min_Time)
    return ECHARTDATA
  },
  //转对象
  toObj(data){
    let info = {}
    data.forEach((item)=>{
      info[item.date] = item
    })
    return info
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userinfo = wx.getStorageSync('userinfo');
    let head_url = userinfo.avatarUrl,
      nickname = userinfo.nickName;
    let token = wx.getStorageSync('token');
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    month = month < 10 ? ('0' + month) : month;
    day = day < 10 ? ('0' + day) : day;
    this.setData({
      head_url,
      nickname,
      token,
      today: '' + year + "-" + month + "-" + day,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.dateInit();
    this.get_weighInfo()
    this.get_report()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})