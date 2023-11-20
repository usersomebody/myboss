import moment from '../../utils/moment.js'
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { accSub, accDiv, accMul, accAdd } from '../../utils/common.js'
import { positionData } from './bodyPosition.js'
const app = getApp()
const { uploadImg, getContras, getContrastDetail, addRecordBefore, getRecordInfo, getRecordList } = api
Page({
    data:{
        switchList:[{
            id:1,
            name:'可视图'
        },{
            id:2,
            name:'列表'
        }],
        switchId:1,
        switchKey:'',
        submitData:{},
        vipType:"",
        sex:'',
        age:'',
        phone:'',
        recordId:'',
        actionStart:false,
        showBodyData:false,
        showAddObj:{
            field_key:'',
            value:'',
            name:''
        },
        systemData:[],
        bodyDataList:{},
        selectData:{},

        // 上传图片
        alyunFilePath:[],
        imgFileList:[],
        editImgIng:false,
        suggest:'',
        storeData:[],
        name:'',
        currentDate:'',
        styleObj:{}
    },
    onLoad(options){
        this.setData({
            vipType:options.type,
            name:options.name,
            phone:options.phone,
            recordId:options.rid,
            currentDate:moment().format('YYYY-MM-DD'),
            
        })
        this.getRecordBefore()
        for(let key in positionData){
            for(let subKey in positionData[key]){
                if(key == 'girl'){
                    positionData[key][subKey].x = parseInt(accMul(188, accDiv(positionData[key][subKey].left,100)) + 48 + accDiv(positionData[key][subKey].width, 2)) 
                    positionData[key][subKey].y = parseInt(accMul(762, accDiv(positionData[key][subKey].top,100)) + accDiv(positionData[key][subKey].height,2))
                }else{
                    positionData[key][subKey].x = parseInt(accMul(234, accDiv(positionData[key][subKey].left,100)) + 48 + accDiv(positionData[key][subKey].width, 2)) 
                    positionData[key][subKey].y = parseInt(accMul(762, accDiv(positionData[key][subKey].top,100)) + accDiv(positionData[key][subKey].height,2))
                }
            }
        }
    },
    switchTab(e){
        const { id } = e.currentTarget.dataset
        const { switchId } = this.data
        if(id == switchId){
            return
        }
        //数据更新
        this.setData({
            switchId:id
        })
    },
    switchTabKey(e){
        const { key, item } = e.currentTarget.dataset
        const { switchKey, selectData } = this.data
        if(key == switchKey){
            return
        }
        selectData.value = ''
        this.setData({
            switchKey:'',
            selectData
        })
        console.log('item',item)
        if(!item.value){
            item.value = '暂无数据'
        }
        // let styleObj = this.getAngle(250,244,item.x,item.y,1,'#7D49FB')
        //数据更新
        this.setData({
            switchKey:key,
            selectData:item,
            // styleObj,
            boxTop:this.calculationBoxTop(item.y,item.height,80)
        })
    },
    calculationBoxTop(y,height,boxHeight){
        return parseInt(y - accDiv(boxHeight,2))
    },
    editBodyData(){
        const { actionStart, bodyDataList } = this.data
        //BMI
        if(bodyDataList['height'] && bodyDataList['weight']){
            //bmi 体重（公斤） / （身高 * 身高）（米）
            //bmi weight（公斤） / （height * height）（米）
            let height = accDiv(bodyDataList['height'], 100).toFixed(2)
            bodyDataList['bmi'] = accDiv(bodyDataList['weight'],accMul(height,height)).toFixed(2)
        }
        //体脂率
        if(bodyDataList['sex'] && bodyDataList['age'] && bodyDataList['bmi']){
            //bmi 体重（公斤） / （身高 * 身高）（米）
            //bmi weight（公斤） / （height * height）（米）
            let bmi = bodyDataList['bmi']
            let sex = bodyDataList['sex'] == 2 ? 0 : 1
            let age = bodyDataList['age']
            bodyDataList['body_fat'] = (accMul(1.2,bmi) + accMul(0.23,age) - 5.4 - accMul(10.8,sex)).toFixed(2)
        }
        this.setData({
            actionStart:!actionStart,
            bodyDataList
        })
    },
    getRecordBefore(){
        const { vipType, phone } = this.data
        request({
            url:app.globalData.baseUrl + api.testRecord,
            data:{
                phone,
                type:vipType,
                user_id:wx.getStorageSync('user_id'),
                method:'fitness.addrecordbefore'
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                const { systemData } = res
                //数据转化

                // 获取展示需要的数据
                let coordinate = []
                if(res.sex == 1){
                    coordinate = systemData.map((item)=>{
                        let obj = {...item,...positionData.boy[item.field_key]}
                        return obj
                    })
                }else{
                    coordinate = systemData.map((item)=>{
                        let obj = {...item,...positionData.girl[item.field_key]}
                        return obj
                    })
                }
                this.setData({
                    systemData:coordinate,
                    sex:res.sex || 2, 
                    age:res.age || 0,
                })
                this.getRecordDetail()
                this.getRecordList()
            }
        })
    },
    // 获取体重详情
    getRecordDetail(){
        const { recordId, systemData } = this.data
        request({
            url:app.globalData.baseUrl + api.testRecord,
            data:{
                id:recordId,
                method:'fitness.getrecordinfo',
                user_id:wx.getStorageSync('user_id')
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                let historyData = this.toObj(res.systemData)
                let newDatas = systemData.map((item)=>{
                    let obj = item
                    if(historyData[item.field_key]){
                        obj.value = historyData[item.field_key].value || ''
                    }
                    return obj
                })
                res.imgs.forEach((item)=>{
                    item.checked = false
                })
                let showData = newDatas.filter((item)=>{
                    return item.field_key != 'weight' && item.field_key != 'height' && item.field_key != 'bmi' && item.field_key != 'body_fat' 
                })
                this.setData({
                    storeData:res.storeData,
                    systemData:newDatas,
                    alyunFilePath:res.imgs,
                    switchKey:showData[0].field_key,
                    selectData:showData[0],
                    suggest:res.suggest
                })
            }
        })
    },
    // 获取体重列表
    getRecordList(){
        const { vipType, phone, sex, age, recordId } = this.data
        request({
            url:app.globalData.baseUrl + api.testRecord,
            data:{
                user_id:wx.getStorageSync('user_id'),
                phone,
                type:vipType,
                method:'fitness.getrecordlist'
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                let body = res.filter((item)=>{
                    return item.id == recordId
                })
                body[0].sex = sex
                body[0].age = age
                this.setData({
                    bodyDataList:body[0]
                })
            }
        })
    },
    toObj(list){
        let info = {}
        list.forEach((item)=>{
            info[item.field_key] = item
        })
        return info
    },
    getNewValKey(e){
        const { value } = e.detail
        const { showAddObj } =  this.data
        showAddObj.value = value
        this.setData({
            showAddObj
        })
    },
    addBodyData(){
        const { showAddObj, submitData, switchKey, systemData, bodyDataList } = this.data
        if(!showAddObj.value){
            wx.showModal({
                title:'请输入数据',
                showCancel:false
            })
            return
        }
        submitData[showAddObj.field_key] = showAddObj.value
        systemData.forEach((item)=>{
            item.value = item.field_key == showAddObj.field_key ? showAddObj.value : item.value || ''
        })
        bodyDataList[showAddObj.field_key] = showAddObj.value
        let selectData = systemData.filter((item)=>{
            return item.field_key == switchKey
        })
        this.setData({
            showBodyData:false,
            submitData,
            selectData:Object.assign({},selectData[0]),
            systemData,
            bodyDataList
        })
    },
    closeBodyData(e){
        const { key, type } = e.currentTarget.dataset
        let { showAddObj } = this.data
        if(type == 1){
            showAddObj = this.checkEditTitle(key)
        }
        this.setData({
            showAddObj,
            showBodyData:!this.data.showBodyData,
        })
    },
    checkEditTitle(key){
        const { systemData } = this.data
        let editTitle = systemData.filter((item)=>{
            return item.field_key == key
        })
        return editTitle[0]
    },

    getImgs() {
        let that = this
        wx.chooseImage({
            // count:9 - that.data.imgFileList.length, // 默认9
            count:1, // 默认9
            sizeType: ['compress'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.data.imgFileList = that.data.imgFileList.concat(res.tempFilePaths)
                that.setData({
                    imgFileList: that.data.imgFileList,
                })
                wx.uploadFile({
                    url: app.globalData.baseUrl + api.uploadImg,
                    filePath:res.tempFilePaths[0],
                    name:'image',
                    formData:{
                        image:res.tempFilePaths
                    },
                    success: function(res){
                        let imgInfo = JSON.parse(res.data)
                        if(res.statusCode == 200) {
                            let obj = {
                                url:imgInfo.content.url,
                                type:1,
                                cover_url:'',
                                checked:false
                            }
                            that.data.alyunFilePath.push(obj)
                            that.setData({
                                alyunFilePath:that.data.alyunFilePath,
                            })
                        }
                    },
                })
            }
        })

    },
    editImg(){
        const { alyunFilePath } = this.data
        this.setData({
            editImgIng:!this.data.editImgIng
        })
        if(!this.data.editImgIng){
            wx.showModal({
                title:"确认删除",
                success:(res)=>{
                    if(res.confirm){
                        let filterData = alyunFilePath.filter((item)=>{
                            return !item.checked
                        })
                        this.setData({
                            alyunFilePath:filterData
                        })
                    }
                }
            })
            
        }
    },
    delImg(e) {
        let idx = e.currentTarget.dataset.idx
        this.data.alyunFilePath.splice(idx, 1)
        this.setData({
            alyunFilePath: this.data.alyunFilePath
        })
    },
    selectImg(e){
        const { alyunFilePath } = this.data
        let idx = e.currentTarget.dataset.idx
        alyunFilePath.forEach((item,index)=>{
            item.checked = index == idx ? !item.checked : item.checked
        })
        this.setData({
            alyunFilePath
        })
    },
    getMemoValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        this.setData({
            suggest:value, 
        })
    },
    //提交的数据
    sure(){
        const { sex, age, phone, vipType, recordId } = this.data
        let isPass = this.verifyData()
        console.log('isPass',isPass)
        isPass.method = 'fitness.editrecord'
        isPass.user_id = wx.getStorageSync('user_id')
        request({
            url:app.globalData.baseUrl + api.testRecord,
            data:isPass,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:'修改成功',
                    showCancel:false,
                    success:()=>{
                        wx.navigateBack({
                            delta: 1, 
                        })
                    }
                })
            }
        })
    },
    delete(){
        const {recordId } = this.data
        wx.showModal({
            title:'确认删除',
            success:(res)=>{
                if(res.confirm){
                    request({
                        url:app.globalData.baseUrl + api.testRecord,
                        data:{
                            user_id:wx.getStorageSync('user_id'),
                            id:recordId,
                            method:'fitness.delrecord'
                        },
                        method:'POST',
                        isTologin:true,
                        success:(res)=>{
                            wx.showModal({
                                title:'删除成功',
                                showCancel:false,
                                success:()=>{
                                    wx.navigateBack({
                                        delta: 1, 
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
        
    },
    verifyData(){
        // 整合提交数据
        const { systemData, age, sex, phone, vipType, alyunFilePath, bodyDataList, storeData, suggest } = this.data
        let system_data = systemData.map((item)=>{
            let obj = {
                field_key:item.field_key,
                value:item.value
            }
            return obj
        })
        let submitData = {system_data,storeData,...{age,sex,phone,type:vipType,imgs:alyunFilePath,id:bodyDataList.id,fitness_test_time:bodyDataList.fitness_test_time,suggest}}
        console.log('submitData',submitData)
        return submitData
    },
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { systemData, sex, age } = this.data
        systemData.forEach(item => {
            item.value = item.field_key == key ? value : item.value
        });
        let weight = systemData.filter((item)=>{
            return item.field_key == 'weight'
        })
        let height = systemData.filter((item)=>{
            return item.field_key == 'height'
        })
        let bmi = ''
        let body_fat = ''
        //BMI
        if(height[0].value && weight[0].value && (key == 'height' || key == 'weight')){
            //bmi 体重（公斤） / （身高 * 身高）（米）
            //bmi weight（公斤） / （height * height）（米）
            let heightValue = accDiv(height[0].value, 100).toFixed(2)
            bmi = accDiv(weight[0].value,accMul(heightValue,heightValue)).toFixed(2)
        }
        //体脂率
        if(sex && age && bmi && (key == 'height' || key == 'weight')){
            //bmi 体重（公斤） / （身高 * 身高）（米）
            //bmi weight（公斤） / （height * height）（米）
            let sexValue = sex == 2 ? 0 : 1
            body_fat = (accMul(1.2,bmi) + accMul(0.23,age) - 5.4 - accMul(10.8,sexValue)).toFixed(2)
        }

        systemData.forEach(item => {
            if(item.field_key == 'bmi' && bmi){
                item.value = bmi || ''
            }else if(item.field_key == 'body_fat' && body_fat){
                item.value = body_fat || ''
            }else{
                item.value = item.field_key == key ? value : item.value
            }
        });
        this.setData({
            systemData, 
        })
    },
    getAngle(x1, y1, x2, y2, lineWidth, color) {
        // 获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var x = x1 - x2;
        var y = y1 - y2;
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos); // 用反三角函数求弧度
        var angle = 180 / (Math.PI / radina); // 将弧度转换成角度
        if (x2 > x1 && y2 === y1) {
          // 在x轴正方向上
          angle = 0;
        }
        if (x2 > x1 && y2 < y1) {
          // 在第一象限;
          angle = angle - 90;
        }
        if (x2 === x1 && y1 > y2) {
          // 在y轴正方向上
          angle = -90;
        }
        if (x2 < x1 && y2 < y1) {
          // 在第二象限
          angle = 270 - angle;
        }
        if (x2 < x1 && y2 === y1) {
          // 在x轴负方向
          angle = 180;
        }
        if (x2 < x1 && y2 > y1) {
          // 在第三象限
          angle = 270 - angle;
        }
        if (x2 === x1 && y2 > y1) {
          // 在y轴负方向上
          angle = 90;
        }
        if (x2 > x1 && y2 > y1) {
          // 在四象限
          angle = angle - 90;
        }
    // 计算出两个点之间的距离
    let line = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
    // 设置一个div 宽度为 两点之间的距离，并且以 transform-origin: 0 50% 为圆心旋转，角度已经算出来
    return `
        position: absolute;
        top:${x1}rpx;
        left:${y1}rpx;
        width: ${ line }rpx;
        height: ${ lineWidth }rpx;
        background-color: ${ color };
        transform:rotate(${angle}deg);transform-origin: 0 50%;
    `
    },
    goList(){
        wx.navigateBack({
            delta: 1
        })
    }, 
    clearValue(){
        const { showAddObj } = this.data
        showAddObj.value = ''
        this.setData({
            showAddObj
        })
    }
})