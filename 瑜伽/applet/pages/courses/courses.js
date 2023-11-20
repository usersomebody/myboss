// pages/courses/courses.js
import { api } from '../../utils/api.js'
import { setStoreId } from '../../utils/common.js'
import moment from '../../utils/moment.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_type:3,
    nav: [
      {
        name: '排队中',
        id: 7,
        noData:'暂无排队~'
      },
      {
      name: '已预约',
      id: 1,
      noData:'暂无约课~'
    }, {
      name: '待上课',
      id: 5,
      noData:'暂无约课~'
    }, {
      name: '已完成',
      id: 3,
      noData:'暂无完成~'
    }, {
      name: '已取消',
      id: 2,
      noData:'暂无取消~'
    }, {
      name: '已旷课',
      id: 4,
      noData:'暂无旷课~'
    }],
    currentChecked: 0,
    isAllow: false,
    iPhonex: false,
    show_preengage_member:0,//全局配置决定是否可以查看预约人数
    

    // 所有店铺列表
    storeList:[],
    storeObj:{},
    loaded:true
  },
  //登录
  getUserInfo: function (e) {
    wx.navigateTo({
      url: '/pages/login/login?isshow=1'
    })
    // app.onLogin(res => {
    //   wx.setStorageSync("user_type", res.user_type)
    //   if(res.user_type!==3){
    //     wx.showModal({
    //       title: '登录成功！',
    //       showCancel:false,
    //       success: (res) => {
    //         this.get_auth();
    //     }
    //   })
    // }else if(res.user_type==3){
    //   wx.navigateTo({
    //     url: '/pages/login/login?isshow=1'
    //   })
    // }
    //   this.setData({
    //     openid: res.openid,
    //     unionid: res.unionid,
    //     isLogin: true
    //   })
    //   wx.hideLoading()    
    //   //初次进入未登录状态重新拉取列表数据
    //   this.get_class()
    // });

  },
  //获取预约课程
  get_class() {
    const { storeObj } = this.data
    let weekDay = {
      0:'日',
      1:'一',
      2:'二',
      3:'三',
      4:'四',
      5:'五',
      6:'六',
    }
    let url = app.globalData.baseUrl + '/applet/user',
      store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'user.getpreengagerecord',
      status: this.data.nav[this.data.currentChecked].id,
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
      success: (res => {
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
        } else
        if (res.data.code == 200) {
          let classList = res.data.data;
          classList.forEach(item => {
            let date = moment(item.curriculum_time * 1000).format('YYYY-MM-DD')
            let week = moment(item.course_arrangee.start_time).day()
            // if(item.course_type_id == 4){
              let start = moment(moment(item.curriculum_time * 1000).format('HH:mm'),"HH:mm"); 
              let bookstart = start.format('HH:mm')
              let bookend = start.clone().add(item.course.duration, "minutes").format("HH:mm")
              item.bookstart = date + ' ' + bookstart
              item.bookend = bookend
            // }
            item.week = weekDay[week]
            // item.show_book_time = item

            item.is_show_comment = storeObj[item.store_id] ? storeObj[item.store_id] : 0
          });
          wx.hideLoading()
          this.setData({
            classList,
            nodata: false,
            loaded:true
          })
        } else {
          wx.hideLoading()
          this.setData({
            classList: [],
            nodata: true,
            loaded:true
          })
        }
      })
    })

  },
  // 取消预约
  handleCancel(e) {
    const { type, id, uid, storeid, editcheck } = e.currentTarget.dataset
    if(editcheck == '-1'){
      return
    }
    if(type == 4){
      let url = app.globalData.baseUrl + api.personalCourse
      let data = {
        method:'course.cancelprivatepreengage',
        store_id: storeid,
        user_id:uid,
        preengage_record: id,
      }
      let header = {},
      token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
      this.canclePersonalBooking(url,data,header)
      return 
    }
    this.get_auth();
    wx.showModal({
      content: "取消后，将不能再预约本节课程，请谨慎操作，确认取消？",
      showCancel:true,
      success: (res) => {
        let url = app.globalData.baseUrl + '/applet/user';
        let data = {
          method: 'user.cancelpreengage',
          preengage_record: id,
          store_id:storeid
        }
        let header = {},
          token = wx.getStorageSync('token');
        if (token) {
          header = {
            token
          }
        }
        if (res.confirm) {
          //私教取消
          // if(type == 4){
          //   url = app.globalData.baseUrl + api.personalCourse
          //   data = {
          //     method:'course.cancelprivatepreengage',
          //     store_id: store_id,
          //     user_id:uid,
          //     preengage_record: id,
          //   }
          //   this.canclePersonalBooking(url,data,header)
          //   return 
          // }
          
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
                wx.showToast({
                  title: '取消成功！',
                })
                this.get_class();
              } else {
                wx.showModal({
                  content: res.data.message,
                })
              }
            })
          })
        } else if (res.cancel) {

        }
      }
    })

  },
  canclePersonalBooking(url,data,header){
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
          wx.showToast({
            title: '取消成功！',
          })
          this.get_class();
        } else {
          wx.showModal({
            content: res.data.message,
          })
        }
      }),
      fail(){
        wx.hideLoading()
        that.setData({
          disbale:false
        })
      },
    })
  },
  //切换课程状态
  checkNav(e) {
    const { loaded } = this.data
    if(!loaded){
      return
    }
    const idx = e.currentTarget.dataset.idx;
    this.setData({
      currentChecked: idx,
      loaded:false,
      classList:[]
    })
    wx.showLoading({title:'加载中',icon:'none'})
    this.get_class();
  },
  // 去签到
  handleSign(e) {
    const { id,date,bindid,tid,week,start,end,teacherid,courseid,storeid, evaluate, editcheck} = e.currentTarget.dataset
    // if(editcheck == '-1'){
    //   return
    // }
    console.log('e',e)
    let checkData = moment(start).format('YYYY-MM-DD')
    wx.setStorageSync('checkedDate', checkData)
    wx.setStorageSync('classTime',start)
    app.globalData.personalBookingTime = {
      start,
      end,
    }
    wx.navigateTo({
      url: `/pages/courseBooking/courseBooking?id=${id}&bindid=${bindid}&date=${checkData}&week=${week}&checkType=${tid}&currentChecked=${this.data.currentChecked}&teacherId=${teacherid}&courseId=${courseid}&store_id=${storeid}&evaluate=${evaluate ? evaluate : ''}&editCheck=${editcheck}`,
    })
    // wx.navigateTo({
    //   url: '/pages/sign/sign?id=' + id+ '&date=' +date+ '&bindid=' +bindid+ '&currentChecked=' +this.data.currentChecked+'&tid='+tid,
    // })
  },
  //获取模板消息权限
  get_auth() {
    var that = this;
    if (!that.data.isAllow) {
      that.handleSubsribe();
      return false
    }
    let tmplIds = ["qFXMY6jKTYwmPfquGNEfBEGzXcWqx6oA-rP-PhT3b1M", "nAMeeKhvSeAkZetHQ6JFAT_yGgTMnAMS8WpoOdHKMkY", "dtZtnqvHCwHgczNRHPu8Z24wXUfF67RfKPaDuw96hwA"];
    wx.requestSubscribeMessage({
      tmplIds,
      success(res) {
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
          is_success: false
        })
      },
      fail(res) {
        console.log(res)

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
        let isAllow = res.subscriptionsSetting.mainSwitch;
        that.setData({
          isAllow
        })
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

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.store_id){
      setStoreId(options.store_id)
      
    }
    this.setData({
      currentChecked:options.status || wx.getStorageSync('currentChecked') || 0
    
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let token = wx.getStorageSync('token');
    this.setData({
      token,
      isLogin: token ? true : false,
      iPhonex:app.globalData.isIphoneX || false,
      storeObj:wx.getStorageSync('allStore')
    })
    // if (!isLogin) {
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   })
    //   return false
    // }
    this.get_subscribe_auth();
    this.get_class();
    this.setData({
      show_preengage_member:wx.getStorageSync('show_preengage_member'),
      user_type:wx.getStorageSync('user_type')
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let store_id = wx.getStorageSync('store_id')
    return {
      title: '',
      path: `/pages/courses/courses?store_id=${store_id}`,
      imageUrl: ''
    }
  }
})