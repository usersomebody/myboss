// pages/teacher/teacher.js
import * as echarts from '../../ec-canvas/echarts';
import { api } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { formatParagraph, filterEOF, accAdd, accSub, getToDay } from '../../utils/common.js'
import { isLast } from '../../utils/loadMore.js'
import { showData } from './bodyPosition.js'

const app = getApp()

let chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var option = {};
  chart.setOption(option);
  return chart;
}
Page({
    data:{
        page:1,
        size:50,
        totalCount:0,
        list:[],
        isLast:false,
        ecLine: {
            onInit: initChart
        },
        start_date:'',
        end_date:'',
        today:'',
        MAXWEIGHT:'',
        MINWEIGHT:'',
        phone:'',
        vipType:'',
        name:'',
        showOverlayer:false,
        dataCompareBox:false,
        popupBox:false,
        popupData:{
          name:'',
          tips:'给您录入新的体测数据啦~',
          staff_name:'',
          content:"检测到您还没有上传体测数据哦~",
          msg1:'录入数据可以查看自己的身体变化趋势，',
          msg2:'联系老师或者自己动手录入吧',
          changeData:[{
            img:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220112/73ea663f9d6d0069c0480eaf253aaca9.png",
            list:[{
              text:'',
              value:'',
              unit:''
            }]
          },{
            img:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220112/fa6edbd95f9bb39d63e9b02ebe07229f.png",
            list:[]
          },{
            img:"https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220112/ff514152aa52d08996fb97d647e3fd15.png",
            list:[{
              text:'其余数据保持平衡，未发生变化',
              value:'',
              unit:''
            }]
          }],
          goBtn:'我自己录入',
          closeBtn:'我知道了',
          type:3,
          cover:{
            1:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220112/97554b480d26a642a4ac850c74d37521.png',
            2:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220112/b007dde8233ff6381f99b1b40f8873aa.png',
            3:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220112/c48452909ac841313fc5a889ace061e7.png'
          },
        },
        
    },
    onLoad(){
        this.setData({
            phone:wx.getStorageSync('phone'),
            vipType:wx.getStorageSync('user_type') == 1 ? 1 : 2,
            name:wx.getStorageSync('userinfo').nickName
        })
        this.getPopupData()
    },
    onShow(){
        this.setData({
            page:1,
            size:10,
            totalCount:0,
            list:[],
            isLast: false
        })
        this.getRecordList(this.contactList)

        let todayTimes = getToDay()
        const { day, month, year, dayNums } = todayTimes
        this.setData({
            today:`${year}-${month < 10 ? ('0' + month) : month}-${day < 10 ? ('0' + day) : day}`,
            start_date: `${year}-${month < 10 ? ('0' + month) : month}-01`,
            end_date: `${year}-${month < 10 ? ('0' + month) : month}-${dayNums}`
        })
        this.get_monthData()
    },
    onReachBottom () {
        if (this.data.isLast) return
        this.data.page++
        this.setData({
          page: this.data.page
        })

        this.getRecordList(this.contactList)
      },
      contactList(list) {
        this.data.list = this.data.list.concat(list)
    },
    addRecord(){
        const { vipId, vipType, phone, name } = this.data
        wx.navigateTo({
            url: `/pages/bodyData/addBodyData?type=${vipType}&phone=${phone}&name=${name}`
        })
    },
    showPopupBox(e){
      console.log(e)
      const { showOverlayer } = this.data
      const { type } = e.currentTarget.dataset
      if(type == 1){
        this.setData({
          dataCompareBox:true,
          showOverlayer:!showOverlayer,
        })
      }
    },
    toggleBox(){
        const { showOverlayer } = this.data
        this.setData({
            showOverlayer:!showOverlayer,
            dataCompareBox:false
        })
    },
    closePopup(){
      this.setData({
        popupBox:false,
        showOverlayer:false
      })
    },
    next(e){
        const { vipType, phone, name } = this.data
        
        const { type } = e.currentTarget.dataset
        let url = `/pages/bodyData/bodyDataCompare?type=${vipType}&ctype=${type}&phone=${phone}&name=${name}`
        wx.navigateTo({
            url: url
        })
    },
    getRecordList(callback){
        const { vipId, vipType, userInfo,page, size } = this.data
        request({
            url:app.globalData.baseUrl + api.testRecord,
            data:{
                phone:wx.getStorageSync('phone') || '',
                type:wx.getStorageSync('user_type') == 1 ? 1 : 2,
                store_id: wx.getStorageSync('store_id') || '',
                page,
                size,                
                user_id:wx.getStorageSync('user_id'),
                method:'fitness.getrecordlist',
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                let data = res == null ? [] : res
                if (callback) callback(data)
                this.setData({
                  list: this.data.list,
                  totalCount: 0
                })
                if (isLast(this.data.page, this.data.totalCount, this.data.size)) {
                    this.setData({
                    isLast: true
                  })
                }
                this.setData({
                  loading: false
                })
            }
        }).catch((err)=>{
            this.setData({
                isLast: true
              })
        })
    },
    checkBodyDetail(e){
        const { vipType, phone, name } = this.data
        const { id } = e.currentTarget.dataset
        let url = `/pages/bodyData/editBodyData?rid=${id}&type=${vipType}&phone=${phone}&name=${name}`
        wx.navigateTo({
            url: url
        })
    },
    //获取月数据
  get_monthData() {
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    request({
        url:app.globalData.baseUrl + api.testRecord,
        data:{
            phone:wx.getStorageSync('phone'),
            type:wx.getStorageSync('user_type') == 1 ? 1 : 2,
            store_id: wx.getStorageSync('store_id'),
            method:'fitness.getrecordcharts',
            user_id:wx.getStorageSync('user_id')
          },
        method:'POST',
        isTologin:true,
        success:(res)=>{
          console.log('res',res)
            if(res == null){
              return
            }
            // let echartData = this.dealEchartData(res)
            let yData = [],
            xData = [];
            for (let i in res) {
                yData.push(res[i].weight)
                xData.push(i)
            }
            let option = that.drawLine(xData, yData);
            setTimeout(function () {
            //要延时执行的代码 
                chart.setOption(option);
            }, 300)
        }
    })
  },
   //折线图
   drawLine(xData, yData) {
     console.log('xData',xData)
    var option = {
      color: ["#37A2DA", "#21DBC3", "#9FE6B8"],
      renderAsImage: true,
      animationDuration: 1500,
      legend: {
        data: ['日期', '体重'],
        top: 20,
        left: 'center',
        backgroundColor: '#fff',
        z: 100
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          for (let x in params) {
            return "时间:" + params[x].name + "\n" + "体重:" + params[x].data + 'kg';
          }
        }
      },
      xAxis: {
        splitLine: {
          show: false
        },
        type: 'category',
        boundaryGap: false,
        data: xData,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#707070"
          },
        },
        axisLabel: {
          interval:0,
          textStyle: {
            fontSize:10   //这里用参数代替了
          }
          // rotate:290,
        },
        minInterval: 0,
        xAxisIndex: [0],
      },
      yAxis: {
        splitLine: {
          show: false
        },
        type: "value",
        name: "体重(kg)",
        max: Math.max(5, Math.max.apply(null, yData)),
        axisLine: {
          show: true,
          lineStyle: {
            color: "#707070"
          },
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#e5e6e7',
            type: 'solid',
          }
        }
      },
      series: [{
        name: '',
        type: 'line',
        smooth: true,
        data: yData,
        itemStyle: {
          normal: {
            color: '#9169FB',
            lineStyle: {
              color: "#9169FB",
              width: 1
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#FFFFFF'
              }, {
                offset: 1,
                color: '#9169FB'
              }]),
            },
          }
        },
      }]
    };
    return option;
  },
  //echartDATA处理
  dealEchartData(data){
    const { today } = this.data
    let showData = []
    let list = []
    //过滤有效值
    for(let i in data){
      if(data[i].weight){ 
        list.push(data[i])
      }
    }
    //取最大最小值
    let Max_Min = list.sort((current,next)=>{
      return accSub(current.weight, next.weight)
    })

    let MAX = Max_Min[Max_Min.length-1]
    let MIN = Max_Min[0]

    this.setData({
      MAXWEIGHT:MAX,
      MINWEIGHT:MIN
    })
    //取当前日期的值
    let currentVal = list.filter(item=>{
      return item.date == today
    })
    showData = [...[MIN],...currentVal,...[MAX]]
    let Max_Min_Time = showData.sort((current,next)=>{
      return accSub(current['max(timeline)'],next['max(timeline)'])
    })
    let ECHARTDATA = this.toObj(Max_Min_Time)
    return ECHARTDATA
  },
  //转对象
  toObj(data){
    let info = {}
    data.forEach((item)=>{
      info[item.date] = item
    })
    return info
  },
  getPopupData() {
    // -1 不弹框 1未加过记录 2一段时间内未加过记录 3记录对比
    request({
        url:app.globalData.baseUrl + api.testRecord,
        data:{
            phone:wx.getStorageSync('phone'),
            type:wx.getStorageSync('user_type') == 1 ? 1 : 2,
            store_id: wx.getStorageSync('store_id'),
            user_id:wx.getStorageSync('user_id'),
            method:'fitness.recordflip',
        },
        method:'POST',
        isTologin:true,
        success:(res)=>{
          if(res.type != '-1'){
            this.setData({
              showOverlayer:true,
              popupBox:true
            })
          }
          if(res.type == 3){
            this.showDataFormat(res)
          }else{
            this.popupDataInit(res)
          }
        }
    })
  },
  popupDataInit(popupObj){
    const { last_record, name, type } = popupObj
    let { popupData } = this.data
    let obj = {
      name: `@${name || '嘤嘤怪'} 上午好`,
      content: type == 2 ? `距离您上次录入数据超过${last_record || 30}天啦~` : popupData.content,
      msg1: type == 2 ? '最近是否有新的变化呢，' : popupData.msg1,
      msg2: type == 2 ? '快来上传新的数据，一起见证您的变化吧~' : popupData.msg2,
      goBtn: type == 2 ? '前往录入' : popupData.goBtn,
      type:type
    }
    popupData = {...popupData,...obj}
    this.setData({
      popupData
    })
  },
  showDataFormat(popupObj){
    const { record_list:list,staff_name, name } = popupObj
    const { popupData } = this.data
    if(list.length < 2){
      return
    }
    let data = this.toObj(showData)
    list.forEach((item)=>{
      for(let key in data){
        data[key].value.push(item[key])
      }
    })
    let showList = this.dataToArray(data)
    // 提取数据
    let riseList = showList.filter((item)=>{
      return item.type == 2
    })
    let rise = riseList.map((item)=>{
      let obj = {
        text:`${item.name}上涨了`,
        value:item.changeValue,
        unit:item.unit
      }
      return obj
    })
    let declineList = showList.filter((item)=>{
      return item.type == 3
    })
    let decline = declineList.map((item)=>{
      let obj = {
        text:`${item.name}下降了`,
        value:Math.abs(item.changeValue),
        unit:item.unit
      }
      return obj
    })
    console.log({riseList,declineList})
    popupData.changeData[0].list = rise
    popupData.changeData[1].list = decline
    popupData.staff_name = staff_name
    popupData.name = `@${name} 上午好`
    this.setData({
      popupData
    })

  },
  toObj(list){
    let info = {}
    list.forEach(element => {
      info[element.key] = element
    });
    return info
  },
  // 转化数组
  dataToArray(data){
    let list = []
    for(let key in data){
      let changeValue = accSub(data[key].value[0],data[key].value[1])
      data[key].changeValue = changeValue
      data[key].type = changeValue == 0 ? 1 : changeValue > 0 ? 2 : 3
      list.push(data[key])
    }
    return list
  },

})