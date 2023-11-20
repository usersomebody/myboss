Component({
    data:{
        switchId:'-1',
        showList:[]
    },
    properties: {
        list: {
            type: Array,
            value: []
        },
        name:{
            type:String,
            value:''
        },
        type:{
            type:String,
            value:""
        }
    },
    lifetimes: {
        attached(){
            const { list } = this.data
            console.log('list______prop',list)
            let showList = []
            if(list.length > 11){
                let obj = {
                    id:'-10',
                    name:'查看更多'
                }
                let partList = list.slice(0,11)
                partList.push(obj)
                showList = partList.concat()
            }else{
                showList = list.concat()
            }
            console.log('showList',showList)
            this.setData({
                showList
            })
        },
    },
    methods:{
        //数组对象合并
        toObj(data){
            const info = {}
            data.forEach(item => {
                info[item.id] = item
            });
            return info
        },
        mergeArray(obj){
            const { list } = this.data
            let merageList = list.map((item)=>{
                let head = item
                head.checked = obj[item.id] ? obj[item.id].checked : item.checked
                return head
            })
            return merageList
        },
        switchSingle(e){
            const { id } = e.currentTarget.dataset
            const { list, type, switchId, showList } = this.data
            if(switchId == id){
                return
            }
            if(id == '-10'){
                let info = this.toObj(showList)
                this.setData({
                    showList:this.mergeArray(info)
                })
                return
            }
            showList.forEach(element => {
                // if(id == 0){
                //     element.checked = true
                // }else{
                    element.checked = id == element.id ? true : false
                // }
            });            
            this.setData({
                switchId:id,
                showList
            })
            //返回给父组件的数据一定是原始的数组数据 感觉这里代码冗余了...
            
            let info = this.toObj(showList)
            let fatherList = this.mergeArray(info)
            this.triggerEvent('updateCourse',{list:fatherList,type:type})
        }
    }
})