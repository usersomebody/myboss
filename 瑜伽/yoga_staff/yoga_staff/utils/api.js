let isDev = true
// baseUrl:'https://yoga.mnancheng.com',//正式
//baseUrl:'https://yg.mnancheng.com'
const baseUrl = isDev ? 'https://test.yoga.mnancheng.com' : 'https://yoga.mnancheng.com'
const api = {
    //图片上传
    uploadImg:'/merchant/system.upload/uploadImg',
    getCheckCode:'/venue/staff.login/getCode',// 获取验证码
    registered:'/venue/staff.login/registered',//注册
    loginChain:'/venue/staff.login/loginChain',//密码登录
    loginCode:'/venue/staff.login/loginCode',//验证码登录
    getAccessStoreList:'/venue/store.store/loginChain',//店铺列表
    
    courseTypeList:'/venue/store.course/getCourseType',//课程类型
    getAllCourseForCard:'/venue/store.card/getAllCourseForCard',//支持课程
    storeIndex:'/venue/staff.index/index',//店铺首页
    groupCourseList:'/venue/store.course/getAllCourse',//团课&私教列表数据
    scheduleList:'/venue/store.Schedule/getSchedule',//课表数据    
    switchStore:'/venue/store.store/switchStore',//店铺列表
    courseBookingDetail:'/venue/store.course/groupDataDetail',//课程预约详情
    courseBookingList:'/venue/store.course/groupDetail',//课程预约列表
    copyScheduleNextWeek:'/venue/store.Schedule/copyScheduleNextWeek',//复制课表数据到下周

    searchBookingUser:'/venue/user.user/getAllUser',// 搜索查询预约会员列表
    vipCardList:'/venue/user.UserCard/getUserAllCard',//会员可用的会员卡列表
    privateCourseList:'/venue/user.user/privateSubscribeTimes',//私教课程排课时间
    subscribeCourse:'/venue/user.user/subscribeCourse',//课程代约
    cancleQueue:'/venue/user.user/cancelQueue',//取消排队
    bookingSign:'/venue/user.user/signSchedule',//课程签到
    bookingCancle:'/venue/user.user/cancelSubscribeCourse',//课程预约
    bookingCardCost:'/venue/user.user/getCost',//选中会员卡的消耗

    editSchedule: '/venue/store.schedule/editSchedule',//排课编辑 团课
    addSchedule: '/venue/store.schedule/addSchedule',//添加排课 团课
    deleteSchedule: '/venue/store.schedule/delSchedule',//删除排课 团课
    addPrivateSchedule:'/venue/store.schedule/addSchedulePrivate',//排课添加 私教
    delPrivateSchedule:'/venue/store.schedule/delSchedulePrivate',//删除排课 私教
    searchScheduleName: '/venue/store.schedule/getAddCourse',//课程名称搜索查询
    configList:'/venue/store.schedule/getStoreConfig',//教练列表//教室列表//提前预约时间

    staffList:'/venue/store.schedule/getSchedulePrivate',//私教教练列表

    vipList:'/venue/user.user/getUserList',//会员列表
    setStar:'/venue/user.user/setUserStar',//星标会员
    userDetail:'/venue/user.user/userDetail',//用户信息
    bookingDetailList:'/venue/user.user/getAllSubscribeCourse',//预约详情列表

    canUseCardList:'/venue/store.card/getAllGrantCard',//用户发卡可用会员卡
    addCard:'/venue/user.UserCard/userCreateCard',//添加会员卡

    addUserConfig:'/venue/user.user/addUserConfig',//新增会员获取教练等信息
    addUser:'/venue/user.user/addUser',//新增用户
    getUserDetail:'/venue/user.user/getUserDetail',//会员详情
    getUserInfo:'/venue/user.user/getUserInfo',//获取会员信息
    editUserAndCard:'/venue/user.user/editUserAndCard',//修改会员信息
    getOperaAllCard:'/venue/user.userCard/getAllCard',//卡操作可以获取的会员卡

    getCardList:'/venue/store.card/getCardList',//会员卡列表

    operaCard:"/venue/user.userCard/changeUserCard",//卡操作
    cardDetail:'/venue/store.card/cardDetail',//会员卡详情
    addNewCard:'/venue/store.card/addCard',//新增会员卡
    editCard:'/venue/store.card/editCard',//编辑会员卡
    delCard:'/venue/store.card/delCard',//删除会员卡

    leaveEnd:'/venue/user.userCard/stopLeave',//请假结束
    deleteCard:'/venue/user.userCard/delUserCard',//删除会员卡
    //管理
    cancelCourse:'/venue/store.course/cancelCourse',//课程取消提醒列表

    sendMsgInfo:'/venue/user.user/sendMsgTemplate',//发送消息
    moneyInsufficient:'/venue/user.user/getCardTypeData',//余额不足卡card列表 type:2,3次数卡
    isNotActiveMember:'/venue/user.user/getSubscribeData',//不活跃会员
    brithMember:'/venue/user.user/getListForBirthday',//生日会员
    expireMember:'/venue/user.user/getExpireData',//即将到期会员
    isNotActiveMemberDown:'/venue/store.schedule/downloadSchedule',//不活跃会员本周课表下载
    brithMsg:'/venue/user.user/message',//生日消息

    leaveList:'/venue/user.user/getLeaveList',//请假列表
    leaveAudit:'/venue/user.user/setLeaveStatus',//请假审批

    //活动
    activityList:'/venue/activity.ActivityData/getActivityList',//活动列表
    orderDetail:'/venue/activity.ActivityData/activityHelpCounts',//订单详情
    orderList:'/venue/activity.ActivityData/activityHelpList',//订单列表
    addHelpActivity:'/venue/activity.help/addActivityHelp',//添加助力登顶
    addKillsActivity:'/venue/activity.Seckill/addActivitySeckill',//添加限时秒杀
    updateHelpActivity:'/venue/activity.help/editActivityHelp',//修改助力登顶
    updateKillsActivity:'/venue/activity.Seckill/editActivitySeckill',//修改限时秒杀
    prizeWinList:'/venue/activity.lotto/activityWinList',//中奖列表
    activityWinInfo:'/venue/activity.lotto/activityCounts',//转盘中奖信息
    verificationPrizeCode:'/venue/activity.lotto/verificationPrizeCode',//转盘兑奖
    setEnd:'/venue/activity.lotto/setEnd',//转盘结束
    addActivityLotto:'/venue/activity.lotto/addActivityLotto',//添加转盘活动
    editActivityLotto:'/venue/activity.lotto/editActivityLotto',//编辑转盘活动
    getActivityInfo:'/venue/activity.lotto/getActivityInfo',//获取转盘活动信息
    addActivityCluster:'/venue/activity.Cluster/addActivityCluster',//添加拼团
    editActivityCluster:'/venue/activity.Cluster/editActivityCluster',//修改拼团

    // 资讯
    informationList:'/venue/chosen.news/getNoticeList',//资讯列表
    informationDetail:'/venue/chosen.news/getNoticeInfo',//资讯详情
    setList:'/venue/chosen.NewsOp/setLike',//点赞
    addShare:'/venue/chosen.NewsOp/addShare',//增加分享
    setCardInfo:'/venue/chosen.diyStoreInfo/setCardInfo',//设置自定义名片信息
    getDiyInfo:'/venue/chosen.news/getDiyInfo',//获取自定义门店信息
    setQr:'/venue/chosen.diyStoreInfo/setQr',//设置二维码

    getProvinces:'/merchant/system.address/getAllAddressByLevel',//获取省
    getCity:'/merchant/system.address/getSonAddress',//获取市区

    // 课程模块
    getCourseList:'/venue/store.course/getCourseList',
    getCourseConfig:'/venue/store.course/getCourseConfig',//课程基本配置信息
    getAllCard:'/venue/store.course/getAllCard',//所有会员卡
    addCourse:'/venue/store.course/addCourse',//添加课程
    editCourse:'/venue/store.course/editCourse',//编辑课程
    delCourse:'/venue/store.course/delCourse',//删除课程
    getCourseInfo:'/venue/store.course/getCourseInfo',//获取课程信息

    getSettingConfig:'/venue/store.store/getConfigInfo',//预约配置信息
    editSettingConfig:'/venue/store.store/editConfig',//预约设置

    //员工模块
    memberList:'/venue/staff.staff/getStaffList',//员工列表
    addStaff:'/venue/staff.staff/addStaff',//员工列表
    editStaff:'/venue/staff.staff/editStaff',//修改员工
    getStaff:'/venue/staff.staff/getStaff',//员工详情
    delStaff:'/venue/staff.staff/delStaff',//删除员工
    getAllRoleForStoreIds:'/venue/auth.role/getAllRoleForStoreIds',//新增职员获取配置
    getAuthRole:'/venue/auth.role/getAuthRole',//添加角色获取权限列表
    addSkilled:'/venue/staff.Skilled/addSkilled',//添加擅长技能
    delSkilled:'/venue/staff.Skilled/delSkilled',//删除擅长技能
    //基本设置
    getIdentityList:'/venue/auth.role/getAllRole',//获取角色列表
    editRole:'/venue/auth.role/editRole',//修改角色
    addRole:'/venue/auth.role/addRole',//添加角色
    delRole:'/venue/auth.role/delRole',//删除角色
    getStoreInfo:'/venue/store.store/getStoreInfo',//店铺信息
    editStore:'/venue/store.store/editStore',//修改店铺
    withdrawList:'/venue/staff.staff/withdrawList',//提现列表
    wxLogin:'/venue/staff.staff/wxLogin',//提现授权
    withdraw:'/venue/staff.staff/withdraw',//提现
    classroom:'/venue/store.store/getClassRoomList',//教室列表
    classroomSet:'/venue/store.store/editClassRoom',//修改教室
    classroomAdd:'/venue/store.store/addClassRoom',//添加教室
    classroomDel:'/venue/store.store/delClassRoom',//删除教室
    labelList:'/venue/user.label/getLabelList',//标签列表
    labelAdd:'/venue/user.label/addLabel',//添加标签
    labelEdit:'/venue/user.label/editLabel',//修改标签
    labelDel:'/venue/user.label/delLabel',//删除标签

    coachStaff:'/venue/staff.staff/coachStaff',//教练首页展示
    editCoachStaff:'/venue/staff.staff/editCoachStaff',//修改教练首页

    picIndex:'/venue/store.store/picIndex',//首页轮播图
    picIndexEdit:'/venue/store.store/picIndexEdit',//修改首页轮播图
    getLat:'/venue/store.store/getLat',//获取经纬度
    //体测
    addRecordBefore: '/venue/fitness.TestRecord/addRecordBefore',//默认基础配置
    addRecord: '/venue/fitness.TestRecord/addRecord',//新增体测数据
    editRecord:'/venue/fitness.TestRecord/editRecord',//修改体测数据
    delRecord:'/venue/fitness.TestRecord/delRecord',//删除体测数据
    getRecordList:'/venue/fitness.testRecord/getRecordList',//体测列表
    getRecordInfo:'/venue/fitness.testRecord/getRecordInfo',//获取体重信息
    getContras:'/venue/fitness.testRecord/getContrast',//获取体重对比时间
    getContrastDetail:'/venue/fitness.testRecord/getContrastDetail',//获取对比记录
    addRecordTime:'/venue/fitness.testRecord/addRecordTime',//体测时间数据

    // 公告
    announceList:'/venue/store.store/announce',//公告列表
    delAnnounce:'/venue/store.store/delAnnounce',//删除公告
    addAnnounce:'/venue/store.store/addAnnounce',//添加删除公告

    //积分

    integralList:'/venue/user.account/accountDetail',
    accountConfig:'/venue/user.account/accountConfig',
    editAccountConfig:'/venue/user.account/editAccountConfig',
    accountInfo:'/venue/user.account/accountInfo',
    checkAccount:'/venue/user.account/checkAccount',

    //评价
    commentIndex:'/venue/store.comment/commentIndex',
    editConfigEva:'/venue/store.store/editConfigEva',
    commentList:'/venue/store.comment/commentList',
    commentReplyList:'/venue/store.comment/commentReplyList',
    commentReply:'/venue/store.comment/commentReply',
    setCommentStatus:'/venue/store.comment/setCommentStatus',
    commentDel:'/venue/store.comment/commentDel',
    

    // 帮助中心
    qaQuestion:'/venue/store.store/qaQuestion',//问题
    qaQuestionAnswer:'/venue/store.store/qaQuestionAnswer', //详情

    getQrCode:'/venue/store.store/getStoreQr',//获取签到二维码
    qrCode:'/venue/chosen.News/qrCode'//获取小程序码
}
export {
    api,
    baseUrl
}