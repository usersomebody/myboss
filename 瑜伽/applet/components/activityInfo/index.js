

Component({
    data: {

    },
    properties: {
        activityInfo:{
            type:Object,
            value:{}
        },
        url:{
            type:String,
            value:{}
        }
    },
    attached() {
        this.judgeTimeValid()
    },
    methods: {
        judgeTimeValid(){
            
        },
        navigatePage(){
            wx.navigateTo({
                url: this.properties.url
            })
        }
    }
       
})
