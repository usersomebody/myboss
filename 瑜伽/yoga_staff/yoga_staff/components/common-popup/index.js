import moment from '../../utils/moment.js'
import { request } from '../../utils/util.js'
import { api, baseUrl } from '../../utils/api.js'

const { searchScheduleName } = api
Component({
    data: {
        checkedId:1,
        checkedName:'',
    },
    properties: {
        name: {
            type: String,
            value: ''
        },
        list: {
            type: Array,
            value: ''
        },
        key: {
            type: String,
            value: ''
        },
        selectId:{
            type:String,
            value:''
        },
        valName:{
            type:String,
            value:''
        }
    },
    observers: {
        'valName': function(val) {
            if(val){
                this.setData({
                    checkedName:val
                })
            }
        },
    },
    attached() {
        const { selectId, key, name, valName } = this.properties
        console.log({ selectId, key, name, valName })
        this.setData({
            checkedId:selectId || 1
        })
    },
    methods: {
        saveData(){
            const { checkedId, checkedName, list } = this.data
            const { key } = this.properties
            let selectId = key == 'course_type' ? [] : checkedId
            let selectName = key == 'course_type' ? [] : checkedName
            if(key == 'course_type'){
                list.forEach(item => {
                    selectId = item.checked ? [...selectId,item.id] : selectId 
                    selectName = item.checked ? [...selectName,item.name] : selectName
                });
                selectId = selectId.join(',')
                selectName = selectName.join(',')
            }
            this.triggerEvent('updataData',{id:selectId,name:selectName,key,type:'save'})
            
        },
        //单选
        switchTab(e){
            const { id, name, item } = e.currentTarget.dataset
            const { checkedId  } = this.data
            const { key } = this.properties
            if(id == checkedId){
                return
            }
            this.setData({
                checkedId:key == 'color' ? item : id,
                checkedName:key == 'color' ? item : name,
            })
        },
        //多选
        multipleChoose(e){
            const { id, name, item } = e.currentTarget.dataset
            const { list, key } = this.properties
            this.triggerEvent('updataData',{id,name,key,type:'update'})
        }
    }
})
