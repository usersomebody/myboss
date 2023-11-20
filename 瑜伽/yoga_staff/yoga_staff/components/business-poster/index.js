import { compareVersion } from '../../utils/common.js'
import { alertError } from '../../utils/util.js'
import { wrapText } from '../../utils/canvasUpdate.js'
import { coordinates } from './posterData.js'
const app = getApp()
const { SDKVersion } = wx.getSystemInfoSync();
const photosAlbum = 'scope.writePhotosAlbum'

Component({
    data:{
        isIphoneX:false,
        posterWidth:"",
        posterHeight:'',
        sWidth:690,
        sHeight:360,
        imgSrc:'',
        canUseOpenSettingBtn: compareVersion(SDKVersion, '2.0.7') > -1,
        album:'',
        product_poster_bg:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211109/9064b6bc02458d933a7aa4d936fa0aaa.png',
        QrCode:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210916/d9a4a5f23c0ae9b59a491ba2a3b4f1bc.png',
        logo:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210615/8e7e5291c1f86155a3c05124d4897b84.png',
        businessList:[],
        posterImgList:[],
        isDown:false,
        index:0,
        prviewPoster:''
    },
    properties: {
        name:{
            type:String,
            val:''
        },
        phone:{
            type:String,
            val:''
        },
        provinces:{
            type:String,
            val:''
        },
        address:{
            type:String,
            val:''
        },
        logo:{
            type:String,
            val:''
        },
        detailShow:{
            type:String,
            val:''
        }
    },
    observers: {
        'name, phone, provinces, address, logo': function(val) {
            if(val){
                this.setData({
                    posterImgList:[],
                    index:0
                })
                console.log('???')
                //   this.initPoster()
                this.drawAllPoster()
            }
            
        }
    },
    lifetimes: {
        attached() {
          this.setData({
            isIphoneX: getApp().globalData.isIphoneX,
          });
        
        },
        detached: function () {
          // 在组件实例被从页面节点树移除时执行
        },
    },
    ready(){
        const Android = wx.getSystemInfoSync().system.indexOf('Android') > -1
        
        //海报展示图片宽高
        const { screenHeight } = app.globalData;
        const reverse_height = screenHeight * 0.5;
        // const posterHeight = `${reverse_height}px`;
        // const posterWidth = `${reverse_height * 750 / this.data.sHeight}px`;

        const posterHeight = '180px';
        const posterWidth = '345px';

        this.setData({
            posterHeight,
            posterWidth,
            Android,
            sWidth: 690,
            sHeight: 360,
            posterImgList:[],
            index:0
        })

        this.checkSetting()
        // this.initPoster()
        // this.drawAllPoster()
        
    },
    methods:{
    //遍历画出海报
    drawAllPoster(){
        const { index, posterImgList } = this.data
        for(let i=0;i<coordinates.length;i+=1){
            if(index == i){
                this.initPoster(coordinates[i],()=>{
                    if(index == coordinates.length - 1){
                        this.setData({
                            businessList:posterImgList,
                            prviewPoster:posterImgList[0]
                        })
                        wx.hideLoading()
                        // if(this.properties.detailShow){
                            this.triggerEvent('drawCard',{cover:posterImgList[0],idx:1})
                        // }
                    }else{
                        setTimeout(() => {
                            this.drawAllPoster();
                        }, 36);
                    }
                })
            }
        }
    },
    switchTab(e){
        const { cover,idx } = e.currentTarget.dataset
        this.setData({
            prviewPoster:cover
        })
        this.triggerEvent('drawCard',{cover:cover,idx:idx + 1})
    },
    //海报初始化
    initPoster(posterInfo,callback) {
        const query = wx.createSelectorQuery().in(this)
        query.select('#poster').fields({
            node: true,
            size: true
        }).exec((res) => {
            this.canvas = res[0].node
            this.ctx = this.canvas.getContext('2d')
            this.dpr = wx.getSystemInfoSync().pixelRatio
            console.log('this.dpr',this.dpr )
            //安卓手机dpr大于2时 强制置为2
            const Android = wx.getSystemInfoSync().system.indexOf('Android') > -1
            if (Android && this.dpr >= 2) {
                this.dpr = 2
            }
            this.canvas.width = res[0].width * this.dpr
            this.canvas.height = res[0].height * this.dpr
            // this.canvas.width = res[0].width
            // this.canvas.height = res[0].height
            this.ctx.scale(this.dpr, this.dpr)
            this.beginToDraw(posterInfo,callback)
        })

    },
    beginToDraw(posterInfo,callback) {
        wx.showLoading('图片生成中')
        // if(!this.ctx){
        //     this.ctx = wx.createCanvasContext('poster')
        // }
        // if (this.data.Android) {
        //     //安卓同比缩放
        //     this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        // }
        //画布内容区域清空
        this.ctx.clearRect(0, 0, 690, 360)
        this.ctx.fillStyle = '#FFFFFF'
        //画店铺信息
        this.productPoster(posterInfo,callback)

    },
    productPoster(posterInfo,callback) {
        console.log('this.properties',this.properties)
        const { product_poster_bg, QrCode, poster_hotle } = this.data
        const { name, phone, provinces, address, logo } = this.properties
        // const { posterInfo, posterBg } = this.properties
        let posterBg = posterInfo['posterBg']
        let slogo = posterInfo['logo']
        let sname = posterInfo['name']
        let saddress = posterInfo['address']
        this.roundReact(0, 0, 690, 360, 0, 0, 0, '#FFFFFF').then(()=>{
            this.drawPosterImg(this.ctx, posterBg, 0, 0, 690, 360).then(() => {
                this.drawAvatar(this.ctx, logo, slogo.bw, slogo.w, slogo.x, slogo.y).then(() => {
                    this.drawPosterText(this.ctx, sname.x, sname.y, sname.w, sname.h, sname.distance, sname.lineHeight, sname.maxWidth, sname.fontSize, [name], sname.color,1)
                    //输入的场馆地址信息
                    // ctx, x, y, w, h, distance, lineHeight, maxWidth, fontSize, textArr, color
                    this.drawPosterText(this.ctx, saddress.x, saddress.y, saddress.w, saddress.h, saddress.distance, saddress.lineHeight, saddress.maxWidth, saddress.fontSize, [phone,`${provinces}${address}`], saddress.color,2)
                    this.canvasToTempFilePath(callback);
                })
            })
        })
    },
    drawAvatar(ctx, src, bw, w, x, y) {
        //头像
        return this.getLocalPath(src).then(bg => {
            return new Promise((resolve, reject) => {
                if (bg) {
                    const avatarurl_wrap_width = bw;    //绘制的头像边框
                    const avatarurl_width = w;   //绘制的头像高度
                    const avatarurl_x = x;   //绘制的头像在画布上的位置
                    const avatarurl_y = y;   //绘制的头像在画布上的位置
                    ctx.moveTo(avatarurl_x, avatarurl_y);
                    ctx.beginPath(); //开始绘制
                    ctx.arc(avatarurl_x, avatarurl_y, avatarurl_wrap_width / 2, 0, 2 * Math.PI);
                    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
                    ctx.fill();
                    ctx.save();
                    ctx.beginPath(); //开始绘制
                    ctx.arc(avatarurl_x, avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2);
                    // ctx.setFillStyle('rgba(255, 255, 255, 0)');
                    // ctx.fill();
                    ctx.clip();// 剪切后所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
                    ctx.drawImage(bg, avatarurl_x - avatarurl_width / 2, avatarurl_y - avatarurl_width / 2, avatarurl_width, avatarurl_width);
                    ctx.restore(); //恢复之前保存的绘图上下文
                    resolve()

                } else {
                    wx.hideLoading()
                    alertError('获取头像底图失败！');
                    reject()
                }

            })
        })
    },
    //画二维码/logo
    drawPosterImg(ctx, imgUrl, x, y, w, h) {
        return this.getLocalPath(imgUrl).then((bg) => {
            return new Promise((resolve, reject) => {
                let time = 10
                if (w == 750) {
                    time = 50
                }
                if (bg) {
                    ctx.drawImage(bg, x, y, w, h)
                    resolve()
                } else {
                    wx.hideLoading()
                    alertError('获取底图失败！');
                    reject()
                }
            })
        })
    },

    //海报文案
    drawPosterText(ctx, x, y, w, h, distance, lineHeight, maxWidth, fontSize, textArr, color, type){
        let FONTSIZE = fontSize
        ctx.font = `${fontSize}px sans-serif`
        // let textWidth = ctx.measureText(text).width || 0
        // let drawWidth = textWidth + 40
        ctx.textBaseline = 'top'
        ctx.textAlign = 'left'
        ctx.fillStyle = color
        //画文案
        for(let i=0;i<textArr.length;i+=1){
            let textWidth = ctx.measureText(textArr[i]).width || 0
            wrapText(this.canvas,ctx,`${type == 1 && textArr[i].length > 4 ? textArr[i].slice(0,4) + '...' : textArr[i]}`, x, y + (FONTSIZE * i) + (distance * i), maxWidth, lineHeight, 1)
            // ctx.fillText(`${textArr[i]}`, x, y + (FONTSIZE * i) + (distance * i))
        }

        // ctx.stroke()
        
    },
    canvasToTempFilePath(callback) {
        const { posterImgList, index } = this.data
        let that = this;
        return new Promise((resolve, reject) => {
            wx.canvasToTempFilePath({
                destWidth: 690,
                destHeight: 360,
                fileType: 'jpg',
                // canvasId: 'poster',
                canvas: this.canvas,
                success({ tempFilePath }) {
                    console.log('tempFilePath',tempFilePath)
                    posterImgList.push(tempFilePath)
                    that.setData({
                        index:index + 1,
                        // imgSrc: tempFilePath || '',
                        posterImgList,
                    });
                    if (typeof callback == 'function') {
                        callback()
                    }
                    // wx.hideLoading();
                    resolve();
                },
                fail(res) {
                    alertError(res.errMsg || '');
                    reject();
                },
                complete() {
                }
            }, this);
        })
    },
    roundReact(left, top, width, height, radiusR, roundR, roundCircleCenterTop, background) {
        return new Promise(resolve => {
            this.ctx.beginPath();
            this.ctx.moveTo(left, top + radiusR);
            this.ctx.quadraticCurveTo(left, top, left + radiusR, top)
            this.ctx.lineTo(left + width - radiusR, top);
            this.ctx.quadraticCurveTo(left + width, top, left + width, top + radiusR);
            this.ctx.lineTo(width + left, roundCircleCenterTop - roundR);
            // this.ctx.moveTo(width + left, roundCircleCenterTop);
            this.ctx.arc(width + left, roundCircleCenterTop, roundR, 1.5 * Math.PI, 0.5 * Math.PI, true);
            this.ctx.lineTo(width + left, top + height - radiusR);
            this.ctx.quadraticCurveTo(left + width, top + height, left + width - radiusR, top + height);
            this.ctx.lineTo(left + radiusR, height + top);
            this.ctx.quadraticCurveTo(left, top + height, left, top + height - radiusR);
            this.ctx.lineTo(left, roundCircleCenterTop + roundR);
            // this.ctx.moveTo(left, roundCircleCenterTop);
            this.ctx.arc(left, roundCircleCenterTop, roundR, 0.5 * Math.PI, 1.5 * Math.PI, true);
            this.ctx.lineTo(left, top + radiusR);
            // this.ctx.setFillStyle('rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0)'
            this.ctx.fill();
            this.ctx.save()
            this.ctx.clip();


            resolve();
        });
    },
    getLocalPath(url) {
        return new Promise((resolve) => {
            const downloadedImg = this.canvas.createImage()
            downloadedImg.crossOrigin = 'Anonymous';
            downloadedImg.onload = function () {
                resolve(downloadedImg);
            };
            downloadedImg.src = url;
        });
    },
    /*
        保存图片
    */
    //检查用户的保存相册权限
    checkSetting() {
        let that = this
        wx.getSetting({
            success({ authSetting }) {
                if (authSetting[photosAlbum]) {//用户成功授权 可以访问相册
                    that.setData({
                        album: 'allow'
                    })
                } else if (authSetting[photosAlbum] === false) {//用户成功授权 拒绝访问相册
                    that.setData({
                        album: 'refuse'
                    })
                } else {//用户未授权
                    that.setData({
                        album: 'close'
                    })
                }
            }
        })
    },
    //保存时进行验证
    checkSaveStatus() {
        let that = this
        //成功授权 允许保存
        if (that.data.album == 'allow') {
            that.savePhoto()
            return;
        }
        //成功授权引到用户开启相册权限
        if (that.data.album == 'refuse' && !that.data.canUseOpenSettingBtn) {
            wx.openSetting({
                success({ authSetting }) {
                    if (authSetting[photosAlbum]) {
                        that.setData({
                            album: 'allow'
                        })
                        that.savePhoto()
                    }
                }
            })
            return;
        }
        //引导授权
        if (that.data.album == 'close') {
            wx.authorize({
                scope: photosAlbum,
                success() {
                    that.setData({
                        album: 'allow'
                    })
                    that.savePhoto()
                },
                fail() {
                    that.setData({
                        album: 'refuse'
                    })
                }
            })
        }
    },
    //用户版本大于2.07且已授权直接引导用户开启相册权限
    openAlbum(e) {
        let that = this
        let obj = e.detail
        if (obj.authSetting[photosAlbum]) {
            that.setData({
                album: 'allow'
            })
            that.savePhoto()
        }
    },
    savePhoto() {
        let that = this
        wx.saveImageToPhotosAlbum({
            filePath: that.data.imgSrc,
            success() {
                wx.showToast('保存成功')
                that.setData({
                    showTips: true
                })
                setTimeout(() => {
                    that.setData({
                        showTips: false
                    });
                }, 1500);
                that.triggerEvent('updateData')//更新
                
            },
            fail() {
                alertError('保存失败!');
            }
        })
    },
    }
})