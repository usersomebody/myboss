import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'
import { isLast } from '../../utils/loadMore.js'
import { param } from '../../utils/param.js';
const { uploadImg } = api
const app = getApp()
Page({
    data:{
        fictitiousData:[{
            nickname:'',
            prize_name:''
        }]
    },
    onLoad(){
        this.setData({
            fictitiousData:wx.getStorageSync('fictitious') || []
        })
    },
    getVal(e){
        const { type, index } = e.currentTarget.dataset
        const { fictitiousData } = this.data
        fictitiousData[index][type] = e.detail.value + ''
        this.setData({
            fictitiousData,
        })
    },
    deleteList(e){
        const { index } = e.currentTarget.dataset
        const { fictitiousData } = this.data
        let list = fictitiousData.filter((item,idx)=>{
            return index != idx
        })
        this.setData({
            fictitiousData:list
        })
    },
    addData(){
        const { fictitiousData } = this.data
        let obj = {
            nickname:'',
            prize_name:''
        }
        fictitiousData.push(obj)
        this.setData({
            fictitiousData
        })
    },
    cancle(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    sure(){
        const { fictitiousData } = this.data
        wx.setStorageSync('fictitious',fictitiousData)
        this.cancle()
    }
})