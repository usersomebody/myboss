// pages/mycard/mycard.js
import { accDiv } from '../../utils/common.js'
import moment from '../../utils/moment.js'
const app = getApp()
const valueCard=app.globalData.valueCard
const numCard=app.globalData.numCard
const clockCard=app.globalData.clockCard
const timeCard=app.globalData.timeCard
const unit = 100 //价格单位
// type 类型 1 约课 2 排队 3 取消约课 4 排队失败 5 开课失败 6 续卡 7 延卡 8 赠卡 9 扣卡 10 恢复停卡 11发卡
const statusMap = {
  1:{
    type:1,
    name:'约课'
  },
  2:{
    type:1,
    name:'排队'
  },
  3:{
    type:1,
    name:'取消约课'
  },
  4:{
    type:1,
    name:'排队失败'
  },
  5:{
    type:1,
    name:'开课失败'
  },
  6:{
    type:2,
    name:'续卡'
  },
  7:{
    type:2,
    name:'延卡'
  },
  8:{
    type:2,
    name:'赠卡'
  },
  9:{
    type:2,
    name:'扣卡'
  },
  10:{
    type:2,
    name:'恢复停卡'
  },
  11:{
    type:2,
    name:'发卡'
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusMap,
    statusBarHeight:0,
    // selectDate:'',//选择日期
    showYear:'',
    showDay:'',
    card_status:'',//卡的状态
    checkCard_id:'',//选择卡的ID
    select_data:'',//选择的日期
    timeCard:timeCard, //期限卡
    numCard:numCard, //次数卡
    valueCard:valueCard,//储值卡
    clockCard:clockCard,//计时卡
    cardarrList_length:'',//会员卡的数量
    consumption_record:'',//消费记录
    card_is_leave:'',
    set_card_id:'',
    avatarUrl:'',
    cardarrList:[
    ],
    recordList:{
      subscribe:'10',
      sign:'5',
      abolish:'5',
    },
    expenseList:'',
    
    //卡显示的类型已经对应的单位
    cardTypeInfo:{
      1:{
        name:'剩余天数:',
        key:'remain_days',
        symbol:'天'
      },
      2:{
        name:'剩余次数:',
        key:'assets_num',
        symbol:'次'
      },
      3:{
        name:'剩余金额:',
        key:'assets_money',
        symbol:'元'
      },
      4:{
        name:'剩余时间:',
        key:'assets_time',
        symbol:'分钟'
      }
    },
    cardType:{
      1:timeCard,
      2:numCard,
      3:valueCard,
      4:clockCard
    },
    // swiper
    swiper:{
      indicatorDots: false,
      left:'40rpx',
      margin:'40rpx'
    },
    card_type:'',
    page:1,
    count:100
  },
//滑动会员卡事件
sliding_choice(e){
  const { cardarrList } = this.data
  const { current } = e.detail
  this.setData({
    checkCard_id:cardarrList[current].id,
    card_status:cardarrList[current].status,
    card_is_leave:cardarrList[current].is_leave,
    card_type:cardarrList[current].type,
  })
  this.get_expense(1)
},
//跳转到约课页面
go_classappmont(){
  wx.switchTab({
    url: '/pages/classAppointment/classAppointment',
  })
},

  changedate: function (e) {
    let date= e.detail.value
    let year=date.split('-')[0]
    let day=date.split('-')[1]

    this.setData({
      // selectDate: e.detail.value,
      showYear:year,
      showDay:day,
      select_data:date
    })
  
    this.get_expense(1) 
    
  },
  //获取会员卡信息
  get_cardInfo() {
    let url = app.globalData.baseUrl + '/applet/user',
      that = this,
      store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'user.getcard',
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
          let classList = res.data.data;
          classList = that.dealRenderCardList(classList)
          that.setData({
            cardarrList:classList,
            checkCard_id:classList[0].id,
            card_type:classList[0].type,
            cardarrList_length:classList.length,
          })
        } 
        that.get_expense()
      }
    })
  },
  //获取消费记录
  get_expense(first) {
    let that=this
    const { page, count } = this.data
    let url = app.globalData.baseUrl + '/index.php/applet/user/index',
      card_id = that.data.checkCard_id,
      date=that.data.select_data
    let data = {
      method: 'user.consumption_record',
      card_id,
      date,
      page,
      size:count
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
          let expenseList = res.data.data;
          let classList = that.dealPayList(expenseList.consumption_record);
          that.setData({
            consumption_record:classList,
            expenseList:expenseList,
          })
          if(!first){
            that.filterCardInfo()
          }
        } 
      }
    })
  },

  //初始化当前卡的信息
  filterCardInfo(){
    const { consumption_record, cardarrList } = this.data 
    //无约课记录取数组第一项
    if(!consumption_record.length){
      this.setData({
        card_status:cardarrList[0].status
      })
      return
    }
    const { user_card_id } = consumption_record[0]
    let cardInfo = cardarrList.filter((item)=>{
      return item.id === user_card_id
    })
    this.setData({
      card_status:cardInfo[0].status
    })
  },
  //处理卡的展示数据
  dealRenderCardList(list){
    let statusObj = {
      1:'正常',
      2:'请假',
      4:'已失效',
      5:'未开卡'
    }
    let statusList = [1,2,4,5]
    let leaveObj = {
      0: '停卡',
      1: '请假中'
    }
    list.forEach(item => {
      item.cardStatusName = ''
      item.assets_money = accDiv(item.assets_money, unit); //价格相除 精度计算 ps:js计算精度不准确
      if (statusList.indexOf(item.status) > -1) {
        item.cardStatusName = statusObj[item.status]
      } else {
        item.cardStatusName = leaveObj[item.is_leave]
      }
    });
    return list
  },
  //处理卡消费记录列表展示数据
  dealPayList(list){
    //显示相应的符号  后台本身返回一个字段就可以了 应该处理一次的
    let symbol = [
      {
        key:'-',
        value:[1,2,9]
      },
      {
        key:'+',
        value:[3,4,5,6,7,8,10,11]
      }
    ]
    //显示相应的值  后台本身返回一个字段就可以了 应该处理一次的
    let timesType = {
      1:{
        key:'days',
        remain:'',
        symbol:'天'
      }, 2:{
        key:'times',
        remain:'assets_num',
        symbol:'次'
      }, 3:{
        key:'amount',
        remain:'assets_money',
        symbol:'元'
      }, 4:{
        key:'time',
        remain:'assets_time',
        symbol:'分钟'
      }
    }
    list.forEach((item)=>{
      let date = new Date(item.create_time * 1000)
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let amount = accDiv(item.amount, unit); //价格相除 精度计算 ps:js计算精度不准确
      let isInToday = this.timeIsBetween(item.create_time)
      item.create_time = isInToday ? `今天 ${hours}:${minutes < 10 ? '0' + minutes : minutes}` : moment(date).format('YYYY-MM-DD HH:MM')
      //这里后面再换个方法 现在这个不太好 
      item.render_symbol = '-'
      let symbolValue = symbol.some((s)=>{
      let obj = s.value.indexOf(item.type) > -1 && s.key
        item.render_symbol = obj
        return obj
      })
      let renderTimeTypeKey = item.card_type == 3 ? amount : item[timesType[item.card_type].key]  //直接数据层面更改 影响视图
      let renderTimeTypeValue = timesType[item.card_type].symbol//直接数据层面更改 影响视图
      let renderTimeTypeRemainKey = item[timesType[item.card_type].remain] && item.card_type == 3 ? accDiv(item[timesType[item.card_type].remain], unit) : item[timesType[item.card_type].remain] || 0
      
      item.render_time_type = `${renderTimeTypeKey}${renderTimeTypeValue}`
      item.render_time_remain_type = renderTimeTypeRemainKey ? `${renderTimeTypeRemainKey}${renderTimeTypeValue}` : ''
    })
    return list
  },
  //计算创建时间是否在当前时间的一天内
  timeIsBetween(now){
    let start = moment().startOf('day').format('x')
    let end = moment().endOf('day').format('x')
    let current = moment(now).format('x') * 1000
    return current > start && current < end
  },
  back(){
    let url = getCurrentPages().length
    if(url == 1){
        wx.switchTab({
            url:'/pages/my/my'
        })
        return
    }
    wx.navigateBack({
        delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // 获取当前时间
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y =date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //  //获取当日日期 
    //  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    //开始日期
    //  var presentdata=Y+'-'+M;

    let avatarUrl = wx.getStorageSync('userinfo').avatarUrl;

    this.setData({
      // selectDate: presentdata
      showYear:Y,
      showDay:M,
      select_data:Y+'-'+M,
      avatarUrl,
      statusBarHeight:app.globalData.statusBarHeight,
    })
    this.get_cardInfo();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})