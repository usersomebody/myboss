import { request } from '../../utils/util.js'
import { getAstro } from '../../utils/common.js'
import { api, baseUrl } from '../../utils/api.js'
import moment from '../../utils/moment.js'
let allProvinces = []

const app = getApp()
const { addUserConfig, getUserInfo, editUserAndCard, getProvinces, getCity } = api
Page({
    data:{
        showList:[{
            name:'姓名',
            key:'name',
            placeholder:'必填',
            value:'',
            require:true,
            isInput:true,
            isPicker:false,
            isShowIcon:false
        },{
            name:'性别',
            key:'sex',
            placeholder:'必填',
            value:'',
            list:[{
                id:0,
                name:'未知'
            },{
                id:1,
                name:'男'
            },{
                id:2,
                name:'女'
            }],
            index:'',
            require:true,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'手机号',
            key:'phone',
            placeholder:'必填',
            value:'',
            require:false,
            isInput:true,
            isPicker:false,
            isShowIcon:false
        },{
            name:'出生年月',
            key:'birthday',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'年龄',
            key:'age',
            placeholder:'必填',
            value:'',
            require:false,
            isInput:true,
            isPicker:false,
            isShowIcon:false,
            disable:true
        },{
            name:'星座',
            key:'constellation',
            placeholder:'',
            value:'',
            require:false,
            isInput:false,
            isPicker:false,
            isShowIcon:false
        },{
            name:'兴趣',
            key:'hobbies',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:true,
            isPicker:false,
            isShowIcon:false
        },{
            name:'邮箱',
            key:'email',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:true,
            isPicker:false,
            isShowIcon:false
        },{
            name:'地址',
            key:'address',
            placeholder:'选填',
            value:['选填'],
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'注册日期',
            key:'register_time',
            placeholder:'选填',
            value:'',
            require:false,
            isInput:true,
            isPicker:false,
            isShowIcon:false
        },{
            name:'所属销售',
            key:'sale_staff_id',
            dataKey:'sale',
            placeholder:'选填',
            value:'',
            list:[{
                id:1,
                name:'销售1'
            },{
                id:2,
                name:'销售2'
            },{
                id:3,
                name:'销售3'
            }],
            index:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'会员来源',
            key:'channel_id',
            dataKey:'channel',
            placeholder:'选填',
            value:'',
            list:[{
                id:1,
                name:'活动'
            },{
                id:2,
                name:'后台添加'
            },{
                id:3,
                name:'主动申请'
            }],
            index:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true
        },{
            name:'会员标签',
            key:'label_id',
            dataKey:'label',
            placeholder:'选填',
            value:'',
            list:[{
                id:1,
                name:'标签1'
            },{
                id:2,
                name:'标签2'
            },{
                id:3,
                name:'标签3'
            }],
            index:'',
            require:false,
            isInput:false,
            isPicker:true,
            isShowIcon:true,
        },{
            name:'学习意向',
            key:'study',
            placeholder:'选填',
            value:'',
            index:'',
            require:false,
            isInput:true,
            isPicker:false,
            isShowIcon:true,
        }],
        date:'',
        currentDate:'',
        sendCard:[],
        vipType:'',
        vipId:'',
        region:['选填'],
        cityId:'',
        areaId:'',
        provinceId:'',
        show:false,
        newKey:'',
        spending_power:{},
        diy_info:[],
    },
    onLoad(options){
        this.setData({
            currentDate:moment().format('YYYY-MM-DD'),
            vipType:options.type,
            vipId:options.id
        })
        this.getPickerBaseData()
        this.getProvice()
    },
    onShow(){
    },
    //获取会员基本信息
    getUserInfo(){
        const { showList, vipType, vipId } = this.data
        request({
            url:baseUrl + getUserInfo,
            data:{
                id:vipId,
                type:vipType
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                // res.birthday = '2021-10-15' 
                // res.province_name = '陕西省'
                // res.city_name = '西安市',
                // res.area_name = '雁塔区'
                showList.forEach((item)=>{
                    if(item.key == 'sex' || item.key == 'sale_staff_id' || item.key == 'label_id' || item.key == 'channel_id'){
                        let card_attr_info = item.key == 'sex' ? item.list[res[item.key]] : item.list[res[item.key] - 1] || item.list[0]
                        item.value = card_attr_info && card_attr_info.name ? card_attr_info.name : ''
                        item.index = item.key == 'sex' ? res[item.key] : res[item.key] - 1
                        item.selectId = card_attr_info && card_attr_info.id ? card_attr_info.id : ''
                    }else if(res[item.key]){
                        item.value = res[item.key] || item.value
                    } 
                })
                let region = res.province_name && res.city_name && res.area_name ? [res.province_name,res.city_name,res.area_name] : ['选填']
                if(res.diy_info.length){
                    res.diy_info.forEach((item,idx)=>{
                        let obj = {
                            name:item.key,
                            key:'custom_' + idx,
                            type:'custom',
                            placeholder:'选填',
                            value:item.val,
                            index:'',
                            require:false,
                            isInput:true,
                            isPicker:false,
                            isShowIcon:false,
                            isDelete:true
                        }
                        showList.push(obj)
                    })
                }
                this.setData({
                  showList,
                  region,
                  cityId:res.city,
                  areaId:res.area,
                  provinceId:res.province,
                  spending_power:res.spending_power,
                  diy_info:res.diy_info
                })
                if(res.birthday){
                    this.getConstellation(res.birthday)
                }   
            }
        })
    },
    // 获取picker基本数据
    getPickerBaseData(){
        const { showList } = this.data
        request({
            url:baseUrl + addUserConfig,
            data:{},
            method:'POST',
            isTologin:true,
            success:(res)=>{
                showList.forEach((item)=>{
                    if(res[item.dataKey]){
                        console.log('item.dataKey',item.dataKey)
                        item.list = res[item.dataKey]
                    }
                })
                this.setData({
                    showList,
                })
                this.getUserInfo()
            }
        })
    },
    getInputVal(event) {
        console.log('event',event)
        const { showList, newKey, diy_info } = this.data
        let obj = {
            name:newKey,
            key:'custom_' + showList.length,
            type:'custom',
            placeholder:'选填',
            value:'',
            index:'',
            require:false,
            isInput:true,
            isPicker:false,
            isShowIcon:false,
            isDelete:true
            
        }
        showList.push(obj)
        diy_info.push({key:newKey,value:''})
        this.setData({
            showList,
            diy_info
        })
    },
    deleteDiy(e){
        const { key } = e.currentTarget.dataset
        const { showList } = this.data
        let list = showList.filter((item)=>{
            return item.key != key
        })
        this.setData({
            showList:list
        })
    },
    getNewValKey(e){
        const { value } = e.detail
        this.setData({
            newKey:value
        })
    },
    onClose() {
        this.setData({ show: false });
    },
    addKey(){
        this.setData({ show: true });
    },
    cancle(){
        wx.navigateBack({
            delta: 1
        })
    },
    sure(){
        let isPass = this.verifyData()
        if(!isPass){
            return
        }
        const { region, vipId,  vipType, showList, cityId, areaId, provinceId} = this.data
        let diy = showList.filter((item)=>{
            return item.type == 'custom'
        })
        let diy_info = diy.map((item)=>{
            let obj = {
                key:item.name,
                val:item.value || ''
            }
            return obj
        })
        isPass.diy_info = diy_info

        if(region.length && provinceId){
            //获取提交数据的省市区代码串
            this.getCity(this.data.provinceId,1).then((cityId)=>{
                this.getCity(cityId,2).then((areaId)=>{
                    this.setData({
                        cityId,
                        areaId
                    })
                    let regionObj = {
                        province_name:region[0],
                        province:this.data.provinceId,
                        city:cityId,
                        city_name:region[1],
                        area_name:region[2],
                        area:areaId
                    }
                    isPass = {...isPass,...regionObj,id:vipId,type:vipType}
                    console.log('isPass',isPass)
                    this.save(isPass)
                })
            })
        }else{
            isPass = {...isPass,id:vipId,type:vipType}
            console.log('isPass',isPass)
            this.save(isPass)
        }
        
    },
    save(isPass){
        request({
            url:baseUrl + editUserAndCard,
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
        let idArr = ['sex','channel_id','label_id', 'coach_staff_id', 'sale_staff_id']
        list.forEach((item)=>{
            if(idArr.indexOf(item.key) > -1){
                info[item.key] = item.selectId
            }else{
                info[item.key] = item.value
            }
        })
        return info
    },
    getNumberValue(e){
        const { value } = e.detail
        const { key } = e.currentTarget.dataset
        let showList = this.updateAssignment(key,value,1)
        this.setData({
            showList, 
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
        this.getConstellation(value)
        this.getAge(value)
    },
    getAge(value){
        const { currentDate } = this.data
        let age = moment(currentDate).diff(moment(value), 'year')
        let showList = this.updateAssignment('age',age,1)
        this.setData({
            showList
        })
    },
    getConstellation(value){
        let valueArr = value.split('-')
        let constellation = getAstro(valueArr[1],valueArr[2])
        let showList = this.updateAssignment('constellation',constellation,1)
        this.setData({
            showList
        })
    },
    bindPickerChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        let showList = this.updateAssignment(key,value,2)
        this.setData({
            showList
        })
    },
    bindRegionChange(e){
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        this.setData({
            region:value,
            provinceId:this.formatFilterData(allProvinces,'',e.detail.value[0])
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
                    console.log({key,value})
                    let selectData = item.list.filter((itm,idx)=>{
                        return idx == value ? {id:itm.id,name:itm.name,index:idx} : ''
                    })
                    console.log('selectData',selectData)
                    item.selectId = selectData[0].id ? selectData[0].id :''
                    item.value = selectData[0].name ? selectData[0].name : ''
                    item.index = selectData[0].index ? selectData[0].index : ''
                }
            })
        }

        return showList
    },

    //获取所有省份数据
    getProvice(){
        request({
            url:  baseUrl + getProvinces,
            data: {
              
            },
            method:'POST',
            success(res) {
                allProvinces = res
            },
        })
    },
    getCity(id,type){
        console.log('id',id)
        const { region } = this.data
        return new Promise((resolve,reject)=>{
            request({
                url:  baseUrl + getCity,
                data: {
                  id:id || '',
                },
                method:'POST',
                success:(res)=> {
                    let name = type == 1 ? region[1] : region[2]
                    let cityId = this.formatFilterData(res,'',name)
                    resolve(cityId)
                },
                fail(err){
                    reject('处理失败...')
                }
            })
        })
    },
    //过滤获取id
    formatFilterData(list,id,name){
        let checkName = name.slice(0,2)
        let filterData = list.filter((item)=>{
            return checkName == item.name.slice(0,2) || id == item.id
        })
        console.log('filterData',filterData)
        return filterData[0].id
    },
})