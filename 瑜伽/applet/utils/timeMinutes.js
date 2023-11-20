import moment from './moment.js'
// const start = '2021-07-30 00:00:00'
// const end = '2021-07-30 23:59:59'
// const interval = 60
// const advance = 60
// const bookedList = [{
//   name:'小王',
//   start:'2021-08-04 15:00:00',
//   end:'2021-08-04 16:00:00',
// },{
//   name:'小李',
//   start:'2021-08-04 16:00:00',
//   end:'2021-08-04 17:00:00',
// }]
//拆分显示得时间节点


function timeSeg(start,end,interval,advance,courseTime,courseId,checkedDate){
    //判断当前选择的日期 是否为当天
    let toDayAfter = moment(checkedDate).isAfter(moment(),'day')
    let toDayBefore = moment(checkedDate).isBefore(moment(),'day')
    // 转化为以小时和分钟为单位得moment 对象
    let starTime = moment(moment(start).format('HH:mm'),"HH:mm"); 
    let endTime = moment(moment(end).format('HH:mm'),"HH:mm");
    let current = moment(moment().format('HH:mm'),"HH:mm")
    //通过diff算法 计算结束时间和开始时间以 interval 为间隔得数量
    let diff = moment(endTime).diff(moment(starTime), "minutes");
    // let num = Math.ceil(diff / interval);
    let num = Math.floor(diff / interval)
    //计算每个时间节点对应得时间
    var segs = []
    for (let i = 1; i <= num + 1; i++) {
      let timeFrom = starTime.clone().add((i - 1) * interval, "minutes") //拆分出来的每个时间节点
      let timeTo = starTime.clone().add(i * interval, "minutes");//拆分出来的每个时间节点 加上 时间间隔后的时间
      let courseTimeTo = starTime.clone().add(i * courseTime, "minutes");//拆分出来的每个时间节点 加上 课程时间后的时间
      // let currentTime = current.clone().add(interval, "minutes"); //当前时间 + 课程市场
      let currentTime = current.clone().add(courseTime, "minutes"); //当前时间 + 课程市场
      let currentTimes = current.clone().add(advance, "minutes");//提前多少分钟才可以预约
      let minutes = timeFrom.minutes();
      let hour = timeFrom.hour()

      segs.push({
        isBeyond:toDayAfter ? false : toDayBefore ? true : moment(current).isAfter(timeFrom,'minutes'), //当前时间不可在预约时间之后
        isBeyondEnd:toDayAfter ? false : toDayBefore ? true : moment(currentTime).isAfter(courseTimeTo,'minutes'),//当前时间 + 间隔时间不可在预约时间之后
        isAdvance:moment(currentTimes).isAfter(timeFrom,'minutes'),//当前时间 + 提前多少时间 不可再预约时间之后 提前预约时间
        imgUrl:toDayAfter ? '' : toDayBefore ? 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_pass.png' :  moment(current).isAfter(timeFrom,'minutes') ? 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_pass.png' : '',
        timeFrom: timeFrom.format("HH:mm"),
        timeTo: timeTo.format("HH:mm"),
        courseTimeTo:courseTimeTo.format("HH:mm"),
        seg:minutes === 0 ? true :false,
        select:false,
        courseId,
        // title:(hour < 12 ? "上午":"下午") + hour + '点'
      });
    }
    return segs
}

function timeSegRest(start,end,interval){
  // 转化为以小时和分钟为单位得moment 对象
  let starTime = moment(moment(start).format('HH:mm'),"HH:mm"); 
  let endTime = moment(moment(end).format('HH:mm'),"HH:mm");
  let current = moment(moment().format('HH:mm'),"HH:mm")
  //通过diff算法 计算结束时间和开始时间以 interval 为间隔得数量
  let diff = moment(endTime).diff(moment(starTime), "minutes");
  let num = Math.ceil(diff / interval);
  //计算每个时间节点对应得时间
  var segs = []
  for (let i = 1; i <= num; i++) {
    let timeFrom = starTime.clone().add((i - 1) * interval, "minutes") //拆分出来的每个时间节点
    let timeTo = starTime.clone().add(i * interval, "minutes");//拆分出来的每个时间节点 加上 时间间隔后的时间
    let minutes = timeFrom.minutes();
    let hour = timeFrom.hour()
    segs.push({
      imgUrl: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_store.png',
      timeFrom: timeFrom.format("HH:mm"),
      timeTo: timeTo.format("HH:mm"),
    });
  }
  return segs
}

function copyTimeSeg(start,end,interval){
  // 转化为以小时和分钟为单位得moment 对象
  let starTime = moment(start,"HH:mm"); 
  let endTime = moment(end,"HH:mm");
  console.log('{starTime,endTime}',{starTime,endTime})
  let current = moment(moment().format('HH:mm'),"HH:mm")
  //通过diff算法 计算结束时间和开始时间以 interval 为间隔得数量
  let diff = moment(endTime).diff(moment(starTime), "minutes");
  let num = Math.ceil(diff / interval);
  //计算每个时间节点对应得时间
  var segs = []
  for (let i = 1; i <= num + 1; i++) {
    let timeFrom = starTime.clone().add((i - 1) * interval, "minutes") //拆分出来的每个时间节点
    let timeTo = starTime.clone().add(i * interval, "minutes");//拆分出来的每个时间节点 加上 时间间隔后的时间
    let minutes = timeFrom.minutes();
    let hour = timeFrom.hour()
    segs.push({
      timeFrom: timeFrom.format("HH:mm"),
      timeTo: timeTo.format("HH:mm"),
      seg:minutes === 0 ? true :false,
      select:false,
      isEndTime:i == num + 1 ? true : false
      // title:(hour < 12 ? "上午":"下午") + hour + '点'
    });
  }
  return segs
}

//已约时间进行拆分时间点
function formattTimeDivision(bookedList,interval){
  bookedList.forEach((item)=>{
    let start = moment.unix(item.curriculum_time).format('HH:mm')
    // let end = moment.unix(item.curriculum_time).clone().add(20, "minutes").format('HH:mm')
    let end = moment.unix(item.end_time).format('HH:mm')
    item.bookingStart = start//被占用掉的开始时间节点
    item.bookingend = end//被占用掉的结束时间节点
    item.timeDate = copyTimeSeg(start,end,interval)//被占用掉的具体时间节点对象
    // item.bookingStart = moment(item.start).format('HH:mm')
    // item.bookingend = moment(item.end).format('HH:mm')
  })
  return bookedList
}


function showDataTime(defaultValue,bookedData, bookingList, groupSetTime, restList){
  console.log({defaultValue,bookedData, bookingList, groupSetTime})
  // let userSelect = bookingList.timeDate ? levelOneToObj(bookingList.timeDate) :  {}
  //如果一个人一天可以预约多次 放出代码
  let userSelect = {}
  bookingList.forEach((item)=>{
    userSelect = {...userSelect,...levelOneToObj(item.timeDate.slice(0,item.timeDate.length - 1))}
  }) 
  let arrToObj = toObj(bookedData)
  let restToObj = levelOneToObj(restList)
  defaultValue.forEach(item=>{
    item.isBooked = arrToObj[item.timeFrom] && item.timeFrom != arrToObj[item.timeFrom].bookingend ? true : false //逻辑调整 结束的时间节点不需要选中 依然可约
    item.imgUrl = userSelect[item.timeFrom] && (item.courseId == arrToObj[item.timeFrom].course_arrange_id) ? 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211207/1f455638b0eda8daffa8836bd44b574d.png' : arrToObj[item.timeFrom] && item.timeFrom != arrToObj[item.timeFrom].bookingend ? 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_full.png' : item.imgUrl//逻辑调整 结束的时间节点不需要选中 依然可约
    item.select = userSelect[item.timeFrom] ? true : false
    item.userBooked = userSelect[item.timeFrom] ? true : false
    groupSetTime.forEach((itm)=>{
      if(itm.start_time == item.timeFrom || itm.end_time == item.timeFrom || moment(itm.start_time,'HH:mm').isBetween(moment(item.timeFrom,'HH:mm'),moment(item.timeTo,'HH:mm'),'minutes')  || moment(itm.end_time,'HH:mm').isBetween(moment(item.timeFrom,'HH:mm'),moment(item.timeTo,'HH:mm'),'minutes') || moment(item.timeFrom,'HH:mm').isBetween(moment(itm.start_time,'HH:mm'),moment(itm.end_time,'HH:mm'),'minutes')){
        item.group = true
        item.imgUrl = item.imgUrl ? item.imgUrl : 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_group.png'
      }
    })
    restList.forEach((itm)=>{
      if(itm.timeFrom == item.timeFrom || itm.timeTo == item.timeFrom || moment(itm.timeFrom,'HH:mm').isBetween(moment(item.timeFrom,'HH:mm'),moment(item.timeTo,'HH:mm'),'minutes')  || moment(itm.timeTo,'HH:mm').isBetween(moment(item.timeFrom,'HH:mm'),moment(item.timeTo,'HH:mm'),'minutes') || moment(item.timeFrom,'HH:mm').isBetween(moment(itm.timeFrom,'HH:mm'),moment(itm.timeTo,'HH:mm'),'minutes')){
        item.restTime = true
        // item.imgUrl = item.imgUrl ? item.imgUrl : 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211204/3ffa87cf6ba68e2299217a958e34c3ca.png'
        item.imgUrl = 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211204/3ffa87cf6ba68e2299217a958e34c3ca.png'
      }
    })
    // item.groupCourse = groupList[item.timeFrom] ? true :false
  })
  return defaultValue
}

//数组转化为对象 进行数据对比
function toObj(bookedData){
  let timeInfo = {}
  bookedData.forEach((item)=>{
    item.timeDate.forEach(itm=>{
      timeInfo[itm.timeFrom] = item
    })
  })
  return timeInfo
}

function levelOneToObj(bookedData){
  let timeInfo = {}
  bookedData.forEach(itm=>{
    timeInfo[itm.timeFrom] = itm
  })
  return timeInfo
}

export {
    timeSeg,
    formattTimeDivision,
    showDataTime,
    copyTimeSeg,
    toObj,
    levelOneToObj,
    timeSegRest
}