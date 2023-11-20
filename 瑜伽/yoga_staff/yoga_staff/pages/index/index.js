
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'

const app = getApp()
const { storeIndex } = api
Page({
  data:{
    statusBarHeight:'',
    banner:[],
    swiper:{
      indicatorDots: true,
      left:'40rpx',
      indicatorColor:'#FFFFFF',
      indicatorActiveColor:'#7D49FB'
    },
    navList:[{
      id:1,
      name:'签到',
      cover:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211203/a06f24ea34ac4a72566f7d0d9fbf30fe.png",
      url:'/pages/appointment/appointment',
      isTabbar:true
    },{
      id:2,
      name:'约课',
      cover:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211203/d26d193ec2b63770efba60a838647538.png",
      url:'/pages/appointment/appointment',
      isTabbar:true
    },{
      id:3,
      name:'会员',
      cover:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211203/82c064f2a9a22ef6f642411f7f3d5be9.png",
      url:'/pages/vip/vip',
      isTabbar:true
    },
    {
      id:4,
      name:'课表',
      cover:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211203/27078ea95c2718c6fba5f5d4e437c102.png",
      url:'/pages/course/schedule',
      isTabbar:false
    },{
      id:5,
      name:'课程',
      cover:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211203/6b9034b63104703e639d5d7f582d900b.png",
      url:'/pages/course/courseList',
      isTabbar:false
    },{
      id:6,
      name:'会员卡',
      cover:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211203/6914ef48122254105cdd8833190f3fd5.png",
      url:'/pages/vip/vipCardList',
      isTabbar:false
    },{
      id:7,
      name:'员工',
      cover:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211203/4ddbc969aa68b994f5abfda976752c73.png",
      url:'/pages/member/list',
      isTabbar:false
    },
    {
      id:8,
      name:'基本设置',
      cover:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211203/8f1ef2240d5131f289164c86f1866891.png",
      url:'/pages/baseConfig/index',
      isTabbar:false
    }
    // ,{
    //   id:4,
    //   name:'潜客',
    //   cover:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210427/ae1c45f1bc16e42fad066faf43f14f19.png",
    //   url:''
    // }
    ],
    courseList:[{
      id:1,
      name:'团课预约',
      num:0,
    },{
      id:2,
      name:'精品课预约',
      num:0,
    },{
      id:3,
      name:'小班课预约',
      num:0,
    },{
      id:4,
      name:'私教课预约',
      num:0,
    }],
    arrangList:[{
      id:1,
      name:'团课排课',
      num:0,
    },{
      id:2,
      name:'精品课排课',
      num:0,
    },{
      id:3,
      name:'小班课排课',
      num:0,
    },{
      id:4,
      name:'私教课排课',
      num:6,
    }],
    buyCard:{
      count:10,
      money:100
    },
    newUser:{
      count_all:10,
      count_month:10
    },
    processType:{
      1:{
        name:'生日',
        link:'/pages/my/commonList?type=1'
      },
      2:{
        name:'不活跃',
        link:'/pages/my/commonList?type=4'
      },
      3:{
        name:'次数卡',
        link:'/pages/my/commonList?type=2'
      },
      4:{
        name:'储值卡',
        link:'/pages/my/commonList?type=3'
      },
      5:{
        name:'到期',
        link:'/pages/my/commonList?type=5'
      }
    },
    process:[],
    storeName:'',
    iPhonex: false,
    imgSrc:'',
    weblink:"",
    shareTips:true,
    isCanSeeData:0
  },
  onLoad(){
    this.setData({
      statusBarHeight:app.globalData.statusBarHeight,
      iPhonex:app.globalData.isIphoneX || false,
    })
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },
  onShow(){
    let storeInfo = wx.getStorageSync('store_info')
    this.setData({
      storeName:storeInfo.sto_name
    })
    if(storeInfo.sto_name){
      wx.setNavigationBarTitle({
        title: storeInfo.sto_name
      })
    }
    this.getStoreInfo()
  },
  //滑动会员卡事件
  sliding_choice(e){
  },
  getStoreInfo(){
    const { processType } = this.data
    request({
      url:baseUrl + storeIndex,
      data:{
          
      },
      method:'POST',
      isTologin:true,
      success:(res)=>{
          wx.hideLoading()
          const { notice, groupCourseCount, arrangeCourse, process, buyCard, newUser, isCanSeeData } = res
          let showCourseData = this.formatCourseData(arrangeCourse)//排课
          let showBookingData = this.formatBookingData(groupCourseCount)//排课
          this.setData({
            banner:notice,
            buyCard,
            newUser,
            process:process || [],
            arrangList:showCourseData,
            courseList:showBookingData,
            weblink:process && process.length ? processType[process[0].type].link : '',
            isCanSeeData:isCanSeeData ? isCanSeeData : 0
          })
      }
    })
  },
  //数据处理 排课
  formatCourseData(reslut){
    const { arrangList } = this.data
    const { groupCourse, goodCourse, smallCourse, privateCourse} = reslut
    let structuralData = {
      0:groupCourse,
      1:goodCourse,
      2:smallCourse,
      3:privateCourse
    }
    let list = arrangList.map((item,index)=>{
      let obj = item
      obj.num = structuralData[index]
      return obj
    })
    return list
  },
  // 数据处理预约人数
  formatBookingData(group){
    const { courseList } = this.data
    let structuralData = {
      0:group.groupUser,
      1:group.goodUser,
      2:group.smallUser,
      3:group.privateCourse
      
    }
    let list = courseList.map((item,index)=>{
      let obj = item
      obj.num = structuralData[index]
      return obj
    })
    return list
  },
  gotoPage(e){
    const { url, tabbar } = e.currentTarget.dataset
    if(!url){
      wx.showModal({
        title:'功能暂未上线',
        showCancel:false
      })
      return
    }
    if(tabbar){
      // this.getNowFormatDate()
      wx.switchTab({
        url,
      })
      return
    }

    wx.navigateTo({
      url,
    })
  },
  getNowFormatDate() {
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
    let weeks = ['日', '一', '二', '三', '四', '五', '六'];
    let day = new Date().getDay();
    wx.setStorageSync('checkedDate', currentdate)
    wx.setStorageSync('checkedWeek', weeks[day])
    wx.setStorageSync('swiper_current_index', 4)
  },
  gotoMember(e){
    const { link } = e.currentTarget.dataset
    this.data.weblink = link || this.data.weblink
    wx.navigateTo({
      url:this.data.weblink,
    })
  },
  togoweb(e){
    const { url } = e.currentTarget.dataset
    if(!url){
      return
    }
    wx.navigateTo({
      url:'/pages/webViewActivity/index?url=' + url
    })
  },
  getCurrent(e){
    const { current } = e.detail
    const { processType, process } = this.data
    let index = current || 0
    this.data.weblink =  processType[process[current].type].link 
  },
  closeShare(){
    this.setData({
      shareTips:!this.data.shareTips
    })
  },
  goGoodsCenter(){
    wx.navigateToMiniProgram({
              appId: 'wx2cea70df4257bba8',
              path:'/project/6275db59ab8c72f945346489/tasks/view/6275db59d91c0700402c69ee&tag=',
              extraData:{
                foo:'bar'
              },
              envVersion:'release',
              success(res){
                console.log(res)
              }
            })
  },
  //分享
  onShareAppMessage() {
    
  }
})
