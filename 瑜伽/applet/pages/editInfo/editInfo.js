// pages/editInfo/editInfo.js
import { isObjectValueEqual } from '../../utils/common.js'
const app = getApp();
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
    today: 0,
    start_date: '',
    end_date: '',
    showOverlayer:false,
    dateShow:false,
    scaleShow:false,
    age: [],
    ageIdx: 0,
    height: [],
    heightIdx: [0, 0],
    weight: [],
    weightIdx: [0, 0],
    sex: 0,
    user_age:0,
    historyData:{
      height:'',
      weight:'',
      age:'',
      sex:''
    },
    submitData:{
      weight: 30,
      height: 30,
    },
    initWeight: 60,
    styles: {
      line: '#D8D8D8', // 刻度颜色
      bginner: '#ffffff', // 前景色颜色
      bgoutside: '#fffff', // 背景色颜色
      lineSelect: '#A38FFF', // 选中线颜色
      font: '#333333' // 刻度数字颜色
    },
    showType:1,
    scaleSetShow:false
  },
  //获取用户信息
  get_userInfo() {
    var that = this;
    let url = app.globalData.baseUrl + '/applet/user',
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
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else
        if (res.data.code == 200) {
          const { height:lastHeight, weight:lastWeight, age:lastAge, sex:lastSex, birthday } = res.data.data
          let height = this.data.height,
            weight = this.data.weight,
            age = that.data.age;
          for (let i in height[0]) {
            if (height[0][i] == parseInt(lastHeight)) {
              that.setData({
                "heightIdx[0]": i
              })
            }
          }
          let heightDecimal = '.' + lastHeight.toString().split('.')[1] + 'cm';
          for (let i in height[1]) {
            if (height[1][i] == heightDecimal) {
              that.setData({
                "heightIdx[1]": i
              })
            }
          }
          for (let i in weight[0]) {
            if (weight[0][i] == parseInt(lastWeight)) {
              that.setData({
                "weightIdx[0]": i
              })
            }
          }
          let weightDecimal = '.' + lastWeight.toString().split('.')[1] + 'kg';
          for (let i in weight[1]) {
            if (weight[1][i] == weightDecimal) {
              that.setData({
                "weightIdx[1]": i
              })
            }
          }
          for (let j in age) {
            if (age[j] == lastAge) {
              that.setData({
                "ageIdx": j
              })
            }
          }
          const { weightIdx, heightIdx } = that.data
          let historyData = { height:lastHeight, weight:lastWeight, age:lastAge, sex:lastSex, birthday } 
          let submitData = {
            weight:weight[0][weightIdx[0]] + weight[1][weightIdx[1]],
            height:height[0][heightIdx[0]] + height[1][heightIdx[1]]
          }
          this.setData({
            sex: lastSex,
            historyData,
            submitData,
            initWeight:parseFloat(submitData.weight),
            user_age:lastAge,
            currentChecked:birthday
          })
          if(birthday){
            let birth = birthday.split('-')
            this.dateInit(parseInt(birth[0]),parseInt(birth[1]) -1,birth[2]);
          }else{
            this.dateInit();
          }
        }
      }
    })
  },
  //保存信息
  submit() {
    const { historyData, submitData, user_age, sex, currentChecked } = this.data
    let url = app.globalData.baseUrl + '/applet/user',
      that = this;
    let data = {
      // weight: this.data.weight[0][this.data.weightIdx[0]] + Number(this.data.weight[1][this.data.weightIdx[1]].slice(0, -2)),
      // height: this.data.height[0][this.data.heightIdx[0]] + Number(this.data.height[1][this.data.heightIdx[1]].slice(0, -2)),
      weight:parseFloat(submitData.weight),
      height:parseFloat(submitData.height),
      age: user_age,
      sex: sex,
      birthday: currentChecked
    }
    let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
    //数据校验 如果数据相同不提交
    if(isObjectValueEqual(data,historyData)){
      wx.showModal({
        title: '提示',
        content:'数据未做更改,请勿提交',
        showCancel: false,
      })
      return
    }
    data.method = 'user.updateinfo'
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
            title: '修改成功！',
          })
          wx.navigateBack({
            delta: 0,
          })
        }else{
          wx.showModal({
            title: res.data.message,
          })
        }
      })
    })
  },
  //选择性别
  checkSex(e) {
    let sex = e.currentTarget.dataset.sex;
    this.setData({
      sex
    })
  },
  //选择年龄
  bindAgeChange(e) {
    this.setData({
      ageIdx: e.detail.value
    })
  },
  // 选择身高
  bindHeightChange(e) {
    this.setData({
      heightIdx: e.detail.value
    })
  },
  bindHeightcolumnchange(e) {
    if (e.detail.column == 0) {
      this.setData({
        heightIdx: [e.detail.value, 0]
      })
    }
  },
  // 选择体重
  bindWeighChange(e) {
    this.setData({
      weightIdx: e.detail.value
    })
  },
  bindWeighcolumnchange(e) {
    if (e.detail.column == 0) {
      this.setData({
        weightIdx: [e.detail.value, 0]
      })
    }
  },
  //初始化年龄体重和身高数组
  init_height_age() {
    let age = [],
      height = [],
      h1 = [],
      h2 = [],
      weight = [],
      w1 = [],
      w2 = [];
    for (let i = 10; i <= 100; i++) {
      age.push(i)
    }
    for (let j = 0; j <= 200; j++) {
      h1.push(j)
    }
    for (let k = 0; k <= 9; k++) {
      h2.push("." + k + 'cm')
    }
    height = [h1, h2]
    for (let a = 0; a <= 100; a++) {
      w1.push(a)
    }
    for (let b = 0; b <= 9; b++) {
      w2.push("." + b + 'kg')
    }
    weight = [w1, w2]
    this.setData({
      age,
      height,
      weight
    })
  },
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
    console.log('setMonth',setMonth)
    //这里入值月份不做加1处理
    this.dateInit(setYear, setMonth);
  },
  //获取日期数组
  dateInit(setYear, setMonth, setDay) {
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
      currentChecked:`${year}-${month > 9 ? month : '0' + month}-${setDay ? setDay : '01'}`,
      start_date: `${year}-${month > 9 ? month : '0' + month}-${setDay ? setDay : '01'}`,
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
      showOverlayer:false,
      user_age:age || 0
    })
  },
  showDate(){
    this.setData({
      dateShow:true,
      showOverlayer:true,
    })
  },
  toggleScale(e){
    const { submitData } = this.data
    const { type } = e.currentTarget.dataset
    this.setData({
      initWeight:type == 1 ? parseFloat(submitData.weight) : parseFloat(submitData.height),
      showType:type,
      scaleShow:true,
      showOverlayer:true,
    })
    setTimeout(()=>{
      this.setData({
        scaleSetShow:true
      })
    },500)
  },
  //体重 身高
  bindWeight(e) {
    const { showType, submitData } = this.data
    let submit = {
      weight:showType == 1 ? e.detail.value + 'kg' : submitData.weight,
      height:showType == 2 ? e.detail.value + 'cm' : submitData.height
    }
    this.setData({
      submitData:submit,
      // initWeight:e.detail.value
    })
  },
  hideScale(){
    this.setData({
      scaleShow:false,
      showOverlayer:false,
      scaleSetShow:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token');
    this.setData({
      token
    })
    this.init_height_age();
    //拉取用户信息数据 
    this.get_userInfo()
    // this.dateInit();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})