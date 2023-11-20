Component({
    data:{
        showOverlayer: false,
    },
    properties: {
        showData: {
            type: Array,
            value: []
        }
    },
    attached(){

    },
    methods:{
        gotoEdit(e){
            const { link } = e.currentTarget.dataset
            this.showPop()
            wx.navigateTo({
                url: link,
            })
        },
        showPop(){
            this.setData({
                showOverlayer:!this.data.showOverlayer
            })
        },
    }
})