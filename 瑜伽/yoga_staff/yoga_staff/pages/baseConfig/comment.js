import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import moment from '../../utils/moment.js'

const app = getApp()
const { editConfigEva, getSettingConfig } = api
Page({
    data:{
        appShowComment:false,
        switchList:[{
            id:1,
            name:'小程序端显示评价内容',
            value:1,
            key:'is_open_comment'
        },{
            id:2,
            name:'后台消息提醒',
            key:'is_system_gossip_tip',
            value:1
        },{
            id:3,
            name:'企业微信提醒',
            key:'is_work_gossip_tip',
            value:1
        }]
    },
    onLoad(){
        this.getConfigInfo()
    },
    getConfigInfo(){
        const { switchList } = this.data
        request({
            url:baseUrl + getSettingConfig,
            data:{},
            method: 'POST',
            isTologin:true,
            success: (res => {
                const { 
                    is_open_comment,
                    is_system_gossip_tip,
                    is_work_gossip_tip
                } = res
                switchList.forEach((item)=>{
                    item.value = res[item.key] ?  res[item.key] :  item.value
                })
                this.setData({
                    switchList,
                })
            })
          })
    },
    switchChange(e){
        const { value } = e.detail
        const { id } = e.currentTarget.dataset
        const { switchList } = this.data
        console.log({id,value})
        switchList.forEach(element => {
            element.value = element.id == id ? value ? 1 : 2 : element.value
        });

        this.setData({
            switchList
        })
    },
    sure(e){
        const { type } = e.target.dataset
        if(type == 1){
            wx.navigateBack({
                delta: 1,
            })
            return
        }
        this.submit()
    },
    submit(){
        const { switchList } = this.data
        request({
            url:baseUrl + editConfigEva,
            data:{
                is_open_comment:switchList[0].value,
                is_system_gossip_tip:switchList[1].value,
                is_work_gossip_tip:switchList[2].value
            },
            method: 'POST',
            isTologin:true,
            success: (res => {
                wx.showToast({title:'操作成功'})
                wx.navigateBack({
                    delta: 1,
                })
            })
        })
    }
})