// pages/leave/leave.js
import moment from '../../utils/moment.js'
import { isObjectValueEqual } from '../../utils/common.js'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_card_name:'',
    showOverlayer:false,
    cardInfo: [],//会员卡信息
    leave_recordo:[],//请假记录
    modify_leave:'',//修改请假的数据
    repeal_leave:'',//撤销请假的数据
    leave_rest:'',//请假次数剩余
    new_data:'',//当前日期
    phone_user:'',//用户的头像
    isshow_up:true,
    //我要请假中的数据
    currentNav:0,
    //延卡日期
    day:'',
    //修改后的延卡日期
    update_day:'',
    //模拟会员卡
    // array: ['年卡', '月卡', '次数卡'],
    objectArray: [
      {
        id: 0,
        name: '年卡'
      },
      {
        id: 1,
        name: '月卡'
      },
      {
        id: 2,
        name: '次数卡'
      },
    ],
    index: 0,
    select_card_id:'',
    assets_num_:'',//剩余使用次数
    //
  //初始开始日期
  initialdata:'',
  //初始结束日期
  initialenddata:'',
  //开始日期
  begindate: '',
  //結束日期
  enddate:'',
  //限定结束时间
  limit_enddate:'',
  //修改的初始日期
  update_initialdata:'',
  //修改开始时间
  update_begindate:'',
  //初始限制天数
  init_endates:'',
  //初始最小结束时间
init_enddate:'',
  //修改结束时间
  update_enddate:'',
  limit_update_enddate:'',
//请假原因
textvalue:'',
textvalue_input:'请填写申请请假原因说明，便于我们审核',
//修改请假原因
amend_inputeidt:'',
//修改的修改请假原因
update_amend_inputeidt:'',
// 撤销原因
repeal_inputeidt:"",
// 修改弹窗
show: false,
// 撤销弹框
repeal_show:false,
//请假的图标
lodingimg:['https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/56d97d245355468ab474f497d6c43d3.png','https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/c0d78d2d8b359844c4f8264812498b2.png','https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/4989f8345c7b521f64a73c70c99cf7d.png',],
  //模拟请假记录中的数据
  logarr:[
    // {
    //   id:'0',
    //   img:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/42497afff9507531bb2073502c7f62e.png',
    //   tit:'王老师代提交的请假',
    //   card:'年卡',
    //   submissiontime:'2021-03-02',
    //   starttime:'2021-04-16 15:00',
    //   stoptime:'2021-05-16 15:00',
    //   serial:'0',
    //   status:'审核中',
    //   lodingimg:'../../imgs/warning-icon.png',
    //   true:'../../imgs/success.png',
    //   false:'../../imgs/fail.png'
    // },{
    //   id:'1',
    //   img:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/42497afff9507531bb2073502c7f62e.png',
    //   tit:'王老师代提交的请假',
    //   card:'年卡',
    //   submissiontime:'2021-03-02',
    //   starttime:'2021-04-16 15:00',
    //   stoptime:'2021-05-16 15:00',
    //   status:'审批通过',
    //   serial:'1',
    //   lodingimg:'../../imgs/success.png',
    //   true:'../../imgs/success.png',
    //   false:'../../imgs/fail.png'
    // },
    // {
    //   id:'2',
    //   img:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/42497afff9507531bb2073502c7f62e.png',
    //   tit:'王老师代提交的请假',
    //   card:'年卡',
    //   submissiontime:'2021-03-02',
    //   starttime:'2021-04-16 15:00',
    //   stoptime:'2021-05-16 15:00',
    //   serial:'2',
    //   status:'审批拒绝',
    //   lodingimg:'../../imgs/nav2.png',
    //   true:'../../imgs/success.png',
    //   false:'../../imgs/fail.png'
    // }
  ],
  update_leave_limit_day:1, //修改时的限制天数
  historyData:{},//历史数据用来做重复提交对比
  statusMap:{
    1:{
      name:'审核中',
      cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_leave_waring.png',
    },
    2:{
      name:'审批拒绝',
      cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_leave_refuse.png',
    },
    3:{
      name:'审批通过',
      cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_leave_pass.png',
    },
    4:{
      name:'已撤回',
      cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_leave_pass.png',
    }
  }
  },
  //获取会员卡信息
  get_cardInfo(cardIdx) {
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
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else
        if (res.data.code == 200) {       
          let cardInfoarrlist=res.data.data
          var cardInfoarr = cardInfoarrlist.filter((p)=>{
            return p.status=="1"
          });
          console.log('cardInfoarr',cardInfoarr)
          // console.log(typeof( cardInfoarr.length),'cardInfoarr121111111111');
          for(var i = 0; i<cardInfoarr.length; i++){          
            var obj = cardInfoarr[i];
            if(obj.is_leave_infinite=='1'){
              obj.card_type_name= obj.card_type_name+'(请假次数不限)' ;
              obj.residue_day='不限'
            }else if(obj.leave_limit_num-obj.leave_num<=0){
              obj.card_type_name= obj.card_type_name+'(剩余0次)' ;
              obj.residue_day='0'
            }else{
              obj.card_type_name= obj.card_type_name+'(剩余'+''+(obj.leave_limit_num-obj.leave_num)+'次)' ;
              obj.residue_day=obj.leave_limit_num-obj.leave_num
            }
            
          }

          var timestamp = Date.parse(new Date());
          var now = new Date(timestamp);
          var millSeconds = now.getTime() + res.data.data[cardIdx].leave_limit_day * 24 * 60 * 60 * 1000;
          var rDate = new Date(millSeconds);
          var year = rDate.getFullYear();
          var month = rDate.getMonth() + 1;      
          if (month < 10) month = "0" + month;
          var date = rDate.getDate();
          if (date < 10) date = "0" + date;
           var init_endates = year + "-" + month + "-" + date;
          console.log(year + "-" + month + "-" + date);

          this.setData({
            cardInfo: cardInfoarr,
            select_card_id:res.data.data[cardIdx].id,
            select_card_name:res.data.data[cardIdx].card_type_name,
            assets_num:res.data.data[cardIdx].assets_num,
            init_endates:init_endates,
            enddate:init_endates,
            limit_enddate:init_endates
          })
          this.countday()
          console.log(this.data.cardInfo,res.data.data[0].id,res.data.data[0].assets_num,'111');
          console.log(cardInfoarr.length,'cardInfoarr1111');      

          //如果没有会员卡的时候弹出提示框
          console.log(cardInfoarr.length);
          if(cardInfoarr.length==0){
            wx.showModal({
              title: '暂无可请假的会员卡！',
              success: (res) => {
              if (res.cancel) {
                wx.navigateBack({
                  delta: 0,
                })
              } else if (res.confirm) {
                wx.navigateBack({
                  delta: 0,
                })
               
              }
            }
          })
          }
         
        }
      }
    })
  },
  //获取请假记录
  get_leave_recordo() {
    let url = app.globalData.baseUrl + '/applet/user',
      that = this,
      store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'user.leave_record',
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
          return
        } 
        console.log('res',res)
        if(!res.data || !res.data.data || !res.data.data.length){
          return
        }
        if (res.data.code == 200) {
          let classList = res.data.data;
          var timestamp = Date.parse(new Date());
          var now = new Date(timestamp);
          var millSeconds = now.getTime()
          for(var i = 0; i<classList.length; i++){
            //计算请假结束日期和当前日期的大小
            var obj = classList[i];
            var timestamptwo = Date.parse(obj.leave_end_time);
            var nowtwo = new Date(timestamptwo);
            var millSecondstwo = nowtwo.getTime()
            if(millSeconds-millSecondstwo>0){
              obj.isshow_up= false
            }else{
              obj.isshow_up= true
            }
            //计算请假开始日期和当前日期的大小
            var timestampthe = Date.parse(obj.leave_start_time);
            var nowthe = new Date(timestampthe);
            var millSecondsthe = nowthe.getTime()
            if(millSeconds-millSecondsthe>0){
              obj.isshow_rel= false
            }else{
              obj.isshow_rel= true
            }
        }
          this.setData({
            leave_recordo: classList || []
          })
          console.log(this.data.leave_recordo,'请假记录数据');
        }
        
      }
    })
  },
  //申请
  apply_btn() {
    let that=this
    const { cardInfo } = this.data
    let url = app.globalData.baseUrl + '//applet/user ',
      store_id = wx.getStorageSync('store_id'),
      card_id= that.data.select_card_id.toString();
    let data = {
      method: 'user.leave',
      store_id,
      card_id,
      leave_start_time: that.data.begindate,
      leave_end_time: that.data.enddate,
      leave_cause:that.data.textvalue,
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
            title: '提交成功！',
          })
          let card_idx = cardInfo.findIndex(item => item.id == card_id)
          this.get_cardInfo(card_idx);
          this.get_leave_recordo();
          // this.countday()
        } else {
          wx.showModal({
            title: res.data.message
          })
        }
      })
    })
  },
  //选择会员卡
  bindPickerChange: function (e) {
    this.setData({
      index:  e.detail.value,
      select_card_id:this.data.cardInfo[e.detail.value].id,
      select_card_name:this.data.cardInfo[e.detail.value].card_type_name,
      assets_num:this.data.cardInfo[e.detail.value].assets_num,
      showOverlayer:false
    })
    var timestamp = Date.parse(new Date());
    var now = new Date(timestamp);
    console.log(this.data.cardInfo[e.detail.value].leave_limit_day,'666666');
    var millSeconds = now.getTime() + this.data.cardInfo[e.detail.value].leave_limit_day * 24 * 60 * 60 * 1000;
    var rDate = new Date(millSeconds);
    var year = rDate.getFullYear();
    var month = rDate.getMonth() + 1;      
    if (month < 10) month = "0" + month;
    var date = rDate.getDate();
    if (date < 10) date = "0" + date;
     var init_endates = year + "-" + month + "-" + date;
    this.setData({
      init_endates:init_endates,
      enddate:init_endates,
      limit_enddate:init_endates
    })
    this.countday()
    console.log(init_endates,'7777777');
  },
  //选择开始日期
  bindDateChange: function (e) {
    var index=this.data.index
    this.setData({
      begindate: e.detail.value,
    })
    console.log(this.data.cardInfo[index].leave_limit_day,'33333333333333');
    //计算结束时间
    var date1 = new Date(this.data.begindate);
    var date2 = new Date(this.data.begindate);
    date2.setDate(date1.getDate() + this.data.cardInfo[index].leave_limit_day);
    var initdate=date2.getFullYear() + "-" + (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) + "-" + (date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate());
    this.setData({
      enddate:initdate,
      limit_enddate:initdate
    })
    this.countday()

  },
  //选择結束日期
  bindendDateChange: function (e) {
    this.setData({
      enddate: e.detail.value
    })
    this.countday()
  },
  //选择修改的开始时间
  update_bindDateChange(e){
    const { update_leave_limit_day } = this.data
    this.setData({
      update_begindate: e.detail.value,
    })

    //计算结束时间
    var date1 = new Date(this.data.update_begindate);
    var date2 = new Date( this.data.update_begindate);

    date2.setDate(date1.getDate() + update_leave_limit_day);
    var initdate=date2.getFullYear() + "-" + (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) + "-" + (date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate());

    this.setData({
      update_enddate:initdate,
      limit_update_enddate:initdate
    })
console.log('d',this.data.limit_update_enddate)

    this.update_countday()
  
  },
  //选择修改的結束日期
  update_bindendDateChange: function (e) {
    this.setData({
      update_enddate: e.detail.value
    })
    this.update_countday()
  },
  
  // 更改导航
  checkNav(e) {
    let flag = e.currentTarget.dataset.flag;
    const { currentNav, index } = this.data
    if(currentNav === flag){
      return
    }
    this.setData({
      currentNav: flag
    })
    if(flag === '0'){
      this.get_cardInfo(index)
    }
    if(flag === '1'){
      this.get_leave_recordo()
    }
  },
  //计算延卡时间
  countday(){
 //算两个时间的月份差
 var begin=this.data.begindate.replace(/-/g,'/');
 var end=this.data.enddate.replace(/-/g,'/');
 var timeend = Date.parse(end);
 var timebegin = Date.parse(begin);
 var day=parseInt((timeend-timebegin)/(1000*60*60*24))
 this.setData({
  day:day
 })
  },
  //计算修改后的延卡时间
  update_countday(){
    //算两个时间的月份差
    var up_begin=this.data.update_begindate.replace(/-/g,'/');
    var up_end=this.data.update_enddate.replace(/-/g,'/');
    var up_timeend = Date.parse(up_end);
    var up_timebegin = Date.parse(up_begin);
    var update_day=parseInt((up_timeend-up_timebegin)/(1000*60*60*24))
    this.setData({
      update_day:update_day
    })
     },
  //请假原因
  inputeidt: function (e) {
    let dataset = e.detail.value
    this.setData({
      textvalue:dataset
    })
  },
  //撤销原因
  repeal_inputeidt: function (e) {
    let dataset = e.detail.value
    this.setData({
      repeal_inputeidt:dataset
    })
  },
  //修改原因
  amend_inputeidt: function (e) {
    let dataset = e.detail.value
    this.setData({
      amend_inputeidt:dataset
    })
  },
   //修改的修改原因
   update_amend_inputeidt: function (e) {
    let dataset = e.detail.value
    this.setData({
      update_amend_inputeidt:dataset
    })
  },
  
  //撤销
  repeal(event){ 
    const that = this
    wx.showModal({
      title: '确认要撤销吗',
      success (res) {
        if (res.confirm) {
          that.repeal_getUserInfo()
        }
      }
    })
    that.setData({
      repeal_show: true,
      repeal_leave:event.currentTarget.dataset.listone,
    })
  },
  //提交撤销请假
  repeal_getUserInfo(event) {
    let that =this
      let url = app.globalData.baseUrl + '/applet/user/index ',
      leave_record_id= this.data.repeal_leave.id.toString();
    let data = {
      method: 'user.undo_leave',
      leave_record_id,
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
            title: '撤回成功！',
          })
          that.get_leave_recordo()
         
        } else {
          wx.showModal({
            title: res.data.message
          })
        }
      })
    })
  },
  repeal_onClose() {
    this.setData({ repeal_show: false });
  },

//修改
amend(event){
  const { list } = event.currentTarget.dataset

  const { cardInfo } = this.data
  let filterData = cardInfo.filter(item=>{
    return item.id == list.card_id
  })
  //存贮historyData 做数据重复提交验证
  let historyData = {
    leave_record_id:list.id.toString(),
    leave_start_time:list.leave_start_time,
    leave_end_time:list.leave_end_time,
    leave_cause:list.leave_cause
  }
  this.setData({
    show: true,
    modify_leave:list,
    update_initialdata:list.leave_start_time,
    update_begindate:list.leave_start_time,
    update_enddate:list.leave_end_time,
    update_leave_limit_day:filterData[0].leave_limit_day,
    limit_update_enddate:moment(list.leave_start_time).add(filterData[0].leave_limit_day ,'d').format('YYYY-MM-DD'),
    historyData,
})
this.update_countday()
},
//提交修改
  getUserInfo(event) {
    let that = this
    const { modify_leave, update_begindate, update_enddate, update_amend_inputeidt, historyData } = this.data
    let url = app.globalData.baseUrl + '/applet/user/index ',
    leave_record_id= modify_leave.id.toString(),
    leave_start_time= update_begindate,
    leave_end_time= update_enddate,
    leave_cause= update_amend_inputeidt;
    console.log(this.data.modify_leave.id.toString(),'666666');
    let sData = {
      method: 'user.edit_leave',
    }
    let data = {
      leave_record_id,
      leave_start_time,
      leave_end_time,
      leave_cause
    }

    if(isObjectValueEqual(data,historyData)){
      wx.showModal({
        title:'提示',
        content:'数据未作更改，请勿提交',
        showCancel:false
      })
      return
    }

    data = {...data,...sData}
  
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
          title: '修改成功！',
        })
        // this.get_cardInfo();
        this.get_leave_recordo();
        this.countday()
       
      } else {
        wx.showModal({
          title: res.data.message
        })
      }
    })
  })
  },
  //计算加减年月日
  getNewData(dateTemp, days) {
    var now = new Date(dateTemp);
    var millSeconds = now.getTime() + days * 24 * 60 * 60 * 1000;
    var rDate = new Date(millSeconds);
    var year = rDate.getFullYear();
    var month = rDate.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = rDate.getDate();
    if (date < 10) date = "0" + date;
    this.init_endates = year + "-" + month + "-" + date;
    console.log(year + "-" + month + "-" + date);
  },

  onClose() {
    this.setData({ show: false });
  },
  radioChange(e){
    console.log('e',e)
  },
  handelCardBox(){
    this.setData({
      showOverlayer:!this.data.showOverlayer
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user_type = wx.getStorageSync('user_type');
    if(user_type!==1){
      wx.showModal({
        title: '暂无可请假的会员卡！',
        success: (res) => {
        if (res.cancel) {
          wx.navigateBack({
            delta: 0,
          })
        } else if (res.confirm) {
          wx.navigateBack({
            delta: 0,
          })
         
        }
      }
    })
    return
    }




    let token = wx.getStorageSync('token');
    let userinfo = wx.getStorageSync('userinfo');
    let head_url = userinfo.avatarUrl;
    let phone_user=wx.getStorageSync('userinfo').avatarUrl
    console.log(phone_user,'phone_user44444');
    this.setData({
      head_url,
      token,
      phone_user
    })

    // 获取当前时间
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //获取年份  
  var Y =date.getFullYear();
  //获取月份  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //获取当日日期 
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
  //开始日期
  var presentdata=Y+'-'+M+'-'+D;
  // 结束日期
  var Mt= (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1+1) : date.getMonth() + 1+1);
  var paesentenddata=Y+'-'+Mt+'-'+D
// //计算结束时间
// var date1 = new Date(presentdata);
// var date2 = new Date(presentdata);
// date2.setDate(date1.getDate() + 30);
// var initdate=date2.getFullYear() + "-" + (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) + "-" + (date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate());

let index=this.data.index;
  this.setData({
  begindate:presentdata,
  new_data:presentdata,
  // enddate:initdate,
  initialdata:presentdata,
  // initialenddata:initdate,
  });
    this.get_cardInfo(0);
    this.get_leave_recordo();
    this.countday()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})