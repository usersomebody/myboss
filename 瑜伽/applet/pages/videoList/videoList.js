const app = getApp()

Page({
    data:{
        iPhonex:false,
        canvasShow:false,
        showOverlayer:false,
    },
    onLoad(){
        this.setData({
            iPhonex:app.globalData.isIphoneX || false
        })
    },
    showCanvas(){
        this.setData({
            canvasShow:true,
            showOverlayer:true
        })
    },
    updateData(){
        this.setData({
            canvasShow:false,
            showOverlayer:false
        })
    },
})