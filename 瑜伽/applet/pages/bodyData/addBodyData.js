import moment from '../../utils/moment.js'
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { accAdd, accDiv, accMul, accSub} from '../../utils/common.js'
const app = getApp()
const { uploadImg, addRecordBefore, addRecord, addRecordTime, editRecord } = api
Page({
    data:{
        showList:[{
            name:'会员姓名',
            placeholder:'必填',
            key:'name',
            selectId:'',
            value:'',
            require:true,
            isHandle:false,
            inputBox:true,
            disable:true
        },{
            name:'体测时间',
            placeholder:'必填',
            key:'fitness_test_time',
            selectId:'',
            value:'',
            require:true,
            isHandle:true,
            inputBox:false,
            isPicker:true
        },{
            name:'体测照片',
            symbol:'(限9张，建议图片尺寸690x518px比例4:3)',
            placeholder:'选填',
            key:'cover_url',
            value:'',
            require:false,
            isHandle:false,
            inputBox:false
        },{
            name:'指导意见',
            placeholder:'选填',
            key:'suggest',
            value:'',
            require:false,
            isHandle:false,
            inputBox:false
        }],
        alyunFilePath:[],
        imgFileList:[],
        currentDate:'',
        phone:'',
        isHasData:false,
        name:'',
        sex:'',
        age:'',
        editId:''
    },
    onLoad(options){
        this.setData({
            currentDate:moment().format('YYYY-MM-DD'),
            phone:options.phone,
            vipType:options.type,
            name:options.name,
           
        })
        this.getRecordBefore()
    },
    onShow(){

    },
    getRecordBefore(){
        const { vipType, showList, phone, name } = this.data
        request({
            url:app.globalData.baseUrl + api.testRecord,
            data:{
                type:vipType,
                phone,
                user_id:wx.getStorageSync('user_id'),
                method:'fitness.addrecordbefore'
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                const { systemData, storeData } = res
                let showData = systemData.map((item)=>{
                    let obj = {
                        name:item.name,
                        symbol:`(${item.unit})`,
                        placeholder:'选填',
                        key:item.field_key,
                        subKey:'system_data',
                        value:'',
                        require:false,
                        isHandle:false,
                        inputBox:true,
                        disable:item.field_key == 'bmi' || item.field_key == 'body_fat' ? true : false
                    }
                    return obj
                })
                let showDataSelf = storeData.map((item)=>{
                    let obj = {
                        name:item.name,
                        symbol:`(${item.unit})`,
                        placeholder:'选填',
                        key:item.id,
                        subKey:'store_data',
                        value:'',
                        require:false,
                        isHandle:false,
                        inputBox:true
                    }
                    return obj
                })
                showList.splice(2,0,...showData)
                showList.splice(-2,0,...showDataSelf)
                showList[0].value = name
                this.setData({
                    showList,
                    sex:res.sex || 2,
                    age:res.age || 0
                })
            }
        })
    },
    recordTimeData(time){
        const { vipType, showList, phone } = this.data
        request({
            url:app.globalData.baseUrl + api.testRecord,
            data:{
                user_id:wx.getStorageSync('user_id'),
                phone,
                fitness_test_time:time,
                type:vipType,
                method:'fitness.addrecordtime'
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                console.log('res',res)
                console.log('resNUll',res == null)
                this.setData({
                    isHasData:res == null ? false : true,
                    editId:res == null ? '' : res.id
                })
            }
        })
    },
    getImgs() {
        let that = this
        const { showList } = this.data
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
                            that.data.alyunFilePath.push(imgInfo.content.url)
                            that.data.showList[showList.length - 2].value = that.data.alyunFilePath
                            that.setData({
                                alyunFilePath:that.data.alyunFilePath,
                                showList:that.data.showList
                            })
                        }
                    },
                })
            }
        })

    },
    delImg(e) {
        let idx = e.currentTarget.dataset.idx
        this.data.alyunFilePath.splice(idx, 1)
        this.setData({
            alyunFilePath: this.data.alyunFilePath
        })
    },
    bindDateChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        let showList = this.updateAssignment(key,value,1)
        this.setData({
          date: value,
          showList
        })
        this.recordTimeData(value)
    },
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { showList, sex, age } = this.data
        showList.forEach(item => {
            item.value = item.key == key ? value : item.value
        });
        let weight = showList.filter((item)=>{
            return item.key == 'weight'
        })
        let height = showList.filter((item)=>{
            return item.key == 'height'
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

        showList.forEach(item => {
            if(item.key == 'bmi' && bmi){ 
                item.value = bmi || ''
            }else if(item.key == 'body_fat' && body_fat){
                item.value = body_fat || ''
            }else{
                item.value = item.key == key ? value : item.value
            }
        });
        this.setData({
            showList, 
        })
    },
    getMemoValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { showList } = this.data
        showList.forEach(item => {
            item.value = item.key == key ? value : item.value
        });
        this.setData({
            showList, 
        })
    },
    updateAssignment(key,value,type){
        const { showList } = this.data
        if(type == 1){
            showList.forEach((item)=>{
                if(item.key == key){
                    item.value = value
                }
            })
        }else if(type == 2){
            showList.forEach((item)=>{
                if(item.key == key){
                    let selectData = item.list.filter((itm,idx)=>{
                        return idx == value ? {id:itm.id,name:itm.name,index:idx} : ''
                    })
                    item.selectId = selectData[0].id ? selectData[0].id :''
                    item.value = selectData[0].name ? selectData[0].name : ''
                    item.index = selectData[0].index ? selectData[0].index : ''
                }
            })
        }

        return showList
    },
    sure(e){
        const { type } = e.target.dataset
        console.log('e',e)
        const { isHasData, sex, age, phone, vipType, editId } = this.data
        if(type == 1){
            wx.navigateBack({
                delta: 1
            })
            return
        }
        let isPass = this.verifyData()
        console.log('isPass',isPass)
        let isHasBaseData = isPass.system_data.some((item)=>{
            return item.value
        })
        if(!isHasBaseData){
            wx.showModal({
                title:'请完善信息',
                showCancel: false,
            })
            return
        }
        if(editId){
            isPass.id = editId
        }
        if(!isPass){
            return
        }
        isPass = {...isPass,...{sex,age,phone,type:vipType,user_id:wx.getStorageSync('user_id')}}

        if(isHasData){
            isPass.method = 'fitness.editrecord'
        }else{
            isPass.method = 'fitness.addrecord'
        }
        request({
            url:app.globalData.baseUrl + api.testRecord,
            data:isPass,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:'添加成功',
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
    verifyData(){
        const { showList } = this.data
        let submitDataList = this.toObj(showList)
        for(let key in submitDataList){
            let checkData = showList.filter((item)=>{
                if(item.key == key){
                    return {require:item.require}
                }
            })
            if(!submitDataList[key] && checkData[0].require){
                console.log({key,submitDataList,checkData})
                wx.showModal({
                    title:'请完善信息',
                    showCancel: false,
                })
                return false
            }
        }
        return submitDataList
        
    },
    toObj(list){
        let info = {}
        // 自定义纬度数据以及默认身体数据
        let filterSystemData = list.filter((item)=>{
            return item.subKey && item.subKey == 'system_data'
        })
        let filterStoreData = list.filter((item)=>{
            return item.subKey && item.subKey == 'store_data'
        })
        let filterImgs = list.filter((item)=>{
            return item.key == 'cover_url'
        })
        let system_data = filterSystemData.map((item)=>{
            let obj = {
                field_key:item.key,
                value:item.value
            }
            return obj
        })
        let store_data = filterStoreData.map((item)=>{
            let obj = {
                id:item.key,
                value:item.value,
                unit:item.symbol,
                name:item.name
            }
            return obj
        })
        let imgs = filterImgs[0].value.length ? filterImgs[0].value.map((item)=>{
            let obj = {
                type:1,
                url:item,
                cover_url:''
            }
            return obj
        }) : []
        list.forEach((item)=>{
            if(item.key != 'cover_url' && !item.subKey){
                info[item.key] = item.value
            }
        })
        info = {...info,imgs,store_data,system_data}
        return info
    },
})