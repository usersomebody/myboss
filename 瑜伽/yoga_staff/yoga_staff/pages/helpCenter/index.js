
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'

const app = getApp()
const { qaQuestion } = api
Page({
    data:{
        guide:{},
        problemList:[],
        linkList:{
            1:'/pages/helpCenter/operationGuide',
            2:'/pages/helpCenter/problem'
        },
        x:0,
        y:0
    },
    onLoad(){
        this.getInfo()
    },
    getInfo(){
        request({
            url:baseUrl + qaQuestion,
            data:{

            },
            method:'POST',
            isTologin:true,
            success: (res)=>{
                const { qa_question, help } = res
                this.setData({
                    problemList:qa_question,
                    guide:help
                })
                app.globalData.guideInfo = help
            }
        })
    },
    goNextPage(e){
        const { type, id } = e.currentTarget.dataset
        const { linkList } = this.data
        wx.navigateTo({
            url:type == 1 ? linkList[type] : linkList[type] + '?id=' + id
        })
    }
})