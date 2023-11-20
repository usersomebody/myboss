
import moment from '../../utils/moment.js'
import { api, baseUrl } from '../../utils/api.js'
import { request, alertError } from '../../utils/util.js'
// import Wxml2Canvas from '../../utils/canvas/wxml2canvas'
import Wxml2Canvas from '../../utils/wxml2canvas'
import { accDiv } from '../../utils/common';
const app = getApp()
const { scheduleList, isNotActiveMemberDown, copyScheduleNextWeek } = api
const photosAlbum = 'scope.writePhotosAlbum'

Page({
    data:{
        iPhonex:false,
        scheduleList:[],
        list:[],
        weekList:[],
        today:'',
        statusMap:{
            1:'正常',
            2:'开课成功',
            3:'开课失败', 
            4:'已完课',
            9:'删除'
        },
        close:'',
        imgs:[],
        imgSrc:'',
        canvasHeight:'',
        showOverlayer:false,
        showActionlayer:false,

        addList:[{
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211118/39c37ada8d05142a2522047c682f1e69.png',
            name:'增加排课',
            info:'增加排课',
            link:'/pages/course/scheduleEdit?close=1',
            type:'1'
        },
        {
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220302/3ca5fc7e2b27261667cb08188961f85c.png',
            name:'复制当前课表到下周',
            info:'复制当前课表到下周',
            link:'',
            type:'3'
        },
        {
            cover:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211118/3efd81d67eeb63b5ef0c876365618a0c.png',
            name:'分享课表',
            info:'分享课表',
            link:'/pages/course/schedule',
            type:'2'
        }],
        album:'',
        cover_url:'',
        switchId:1,
        courseTypeList:[{
            id:1,
            name:'团课'
        },{
            id:4,
            name:'私教课'
        }],
        maxWidth:1032,
        showShareSchedule:false
    },
    onLoad(options){
        let year = moment().format('YYYY-MM-DD')
        this.setData({
            today:year,
            close:options.close,
            switchId:options.type || 1
        })
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
        })
        this.drawImage1()
        this.checkSetting()
    },
    onReady(){
    },
    onShow(){
        this.getScheduleData()
        // this.getCourseImg()
    },
    switch(e){
        const { id } = e.currentTarget.dataset
        const { switchId } = this.data
        if(switchId == id){
            return
        }
        this.setData({
            switchId:id
        })
        this.getScheduleData()
        // this.getCourseImg()
    },
    getCourseImg(e){
        const { type } = e.currentTarget.dataset
        const { weekList } = this.data
        let date = type == 1 ? weekList[0].fullDate : weekList[7].fullDate
        wx.showLoading({
            title:'图片生成中...'
        })
        let that = this
        const { switchId } = this.data
        request({
            url:  baseUrl + isNotActiveMemberDown,
            data: {
                type:switchId == 4 ? 2 : 1,
                date
            },
            isTologin:true,
            method:'POST',
            success(res) {
                that.setData({
                    cover_url:res.url
                })
                that.checkSaveStatus()
                that.toggleScheduleBox()
                wx.hideLoading()
            },
        })
    },
    getScheduleData(){
        request({
            url:baseUrl + scheduleList,
            data:{
                course_type_id:this.data.switchId
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    list:res
                })
                this.calculateHeight()
                //提取周的数据
                this.getWeekList()
            }
        })
    },
    //计算时间表格高度
    calculateHeight(){
        const { list } = this.data
        list.forEach(item => {
            let lengthArr = []
            item.data.forEach((items) => {
                lengthArr.push(items.children.length)
                items.children.forEach((v)=>{
                    v.star_level =  this.startRating(v.difficulty_star)
                })
            })
            item.maxLength = Math.max(...lengthArr)
            item.height = item.maxLength * 188
        });
        //给数组进行数据填充
        let copyList = list.concat()
        copyList.forEach((item)=>{
            item.data.forEach((items)=>{
                if(item.maxLength > items.children.length){
                    let fillNum = item.maxLength - items.children.length
                    let arr = Array(fillNum).fill({})
                    items.children = [...items.children,...arr]
                    // items.children = items.children.concat(arr)
                }
            })
        })
        copyList.forEach((p)=>{
            p.data.forEach((v)=>{
                if(v.children.length){
                    v.children.forEach((itm)=>{
                        console.log('itm',itm)
                        itm.color = itm && itm.color && itm.id ? itm.color : itm.id && !itm.color ? '#9B77F4' : ''
                    })
                }
            })
        })
        this.setData({
            scheduleList:copyList,
        })
    },
    getWeekList(){
        const { list,today } = this.data
        let weekDate = list[0].data.concat()
        let week = weekDate.map((item)=>{
            let obj = item
            obj.select = item.date == today
            obj.fullDate = obj.date
            obj.date = obj.date.slice(5),
            obj.week = obj.week.slice(1,2)
            return obj
        })
        this.setData({
            weekList:week,
            maxWidth:accDiv(week.length,7) * 1032
        })
        let query = wx.createSelectorQuery();
        //选择id
        let that = this;
        query.select('.container').boundingClientRect(function (rect) {
        // console.log(rect.width)
        console.log('rect',rect)
        that.setData({
            canvasHeight: rect.height + 50 + 'px'
        })
        }).exec();
    },
    //星星评级
    startRating(rate){
        let rateLevel = "★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate);
        return rateLevel
    },
    gotoEdit(e){
        const { item } = e.currentTarget.dataset
        const { switchId } = this.data
        if(!item.id){
            return
        }
        wx.setStorageSync('scheduleInfo',item)
        wx.navigateTo({
            url: '/pages/course/scheduleEdit?scheduleId=' + item.id + '&type=' + switchId,

        })
    },
    gotoAdd(){
        this.setData({
            showOverlayer:!this.data.showOverlayer,
            showActionlayer:!this.data.showActionlayer
        })
    },
    drawImage1 () {
        let self = this;
        this.drawImage1 = new Wxml2Canvas({
            width: 340, // 宽， 以iphone6为基准，传具体数值，其他机型自动适配
            height: 210, // 高
            element: 'canvas1', 
            background: '#f0f0f0',
            progress (percent) {
            },
            finish(url) {
                let imgs = self.data.imgs;
                imgs.push(url);

                self.setData({
                    imgs
                })
            },
            error (res) {
            }
        });

        let data = {
            list: [{
                type: 'wxml',
                class: '.share__canvas1 .draw_canvas', // draw_canvas指定待绘制的元素
                limit: '.share__canvas1', // 限定绘制元素的范围，取指定元素与它的相对位置
                x: 0,
                y: 0
            }]
        }

        // this.drawImage1.draw(data);
    },
    drawCanvas() {
        const wrapperId = '#wrapper'
        const drawClassName = '.draw'
        const canvasId = 'canvas-map'
        let that = this
        Wxml2Canvas(wrapperId, drawClassName, canvasId).then(() => {
          // canvas has been drawn here, you can save the canvas image with wx.canvasToTempFilePath 
          wx.canvasToTempFilePath({
            destWidth: 750,
            destHeight: 1334,
            fileType: 'jpg',
            canvasId: canvasId,
            success({ tempFilePath }) {

                console.log('tempFilePath', tempFilePath)
                that.setData({
                    imgSrc: tempFilePath || ''
                });
                // wx.hideLoading();

            },
            fail(res) {
                console.log('res', res)
                alertError(res.errMsg || '');
            },
        });
        })
    },
    gotoPage(e){
        const { switchId } = this.data
        const { link,type } = e.currentTarget.dataset
        this.gotoAdd()
        if(type == 2){
            this.toggleScheduleBox()
            // this.getCourseImg()
            return
        }
        if(type == 1){
            wx.navigateTo({
                url: link + '&type=' + switchId,
            })
            return
        }

        this.copyScheduleData()
    },
    copyScheduleData(){
        let that = this
        const { weekList, switchId } = this.data
        request({
            url:  baseUrl + copyScheduleNextWeek,
            data: {
                date:weekList[0].fullDate,
                type:switchId == 4 ? 2 : 1,
            },
            isTologin:true,
            method:'POST',
            success(res) {
                that.getScheduleData()
                that.setData({
                    showOverlayer:false,
                    showActionlayer:false
                })
                wx.showToast({
                    title:'复制成功',
                    icon:'none'
                })
            },
        })
    },
    toggleScheduleBox(){
        const { showShareSchedule,showOverlayer } = this.data
        this.setData({
            showOverlayer:!showShareSchedule,
            showShareSchedule:!showOverlayer
        })
    },
    /*
        保存图片
    */
    //检查用户的保存相册权限
    checkSetting(){
        let that = this
        wx.getSetting({
            success({authSetting}){
                if(authSetting[photosAlbum]){//用户成功授权 可以访问相册
                    that.setData({
                        album:'allow'
                    })
                }else if(authSetting[photosAlbum] === false){//用户成功授权 拒绝访问相册
                    that.setData({
                        album:'refuse'
                    })
                }else{//用户未授权
                    that.setData({
                        album:'close'
                    })
                }
            }
        })
    },
    //保存时进行验证
    checkSaveStatus(){
        let that = this
        //成功授权 允许保存
        if(that.data.album == 'allow'){
            that.savePhoto()
            return;
        }
        //成功授权引到用户开启相册权限
        if(that.data.album == 'refuse'){
            wx.openSetting({
                success({authSetting}){
                    if(authSetting[photosAlbum]){
                        that.setData({
                            album:'allow'
                        })
                        that.savePhoto()
                    }
                }
            })
            return;
        }
        //引导授权
        if(that.data.album == 'close'){
            wx.authorize({
                scope:photosAlbum,
                success(){
                    that.setData({
                        album:'allow'
                    })
                    that.savePhoto()
                },
                fail(){
                    that.setData({
                        album:'refuse'
                    })
                }
            })
        }
    },
    //用户版本大于2.07且已授权直接引导用户开启相册权限
    openAlbum(e){
        let that = this
        let obj = e.detail
        if(obj.authSetting[photosAlbum]){
            that.setData({
                album:'allow'
            })
            that.savePhoto()
        }
    },
    savePhoto(){
        let that = this
        wx.getImageInfo({
            src:that.data.cover_url,
            success(res){
                wx.saveImageToPhotosAlbum({
                    filePath:res.path,
                    success(){
                        that.setData({
                            showModal:false
                        })
                        wx.showToast({
                            title:'保存成功',
                            mask:true
                        })
                    },
                    fail(err){
                        that.setData({
                            showModal:false
                        })
                        alertError('保存失败!');
                    }
                })
            }
        })
    },
    onShareAppMessage() {
        
    },
})