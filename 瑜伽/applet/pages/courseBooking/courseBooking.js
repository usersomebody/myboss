// pages/courseBooking/courseBooking.js
import  moment  from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv, formatParam, weekDayOfWeek } from '../../utils/common.js'
import { timeSeg, formattTimeDivision, showDataTime, copyTimeSeg, toObj, levelOneToObj, timeSegRest } from '../../utils/timeMinutes.js'
import { api } from '../../utils/api.js'
const app = getApp();
const valueCard=app.globalData.valueCard
const numCard=app.globalData.numCard
const clockCard=app.globalData.clockCard
const timeCard=app.globalData.timeCard

/**
 * subscribe 课程预约状态 0
 * 1成功 2取消 3完成(表示正常上课) 4未上课 5开课失败 6 排队中 7 排队失败 
 * courseInfo - status
 * 状态 1正常 2开课成功 3开课失败 4 已完课 9删除
 * bindid记录id 现在一定会存在
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_id:'',
    isAppoint:'',
    bindid:'',
    isLogin:false,
    bookingCourseType:1,
    timeCard:timeCard, //期限卡
    numCard:numCard, //次数卡
    valueCard:valueCard,//储值卡
    clockCard:clockCard,//计时卡
    number_line:'',//排队人数
    user_type:'',//会员类型
    reminder_card_null:1,//没会员卡的时候点击预约时
    date: '',
    week: '',
    show_week:'',//更改后显示的星期
    id: '',
    checkedCardInfo: {},
    checkedCard: false,
    is_binding: false,
    cardNum: 1,
    is_success: false,
    is_fail: false,
    copy_success: false,
    courseInfo: {},
    cardInfo: {},
    checkCard_id:'',//选择的会员卡ID
    isAllow: false,
    card_status:'1',
    cardList_status:'',
    queuestatus:1,    //1 預約成功 6 排隊成功
    typeData:[{
      id:1,
      name:'课程预约'
    },{
      id:2,
      name:'课程介绍'
    }],
    courseTypeId:1,
  //全部卡
    cardarrList:[],
    //全部能用的卡
    cardCanarrList:[],
    buyPerson:[],
    disbale:false,
    today:'',
    checkedDate: '',
    checkedWeek: '',
    weekArr: ['一', '二', '三', '四', '五', '六', '日'],
    dateArr:[],
    timeArr:[],
    interval:60,//时间间隔
    redirectUrl:'',
    bookingTimeObj:{
      interval:''
    },
    currentDayData:'',
    personalList:[],
    personalCourseStr:'',
    isThanNow:false,
    isOverdue:{
      3:'1',
    },
    bookedTime:'',
    openid:'',
    isCanBooking:true,
    bookingList:[],
    currentChecked:'',
    hasBookingTime:{},
    showBookingTime:{},
    status:'',
    teacherId:'',
    teacherGroupSetTime:[],
    courseId:'',
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
    show_preengage_member:0,//全局配置决定是否可以查看预约人数
    privateTeacherTime:[],
    bookingSignList:[],
    signId:'',

    //评价
    showEvaluateList:true,
    isShowEvaluate:false,
    evaluate:1,
    canevaluate:'',
    //邀请评价弹层
    showShadowlayer:false,
    showCommentModel:false,
    successEvaluate:2,
    isCanEvaluate:false,
    showEvaluateImg:false,
    isOpenComment:true,
    isInstartOpen:false,
    isInRealstartOpen:false,
    editCheck: ''
  },
  //预约
  appoint() {
    var that = this;
    const { courseInfo, bookingCourseType, redirectUrl,timeArr,bookingList, checkedDate, store_id, isCanBooking } = that.data
    // if (this.data.cardNum == 0||this.data.reminder_card_null==0) {

      //阻止按钮点击操作
      if(this.data.disbale){
        return
      }

      if(!isCanBooking){
        wx.showModal({
          content: '已经预约了',
          showCancel:false
        })
        return
      }

      if (that.data.reminder_card_null==0 || !this.data.cardarrList.length) {
        wx.showModal({
          content: "暂无可预约本节课的会员卡"
        })
        this.setData({
          disbale:false
        })
        return false
      }

      if(bookingCourseType !=4 && (courseInfo.subscribe == 1 || (courseInfo.subscribe == 2 && bookingCourseType !=4 ))){
        let msg = courseInfo.subscribe == 1 ? '已经预约了' : courseInfo.subscribe == 2 ? '已经取消了' : ''
        wx.showModal({
          content: msg,
          showCancel:false
        })
        this.setData({
          disbale:false
        })
        return
      }
      //私教
      if( bookingCourseType ==4  && bookingList.timeDate && bookingList.timeDate.length ){
        wx.showModal({
          content: '已经预约了',
          showCancel:false
        })
        this.setData({
          disbale:false
        })
        return
      }
      if(bookingCourseType !=4 &&  courseInfo.preengage_status == 2 && courseInfo.is_open_queue != 1){
        wx.showModal({
          content: '已约满',
          showCancel:false
        })
        this.setData({
          disbale:false
        })
        return
      }
     

      wx.showLoading({
        title:'加载中...',
        mask:true
      })
    let url = app.globalData.baseUrl + api.user,
      user_id = wx.getStorageSync("user_id");
    let data = {
      method: 'user.preengage',
      // store_id: courseInfo.store_id,
      store_id: store_id || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id'),//小程序分店改版 取用子分店的id
      course_id: courseInfo.course_id,
      course_arrange_id: courseInfo.id,
      card_id: this.data.checkCard_id,
      user_id
    }

    let header = {},
    token = wx.getStorageSync('token');
    if (token) {
      header = {
        token
      }
    }
    //私教课 预约操作
    if(bookingCourseType == 4){
      //过滤私教课数据
      let sbumitData = timeArr.filter(item=>{
        return item.select
      })
      if(!sbumitData.length){
        wx.showModal({
          title:'提示',
          content:'请选择预约时间',
          showCancel:false,
        })
        this.setData({
          disbale:false
        })
        wx.hideLoading()
        return
      }
      this.setData({
        disbale:true
      })
      let sData = {
        method:'course.privatepreengage',
        curriculum_time:checkedDate + ' ' + sbumitData[0].timeFrom,
        // store_id: courseInfo.store_id,
        store_id: store_id || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id'),//小程序分店改版 取用子分店的id
        course_arrange_id:sbumitData[0].courseId,
        card_id: this.data.checkCard_id,
        user_id,
        course_type_id:4
      }
      this.setData({
        showBookingTime:{
          start:checkedDate + ' ' + sbumitData[0].timeFrom,
          end:sbumitData[sbumitData.length - 1].timeFrom,
          week:this.data.checkedWeek
        }
      })
      // if(courseInfo.subscribe == 2){
      //   url = app.globalData.baseUrl + api.personalCourse
      //   let data = {
      //     method:'course.course.cancelprivatepreengage',
      //     store_id: courseInfo.store_id,
      //     user_id
      //   }
      //   this.canclePersonalBooking(url,data,header,redirectUrl)
      //   return
      // }
      url = app.globalData.baseUrl + api.personalCourse

      this.booking(url,sData,header,redirectUrl)
      return
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
          wx.hideLoading()
          that.setData({
            is_success: true,
            queuestatus :res.data.data.status,
            disbale:false
          })
          that.get_course();
        } else {
          wx.hideLoading()
          that.setData({
            disbale:false
          })
          wx.showModal({
            content: res.data.message
          })
        }
      },
      fail(){
        wx.hideLoading()
        that.setData({
          disbale:false
        })
      },
    })
  },
  booking(url,data,header,redirectUrl){
    request({
      url,
      data,
      header,
      isTologin:true,
      redirectUrl,
      method: 'POST',
      success: (res) => {
        if (res.curriculum_time) {
          wx.hideLoading()
          this.setData({
            is_success: true,
            queuestatus :res.status,
            disbale:false
          })
          this.get_weighInfo()
          // this.getCourseInfo()
        } 
      },
      fail(){
        wx.hideLoading()
        this.setData({
          disbale:false
        })
      },
    }).catch((err)=>{
      this.setData({
        disbale:false
      })
    })
  },
   //  选择卡片
   checkDate(e) {
     if(this.data.bookingCourseType !=4 && this.data.courseInfo.preengage_num<=this.data.courseInfo.max_user){
      const idx = e.currentTarget.dataset.idx;
      const checkCard_id=this.data.cardarrList[idx].id
      this.setData({
        cardList_status:idx,
        checkCard_id
      })
    }else{
      const idx = e.currentTarget.dataset.idx;
      const checkCard_id=this.data.cardarrList[idx].id
      this.setData({
        cardList_status:idx,
        checkCard_id
      })
    }
  },
  // 计算当前是否在开课时间和上课开始时间之间
  calculatTime(openTime,startTime){
    let open = moment(openTime).format('YYYY-MM-DD HH:mm:ss')
    let current = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
    console.log({open,current})
    console.log('currentTime',moment().isBetween(open, current, 'seconds'))
    return moment().isBetween(open, current,'seconds')
  },
  // 获取课程
  get_course() {
    const { id, bookingCourseType, date, bookingTimeObj,checkedDate, isLogin, teacherId, store_id} = this.data
    let url = app.globalData.baseUrl + '/applet/courseArrange',
      that = this;
    let data = {
      method: 'course.arrange.get',
      store_id: store_id || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id'),//小程序分店改版 取用子分店的id
      date:checkedDate,
      course_type_id:bookingCourseType == 4 ? '1,2,3' : bookingCourseType + '',
      coach_staff_id:teacherId
    }
    if(bookingCourseType != 4){
      data.id = id
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
          // wx.navigateTo({
          //   url: '/pages/login/login',
          // })
          this.getCourseInfo()
          return false
        } else
        if (res.data.code == 200) {
          let commentModel = {
            avatar:wx.getStorageSync('userinfo').avatar,
            name:wx.getStorageSync('userinfo').nickName
          }
          //存贮评论弹层数据
          if(wx.getStorageSync('classTime')){
            commentModel = {
              avatar:wx.getStorageSync('userinfo').avatar,
              name:wx.getStorageSync('userinfo').nickName,
              course:{
                cover:res.data.data[0].course_detail.cover_img,
                avatar:res.data.data[0].course_detail.coach_staff.head_img,
                name:res.data.data[0].course_detail.coach_staff.name,
                courseName:res.data.data[0].course_detail.name,
                cuorseTime:wx.getStorageSync('classTime'),
                week:'周' + weekDayOfWeek(moment(wx.getStorageSync('classTime')).day())
              }
            }
          }
          this.setData({
            commentModel,
          })
          
          if(bookingCourseType == 4){
            let teacherGroupSetTime =  res.data.data.map(item=>{
              let obj = {
                start_time:item.start_time || '',
                end_time:item.end_time || ''
              }
              return obj
            })
            this.setData({
              teacherGroupSetTime,
            })
            if(isLogin){
              this.get_weighInfo()
            }else{
              this.getCourseInfo()
            }
            return
          }
          
          let courseInfo = res.data.data[0];
          let bookingTimeObj = {
            interval:courseInfo.course_detail.duration
          }
            let preengage_status = '';
            if (courseInfo.preengage_num >= courseInfo.max_user) {
              preengage_status = "2";
            } else {
              preengage_status = "1";
            }
            courseInfo.preengage_status = preengage_status;
          let isInstartOpen = this.calculatTime(courseInfo.curriculum_time * 1000, courseInfo.date + ' ' + courseInfo.start_time)
          let isInRealstartOpen = this.calculatTime(courseInfo.date + ' ' + courseInfo.start_time, courseInfo.date + ' ' + courseInfo.end_time)
          that.setData({
            courseInfo,
            number_line: res.data.data[0].queue ? res.data.data[0].queue  : 0,
            bookingTimeObj,
            status:courseInfo.status,
            isInstartOpen,
            isInRealstartOpen
          })
          this.getBookingAvatar()

          if (that.data.checkedCard) {
            that.setData({
              cardInfo: that.data.checkedCardInfo,
              cardNum: 2,
              is_binding: true,
            })
            return false
          }
          this.get_can_card();
          if(isLogin){
            this.get_cardInfo();
          }
        }else{
          if(isLogin){
            this.get_weighInfo()
          }else{
            this.getCourseInfo()
          }
          
        }
      })
    })
  },
  //获取会员卡信息
  get_cardInfo() {
    const { store_id } = this.data
    let url = app.globalData.baseUrl + '/applet/user',
      that = this,
      course_id= that.data.courseInfo.course_id
    let data = {
      method: 'user.getcard',
      store_id: store_id || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id'),//小程序分店改版 取用子分店的id
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
                  // checkCard_id:classList[0].id
                })
              }else{
                this.setData({
                  reminder_card_null:0,
                })
              }
             
            }
          }else if(classListlist==null){
            this.setData({
              reminder_card_null:0,
            })
          }
         
          
          
          let support_card_ids = this.data.courseInfo.course_detail.support_card_ids,
            cardList = [];
          if (support_card_ids) {
            let arr1 = support_card_ids.split(','),
              cardNum = 0;
            // let arr2 = res.data.data;
            // for (let i of arr1) {
            //   for (let j of arr2) {
            //     if (i == j.card_id) {
            //       cardNum++;
            //       cardList.push(j)
            //     }
            //   }

            // }
            
            this.setData({
              cardNum,
              is_binding: true,
            })
          } else {
            this.setData({
              cardNum: 0,
              is_binding: true,
            })
          }
          let cardInfo, has_default = 0,
            cardId = this.data.courseInfo.card_id;
          if (cardList.length > 0) {
            if (cardId) {
              for (let item of cardList) {
                if (item.card_id == cardId) {
                  cardInfo = item;
                  has_default++;
                }
              }
            } else {
              for (let item of cardList) {
                if (item.is_default_card == 1) {
                  cardInfo = item;
                  has_default++;
                }
              }
            }


          }
          if (has_default == 0) {
            cardInfo = cardList[0];
          }
          this.setData({
            cardInfo
          })
          this.get_can_card();
        } else {
          this.setData({
            cardNum: 0,
            is_binding: false
          })
        }
      }
    })
  },
  //关闭弹窗
  closeCover(e) {
    let flag = e.currentTarget.dataset.flag;
    switch (flag) {
      case "1":
        this.setData({
          is_success: false
        });
        break;
      case "2":
        this.setData({
          is_fail: false
        });
        break;
      case "3":
        this.setData({
          copy_success: false
        });
        break;
    }

  },
  // 复制微信
  handleCopy() {
    var that = this;
    wx.setClipboardData({
      data: '不错哟',
      success(res) {
        wx.getClipboardData({
          success(res) {
            that.setData({
              copy_success: true,
              is_fail: false
            })
          }
        })
      }
    })
  },
  //拨打电话
  handleCall() {
    wx.makePhoneCall({
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
  },
  //可用卡片
  availableCard() {
    let course_id = this.data.courseInfo.course_detail.id;
    wx.redirectTo({
      url: '/pages/availableCard/availableCard?course_id=' + course_id+'&id='+this.data.id+'&date='+this.data.date+'&week='+this.data.week,
    })
  },
 
  //获取可预约的会员卡
  get_can_card() {
    const { cardarrList } = this.data
    let url = app.globalData.baseUrl + '/applet/course';
    let data = {
      method: 'course.support.card',
      course_id: this.data.courseInfo.course_id,
      course_type_id:this.data.bookingCourseType
      
    }
    
    // if(this.data.bookingCourseType !=4 ){
      
    // }
    let header = {};
  //   token = wx.getStorageSync('token');
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
        if (res.data.code == 400) {
          wx.removeStorageSync('token')
          // wx.navigateTo({
          //   url: '/pages/login/login',
          // })
        } else
        if (res.data.code == 200) {
          let classListarr=res.data.data
          for(var i = 0; i<classListarr.length; i++){
            var obj = classListarr[i];
            obj.assets_money= Math.floor(obj.assets_money/100) ;
            // obj.assets_time = Math.floor(obj.assets_time/60) ;
        }
        let canUseCardList = []
        classListarr.forEach(item=>{
          cardarrList.forEach(itm=>{
            if(item.id == itm.card_id){
              if(itm.is_default_card == 1){
                canUseCardList.unshift(itm)
              }else{
                canUseCardList.push(itm)
              }
            }
          })
        })
          this.setData({
            cardCanarrList:classListarr,
            cardarrList:canUseCardList,
            checkCard_id:canUseCardList.length ? canUseCardList[0].id : ''
          })
        } else {
          this.setData({
            cardCanarrList: [],
            cardarrList:[]
          })
        }
      }
    })
  },
  //绑定会员卡
  bindCard() {
    wx.navigateTo({
      url: '/pages/cardBind/cardBind?id=' + this.data.id,
    })
  },
  //获取模板消息权限
  get_auth() {
    if(this.data.bookingCourseType == 4){
      this.setData({
        is_success: false
      })
      wx.navigateBack({
        delta: 1,
      })
      return
    }
    var that = this;
    if (!that.data.isAllow) {
      that.handleSubsribe();
      return false
    }
    if(that.data.queuestatus==6){
      var tmplIds = ["EHsceERv7KsU8iCEVn6DzYe3Obrtc_lBiM4h2EFw_jU", "DI1QV3x8-bMcwWWapKcmx1lSMnqeFGQgROBcWvACQy8"];
    }else if(that.data.queuestatus==1){
      
      var tmplIds = ["EccGBYUDJ1QdjqbyUMi6bwRFOLHLljSfvAbpD8RBTaI", "UzZRrW-o9uL7eF0A8lKpxLz5EGiDeitcj2YZybMcGF0","x9PK_Rd3NbW3aN1_pHNyTOtXH7aYpgcWoQM0pbCByWg"];
    }
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
        console.log('res_fail',res)
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

  switchTab(e){
    const { id } = e.currentTarget.dataset
    if(this.data.courseTypeId == id){
      return
    }
    this.setData({
      courseTypeId:id
    })
  },

  /**                          */
  //私教课逻辑
  // 获取当前两周日期
  getWeekTime() {
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
    for (let i = 0; i < 14; i++) {
      let idx = (i % 7)
      arr.push({
        date: this.GetDate(monday, i).date,
        month: this.GetDate(monday, i).month,
        week: this.data.weekArr[idx],
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
    if(wx.getStorageSync('checkedDate')){
      checkedDate=wx.getStorageSync('checkedDate');
    }
    this.setData({
      dateArr: arr,
      checkedDate,
      checkedWeek
    })
    wx.setStorageSync('checkedWeek', checkedWeek)

    // this.get_class();
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
  chooseDate(e) {
    const { bookingCourseType } = this.data
    const idx = e.currentTarget.dataset.idx;
    this.setData({
      checkedDate: this.data.dateArr[idx].date,
      checkedWeek: this.data.dateArr[idx].week,
    })
    wx.setStorageSync('checkedDate', this.data.dateArr[idx].date)
    wx.setStorageSync('checkedWeek', this.data.dateArr[idx].week)
    if(bookingCourseType == 4){
      this.getCourseInfo()
    }else{
      this.get_course();
    }
  },
  //获取当前时间
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
      today: currentdate
    })
  },
  checkTime(e){
    const { isbeyond, isbeyondend, timefrom, timeto, isbooked, index, isover, group, resttime, userbooked, bookingList } = e.currentTarget.dataset
    const { timeArr, bookingTimeObj, bookedTime, checkedDate, bookingSignList, bookingCourseType, currentChecked } = this.data
    if(!timeArr.length){
      return
    }
    if(isbooked && !userbooked){
      wx.showModal({
        title:'提示',
        content:'已约满',
        showCancel:false
      })
      return
    }
    if(index == timeArr.length - 1 || isover){
        wx.showModal({
          title:'提示',
          content:'当前时间不可预约',
          showCancel:false
        })
        return
    }
    if((isbeyond || isbeyondend) && (currentChecked != 1 && currentChecked != 2)){
      wx.showModal({
        title:'提示',
        content:'不在可预约时间内',
        showCancel:false
      })
      return
    }
    if(group){
      wx.showModal({
        title:'提示',
        content:'当前为团课时间',
        showCancel:false
      })
      return
    }
    if(resttime){
      wx.showModal({
        title:'提示',
        content:'当前为休息时间',
        showCancel:false
      })
      return
    }
    //结束时间
    let end = moment(timefrom,"HH:mm").clone().add(bookingTimeObj.interval, "minutes").format("HH:mm")
    let selectArr = copyTimeSeg(timefrom,end,bookingTimeObj.interval)
    let overTime = checkedDate + ' ' + end
    if(moment(overTime).isAfter(moment(bookedTime)) && (currentChecked != 1 && currentChecked != 2)){
      wx.showModal({
        title:'提示',
        content:'不在可预约时间内',
        showCancel:false
      })
      return
    }
    let copyTimeArr = this.toObj(timeArr)
    let isValid = selectArr.some(item=>{
      return copyTimeArr[item.timeFrom] ? copyTimeArr[item.timeFrom].isBooked : false
    })
    // if(isValid){
    //   wx.showModal({
    //     title:'提示',
    //     content:'当前时间已约',
    //     showCancel:false
    //   })
    //   return
    // }
    if(bookingSignList.length && bookingCourseType == 4){
      let isExistence = bookingSignList.some((item)=>{
        return item.course_arrange_date + '' + item.bookingStart == checkedDate + '' + selectArr[0].timeFrom
      })
      if(!isExistence){
        this.setData({
          status:1
        })
      }else{
        this.setData({
          status:3
        })
      }
    }
    let selectObj = this.toObj(selectArr)
    let bookingSelectObj = this.toObjs(this.data.bookingList)
    let signId = bookingSelectObj[`${selectArr[0].timeFrom}-${selectArr[0].timeTo}`] ? bookingSelectObj[`${selectArr[0].timeFrom}-${selectArr[0].timeTo}`].subscribe_id : signId
    //根据当前选择得时间 以及时间间隔  课程时间 进行选中 选中时间 + 课程时间  在通过间隔时间拆分成 选中时间的数组 ok
    timeArr.forEach((item)=>{
      item.select = selectObj[item.timeFrom] ? true : false
    })
    
    this.setData({
      signId,
      timeArr,
      isCanBooking:isbooked && userbooked ? false : true
    })
  },
  toObj(data){
    let info = {}
    data.forEach((item)=>{
      info[item.timeFrom] = item
    })
    return info
  },
  toObjs(data){
    let info = {}
    data.forEach((item)=>{
      info[`${item.bookingStart}-${item.bookingend}`] = item
    })
    console.log('info',info)
    return info
  },
  getBookedList(){
    const { courseInfo, redirectUrl, bookingTimeObj, personalList, checkedDate, personalCourseStr, openid, teacherGroupSetTime, teacherId, store_id, privateTeacherTime } = this.data
    let url = app.globalData.baseUrl + api.personalCourse;
    let data = {
      method: 'course.privatesubrecord',
      // store_id: courseInfo.store_id,
      store_id: store_id || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id'),//小程序分店改版 取用子分店的id
      coach_staff_id:courseInfo.course_detail.coach_staff.id || teacherId,
      // course_arrange_id: personalCourseStr,
      course_id:courseInfo.course_id,
      date:checkedDate,
    }

    let header = {}
    // token = wx.getStorageSync('token');
    // if (token) {
    //   header = {
    //     token
    //   }
    // }
    request({
      url,
      data,
      header,
      // isTologin:true,
      // redirectUrl,
      method: 'POST',
      success: (res) => {
        // let bookedList = res.filter(item=>{
        //   return item.course_id == courseInfo.course_id
        // }) || []
        let bookedList = res == null || !res.length ? [] : res
        //是否可以预约

        if(!bookedList.length){
          this.setData({
            // isCanBooking:true,
            bookingList:[],
            showEvaluateImg:true
          })
        }else{
          let isCanEvaluateList = bookedList.filter((item)=>{
            return openid == item.openid && courseInfo.course_id == item.course_id && item.status == 3
            // return openid == item.openid //如果一个人一天可以预约多次 放出代码
         })
          let bookingRecord = bookedList.some((item)=>{
            //  return openid == item.openid && courseInfo.course_id == item.course_id
             return openid == item.openid //如果一个人一天可以预约多次 放出代码
          })
          //bookingList 代表的是同一个人同一个课程被预约掉的列表
          let bookingList = bookedList.filter((item)=>{
            // return openid == item.openid && courseInfo.course_id == item.course_id
            return openid == item.openid //如果一个人一天可以预约多次 放出代码
         })
         
         let isSign = bookingList.some((item)=>{
           return item.status == 3
         })
         let bookingSignList = bookingList.filter((item)=>{
          return item.status == 3
          })
          this.setData({
            // isCanBooking:!bookingRecord,
            // bookingList:bookingList.length ? bookingList[0] : {},
            bookingList:bookingList.length ? bookingList : [],//如果一个人一天可以预约多次 放出代码
            status: isSign ? 3 : this.data.status,
            isCanEvaluate:isCanEvaluateList.length ? true : false,
            bindid:isCanEvaluateList.length ? isCanEvaluateList[0].subscribe_id : this.data.bindid,
            bookingSignList,
            showEvaluateImg:true
          })
        }
        let showData = []
        //私教排课同一天存在多种类型的课 但是前后台约定 返回的不同的课程的时间段不可以重复 即课程a 8:00 - 10:00 课程b 10:00 - 12:00  时间段不可以交叉
        //通过获取的私教课程列表 排列组合出当前所有可预约的时间节点
        personalList.forEach(item=>{
          let formatArr = timeSeg(item.start,item.end, item.interval, 60, bookingTimeObj.interval,item.id,checkedDate)
          formatArr[formatArr.length-1].isOver = true
          showData = [...showData,...formatArr]
        })
        let timeArr = showData
        //将已经被预约掉的时间排列组合成 预约的时间节点
        let bookedArr = formattTimeDivision(bookedList,bookingTimeObj.interval)
        console.log('bookedArr',bookedArr)
        //休息的时间段
        let restData = []
        let restList = privateTeacherTime || []
        restList.forEach((item)=>{
          let formatListData = timeSegRest(item.start_time,item.end_time,bookingTimeObj.interval)
          restData = [...restData,...formatListData]
        })
        //团课
        // let teacherGroupSetTime = [{
        //   start:'2021-08-11 09:00:00',
        //   end:'2021-08-11 10:00:00'
        // },{
        //   start:'2021-08-11 13:00:00',
        //   end:'2021-08-11 14:00:00'
        // },{
        //   start:'2021-08-11 16:00:00',
        //   end:'2021-08-11 17:00:00'
        // }]

        // teacherGroupSetTime.forEach((item)=>{
        //   item.start_time = moment(item.start).format('HH:mm')
        //   item.end_time = moment(item.end).format('HH:mm')
        // })
        /**
         * timeArr：私教所有课程可以预约的所有时间节点
         * bookedArr：私教所有课程已经被愉悦的时间节点
         * bookingList: 被约掉的同一个课程同一个人
         * teacherGroupSetTime：团课占用掉的时间节点
         */
        this.setData({
          timeArr:showDataTime(timeArr,bookedArr,this.data.bookingList,teacherGroupSetTime, restData),
        })
        wx.hideLoading()
      },
    }).catch(()=>{
      this.setData({
        showEvaluateImg:true
      })
    })
  },
  //课程头像
  getBookingAvatar(){
    const { courseInfo, redirectUrl, store_id } = this.data
    let url = app.globalData.baseUrl + api.personalCourse;
    let data = {
      method: 'course.subrecord',
      // store_id: courseInfo.store_id,
      store_id:store_id || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id'),//小程序分店改版 取用子分店的id
      course_arrange_id: courseInfo.id,
    }

    let header = {};
    // token = wx.getStorageSync('token');
    // if (token) {
    //   header = {
    //     token
    //   }
    // }
    request({
      url,
      data,
      header,
      // isTologin:true,
      errorShow:true,
      // redirectUrl,
      method: 'POST',
      success: (res) => {
        if(res == null){
          this.setData({
            showEvaluateImg:true
          })
          return
        }
        let signStatus = res.filter((item)=>{
          return item.user_id == wx.getStorageSync('user_id')
        })
        this.setData({
          buyPerson:res,
          isCanEvaluate:signStatus.length ? signStatus[0].status == 3 ? true : false : false,
          bindid:signStatus.length ? signStatus[0].id : '',
          showEvaluateImg:true,
          status:signStatus.length ? signStatus[0].status : this.data.status
        })
      },
    }).catch(()=>{
      this.setData({
        showEvaluateImg:true
      })
    })
  },
  //选中天的课程信息
  getCourseInfo(){
    wx.showLoading('加载中...')
    const { courseId, redirectUrl, checkedDate, teacherId, isLogin, store_id } = this.data
    let url = app.globalData.baseUrl + api.personalCourse,
      that = this;

    let data = {
      method: 'course.privatelist',
      store_id: store_id || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id'),//小程序分店改版 取用子分店的id
      coach_staff_id: teacherId,
      date:checkedDate,
      course_id:courseId
    }

    let header = {}
    // token = wx.getStorageSync('token');
    // if (token) {
    //   header = {
    //     token
    //   }
    // }
    request({
      url,
      data,
      header,
      // isTologin:true,
      // redirectUrl,
      isPassValue:'array',
      method: 'POST',
      success: (res) => {
        if(!res.length){
          this.setData({
            timeArr:[]
          })
          return
        }
        let lastData = res.length ? res[res.length-1] : ''
        let endDate = lastData.date + ' ' + lastData.end_time

        let courseInfo = res[0];
        let bookingTimeObj = {
          interval:courseInfo.course_detail.duration
        }
        let preengage_status = '';
        if (courseInfo.preengage_num >= courseInfo.max_user) {
          preengage_status = "2";
        } else {
          preengage_status = "1";
        }
        courseInfo.preengage_status = preengage_status;
        let tarcherTime = res[0].rest_time.map((item)=>{
          let obj = item
          obj = {
            start_time:`${checkedDate} ${item.start_time}`,
            end_time:`${checkedDate} ${item.end_time}`
          }
          return obj 
        })
        this.setData({
          courseInfo,
          number_line: res[0].queue ? res[0].queue  : 0,
          bookingTimeObj,
          status:courseInfo.status,
          personalList:this.formatPersonalData(res,bookingTimeObj.interval) || [],
          isThanNow: moment().isAfter(moment(endDate),'day'),
          bookedTime:endDate,
          privateTeacherTime:tarcherTime
        })
        if (that.data.checkedCard) {
          that.setData({
            cardInfo: that.data.checkedCardInfo,
            cardNum: 2,
            is_binding: true,
          })
          return false
        }
        this.get_can_card();
        if(isLogin){
          this.get_cardInfo();
        }
        this.getBookedList()
      },
    })
  },
  formatPersonalData(data,interval){
    // const { bookingTimeObj } = this.data
    let showData = data.map(item=>{
      let obj = {
        id:item.id,
        date:item.date,
        end:item.date + ' ' + item.end_time,
        start:item.date + ' ' + item.start_time,
        interval:interval
      }
      return obj
    })
    return showData
  },
  //获取用户信息
  get_weighInfo() {
    const { redirectUrl, store_id } = this.data
    let url = app.globalData.baseUrl + '/applet/user',
      that = this
      
    let data = {
      method: 'user.getuserinfo',
      store_id:store_id || wx.getStorageSync('store_child_id') || wx.getStorageSync('store_id')//小程序分店改版 取用子分店的id
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
      isTologin:true,
      redirectUrl,
      method: 'POST',
      success: (res) => {
        this.setData({
          openid:res.openid || ''
        })
        this.getCourseInfo()
        
      }
    })
  },
  toLogin(){
    wx.removeStorageSync('token')
    wx.navigateTo({
      url: '/pages/login/login',
    })
   
  },
  //签到
  sign() {
    const { editCheck } = this.data
    if(editCheck == '-1'){
      return
    }
    let url = app.globalData.baseUrl + '/applet/user',
      user_id = wx.getStorageSync(
        "user_id"
      ),
      that = this;
    let data = {
      method: 'user.signin',
      course_id: this.data.courseInfo.course_id,
      course_arrange_id: this.data.courseInfo.id,
      preengage_record: this.data.signId,
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
          wx.showToast({
            title: '签到成功',
            icon: 'none',
            duration: 1000
          })
          this.setData({
            showCover: true,
            status:3,
            showCommentModel:moment().diff(moment(wx.getStorageSync('classTime')), 'seconds') > 0 ? true : false,
            showShadowlayer:moment().diff(moment(wx.getStorageSync('classTime')), 'seconds') > 0 ? true : false
          })
          this.get_course()
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

  //评价
  showEvaluate(e){
    const { type } = e.currentTarget.dataset
    this.setData({
      isShowEvaluate:!this.data.isShowEvaluate,
      showEvaluateList:type == 1 ? true : false,
      showCommentModel:false,
      showShadowlayer:false
    })
  },
  updateShowEvaluateStatus(data){
    const { showEvaluateList, isShowEvaluate, successEvaluate} = data.detail
    this.setData({
      isShowEvaluate:isShowEvaluate,
      showEvaluateList,
      successEvaluate,
      showCommentModel:successEvaluate == 1 ? true : false,
      showShadowlayer:successEvaluate == 1 ? true : false
    })
  },
  toggleClose(){
    const { showCommentModel, showShadowlayer } = this.data
    this.setData({
      showCommentModel:!showCommentModel,
      showShadowlayer:!showShadowlayer
    })
  },
  /**                          */



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user_type = wx.getStorageSync('user_type');
    // if(wx.getStorageSync('checkedWeek')){
    //   let show_week = wx.getStorageSync('checkedWeek');
    //   this.setData({
    //     show_week
    //   })
    // }
    let url = 'pages/courseBooking/courseBooking'
    let str = formatParam(options)
    let formatUrl = `/${url}${str ? '?' + str : ''}`
    let redirectUrl = encodeURIComponent(formatUrl)
    let id = options.id || 90,
      date = options.date,
      week = options.week,
      bindid = options.bindid || '',
      store_id = options.store_id,
      checkedCardInfo = options.checkedCard;
    let personalCourseId = app.globalData.personalList || []
    let personalCourseStr = personalCourseId.length ? personalCourseId.map(item=>{
      return item.id
    }).join(',') : ''
      let storeObj = wx.getStorageSync('allStore')
      let isOpenComment = storeObj[store_id || wx.getStorageSync('store_id')] == 1 ? true : false
    this.setData({
      bindid,
      signId:options.bindid,
      id,
      date,
      week,
      user_type,
      bookingCourseType:options.checkType,
      redirectUrl:redirectUrl,
      currentDayData:moment().format('YYYY-MM-DD'),
      checkedDate:date,
      personalCourseStr,
      currentChecked:options.currentChecked || '',
      hasBookingTime:app.globalData.personalBookingTime || {},
      teacherId:options.teacherId || '',
      courseId:options.courseId,
      isAppoint:options.appoint || '',
      store_id,
      showEvaluateList:options.evaluate ? options.evaluate == 1 ? true : false : true,
      evaluate:options.evaluate || 1,
      canevaluate:options.canevaluate,
      isOpenComment,
      editCheck: options.editCheck || ''
      // isShowEvaluate:options.evaluate ? true : false
    })
    if (checkedCardInfo) {
      this.setData({
        checkedCardInfo: JSON.parse(checkedCardInfo),
        checkedCard: true
      })
    }

    this.get_subscribe_auth();
    this.getNowFormatDate()
    this.getWeekTime()
    // this.get_can_card();
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    let token = wx.getStorageSync('token');
    this.setData({
      isLogin: token ? true : false,
      token,
      show_preengage_member:wx.getStorageSync('show_preengage_member') || 0
      
    })
    this.get_course();
    wx.removeStorageSync('currentChecked')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})