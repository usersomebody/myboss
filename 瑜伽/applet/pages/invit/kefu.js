const app = getApp()
Page({
    data:{
        showData:{

        },
        codeType:{
            1:'企业微信号',
            2:'公众号',
            3:'个人微信号'
        },
        qrType:3
    },
    onLoad(){
        this.formatShowData()
    },
    onShow(){
        
    },
    // 处理显示数据
    formatShowData(){
        let qrcode = app.globalData.qrcode
        const { codeType } = this.data
        qrcode.codeType = `${qrcode.qr_type != 1 ? '长按识别二维码，关注' : '长按保存图片，识别二维码，关注'}${codeType[qrcode.qr_type]}`
        this.setData({
            showData:qrcode,
            qrType:qrcode.qr_type
        })

    },
    checkImg(){
        const { showData } = this.data
        wx.previewImage({
            urls:[showData.qr_img],
            showmenu:true,
            current:showData.qr_img
        })
    }
})