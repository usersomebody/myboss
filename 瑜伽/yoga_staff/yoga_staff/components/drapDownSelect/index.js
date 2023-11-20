Component({
    data:{
        selectId:'',
        selectName:""
    },
    properties: {
        list:{
            type: Array,
            value: []
        },
        key:{
            type:String,
            value:''
        }
    },
    observers: {
        'key': function(newVal) {
          this.setData({
            selectName: ''
          })
        },
      },
    attached() {

    },
    methods:{
        filterSelectData(list){
            let selectList = list.filter(item=>{
                return item.select
            })
            return selectList
        },
        selectData(){
            const { list } = this.properties
            let data = this.filterSelectData(list)
            // if(!data.length){
            //     wx.showModal({
            //         title:'提示',
            //         content:'请添加条件',
            //         showCancel:false
            //     })
            //     return
            // }
            this.triggerEvent('updataData',{key:this.properties.key,data:data,type:1})
        },
        clear(){
            this.triggerEvent('updataData',{key:this.properties.key,data:[],type:2})
        },
        select(e){
            const { id } = e.currentTarget.dataset
            const { list, selectId } = this.data
            let selectList = list.filter((item)=>{
                return item.id == id
            })
            if(this.properties.type == 3){
                this.setData({
                    selectName:selectList[0].name || '',
                })
                this.triggerEvent('updataData',{key:this.properties.key,data:[],type:3,id})
                return
            }
            
            if(id == selectId && selectList[0].select){
                this.setData({
                    selectName:''
                })
            }else if(!selectList[0].select){
                this.setData({
                    selectName:selectList[0].name || '',
                    selectId:id
                })
            }
            this.triggerEvent('updataData',{key:this.properties.key,data:[],type:3,id})
        }
    }
})