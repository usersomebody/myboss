import moment from '../../utils/moment.js'
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { accSub } from '../../utils/common.js'

const app = getApp()
const { uploadImg, getContras, getContrastDetail } = api
Page({
    data:{
        swiper:{
            indicatorDots: true,
            left:'40rpx',
            indicatorColor:'rgba(255,255,255,.5)',
            indicatorActiveColor:'#FFFFFF'
          },
          banner:[],
          recordList:[
              {
                fitness_test_time:'2021-12-12',
                  imgs:[{
                      url:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211203/a06f24ea34ac4a72566f7d0d9fbf30fe.png',
                      type:1,
                      cover_url:''
                  }]
              },
              {
                fitness_test_time:'2021-12-20',
                  imgs:[{
                      url:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211203/a06f24ea34ac4a72566f7d0d9fbf30fe.png',
                      type:1,
                      cover_url:''
                  }]
              }
          ],
          vipId:'',
          vipType:'',
          ctype:'',
          compareData:{},
          showData:[{
            name:'身高',
            key:'height',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[],
          },{
            name:'体重',
            key:'weight',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'kg',
            value:[]
          },{
            name:'BMI',
            key:'bmi',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'kg/m^2',
            value:[]
          },{
            name:'体脂',
            key:'body_fat',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'%',
            value:[]
          },{
            name:'上臂围（左）',
            key:'upper_arm_left',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          },{
            name:'上臂围（右）',
            key:'upper_arm_right',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          },{
            name:'下臂围（左）',
            key:'lower_arm_left',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          },{
            name:'下臂围（右）',
            key:'lower_arm_right',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          },{
            name:'胸围',
            key:'chest',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          },{
            name:'腰围',
            key:'waist',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          },{
            name:'臀围',
            key:'hip',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          },{
            name:'大腿围（左）',
            key:'big_leg_left',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          },{
            name:'大腿围（右）',
            key:'big_leg_right',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          },{
            name:'小腿围（左）',
            key:'small_leg_left',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          },{
            name:'小腿围（右）',
            key:'small_leg_right',
            type:1,//1不变2上升3下降
            changeValue:0,
            unit:'cm',
            value:[]
          }],
          changeImage:{
            1:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220106/c9fdecf88f01fe9cc97173630a47c732.png',
            2:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220106/ddd5b37e6b60edfaabcea1cf9671ff46.png',
            3:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220106/94f7a2aea9e416480efd892401e50c92.png'
          },
          showOverlayer:false,
          posterList:[],
          timeArr:[],
          logo:''
    },
    onLoad(options){
        this.setData({
            name:options.name,
            recordList:app.globalData.compareData,
            ctype:options.ctype,
            logo:wx.getStorageSync('user_info').avatar
        })
        
        //处理显示的数据结构
        this.showDataFormat(app.globalData.compareData)
    },
    onShow(){

    },
    showDataFormat(list){
      const { showData } = this.data
      let data = this.toObj(showData)
      let timeArr = []
      list.forEach((item)=>{
        timeArr.push(item.fitness_test_time)
        for(let key in data){
          data[key].value.push(item[key])
        }
      })
      let showList = this.dataToArray(data)
      // 提取数据
      let posterList = ['','','其余数据保持平衡，未发生变化']
      let riseList = showList.filter((item)=>{
        return item.type == 2
      })
      let declineList = showList.filter((item)=>{
        return item.type == 3
      })
      if(riseList.length){
        let str = ''
        riseList.forEach((item)=>{
          str = str + `${item.name}上涨了${Math.abs(item.changeValue)}${item.unit}` + ' '
        })
        posterList[0] = str
      }
      if(declineList.length){
        let str = ''
        declineList.forEach((item)=>{
          str = str + `${item.name}下降了${Math.abs(item.changeValue)}${item.unit}` + ' '
        })
        posterList[1] = str
      }
      this.setData({
        posterList,
        timeArr,
        showOverlayer:true,
        showData:showList
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
        let changeValue = accSub(data[key].value[1],data[key].value[0])
        data[key].changeValue = changeValue
        data[key].type = changeValue == 0 ? 1 : changeValue > 0 ? 2 : 3
        list.push(data[key])
      }
      return list
    },
    getCover(obj){
      this.setData({
        showOverlayer:false
      })
  },
})