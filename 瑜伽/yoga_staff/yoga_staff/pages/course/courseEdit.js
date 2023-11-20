import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { accDiv } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
const app = getApp()
const {  uploadImg, getCourseConfig, getCourseInfo, addCourse, editCourse, delCourse  } = api
const supportDataListMat = [{
        course_type_id:1,
        card_arr:[{
            type:1,
            ids:[]
        },{
            type:2,
            ids:[]
        },{
            type:3,
            ids:[]
        },{
            type:4,
            ids:[]
        }]
    },{
        course_type_id:2,
        card_arr:[{
            type:1,
            ids:[]
        },{
            type:2,
            ids:[]
        },{
            type:3,
            ids:[]
        },{
            type:4,
            ids:[]
        }]
    },{
        course_type_id:3,
        card_arr:[{
            type:1,
            ids:[]
        },{
            type:2,
            ids:[]
        },{
            type:3,
            ids:[]
        },{
            type:4,
            ids:[]
        }]
    },{
        course_type_id:4,
        card_arr:[{
            type:1,
            ids:[]
        },{
            type:2,
            ids:[]
        },{
            type:3,
            ids:[]
        },{
            type:4,
            ids:[]
        }]
    }]
Page({
    data:{
        list:[{
            key:'course_type',
            submitKey:'course_type_ids',
            name:'课程类型',
            value:'',
            selectId:'',
            placeholder:'必填',
            list:[],
            require:true,
            isHandle:true,
            isInput:false
        },{
            key:'name',
            submitKey:'name',
            name:'课程名称',
            value:'',
            selectId:'',
            placeholder:'必填',
            list:[],
            require:true,
            isHandle:false,
            isInput:true
        },{
            key:'chainStore',
            submitKey:'store_ids',
            name:'适用门店',
            value:'',
            selectId:'',
            placeholder:'必填',
            list:[],
            require:true,
            isHandle:true,
            isInput:false,
            link:'/pages/course/storeList'
        },{
            key:'duration',
            submitKey:'duration',
            name:'课程时长(分)',
            value:'',
            selectId:'',
            placeholder:'必填',
            list:[],
            require:true,
            isHandle:false,
            isInput:true
        },{
            key:'consume',
            submitKey:'consume',
            name:'课程消耗',
            value:'',
            money:'',
            selectId:'',
            placeholder:'必填',
            list:[],
            require:true,
            isHandle:false,
            isInput:false
        },{
            key:'max_user',
            submitKey:'max_user',
            name:'容纳人数',
            value:'',
            selectId:'',
            placeholder:'必填',
            list:[],
            require:true,
            isHandle:false,
            isInput:true
        },{
            key:'min_user',
            submitKey:'min_user',
            name:'开课人数限制(最少人数)',
            value:'',
            selectId:'',
            placeholder:'必填',
            list:[],
            require:true,
            isHandle:false,
            isInput:true
        },{
            key:'staff',
            submitKey:'coach_staff_id',
            name:'授课老师',
            value:'',
            selectId:'',
            placeholder:'选填',
            list:[],
            require:false,
            isHandle:true,
            isInput:false
        },{
            key:'room',
            submitKey:'classroom_id',
            name:'上课教室',
            value:'',
            selectId:'',
            placeholder:'选填',
            list:[],
            require:false,
            isHandle:true,
            isInput:false
        },{
            key:'color',
            submitKey:'color',
            name:'课程颜色',
            value:'',
            selectId:'',
            placeholder:'必填',
            list:[],
            require:true,
            isHandle:true,
            isInput:false
        },{
            key:'difficulty_star',
            submitKey:'difficulty_star',
            name:'课程难度',
            value:'',
            selectId:'',
            placeholder:'必填',
            list:[],
            require:true,
            isHandle:false,
            isInput:false
        },{
            key:'support_cards',
            submitKey:'support_cards',
            name:'支持卡',
            value:'',
            selectId:'',
            placeholder:'选填',
            list:[],
            require:false,
            isHandle:true,
            isInput:false,
            link:'/pages/course/cardList'
        },{
            key:'cover_img',
            submitKey:'cover_img',
            name:'展示封面图',
            value:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211207/3f56e3a02fdcb24575e16c6db3c17814.png',
            selectId:'',
            placeholder:'选填',
            list:[],
            require:false,
            isHandle:false,
            isInput:false
        },{
            key:'synopsis',
            submitKey:'synopsis',
            name:'课程简介',
            value:'',
            selectId:'',
            placeholder:'输入简介',
            list:[],
            require:false,
            isHandle:false,
            isInput:false
        }],

        //课程分类
        editId:'',
        courseType:[],

        //弹窗数据
        popupShow:false,
        popupData:{},

        //评级
        difficulty_star:'',
        isAction:2,
        width:260,//宽度
        height: 146,//高度
        imgSrc:'',

        pickerList:[{
            id:1,
            name:'限时卡'
        },{
            id:2,
            name:'次数卡'
        }],
        index:0,

        course_type_edit:[],
        //support
        supportCards:supportDataListMat,
        cardType:{
            1:'期限卡',
            2:'次数卡',
            3:'储值卡',
            4:'计时卡'
        },
        supportCardList:[],
        btnDisable:false,
        isSameStore:true,
        editInfo:{}
    },
    onLoad(options){
        let isSameStore = options.sid ? options.sid == wx.getStorageSync('store_id') : true
        this.setData({
            editId:options.id,
            sid:options.sid || '',
            isSameStore:isSameStore,
        })
        if(options.id){
            wx.setNavigationBarTitle({
                title: '编辑课程',
            })
            if(!isSameStore){
                wx.showModal({
                    title:'无权限操作其它场馆的课程',
                    showCancel:false,
                    
                })
            }
            this.getCourseInfo()
        }else{
            this.getConfigList()
        }
    },
    onShow(){
        const { list } = this.data
        //获取当前选中的店铺数据
        let selectStore = wx.getStorageSync('checkStoreNames') || []
        if(selectStore.length){
            this.updateListData('chainStore',selectStore.length > 1 ? selectStore.join(',') : selectStore[0])
        }
        //获取支持卡的数据
        this.setData({
            supportCardList:wx.getStorageSync('checkedSupportList') || [],
        })
    },
    onUnload(){
        wx.removeStorageSync('checkStoreNames')
        wx.removeStorageSync('supportCard')
        wx.removeStorageSync('checkStoreIds')
        wx.removeStorageSync('checkedSupportIds')
        wx.removeStorageSync('checkedSupportList')
        wx.removeStorageSync('consume_data')
        
    },
    //当前选中的值
    updateSelectData(obj){
        const { popupData, list, supportCards } = this.data
        if(obj.detail.type == 'update'){
            popupData.list.forEach(item => {
                item.checked = obj.detail.id == item.id ? !item.checked : item.checked
            });
            list[0].list = popupData.list
            this.setData({
                popupData,
                list
            })
            
        }else{
            list.forEach(item => {
                item.value = item.key == obj.detail.key ? obj.detail.name : item.value
                item.selectId = item.key == obj.detail.key ? obj.detail.id : item.selectId
            });
            this.setData({
                list,
                popupShow:false
            })
        }
        
        if(obj.detail.key == 'course_type'){
            this.formatData(supportCards)
        }
    },
    deleteItem(array,item) {
        const index = this.array.findIndex(text => text.name === item.name);
        this.array.splice(index, 1);
    },
    //组件盒子显示
    toggelePopup(e){
        const { item } = e.currentTarget.dataset
        const { list, supportCards } = this.data
        let obj = { name:item.name, key:item.key, list:item.list, selectId:item.selectId, value:item.value}
        if(!item.isHandle){
            return
        }
        if(item.disable){
            return
        }
        if(item.link){
            if(item.key == 'support_cards'){
                if(!list[0].selectId){
                    wx.showModal({
                        title:'请选择课程支持类型',
                        showCancel:false
                    })
                    return
                }
                let consume = {
                    2:list[4].value || '', 
                    3:list[4].money || '',
                    4:list[3].value || ''
                }
            //    this.formatData(supportCards)
                wx.setStorageSync('consume_data', consume)
            }
            setTimeout(()=>{
                wx.navigateTo({
                    url: item.link,
                })
            },200)
            return
        }
        this.setData({
            popupShow:!this.data.popupShow,
            popupData:obj
        })
    },
    //星星评级
    startRating(rate){
        let rateLevel = "★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate);
        return rateLevel
    },
    //获取课程基本信息
    getCourseInfo(){
        const { list, editId, cardType, isSameStore } = this.data
        request({
            url:baseUrl + getCourseInfo,
            data:{
                id:editId
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
               const { course_type, card, store_id_arr} = res
            //    let supportIds = this.supportCardAction(card)
               list.forEach((item)=>{
                   if(item.submitKey == 'course_type_ids'){
                       let str = ''
                       let ids = ''
                       res['course_type'].forEach((itm,idx)=>{
                           str += `${itm.name}${idx == res['course_type'].length -1 ? '' : ','}`
                           ids = ids + itm.id + ','
                       })
                       item.value = str
                       item.selectId = ids
                       item.disable = isSameStore ? false : true
                   }else if(item.submitKey == 'store_ids'){
                        let str = []
                        let ids = []
                        res['store_id_arr'].forEach((itm)=>{
                           str.push(itm.name)
                            ids.push(itm.id + '')
                        })
                        item.disable = isSameStore ? false : true
                        wx.setStorageSync('checkStoreIds',ids)
                        wx.setStorageSync('checkStoreNames', str)
                        this.updateListData('chainStore',str.join(','))
                   }else if(item.submitKey == 'consume'){
                        item.value = res['consume_num']
                        item.money = res['consume_price']
                        item.disable = isSameStore ? false : true
                   }else{
                        item.value = res[item.submitKey]
                        item.selectId = res[item.consume_time]
                        item.disable = isSameStore ? false : true
                   }    
               })
               this.setData({
                    course_type_edit:course_type,
                    list,
                    supportCards:card,
                    editInfo:res
               })
               this.formatData(card)
               
              this.getConfigList()
            }
        })
    },
    //获取教练 教室 颜色列表
    getConfigList(){
        const { list, editId, course_type_edit, editInfo } = this.data
        request({
            url:baseUrl + getCourseConfig,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                //数据组合
                const { staff, room, config, color, course_type, chainStore } = res
                // if(!staff.length){
                //     wx.showModal({
                //         title:'提示',
                //         content:"请配置员工信息",
                //         success:()=>{
                //             wx.navigateBack({
                //                 delta: 1
                //             })
                //         }
                //     })
                //     return
                // }
                let course_type_obj = this.toObj(course_type_edit) || {}
                course_type.forEach(item => {
                    item.checked = course_type_obj[item.id] ? true : false
                });
                list.forEach(item => {
                    item.list = res[item.key] ? res[item.key] : item.list
                    if(item.key == 'chainStore' && chainStore.length == 1){
                        item.value = chainStore[0].name
                        item.selectId = [chainStore[0].id]
                    }else if(item.key == 'staff'){
                        let staffInfo = res.staff.filter((item)=>{
                            return item.id == editInfo.coach_staff_id
                        })
                        item.value = staffInfo.length ? staffInfo[0].name : ''
                        item.selectId = editInfo.coach_staff_id
                    }else if(item.key == 'room'){
                        let roomInfo = res.room.filter((item)=>{
                            return item.id == editInfo.classroom_id
                        })
                        item.value = roomInfo.length ? roomInfo[0].name : ''
                        item.selectId = editInfo.classroom_id
                    }
                });
                if(!editId){
                    let storeInfo = chainStore.filter((item)=>{
                        return item.id ==  wx.getStorageSync('store_id')
                    })
                    this.updateListData('chainStore',storeInfo[0].name,storeInfo[0].id)
                    wx.setStorageSync('checkStoreIds',[storeInfo[0].id + ''])
                    wx.setStorageSync('checkStoreNames',[storeInfo[0].name])
                }
                // if(chainStore.length == 1){
                //     let selectName = [chainStore[0].name]
                //     let checkedIds = [chainStore[0].id]
                //     wx.setStorageSync('checkStoreIds', checkedIds)
                //     wx.setStorageSync('checkStoreNames', selectName)
                // }
                this.setData({
                    list,
                    courseType:course_type,
                })
            }
        })
    },
    toObj(list){
        if(!list.length){
            return {}
        }
        let obj = {}
        list.forEach((item)=>{
            obj[item.id] = item
        })
        return obj
    },
    getImg() {
        const { isAction, isSameStore } = this.data
        if(isAction != 2){
            return
        }
        if(!isSameStore){
            return
        }
        let that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compress'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.data.upyunFilePath = res.tempFilePaths[0]
                that.setData({
                    imgSrc:that.data.upyunFilePath
                })
                that.cropper = that.selectComponent("#image-cropper");
            }
        })
    },
    sure(){
        // 提交数据
        const { list, supportCardList, btnDisable } = this.data
        if(btnDisable){
            return
        }
        this.setData({
            btnDisable:true
        })
        let submitData = {
            course_type_ids:[],
            name:'',
            store_ids:[],
            consume_price:'',
            consume_num:'',
            duration:'',
            min_user:'',
            max_user:'',
            coach_staff_id:'',
            classroom_id:'',
            color:'',
            difficulty_star:'',
            cover_img:'',
            synopsis:'',
            support_cards:[{
                type:'',
                ids:[]
            }]
        }
        list.forEach((item)=>{
            if(item.submitKey == 'course_type_ids'){
                let ids = item.selectId.split(',')
                let selectIds = ids.filter((itm)=>{
                    return itm
                })
                submitData[item.submitKey] = selectIds
            }else if(item.submitKey == 'store_ids'){
                submitData[item.submitKey] = wx.getStorageSync('checkStoreIds')
            }else if(item.submitKey == 'support_cards'){
                let storageData = wx.getStorageSync('checkedSupportList')
                let filterData = storageData.map((item)=>{
                    let obj = item
                    return item.ids.length ? obj : ''
                })
                let validData = filterData.filter((item)=>{
                    return item
                })
                submitData[item.submitKey] = validData
            }else if(item.submitKey == 'consume'){
                submitData['consume_price'] = item.money
                submitData['consume_num'] = item.value
            }else{
                submitData[item.submitKey] = item.selectId || item.value
            }
        })
        for(let key in submitData){
            if(!submitData[key] && key != 'coach_staff_id' && key != 'classroom_id' && key != 'synopsis'){
                wx.showModal({
                    title:'请完善信息',
                    showCancel:false ,
                })
                this.setData({
                    btnDisable:false
                })
                return
            }
        }
        this.submit(submitData)
    },
    submit(submitData){
        const { editId } = this.data
        let url = editId ? editCourse : addCourse
        if(editId){
            submitData.id = editId
        }
        request({
            url:baseUrl + url,
            data:submitData,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    btnDisable:false
                })
                wx.showModal({
                    title:`${editId ? '修改' : '添加'}成功`,
                    showCancel:false ,
                    success(res){
                        wx.navigateBack({
                            delta: 1, // 回退前 delta(默认为1) 页面
                        })
                    }
                })
            }
        }).catch(()=>{
            this.setData({
                btnDisable:false
            })
        })
    },
    cancle(){
        const { editId } = this.data
        if(!editId){
            wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
            })
            return
        }

        request({
            url:baseUrl + delCourse,
            data:{
                id:editId
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:'删除成功',
                    showCancel:false ,
                    success(res){
                        wx.navigateBack({
                            delta: 1, // 回退前 delta(默认为1) 页面
                        })
                    }
                })
            }
        })
    },
    //input - event - blur
    getNumberValue(e){
        const { value } = e.detail
        const { key, subkey } = e.currentTarget.dataset
        const { list } = this.data
        if(key == 'consume'){
            list.forEach(item => {
                item.value = item.key == key && subkey && subkey == 'time' ? value : item.value
                item.money = item.key == key && subkey && subkey == 'money' ? value : ''
            });
        }else{
            this.updateListData(key,value)
        }
        
        this.setData({
            list, 
        })
    },
    //textarea - event - input
    getMemoValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { list } = this.data
        this.updateListData(key,value)
    },
    // 评级
    onChange(e){
        const { detail } = e
        const { list, isSameStore } = this.data
        this.updateListData('difficulty_star',detail)
    },
    //获取到image-cropper实例
    loadimage(e){
        console.log("图片加载完成",e.detail);
        wx.hideLoading();
        this.cropper.imgReset();
    },
    loadimage(e){
        console.log("图片加载完成",e.detail);
        wx.hideLoading();
        this.cropper.imgReset();
    },
    clickcut(e) {
        console.log(e.detail);
    },
    effectiveImg(){
        let that = this
        wx.showLoading({
            title:'上传中'
        })
        this.cropper.getImg((obj) => {
            console.log('obj.url',obj.url)
            wx.uploadFile({
                url: baseUrl + uploadImg,
                filePath:obj.url,
                name:'image',
                formData:{
                    image:obj.url
                },
                success:(result)=>{
                    let imgInfo = JSON.parse(result.data)
                    if(result.statusCode == 200) {
                        that.data.upyunFilePath = imgInfo.content.url
                        that.data.list.forEach(item => {
                            item.value = item.key == 'cover_img' ? that.data.upyunFilePath : item.value
                        });
                        that.setData({
                            list:that.data.list,
                            imgSrc:''
                        })
                        wx.hideLoading()
                    }
                }
            })
        });
    },
    cancleTailoring(){
        this.setData({
            imgSrc: ''
        })
    },
    // 更改list的数据
    updateListData(key,value,selectId){
        const { list } = this.data
        console.log({key,value,selectId})
        list.forEach((item)=>{
            item.value  = item.key == key ? value : item.value
            item.selectId = item.key == key ? selectId || '' : item.selectId
        })
        this.setData({
            list,
        })
    },
    // 编辑更改渲染数据
    updateListRenderData(){
        const { list, courseInfo } = this.data
        list.forEach(item => {
            if(item.key == ''){}
            item.value = courseInfo[item.key]
        });
    },
    formatData(card){
        const { cardType, list } = this.data
        let course_type = list[0].selectId.split(',')
        let course_list = course_type.filter((item)=>{
            return item
        })
        let consume = {
            2:list[4].value || '', 
            3:list[4].money || '',
            4:list[3].value || ''
        }
        let card_list = card.map((item)=>{
            let obj = item
            let arr = []
            item.card_arr.forEach((itm)=>{
                itm.ids.forEach((p)=>{
                    arr.push(p.id + '')
                })
            })
            let peon = Array.from(new Set(arr))
            obj = {
                course_type_id:item.course_type_id,
                checkIds:peon,
                card_arr:item.card_arr.map((itm)=>{
                    let middle = itm
                    middle.name = cardType[itm.type]
                    middle.checked = itm.ids.length ? true : false
                    middle.ids = itm.ids.map((v)=>{
                        let o = v
                        o.property = itm.type == 1 ? -1 : v.property == -1 ? consume[itm.type] : v.property
                        return o
                    })
                    return middle
                })
            }
            return course_list.indexOf(item.course_type_id + '') >-1 ? obj : ''
        })
        let card_list_rest = card_list.filter((item)=>{
            return item
        })
        wx.setStorageSync('supportCard', card_list_rest || [])
        this.filterSelectData(card_list_rest)
    },
    //支持的会员卡
    supportCardAction(card){
        const { cardType } = this.data
        let card_list = card.map((item)=>{
            let obj = item
            obj.name = cardType[item.type]
            obj.checked = item.ids.length ? true : false
        })
        let card_ids = []
        card.forEach(element => {
             element.ids.forEach((item)=>{
                 card_ids.push(item.id + '')
             })
        })
        let peon = Array.from(new Set(card_ids))
        console.log('peon',peon)
        return peon
    },
    //编辑 当前选中的数据
    filterSelectData(cardList){
        let list = cardList.map((item)=>{
            let arr = []
            item.card_arr.forEach((middle)=>{
                middle.ids.forEach((itm)=>{
                    if(item.checkIds.indexOf(`${itm.id + ''}`) > -1){
                        itm.property = middle.type == 1 ? -1 : itm.property
                        itm.type = middle.type
                        arr.push(itm)
                    }
                })
            })
            let obj = {
                type:item.course_type_id,
                checkIds:item.checkIds,
                ids: arr
            }
            return obj 
        })
        console.log('list',list)
        wx.setStorageSync('checkedSupportList',list)
        this.setData({
            supportCardList:list || []
        })
    }
})