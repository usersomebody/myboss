import { request } from '../../utils/util.js'
import { telReg } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import moment from '../../utils/moment.js'

const app = getApp()
const { uploadImg, getStaff, editStaff, addStaff, delStaff, getCourseConfig, getAllRoleForStoreIds } = api
Page({
    data:{
        upyunFilePath:[],
        avatarSrc:'',
        imgSrc:'',
        showList:[{
            name:'头像',
            key:'head_img',
            placeholder:'',
            value:'',
            require:true,
            isInput:false,
            isPicker:false,
            isShow:false,
            isShowIcon:true,
            isAction:true
        },{
            name:'姓名',
            key:'name',
            placeholder:'必填',
            value:'',
            require:true,
            isInput:true,
            isPicker:false,
            isShow:false,
            isShowIcon:false,
            isAction:true
        },{
            name:'昵称',
            key:'nickname',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:true,
            isPicker:false,
            isShow:false,
            isShowIcon:false,
            isAction:true
        },{
            name:'手机号',
            key:'phone',
            placeholder:'必填',
            value:'',
            require:true,
            isInput:true,
            isPicker:false,
            isShow:false,
            isShowIcon:false,
            isAction:true
        },{
            name:'消息接收人',
            key:'work_userid',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:true,
            isPicker:false,
            isShow:false,
            isShowIcon:false,
            isAction:true
        },{
            name:'性别',
            key:'sex',
            placeholder:'必填',
            value:'女',
            list:[{
                id:1,
                name:'男'
            },{
                id:2,
                name:'女'
            }],
            index:2,
            selectId:2,
            require:false,
            isInput:false,
            isPicker:true,
            isShow:false,
            isShowIcon:true,
            isAction:true
        },{
            name:'生日',
            key:'birthday',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShow:false,
            isShowIcon:true,
            isAction:true
        },{
            name:'入职时间',
            key:'entry_time',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShow:false,
            isShowIcon:true,
            isAction:true
        },{
            name:'工作类型',
            key:'type',
            dataKey:'type',
            placeholder:'选填',
            value:'全职',
            list:[{
                id:1,
                name:'全职'
            },{
                id:2,
                name:'兼职'
            }],
            index:0,
            selectId:1,
            require:false,
            isInput:false,
            isPicker:true,
            isShow:false,
            isShowIcon:true,
            isAction:true
        },{
            name:'权限设置',
            key:'store_name_arr',
            dataKey:'store_name_arr',
            placeholder:'选填',
            value:'',
            require:true,
            isInput:false,
            isPicker:false,
            isShowIcon:true,
            isShow:false,
            link:"/pages/member/roleStoreList"
        },
        // {
        //     name:'教练类型',
        //     key:'staff',
        //     dataKey:'staff',
        //     placeholder:'选填',
        //     value:'',
        //     require:false,
        //     isInput:false,
        //     isPicker:false,
        //     isShowIcon:true,
        //     isShow:false,
        //     link:"//"
        // },{
        //     name:'成员ID',
        //     key:'member_id',
        //     placeholder:'选填',
        //     value:'',
        //     isInput:true,
        //     require:false,
        //     isShowIcon:false
        // },
        {
            key:'resume',
            submitKey:'resume',
            name:'简介',
            value:'',
            placeholder:'输入简介',
            require:false,
            isHandle:false,
            isInput:false,
            isShow:true,
            isShowIcon:true,
            link:"/pages/member/resume",
            isAction:true
        }],
        date:'',
        width:200,//宽度
        height: 200,//高度
        currentDate:'',
        showOverlayer:false,
        editId:'',
        store_role_list:[],
        filter_store_name_arr:[],
        action:1,
        workDisable:''
    },
    onUnload(){
        app.globalData.checkRoleRoot = ''
        app.globalData.role_ids = ''
        app.globalData.submitCheckCodes = ''
        app.globalData.personal_style = ''
        app.globalData.storeRoleList = ''
    },
    onLoad(options){
        this.setData({
            currentDate:moment().format('YYYY-MM-DD'),
            editId:options.id,
            action:options.action,
            workDisable:wx.getStorageSync('store_info').apply_company_key || ''
        })
        if(options.action == 2){
            wx.showModal({
                title:'无权限操作其它场馆的课程',
                showCancel:false,
                
            })
        }
        wx.setNavigationBarTitle({
            title: options.id ? '编辑员工' : '新增员工',
        })
        this.getALLRole()
    },
    onShow(){
        const { showList } = this.data
        let submitData = app.globalData.storeRoleList
        if(submitData && submitData.length){
            let store_check_name = submitData.map((item)=>{
                return item.store_name
            })
            let isTeacher = submitData.some((item)=>{
                let teacher = item.checkName ? item.checkName.some((itm)=>{
                    return itm.indexOf('老师/教练') > -1 ? true : false
                }) : false
                return teacher
            })
            showList[showList.length - 1].isShow = !isTeacher ? true : false
            
            this.setData({
                showList:this.updateAssignment('store_name_arr',store_check_name.join(','),1)
            })
        }
        let personal_style = app.globalData.personal_style
        if(personal_style){
            this.setData({
                showList:this.updateAssignment('resume',personal_style.resume,1)
            })
        }
    },

    toObjData(arr,key){
        let obj = {}
        arr.forEach((item)=>{
            obj[item[key]] = item
        })
        return obj
    },
    sure(){
        const { editId, filter_store_name_arr } = this.data
        let isPass = this.verifyData()
        if(!isPass){
            return
        }
        if(editId){
            isPass.id = editId
        }
        //原始数据
        let historyData = this.toObjData(filter_store_name_arr,'id')
        console.log('historyData',historyData)
        //switch 1开启2关闭
        let submitData = app.globalData.storeRoleList
        let staff_roles = submitData.map((item)=>{
            let obj = {
                is_private:item.week.some((v)=>{
                    return v.attend.length
                }) ? 1 : 2,
                is_show_applet:editId && historyData[item.store_id] ? historyData[item.store_id].is_show_applet : 2,
                store_id:item.store_id,
                role_id:item.checkIds[0],
                auth_code:item.isRoot == 1 ? [] : item.checkCodes,
                data_range:item.data_range,
                role_ids:item.checkIds.join(','),
                allow_login:editId && historyData[item.store_id] ? historyData[item.store_id].allow_login : 1,
                private_time_frame:this.updateWeekData(item.week)
            }
            return obj
        })
        isPass.staff_roles = staff_roles
        isPass = {...isPass,...app.globalData.personal_style}
        console.log('isPass',isPass)
        let url = editId ? editStaff : addStaff
        request({
            url:baseUrl + url,
            data:isPass,
            method:'POST',
            isTologin:true,
            success:(res)=>{
                wx.showModal({
                    title:editId ? '修改成功' : '添加成功',
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
        let idArr = ['sex','type']
        list.forEach((item)=>{
            if(idArr.indexOf(item.key) > -1){
                info[item.key] = item.selectId
            }else{
                info[item.key] = item.value
            }
        })
        return info
    },
    //提交数据周期处理
    updateWeekData(data){
        let weekData = {
            1:'monday',
            2:'tuesday',
            3:'wednesday',
            4:'thursday',
            5:'friday',
            6:'saturday',
            0:'sunday'
        }
        let submitWeek = data.map((item)=>{
            // let rest = item.rest.filter((itm)=>{
            //     return itm.rest_start_time != '00:00:00' && itm.rest_end_time != '00:00:00'
            // })
            let o = {
                id:item.id,
                on_duty:item.attend[0] || '',
                off_duty:item.attend[1] || '',
                rest:item.rest.map((v)=>{
                    let p = v.rest_start_time != '00:00' && v.rest_end_time != '00:00' ? `${v.rest_start_time}-${v.rest_end_time}` : ''
                    return p
                }),
                switch:item.attend.length ? 1 : 2
            }
            return o
        })
        let obj = {}
        submitWeek.forEach((item)=>{
            obj[weekData[item.id]] = item
        })
        return obj
    },
    getImg() {
        if(this.data.action == 2){
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
    //获取到image-cropper实例
    cropperload(e){
        console.log("cropper初始化完成");
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
        if(this.data.action == 2){
            return
        }
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
                        let showList = that.updateAssignment('head_img',imgInfo.content.url,1)
                        that.setData({
                            avatarSrc:that.data.upyunFilePath,
                            imgSrc:'',
                            showList
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
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        if(key == 'phone' && !telReg(value)){
            wx.showModal({
                title:'手机号格式不正确',
                showCancel:false
            })
            return
        }
        let showList = this.updateAssignment(key,value,1)
        this.setData({
            showList, 
        })
    },
    getMemoValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        const { list } = this.data
        this.updateAssignment(key,value,1)
    },
    bindDateChange(e){
        if(this.data.action == 2){
            return
        }
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        let showList = this.updateAssignment(key,value,1)
        this.setData({
          date: value,
          showList
        })
    },
    bindPickerChange(e){
        if(this.data.action == 2){
            return
        }
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        let showList = this.updateAssignment(key,value,2)
        this.setData({
            showList
        })
    },
    updateAssignment(key,value,type,selectId){
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
        }else if(type == 3){
            showList.forEach((item)=>{
                if(item.key == key){
                    item.value = value
                    item.selectId = selectId
                }
            })
        }

        return showList
    },
    goSendRole(e){
        if(this.data.action == 2){
            return
        }
        const { link } = e.currentTarget.dataset
        wx.navigateTo({
            url: link
        })
    },
    closeMessage(){
        this.setData({
            showOverlayer:!this.data.showOverlayer 
        })
    },
    // 获取员工信息
    getStaff(){
        const { editId, showList, store_role_list } = this.data
        request({
            url:baseUrl + getStaff,
            data:{
                id:editId
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                const {  store_name_arr } = res
                let filter_store_name_arr = store_name_arr.filter((item)=>{
                    return item.store_status
                })
                let isTeacher = store_name_arr.some((item)=>{
                    let teacher = item.store_role ? item.store_role.some((itm)=>{
                        return itm.role_name.indexOf('老师/教练') > -1 ? true : false
                    }) : false
                    return teacher
                })
                showList.forEach((item)=>{
                    if(item.key == 'sex'){
                        item.value = res[item.key] == 1 ? '男' : '女'
                        item.index = res[item.key]
                    }else if(item.key == 'type'){
                        item.value = res[item.key] == 1 ? '全职' : '兼职'
                        item.index = res[item.key]
                    }else if(item.key == 'store_name_arr'){
                        let str = []
                        if(filter_store_name_arr.length){
                            str = filter_store_name_arr.length > 1 ? filter_store_name_arr.map((itm)=>{
                                let obj = itm.name
                                return obj
                            }) : [filter_store_name_arr[0].name]
                        }
                        item.value = str.join(',')
                    }else{
                        item.value = res[item.key] ? res[item.key] : item.value
                    }   
                })
                // let filter_store_name_arr = store_name_arr.filter((item)=>{
                //     return item.store_status
                // })
                //编辑整合数据
                let storeInfo = filter_store_name_arr.map((item)=>{
                    //角色名称
                    let checkName = item.store_role.map((v)=>{
                        let o = v.role_name
                        return o
                    })
                    console.log('checkName',checkName)
                    //角色ID
                    let checkIds = item.store_role.map((v)=>{
                        let o = v.role_id + ''
                        return o
                    })
                    let obj = {
                        checkCodes:item.auth_code,
                        checkIds:checkIds,
                        checkName:checkName,
                        data_range:item.data_range,
                        delCode:checkName.indexOf('超级管理员') == -1  ? this.deledCodes(item.id,checkIds,item.auth_code) : [],
                        isRoot:checkName.indexOf('超级管理员') > -1 ? 1 : 0,
                        isTeacher:checkName.indexOf('老师/教练') > -1 ? 1 : 0,
                        store_id:item.id + '',
                        store_name:item.name,
                        week:this.conversionWeek(item.private_time_frame_arr)
                    }
                    return obj
                })
                //个人简介数据
                app.globalData.personal_style = {
                    cover_img:res.cover_img,
                    personal_style:res.personal_style,
                    resume:res.resume,
                    skilled_id:res.skilled_id.map((item)=>{
                        return parseInt(item)
                    }),
                    work_years:res.work_years,
                    rule_imgs:res.personal_style.map((item)=>{
                        return item.url
                    })
                }
                app.globalData.storeRoleList = storeInfo
                showList[showList.length - 1].isShow = !isTeacher ? true : false
                this.setData({
                    showList,
                    avatarSrc:res.head_img,
                    filter_store_name_arr,
                })
            }
        })
    },
    // 转换星期
    conversionWeek(data){
        let weekData = {
            monday:{
                id:1,
                name:'一',
                eName:'monday'
            },
            tuesday:{
                id:2,
                name:'二',
                eName:'tuesday'
            },
            wednesday:{
                id:3,
                name:'三',
                eName:'wednesday'
            },
            thursday:{
                id:4,
                name:'四',
                eName:'thursday'
            },
            friday:{
                id:5,
                name:'五',
                eName:'friday'
            },
            saturday:{
                id:6,
                name:'六',
                eName:'saturday'
            },
            sunday:{
                id:0,
                name:'日',
                eName:'sunday'
            }
        }
       
        let week = []
        for(let key in data){
            let attend = new Array(`${data[key].on_duty == null ? '' : data[key].on_duty}`, `${data[key].off_duty == null ? '' : data[key].off_duty}`);
            attend = attend.filter((item)=>{
                return item
            })
            let rest = data[key].rest.map((v)=>{
                let currentV = v ? v.split('-') : ['00:00','00:00']
                let p = {
                    rest_start_time:currentV[0],
                    rest_end_time:currentV[1]
                }
                return p
            })
            let weekDemo = {
                attend:attend,
                checked: false,
                id: weekData[key].id,
                name: weekData[key].name,
                rest:rest
            }
            week.push(weekDemo)
        }

        return week
    },
   getALLRole(){
        const { store_id, editId } = this.data
        request({
            url:baseUrl + getAllRoleForStoreIds,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                this.setData({
                    store_role_list:res.store_role
                })
                if(editId){
                    this.getStaff()
                }
            }
        })
    },
    //选中角色被删除掉的code
    deledCodes(store_id,teacherArr,auth_code){
        const { store_role_list } = this.data
        let roleCodes = []
        let delCode = []
        store_role_list.forEach((item)=>{
            if(item.store_id == store_id){
                item.role.forEach((itm)=>{
                    if(teacherArr.indexOf(`${itm.id}`) > -1){
                        roleCodes = [...roleCodes,...itm.auth_code_arr]
                    }
                })
            }
        })

        delCode = roleCodes.reduce((arr, item) => {
          !auth_code.includes(item) && arr.push(item)
          return arr
        }, [])
        return delCode
    },
    goResume(e){
        if(this.data.action == 2){
            return
        }
        const { link } = e.currentTarget.dataset
        if(!link){
            return
        }
        wx.navigateTo({
            url: link
        })
    },
    cancle(){
        const { editId } = this.data
        if(editId){
            wx.showModal({
                title:'确认删除',
                success:(res)=>{
                    if(res.confirm){
                        request({
                            url:baseUrl + delStaff,
                            data:{
                                id:editId
                            },
                            method:'POST',
                            isTologin:true,
                            success:(res)=>{
                                wx.showModal({
                                    title:'删除成功',
                                    showCancel:false,
                                    success:()=>{
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }else{
            wx.navigateBack({
                delta: 1
            })
        }
        
    },
    workUserAlert(e){
        const { key } = e.currentTarget.dataset
        const { workDisable } = this.data
        console.log('workUserAlert')
        if(key != 'work_userid'){
            return
        }
        if(!workDisable){
            wx.showModal({
                content:'教练接收课程通知的人员企业微信账号 ,请确认企业微信已添加[气质范服务]应用',
                showCancel:false
            })
            return
        }
    }
})