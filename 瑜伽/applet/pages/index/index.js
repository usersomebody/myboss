//index.js
//获取应用实例
import Poster from '../../palette/poster';
import {request} from '../../utils/util.js';
import {accDiv,setStoreId, weekDayOfWeek} from '../../utils/common.js';
import { api } from '../../utils/api.js'
import moment from '../../utils/moment.js'
const app = getApp()
const { information, announce  } = api
const { baseUrl } = app.globalData
Page({
  data: {
    tabList:[{
      id:1,
      name:'头条资讯'
    },{
      id:2,
      name:'店铺公告'
    }],
    tabId:1,
    swiper:{
      autoplay:true,
      interval:6000,
      duration:500,
      circular:true
    },
    swiperData:[
      {
        type:2,
        cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220124/a1495457faa95447e165e71dabdfdf5a.png'
      },
      // {
      //   type:1,
      //   cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210914/f71e53b667f90802b9bacde3afee876e.png'
      // }
    ],
    brand_logo:'',
    showCover: false,
    rank: 1,
    myInfo: {},
    coverList: [],
    store_id: '',
    statusBarHeight: app.globalData.statusBarHeight,
    noLogin: true,
    haveLocation: false,
    teacher: [],
    student: [],
    template: {},
    userInfo: {},
    showPoster: false,
    year: '',
    month: '',
    monthEnglish: '',
    day: '',
    poster: 'http://tmp/COcZ4nhxcGCCceea5c515fcbcaed11fcf91f5091d015.png',
    noclass: true,
    classInfo: {},
    token: null,
    list:[],
    activityType:[
      {
          id:0,
          name:'全部活动',
          url:'',
          secondaryUrl:''
      },
      {
          id:24,
          name:'幸运转盘',
          url:'/pages/activity/lucky',
          secondaryUrl:''
      },
      {
          id:21,
          name:'助力登顶',
          url:'/pages/invit/index',
          secondaryUrl:''
      },
      {
          id:22,
          name:'限时秒杀',
          url:'/pages/activity/secondsKill',
          secondaryUrl:''
      },
      {
          id:23,
          name:'超值拼团',
          url:'/pages/activity/group',
          secondaryUrl:''
      }
    ],
    btnText:{
      1:'立即参与',
      21:'立即参与',
      22:'立即抢购',
      4:'超值拼团'
    },
    signText:{
      21:'助力登顶',
      22:'限时秒杀',
      23:'超值拼团',
      24:'幸运抽奖'
    },
    activityData:{},
    timeShow:false,
    isShareIn:false,
    storeNav:[{
      id:1,
      name:'签到',
      cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_index_sign.png',
      url:"/pages/courses/courses"
    },{
      id:2,
      name:'约课',
      cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_index_course.png',
      url:"/pages/classAppointment/classAppointment"
    },{
      id:3,
      name:'会员卡',
      cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_index_vip.png',
      url:"/pages/mycard/mycard"
    },{
      id:4,
      name:'活动',
      cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_index_act.png',
      url:"/pages/activity/index"
    }],
    iPhonex: false,
    
    infoList:[],
    coverInfo:{},
    showScreenCover:false,
    shareTips:true,
    firstCount:20,
    announce:[],
    statusMap:{
      1:{
          name:'已定时',
          color:'#FA9552'
      },
      2:{
          name:'已推送',
          color:'#9B77F4'
      }
    },
    announceList:[{
      id:1,
      title:'12',
      content:'本周日，两节课，由印度老师来代课，给伽人们的福利哦，祝大家玩的愉快！'
    }],
    showAnn:false,
    showCommentModel:false,
    showShadowlayer:false,
    commentModel:{}
  },
  //截取字符串
  formatStr(str) {
    if(str&&str.length>1){
      return str.substring(0,1) + new Array(str.length).join('*')
    }else{
      return "*"
    }
  },

// 测试登录
test_login(){
  wx.navigateTo({
    url: '/pages/login/login',
  })
},


  //关闭海报
  closePoster() {
    this.setData({
      showPoster: false
    })
  },
  //生成海报
  get_poster() {
    wx.showLoading({
      title: '正在努力生成中',
    })
    let nickname, head_img;
    if (this.data.myInfo) {
      nickname = this.data.myInfo.nickname
      head_img = this.data.myInfo.head_img
    } else {
      nickname = this.data.userInfo.nickname
      head_img = this.data.userInfo.head_img
    }

    let params = {
      year: this.data.year,
      month: this.data.monthEnglish,
      day: this.data.day,
      nickname,
      head_img,
      rank: this.data.rank,
      times: this.data.myInfo.times
    };
    this.setData({
      template: new Poster().palette(params),
      showCover: false,
    });
  },
  //海报生成成功
  onImgOK(e) {
    wx.hideLoading()
    this.setData({
      poster: e.detail.path,
      showPoster: true
    })
  },
  //查看老师
  lookTeacher(e) {
    const { empty, id } = e.currentTarget.dataset
    if(empty){
      return
    }
    wx.navigateTo({
      url: '/pages/teacher/teacher?staff_id=' + id,
    })
  },

  //获取是否授权
  get_auth() {
    
    var that = this;
    let store_id = wx.getStorageSync('store_id');

    if (store_id) {
      that.setData({
        store_id
      })
      this.get_store();
      return false
    }
    wx.getSetting({
      success(res) { 
        if (res.authSetting['scope.userLocation']) {
          that.setData({
            haveLocation: true
          })
          that.getLocation();
        } else {
          // return false
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                // wx.navigateTo({
                //   url: '/pages/address/address',
                // })
                that.get_store()
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      that.setData({
                        haveLocation: true
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                      // wx.navigateTo({
                      //   url: '/pages/address/address',
                      // })
                    }
                  }
                })
              }
            }
          })
        }
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      },
      fail: (res => {
        that.get_store()
        // wx.navigateTo({
        //   url: '/pages/address/address',
        // })
      })
    })
  },
   // 转对象
   toObj(data){
    const info = {}
    data.forEach((item)=>{
      info[item.id] = item.config ? item.config.is_open_comment : ''
    })
    return info
  },
  //门店列表
  get_store(latitude, longitude) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let url = app.globalData.baseUrl + '/applet/store',
      that = this;
    let data = {
      method: 'store.getlist',
    }
    let store_id = Number(wx.getStorageSync('store_id'))
    if (wx.getStorageSync('token')) {
      data.token = wx.getStorageSync('token');
    }else if(store_id){
      data.store_id = store_id
    }else{
      data.latitude = wx.getStorageSync('latitude')
      data.longitude =wx.getStorageSync('longitude')
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
        console.log('res___',res)
        const { data, code } = res.data
        wx.hideLoading()
        if (code == 400) {
          wx.removeStorageSync('token')
          this.get_store();
        } else
        if (code == 200) {
          console.log('data_____________',data)
          let allStoreComment = that.toObj(data)
          wx.setStorageSync('allStore', allStoreComment)
          let store_info = data.filter(function (store) {
            return store.id == wx.getStorageSync('store_id');
          });
          let store_name = ''
          let store_cover = ''
          let store_logo = ''
          let coverList = []
          if(store_info.length){
            store_name = store_info[0].name;
            store_cover = store_info[0].facade_img;
            store_logo = store_info[0].brand_logo;
            store_id = wx.getStorageSync('store_id')
            //本地存储后台配置项字段
            wx.setStorageSync('show_preengage_member',store_info[0].config ? store_info[0].config.is_show_course_to_member : 0)
          }else{
            store_name = data[0].name;
            store_cover = data[0].facade_img;
            store_id = data[0].id
            store_logo = data[0].brand_logo;
            wx.setStorageSync('store_id', data[0].id)
            wx.setStorageSync('show_preengage_member',data[0].config ? data[0].config.is_show_course_to_member : 0)
          }
          
          if (store_cover) {
            coverList = store_cover.split(',');
          }

          that.setData({
            store_id:store_id,         
            store_name: store_name,
            brand_logo: store_logo,
            coverList
          })
         
          app.globalData.store_name = store_name || '瑜伽舍'
          console.log('store_id',wx.getStorageSync('store_id'))
          that.get_info();
          that.get_student();
          that.get_teacher();
          that.get_record_class();
          that.getHotActivity()
          that.getList()
          that.getAnnounceList()
          that.getNoticeAnnounceList()
        }
      }
    })
  },
  //获取定位
  getLocation() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        wx.setStorageSync('latitude', latitude);
        wx.setStorageSync('longitude', longitude);
        that.get_store(latitude, longitude)
      },
      fail: (res) => {
        console.log('获取定位失败',res)
        that.get_store()
        
        // wx.navigateTo({
        //   url: '/pages/address/address',
        // })
      }
    })
  },
  //查看报告
  lookReport() {
    wx.navigateTo({
      url: '/pages/bodyData/bodyDataList?toIndex=1',
    })
  },
  //查看积分
  look_point() {
    wx.navigateTo({
      url: '/pages/point/point',
    })
  },
  //查看榜单
  look_rank() {
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  },
  //切换门店
  checkStore() {
    const { isShareIn } = this.data
    if(isShareIn){
      return
    }
    wx.navigateTo({
      url: '/pages/store/store',
    })
  },
  //关闭弹窗
  closeCover() {
    this.setData({
      showCover: false,
    })
  },
  //快捷入口
  quickAccess(e) {
    let flag = e.currentTarget.dataset.flag;
    switch (flag) {
      case 0:
        wx.switchTab({
          url: '/pages/courses/courses',
        });
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/weightReport/weightReport',
        });
        break;
      case 2:
        wx.switchTab({
          url: '/pages/classAppointment/classAppointment',
        });
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/record/record',
        })
    }
  },
  //约课
  handleAppoint() {
    wx.switchTab({
      url: '/pages/classAppointment/classAppointment',
    })
  },
  //签到
  handleSign() {
    let url = app.globalData.baseUrl + '/applet/user',
      that = this;
    let user_id = wx.getStorageSync('user_id');
    let data = {
      method: 'user.signin',
      user_id,
      preengage_record: that.data.classInfo.id,
      course_arrange_id: that.data.classInfo.course_arrangee.id,
      course_id: that.data.classInfo.course.id
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
          wx.showModal({
            content: '签到成功',
            showCancel:false
          })
          // let dateTime = moment(that.data.classInfo.course_arrangee.start_time)
          // let advanceTime = dateTime.subtract(that.data.classInfo.before_the_course_sign, 'seconds').format('YYYY-MM-DD HH:mm'); 
          console.log('advanceTime',advanceTime)
          that.setData({
            showCommentModel:moment().diff(moment(that.data.classInfo.course_arrangee.start_time), 'seconds') > 0 ? true : false,
            showShadowlayer:moment().diff(moment(that.data.classInfo.course_arrangee.start_time), 'seconds') > 0 ? true : false,
            classInfo: res.data.data[0],
          })
          that.get_record_class();
        } else if (res.data.code == 500) {
          wx.showModal({
            content: res.data.message
          })
        }else if (res.data.code == 999) {
          wx.showModal({
            content: res.data.message
          })
        }
      }
    })
  },
  //获取预约课程信息
  get_record_class() {
    let url = app.globalData.baseUrl + '/applet/user',
      that = this,
      store_id = wx.getStorageSync('store_id');
    let data = {
      method: 'user.getpreengagerecord',
      store_id,
      status: 6
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
          if (
            res.data.data && res.data.data.length
          ) {
            let commentModel = {
              avatar:wx.getStorageSync('userinfo').avatar,
              name:wx.getStorageSync('userinfo').nickName,
              course:{
                cover:res.data.data[0].course.cover_img,
                avatar:res.data.data[0].course.coach_staff.head_img,
                name:res.data.data[0].course.coach_staff.name,
                courseName:res.data.data[0].course.name,
                cuorseTime:res.data.data[0].course_arrangee.start_time,
                week:'周' + weekDayOfWeek(moment(res.data.data[0].course_arrangee.start_time).day())
              }
            }
            that.setData({
              classInfo: res.data.data[0],
              noclass: false,
              commentModel,
              
            })
          } else {
            that.setData({
              noclass: true
            })
          }

        } else {
          that.setData({
            noclass: true
          })
        }
      }
    })
  },
  //获取明星学员
  get_student() {
    let url = app.globalData.baseUrl + '/applet/preengageRecord',
      that = this;
    let data = {
      method: 'preengagerecord.getattendtimes',
      store_id: that.data.store_id,
      size: 3
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
          let rank = res.data.data.index.index;
          let showCover = false,
            record_month = wx.getStorageSync('record_month');
          if (rank <= 3) {
            if (record_month) {
              if (record_month != that.data.month) {
                showCover = true;
                wx.setStorageSync('record_month', that.data.month)
              }

            } else {
              wx.setStorageSync('record_month', that.data.month)
            }
          }
          let student=res.data.data.sort;
          for(let item of student){
            item.nickname=that.formatStr(item.nickname);
          }
          that.setData({
            student,
            myInfo: res.data.data.index.info,
            rank,
            showCover,
          })
        }
      }
    })
  },
  //获取明星老师
  get_teacher() {
    let url = app.globalData.baseUrl + '/applet/staff',
      that = this;
    let data = {
      method: 'staff.getstarstaff',
      store_id: that.data.store_id,
    }
    wx.request({
      url,
      data,
      method: 'POST',
      success: (res) => {
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
        } else
        if (res.data.code == 200) {
          // that.formatTeacherShowData(res.data.data)
          let list = res.data.data 
         
          that.setData({
            teacher:list
          })
        }
      }
    })
  },
  //获取个人信息
  get_info() {
    let url = app.globalData.baseUrl + '/applet/user',
      that = this;
    let data = {
      method: 'user.getuserinfo',
      store_id: that.data.store_id
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
          that.setData({
            userInfo: res.data.data
          })
          wx.setStorageSync('user_type',res.data.data.user_type)
          if(wx.getStorageSync('token')==''){
            this.setData({
              noLogin: true
            })
          }
        }

      }
    })
  },
  //保存图片
  saveImage() {
    wx.getSetting({
      success: (set) => {
        if (set.authSetting['scope.writePhotosAlbum'] == false) {
          wx.openSetting()
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: this.data.poster,
            success: (res) => {
              wx.showToast({
                title: '保存成功',
              });
            }
          })
        }
      }
    })
  },
  //登录
  getUserInfo: function (e) {
    
      wx.navigateTo({
        url: '/pages/login/login',
      })
      this.setData({
        noLogin: false,
      })
  },
  //获取当前时间
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    // if (month >= 1 && month <= 9) {
    //   month = "0" + month;
    // }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    let monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    // var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    let idx = month - 1;
    this.setData({
      // today: currentdate
      year: date.getFullYear(),
      monthEnglish: monthArr[idx],
      month: month,
      day: strDate
    })
  },

  //前往对应活动页面
  toActivityPage(e){
    const { activityType } = this.data
    const { storeid, start, aid, cid } = e.currentTarget.dataset
    if(start){
        wx.showModal({
            title:'提示',
            content:'活动已结束',
            showCancel:false
        })
        return
    }
    let realUrl = ''
    // 筛选数据
    let jumpPath = activityType.filter((item)=>{
        return item.id == cid
    })
    realUrl = `${jumpPath[0].url}?sid=${storeid}&aid=${aid}&cid=${cid}`
    //特殊处理 存在二级页面 活动需要跳转真实页面 授权........
    if(jumpPath[0].url){
        wx.navigateTo({
            url: realUrl,
        })
    }
  },
  toActivityList(){
    wx.navigateTo({
      url: '/pages/activity/index',
    })
  },
  formatTeacherShowData(data){
    let arr = [
      {
        name:'孕产瑜伽'
      },
      {
        name:'孕产瑜伽'
      },
      {
        name:'孕产瑜伽'
      },
      {
        name:'孕产瑜伽'
      }
    ]
    data.forEach((item,idx)=>{
      item.courseList = arr
    })
    return data 
    return
    if(data.length >= 3){
      data.forEach((item,idx)=>{
        item.idx = (idx + 1) % 3 == 1 ? 0 : (idx + 1) % 3 == 2 ? 1 : 2
      })
      return data
    }
    let mockData = {
      head_img:'/imgs/head_url.png',
      name:'暂未上传',
      isEmpty:1
    }
    let len = 3 - data.length
    for(let i=0;i<len;i+=1){
      data.push(mockData)
    }
    return data
  },
  //获取热门活动
  getHotActivity() {
    let url = app.globalData.baseUrl + '/applet/activity',
      that = this;
    let data = {
      method: 'activity.gethotactivity',
      store_id: that.data.store_id,
    }
    let header = {}
    // token = wx.getStorageSync('token');
    // if (token) {
    //   header = {
    //     token
    //   }
    // }
    wx.request({
      url,
      data,
      header,
      method: 'POST',
      success: (res) => {
        if (res.data.code == 200) {
          if(res.data.data == null){
            that.setData({
              activityData:{},
              timeShow:false
            })
            return
          }
          const { id,activity_cat_id,buying_price,end_time,original_price,seckill_price,start_time,store_id,desc_img,name} = res.data.data
          let activityData = {
            desc_img,
            activity_cat_id,
            activity_id:id,
            buying_price:accDiv(buying_price || seckill_price ,100),
            end_time:that.formatTime(end_time),
            original_price:accDiv(original_price,100),
            start_time:that.formatTime(start_time),
            store_id,
            name
          }
          that.setData({
            activityData,
            timeShow:true
          })
        }
      }
    })
  },
  formatTime(time){
    if(!time){
        return moment().format('YYYY/MM/DD HH:mm:ss')
    }
    return moment(time * 1000).format('YYYY/MM/DD HH:mm:ss')
  },
  handelAction(e){
    const { id, url } = e.currentTarget.dataset
    const { noLogin } = this.data
    console.log({id,url})
    if(id == 2 || id == 1){
      if(id == 1 && noLogin){
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
      }
      wx.switchTab({
        url,
      })
      return
    }
    if(noLogin){
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    wx.navigateTo({
      url,
    })
  },
  goLive(){
    wx.switchTab({
      url: '/pages/videoList/videoList'
    })
  },
  goInfoList(){
    const { tabId } = this.data
    if(tabId == 1){
      wx.navigateTo({
        url: '/pages/information/index',
      })
    }else{
      wx.navigateTo({
        url: '/pages/announce/index',
      })
    }
    
  },
  //获取列表
  getList(){
    wx.request({
      url:  baseUrl + information,
      data: {
        store_id: wx.getStorageSync('store_id'),
        page:1,
        size:3,
        method:'notice.list'
      },
      method:'POST',
      success:res=> {
        let list = res.data.data
        let restList = list.map((item)=>{
          let obj = item
          obj.update_time = item.update_time.split(' ')[0]
          obj.read_num = item.vm_page_view + item.page_view
          
          return obj 
      })
        this.setData({
            infoList: restList,
        })
      },
    })
  },
  goDetail(e){
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
        url: '/pages/information/detail?id=' + id
    })
  },
  // 公告列表
  getAnnounceList(){
    wx.request({
      url:  baseUrl + announce,
      data: {
        store_id: wx.getStorageSync('store_id'),
        page:1,
        size:3,
        method:'user.announcelist'
      },
      method:'POST',
      success:res=> {
        console.log('res',res)
        this.setData({
          announce: res.data.data,
        })
      },
    })
  },
  // 通知公告列表
  getNoticeAnnounceList(){
    let header = {},
    token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
    wx.request({
      url:  baseUrl + announce,
      data: {
        store_id: wx.getStorageSync('store_id'),
        page:1,
        size:3,
        method:'user.announce'
      },
      header,
      method:'POST',
      success:res=> {
        console.log('res',res)
        if(res.data.code == 400){
          return
        }
        if(res.data.code == 500){
          return
        }
        if(res.data.data == null){
          return
        }
        this.setData({
          announceList: res.data.data,
          showAnn:res.data.data.length ? true : false,
        })
      },
    })
  },
  //首页显示的首图
  showFirstCover(){
    let header = {},
    token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
    wx.request({
      url:  baseUrl + '/applet/UserIndex',
      data: {
        store_id: wx.getStorageSync('store_id'),
        method:'user.index'
      },
      header,
      method:'POST',
      success:res=> {
        const { data } = res.data
        if(res.data.code != 200 || data.type == -1){
          return
        }
        // data.type = 3
        let msgArr = data.msg.split(',')
        let coverInfo = {
          type:data.type,
          nickname:data.name,
          color:data.color,
          bookingNum:data.sub,
          greetings:'',
          sign:data.sign,
          recent:data.percent,
          courseName:data.course,
          truant:data.truant,
          info:msgArr[0],
          info2:msgArr[1],
          imgUrl:data.img
        }
        this.setData({
          showScreenCover:data.type == -1 ? false : true,
          coverInfo
        })
        let str = '你好'
        let i = 1
        let timer = setInterval(()=>{
          coverInfo.greetings = str.substring(0, i);
          i++
          this.setData({
            coverInfo
          })
          if(i == 3){
            clearInterval(timer);
          }
        },500)
        this.imgCutDown()
      },
    })
  },
  //图片倒计时
  imgCutDown(){
    this.imgTimer = setInterval(()=>{
      this.data.firstCount--
      this.setData({
        firstCount:this.data.firstCount
      })
      if(this.data.firstCount <= 0){
        this.setData({
          showScreenCover:false,
        })
        clearInterval(this.imgTimer);
      }
    },1000)
  },
  updateScreenShow(){
    this.setData({
      showScreenCover:!this.data.showScreenCover
    })
    clearInterval(this.imgTimer);
    
  },
  closeShare(){
    this.setData({
      shareTips:!this.data.shareTips
    })
  },
  tabSwitch(e){
    const { tabId } = this.data 
    const { id } = e.currentTarget.dataset
    if(tabId == id ){
      return
    }
    this.setData({
      tabId:id
    })
  },
  closeAnnounce(){
    this.setData({
      showAnn:false
    })
  },
   //评价
   showEvaluate(e){
    const { type } = e.currentTarget.dataset
    this.setData({
      isShowEvaluate:!this.data.isShowEvaluate,
      showEvaluateList:type == 1 ? true : false,
      showCommentModel:false,
      showShadowlayer:false
    })
    wx.setStorageSync('currentChecked',3)
    wx.switchTab({
      url:'/pages/course/course'
    })
    
  },
  toggleClose(){
    const { showCommentModel, showShadowlayer } = this.data
    this.setData({
      showCommentModel:!showCommentModel,
      showShadowlayer:!showShadowlayer
    })
  },
  onLoad: function (options) {
    //小程序码场景
    let scene = {}
    if (options.scene) {
      JSON.parse('{"' + decodeURIComponent(options.scene).replace(/&/g, '","').replace(/=/g, '":"') + '"}', (k, v) => {
          scene[k] = v
      })
    }
    if(options.store_id){
      setStoreId(options.store_id)
      this.setData({
          store_id:options.store_id
      })
    }
    this.setData({
      isShareIn:app.globalData.isShareIn || false,
      iPhonex:app.globalData.isIphoneX || false,
    })
    this.getNowFormatDate();
    // this.get_store();
    // wx.removeStorageSync('token')

  },
  onShow: function () {
    var that = this
    //本地存贮的选中日期清除
    wx.removeStorageSync('checkedDate')
    wx.removeStorageSync('checkedWeek')
    //本地存贮标识id
    wx.removeStorageSync('activity_type')
    wx.removeStorageSync('store_child_id') //小程序分店改版 取用子分店的id 默认存贮数据第一条子店铺id（貌似返回的是主店）
    let token = wx.getStorageSync('token');
    this.setData({
      noLogin:token ? false : true,
      token,
      firstCount:20,
    })
    this.showFirstCover()
    
    if (token) {
      this.get_record_class();
    } 
    wx.authorize({
      scope: 'scope.userLocation',
      success: (res) => {

        that.get_auth();
      },
      fail: (res) => {
        that.get_store();
      
        let select = wx.getStorageSync('selected')
        if(select){
          that.get_auth();
          return
        }
        // if(!app.globalData.isShareIn){
        //   wx.navigateTo({
        //     url: '/pages/address/address',
        //   })
        // }
        
      },
      complete:(done) => {
        wx.showLoading({
          title:'加载中',
          mask:true
        })
        console.log('done',done)
      }
    });
  },
  onHide(){
    this.setData({
      timeShow:false
    })
  },
  onShareAppMessage: function () {
    let store_id = wx.getStorageSync('store_id')
    return {
      title: '',
      path: `/pages/index/index?store_id=${store_id}`,
      imageUrl: ''
    }
  }
})