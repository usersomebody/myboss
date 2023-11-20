// pages/sign/sign.js
import { accDiv } from '../../utils/common.js'
const app = getApp();
const valueCard=app.globalData.valueCard
const numCard=app.globalData.numCard
const clockCard=app.globalData.clockCard
const timeCard=app.globalData.timeCard
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeCard:timeCard, //期限卡
    numCard:numCard, //次数卡
    valueCard:valueCard,//储值卡
    clockCard:clockCard,//计时卡
    showCover: false,
    id: 0,
    courseInfo: {},
    cardInfo: {},
    isAllow: false,
    template_id: '',
    date:'',
    bindid:'',
    status:'',
    currentChecked:'',
    preengage_record:'',
    user_type:'',
    cardarrList:[],
    tid:''
  },
  //获取预约课程
  // get_class_info() {
  //   let url = app.globalData.baseUrl + '/applet/courseArrange',
  //     that = this,
  //     store_id = wx.getStorageSync('store_id');
  //     console.log(that.data.date,'that.data.date');
  //   let data = {
  //     method: 'course.arrange.get',
  //     store_id,
  //     id: this.data.id,
  //     date:that.data.date
  //   }
  //   let header = {},
  //     token = wx.getStorageSync('token');
  //   if (token) {
  //     header = {
  //       token
  //     }
  //   }
  //   wx.request({
  //     url,
  //     data,
  //     header,
  //     method: 'POST',
  //     success: (res => {
  //       if (res.data.code == 400) {
  //         wx.removeStorageSync('token')
  //       } else
  //       if (res.data.code == 200) {

  //         let preengage_record = res.data.data[0].id;
  //         console.log(preengage_record,'888888888');
  //         this.setData({
  //           preengage_record
  //         })
  //         this.get_cardInfo();
  //       } else {}
  //     })
  //   })
  // },
  //获取课程信息
  get_class(){
    let url = app.globalData.baseUrl + '/applet/courseArrange',
    store_id = wx.getStorageSync('store_id'),
    that = this;
  let data = {
    method: 'course.arrange.get',
    id: that.data.id,
    store_id,
    course_type_id:that.data.tid,
    date:that.data.date
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
        return false
      } else
      if (res.data.code == 200) {
        let courseInfo = res.data.data[0];
        let status =res.data.data[0].status;
        console.log(status,'courseInfo0000000000111111');
        this.setData({
          courseInfo,
          status
        })
        this.get_cardInfo();
      } else {}
    })
  })
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
        } else
        if (res.data.code == 200) {
          console.log(res.data)
          let arr = res.data.data,
            cardInfo;
          for (let item of arr) {
            if (item.card_id == this.data.courseInfo.card_id) {
              cardInfo = item;
            }
          }
          this.setData({
            cardInfo
          })
        } else {

        }
      }
    })
  },
  //签到
  sign() {
    let url = app.globalData.baseUrl + '/applet/user',
      user_id = wx.getStorageSync(
        "user_id"
      ),
      that = this;
    let data = {
      method: 'user.signin',
      course_id: this.data.courseInfo.course_id,
      course_arrange_id: this.data.courseInfo.id,
      preengage_record: this.data.bindid,
      user_id
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
          this.setData({
            showCover: true,
            status:3
          })
          // this.get_class();
          // this.get_class_info();
        } else {
          wx.showModal({
            content: res.data.message
          })
        }
      }
    })
  },
  //关闭弹窗
  closeCover() {
    this.setData({
      showCover: false
    })
  },
  //获取模板消息权限
  get_auth() {
    var that = this;
    let tmplIds = ["E2rHH5-FBdb2fiO2scxrCnaegVpbk6W21q0OZyL8IMc"];
    wx.requestSubscribeMessage({
      tmplIds,
      success(res) {
        console.log(res)
        let arr = [];
        for (let i in tmplIds) {
          if (res[tmplIds[i]] == "accept") {
            arr.push(tmplIds[i]);
          }
        }
        if (arr.length > 0) {
          that.setData({
            template_id: arr.join(',')
          })
        }
        that.setData({
          showCover: false
        })
      },
      fail(res) {
        that.handleSubsribe();
      }
    })
  },
  //获取是否开启订阅开关
  get_subscribe_auth() {
    var that = this,
      arr = [];
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        // console.log(res)
        let subScribe_btn = res.subscriptionsSetting.mainSwitch;
        if (res.subscriptionsSetting.itemSettings) {
          let setting = res.subscriptionsSetting.itemSettings;
          let tmplIds = ["E2rHH5-FBdb2fiO2scxrCnaegVpbk6W21q0OZyL8IMc"];
          for (let i in tmplIds) {
            console.log(setting[tmplIds[i]])
            if (setting[tmplIds[i]] == "accept") {
              arr.push(tmplIds[i]);
            }
          }
          console.log(arr)
          that.setData({
            isAllow: true
          })
        } else {
          that.setData({
            isAllow: false
          })
        }
      },
      fail(res) {
        console.log("调用失败：", res)
      }
    })
  },

  //手动开启订阅
  handleSubsribe() {
    var that = this;
    wx.openSetting({
      success(res) {
        that.get_subscribe_auth();
      }
    })
  },
  //  选择卡片
  checkDate(e) {
    if(this.data.courseInfo.preengage_num<=this.data.courseInfo.max_user){
     const idx = e.currentTarget.dataset.idx;
     const checkCard_id=this.data.cardarrList[idx].id
     this.setData({
       cardList_status:idx,
       checkCard_id
     })
    }
  },
 get_cardInfo() {
  let url = app.globalData.baseUrl + '/applet/user',
    that = this,
    store_id = wx.getStorageSync('store_id'),
    course_id= that.data.courseInfo.course_id
  let data = {
    method: 'user.getcard',
    store_id,
    course_id
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
        var classListlist = res.data.data;
        if(classListlist!==null){
          if(classListlist.length!==0){
            var classList = classListlist.filter((p)=>{
              return p.status=="1"||p.status=='5'
            });
            if(classList.length!==0){              
              for(var i = 0; i<classList.length; i++){
                var obj = classList[i];
                obj.assets_money= accDiv(obj.assets_money,100) ;
                // obj.assets_time = Math.floor(obj.assets_time/60) ;
            }
              this.setData({
                cardarrList:classList,
                checkCard_id:classList[0].id
              })
            }else{
              this.setData({
                reminder_card_null:0,
              })
            }
           
          }
        }
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || 47,
    date = options.date,
    bindid = options.bindid,
    tid = options.tid,
    currentChecked = options.currentChecked;
    
    let token = wx.getStorageSync('token');
    let user_type = wx.getStorageSync('user_type');
    
    this.setData({
      token,
      id,
      date,
      bindid,
      currentChecked,
      user_type,
      tid

    })

    this.get_subscribe_auth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.get_class()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_class();
    // this.get_class_info();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})