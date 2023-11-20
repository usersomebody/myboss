import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'

const app = getApp()
const { vipList } = api

Page({
  data:{
    list:[],
    contactPersonData:[],
    letter:[],
    searchWord:'',
    iPhonex:false,
    switchList:[{
      id:1,
      name:'会员'
    },{
      id:2,
      name:'潜在会员'
    }],
    switchId:1
  },
  onLoad(){
    this.setData({
      iPhonex:app.globalData.isIphoneX || false
    })
    
  },
  onShow(){
    this.setData({
      switchId:1
    })
    this.getUsetList()
    wx.removeStorageSync('sendCardList')
    
  },
  getUsetList(){
      const { list, searchWord, switchId } = this.data
      request({
        url:baseUrl + vipList,
        data:{
          name:searchWord,
          type:switchId
        },
        method: 'POST',
        isTologin: true,
        success: (res => {
          const { letter, arr, strArr } = res
          let list = arr.concat()
          // 存放所有联系人       
          let allContactPerson = {};        
          list.map((item) => {    
          if (allContactPerson[item.letter]) {     
              allContactPerson[item.letter].push(item);       
          } else {     
            allContactPerson[item.letter] = [item];      
            }       
        });      
        this.setData({
          letter,
          strArr,
          contactPersonData:Object.entries(allContactPerson).sort()
        }) 
      })
    })
  },
  getVal(e){
    const { value } = e.detail
    this.setData({
      searchWord:value
    })
    this.getUsetList()
      
  },
  search(){
    this.getUsetList()
  },
  checkVipDetail(e){
    const { id } = e.currentTarget.dataset
    const { switchId } = this.data
    wx.navigateTo({
      url: '/pages/vip/vipDetail?id=' + id + '&type=' + switchId,
    })
  },
  goDetail(){
    wx.navigateTo({
      url: '/pages/vip/addVip'
    })
  },

  switch(e){
    const { id } = e.currentTarget.dataset
    const { switchId } = this.data
    if(id == switchId ){
      return
    }
    this.setData({
      switchId:id
    })
    this.getUsetList()
  }
})