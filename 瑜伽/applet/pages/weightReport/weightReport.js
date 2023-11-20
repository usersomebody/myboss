// pages/weightReport/weightReport.js
const app = getApp();
import * as echarts from '../../ec-canvas/echarts';
import { accAdd, accSub, getToDay } from '../../utils/common.js'

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

  /**
   * 页面的初始数据
   */
  data: {
    today:'',
    start_date:'',
    end_date:"",
    showOverlayer:true,
    showTips:true,
    head_url: '/imgs/head_url.png',
    nick_name:'',
    bmiLeft: 245, //60+18为第一段，中间165一段
    bfpLeft: 410,
    report: {},
    analysis: [{
      content: ['你的身体状态-偏低', '人体所需的能量未必充分，可能会给身体带来危害，例如身体免疫力下降，骨质疏松等。建议你综合评价自己的身体状况和日常营养摄入，保持正常的体重和健康的生活方式。']
    }, {
      content: ['你的身体状态-正常', '你的BMI指数正常，是最好的身体状态，可以适当进行一些有氧运动，助你保持身材，远离亚健康。']
    }, {
      content: ['你的身体状态-过重', '建议严格控制饮食，运动过程注意保护膝盖、脚踝等关节，防止重力性受伤，在减肥过程要有足够信心，相信自己可以成功的。']
    }, {
      content: ['你的身体状态-肥胖', 'BMI指数偏高，除了会导致体重超重，身体肥胖之外，冠心病和脑卒中发病率也会随之上升，超重和肥胖是冠心病和脑卒中发病的独立危险因素。', '规律和节制的饮食以及适量的运动会帮助你降低BMI值，建议你遵循循序渐进的原则，前期建议采用低强度、拉伸等静力性运动运动为主。']
    }],
    analysis_content: [],
    suggestions: ['由于肌肉量和脂肪都较少，可以通过运动和饮食增加肌肉量，从而达到正常的BMI的状态。主要以中等强度力量训练为主，每周配合一次有氧运动。力量依次训练大肌群，但由于偏瘦，肌肉相对较少，要注意合理选择器械重量或者直接采取自重进行训练，如练腿部股四头肌、腘绳肌、股二头肌可以选择自重深蹲、弓箭步和自重提踵等；胸肌及肱三头肌可以采用不同角度的俯卧撑、较轻的杠铃推举等；背部斜方肌、三角肌、背阔肌则可以采用引体向上或划船等动作。每个动作6~8次，3~4个动作为一组（可遵循以上动作），3~5组，一周训练3次。在配合饮食下增强力量后慢慢再增加力量训练的负荷。', '可以一周进行三次的力量训练和两次的有氧训练，力量训练可以采用高强度多样式无氧训练，力量训练覆盖所有肌肉群，合理安排每天训练不同的大肌群，例如周一训练臀腿，周三训练胸肌及肱三头肌，周五训练背部肌群及肱二头肌，而腹部则可以周一到周五都可以训练。有氧训练在周二、周四进行，可以采取跑步、游泳、骑车、HIIT等方式进行。周六可以进行一些全身性运动，可以参与一些羽毛球、篮球等运动，周日休息。', '以有氧训练为主，同时配合一些低抗阻力量性训练，有氧训练可以采用快走，游泳，骑行等方式进行，力量训练以全身性大肌群训练为主，每个动作8-12次。再减掉一些体重后间断性的加入高强度间歇运动，心率保持在约最大心率的65%~75%，运动持续时间30~60分钟。特别注意运动要循序渐近，同时严格控制饮食，运动过程注意保护膝盖、脚踝等关节，防止重力性受伤，在减肥过程要有足够信心，相信自己可以成功的。', '身体承受的力量较大，如果进行激烈运动，腹部器官和下肢关节可能会受到严重压迫；所以不建议采用跑步跳绳的对膝关节冲击较大的运动来减脂，遵循循序渐进的原则，前期建议采用低强度、拉伸等静力性运动运动为主，如快走、瑜伽与有氧健身操等较为柔和的运动来使身体适应；力量训练采取自重训练的方式，每个动作6~8次，在经过一段时间后可以适当提高运动强度和时间。将适宜心率保持在约最大心率的65%~75%左右，并且适宜心率维持15min以上，运动持续时间20~40分钟。'],
    suggest_content: '',
    toIndex:'',
    lineArr:{
      2:'偏瘦',
      7:'标准',
      12:'偏胖',
      17:'肥胖',
    },
    lineColor:{
      9:'.lean',
      19:'.standard',
      29:'.chubby',
      39:'.fat_per'
    },
    lineList:[],
    bmiColor:'',
    bfpColor:'',
    IS_AND:false,
    ecLine: {
      onInit: initChart
    },
    differNum:0,
    MAXWEIGHT:0,
    MINWEIGHT:0,
  },

  //获取体重报告
  get_report() {
    const { toIndex } = this.data
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    let data = {
      method: 'user.weight.report'
    }
    let header={};
    if (that.data.token) {
      header = {
        token: that.data.token
      }
    }
    wx.request({
      url,
      data,
      header,
      method: 'POST',
      success: (res) => {
        if(res.data.code == 400){
          wx.removeStorageSync('token');
          if(toIndex){
            wx.redirectTo({
              url: `/pages/login/login?toIndex=${toIndex}`,
            })
          }else{
            wx.navigateTo({
              url: `/pages/login/login?toIndex=${toIndex}`,
            })
          }
        }else
        if (res.data.code == 200) {
          let suggest_content = '',
            analysis_content = [],
            bmiLeft = 0,
            bfpLeft = 0,
            sex = res.data.data.sex,
            bmi = Number(res.data.data.bmi),
            bfp = Number(res.data.data.body_fat);
          switch (true) {
            case (bmi <= 18.4):
              bmiLeft = (78 / 18.4) * bmi;
              suggest_content = that.data.suggestions[0];
              analysis_content = that.data.analysis[0].content;
              break;
            case (bmi >= 18.5 && bmi <= 24):
              bmiLeft = 78 + ((bmi - 18.5) / 5.4) * 165;
              suggest_content = that.data.suggestions[1];
              analysis_content = that.data.analysis[1].content;
              break;
            case (bmi > 24.0 && bmi <= 28):
              bmiLeft = 78 + ((bmi - 18.5) / 9.4) * 330;
              suggest_content = that.data.suggestions[2];
              analysis_content = that.data.analysis[2].content;
              break;
            case (bmi > 28.0):
              suggest_content = that.data.suggestions[3];
              analysis_content = that.data.analysis[3].content;
              bmiLeft = 600;
              break;
          }
          if (sex == 1) {
            switch (true) {
              case (bfp <= 13):
                bfpLeft = (78 / 13) * bfp;
                break;
              case (bfp > 13 && bfp <= 18):
                bfpLeft = 78 + ((bfp - 13) / 5) * 165;
                break;
              case (bfp > 18 && bfp <= 23):
                bfpLeft = 78 + ((bfp - 13) / 10) * 330;
                break;
              case (bfp > 23 && bfp <= 30):
                bfpLeft = 78 + ((bfp - 13) / 17) * 495;
                break;
              case (bfp > 30):
                bfpLeft = 600;
                break;
            }
          } else {
            console.log(1)
            switch (true) {
              case (bfp <= 20):
                bfpLeft = (78 / 20) * bfp;
                break;
              case (bfp > 20 && bfp <= 25):
                bfpLeft = 78 + ((bfp - 20) / 5) * 165;
                break;
              case (bfp > 25 && bfp <= 32):
                bfpLeft = 78 + ((bfp - 20) / 12) * 330;
                break;
              case (bfp > 32 && bfp <= 40):
                bfpLeft = 78 + ((bfp - 20) / 20) * 495;
                break;
              case (bfp > 40):
                bfpLeft = 600;
                break;
            }
          }
          res.data.data.basal_metabolism = Number(res.data.data.basal_metabolism).toFixed(2)
          res.data.data.best_weight = Number(res.data.data.best_weight).toFixed(2)
          let bmiColor = this.rulerSelectColor(parseInt(bmiLeft))
          let bfpColor = this.rulerSelectColor(parseInt(bfpLeft))


          that.setData({
            report: res.data.data,
            suggest_content,
            analysis_content,
            bmiLeft: parseInt(bmiLeft),
            bfpLeft: parseInt(bfpLeft),
            bmiColor,
            bfpColor,
            differNum:Math.abs(accSub(res.data.data.best_weight,res.data.data.weight))
          })
        }
      }
    })
  },
  //查看指数介绍
  lookIntroduction() {
    wx.navigateTo({
      url: '/pages/indexIntroduction/indexIntroduction',
    })
  },
  // 编辑体重信息
  editInfo() {
    this.setData({
      showOverlayer:false
      
    })
    wx.navigateTo({
      url: '/pages/editInfo/editInfo',
    })
  },
  //获取模板消息权限
  get_auth() {
    var that = this;
    that.setData({
      showSubscirbeTip: true
    })
    let tmplIds = ["LOwzFsQEA8Gk0rkadT5Tw2n5tz6lZvrg7jBzuX5S2ig", "xAuaBSPzty2OBrqPx0LNriAX-LQsSDutzkTSh_plZQ0", "l4UJ1HVesKbLpynJ6u0aLPuE2_djuK0_ngL_S1spNm8"];
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
        that.setData({
          showSubscirbeTip: false
        })
        if (arr.length > 0) {
          that.setData({
            have_subscribe: true,
            showSubscirbe: false,
            template_id: arr.join(',')
          })
          that.signUp();
        } else {
          that.setData({
            showSubscirbe: true
          })
        }

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
        console.log(res)
        let subScribe_btn = res.subscriptionsSetting.mainSwitch;
        if (res.subscriptionsSetting.itemSettings) {
          let setting = res.subscriptionsSetting.itemSettings;
          let tmplIds = ["LOwzFsQEA8Gk0rkadT5Tw2n5tz6lZvrg7jBzuX5S2ig", "xAuaBSPzty2OBrqPx0LNriAX-LQsSDutzkTSh_plZQ0", "l4UJ1HVesKbLpynJ6u0aLPuE2_djuK0_ngL_S1spNm8"];
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
        if (arr.length > 0) {
          that.setData({
            have_subscribe: true,
            showSubscirbe: false
          })
        } else {
          that.setData({
            have_subscribe: false
          })
        }
        that.setData({
          subScribe_btn
        })
        // res.subscriptionsSetting = {
        //   mainSwitch: true, // 订阅消息总开关
        //   itemSettings: {   // 每一项开关
        //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
        //     SYS_MSG_TYPE_RANK: 'accept'
        //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
        //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
        //   }
        // }
      },
      fail(res) {
        console.log("调用失败：", res)
      }
    })
  },
  //立即开启订阅
  handleOpenSubsrcibe() {
    var that = this;
    if (that.data.subScribe_btn && !that.data.have_subscribe && !that.data.isAllow) {
      that.get_auth();
    }
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
  closeGuide(){
    this.setData({
      showTips:false
    })
  },
  //标尺处理
  rulerDeal(){
     let list = []
     let len = 52
     for(let idx=0; idx<len; idx+=1){
      let color = ''
      let left = 0
      if(idx <= 9 && idx >= 0 ) color = '.lean', left = 108
      if(idx <= 21 && idx > 9 ) color = '.standard', left = 248
      if(idx <= 31 && idx > 21 ) color = '.chubby', left = 380
      if(idx > 31 ) color = '.fat_per', left = 380
      let obj = {
        color,
      }
      list.push(obj)
     }
     this.setData({
      lineList:list
     })
     console.log('list',list)
  },
  // 标尺选中颜色
  rulerSelectColor(left){
    let colorClass = ''
    switch (true) {
      case left < 108:
      console.log('left',left)
      colorClass = ".lean";
          break;
      case left < 236:
      colorClass = ".standard";
           break;
      case left < 368:
      colorClass = ".chubby";
           break;
      case left >= 368 :
      colorClass = ".fat_per";
           break;
    } 
    return colorClass
  },
  //获取月数据
  get_monthData() {
    let url = app.globalData.baseUrl + '/applet/weight',
      that = this;
    let data = {
      method: 'user.weight.getweightbyday',
      start_date: this.data.start_date,
      end_date: this.data.end_date
    }
    let header = {},token=wx.getStorageSync('token');
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
        } else if (res.data.code == 200) {
          let echartData = this.dealEchartData(res.data.data)
          console.log('echartData',echartData)
          let yData = [],
            xData = [];
          for (let i in echartData) {
              yData.push(echartData[i].weight)
              xData.push(i)
          }
          that.setData({
            total: res.data.data.days
          })
          let option = that.drawLine(xData, yData);
          setTimeout(function () {
            //要延时执行的代码 
            chart.setOption(option);
          }, 300)

        }
      }
    })
  },
   //折线图
   drawLine(xData, yData) {
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
        boundaryGap: true,
        data: xData,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#707070"
          }
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
            color: '#707070',
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
            }
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
  //close
  btnClose(){
    this.setData({
      showOverlayer:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log({options})
   if(options.toIndex){
     this.setData({
       toIndex:options.toIndex || '',
     })
   }
    // this.get_subscribe_auth();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userinfo = wx.getStorageSync('userinfo');
    let head_url = userinfo.avatarUrl;
    let nick_name = userinfo.nickName;
    let token = wx.getStorageSync('token');
    let todayTimes = getToDay()
    const { day, month, year, dayNums } = todayTimes
    this.setData({
      head_url,
      nick_name,
      token,
      IS_AND:app.globalData.android,
      today:`${year}-${month < 10 ? ('0' + month) : month}-${day < 10 ? ('0' + day) : day}`,
      start_date: `${year}-${month < 10 ? ('0' + month) : month}-01`,
      end_date: `${year}-${month < 10 ? ('0' + month) : month}-${dayNums}`
    })
    this.get_report();
    this.rulerDeal()
    this.get_monthData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})