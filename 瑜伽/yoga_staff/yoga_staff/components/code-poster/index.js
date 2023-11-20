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
        sHeight:280,
        imgSrc:'',
        canUseOpenSettingBtn: compareVersion(SDKVersion, '2.0.7') > -1,
        album:'',
        product_poster_bg:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211109/d024382b7273c64ffbcffd2870fcd7d5.png',
        QrCode:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210916/d9a4a5f23c0ae9b59a491ba2a3b4f1bc.png',
        logo:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210615/8e7e5291c1f86155a3c05124d4897b84.png',
    },
    properties: {
        name:{
            type:String,
            val:''
        },
        info:{
            type:String,
            val:''
        },
        logo:{
            type:String,
            val:''
        }
    },
    observers: {
        'name, info, logo': function(val) {
                this.initPoster()
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

        const posterHeight = '140px';
        const posterWidth = '345px';

        this.setData({
            posterHeight,
            posterWidth,
            Android,
            sWidth: 690,
            sHeight: 280,
        })

        this.checkSetting()
        this.initPoster()
        
    },
    methods:{
    //海报初始化
    initPoster() {
        const query = wx.createSelectorQuery().in(this)
        query.select('#poster').fields({
            node: true,
            size: true
        }).exec((res) => {
            this.canvas = res[0].node
            this.ctx = this.canvas.getContext('2d')
            this.dpr = wx.getSystemInfoSync().pixelRatio
            //安卓手机dpr大于2时 强制置为2
            const Android = wx.getSystemInfoSync().system.indexOf('Android') > -1
            if (Android && this.dpr >= 2) {
                this.dpr = 2
            }
            this.canvas.width = res[0].width * this.dpr
            this.canvas.height = res[0].height * this.dpr
            this.ctx.scale(this.dpr, this.dpr)
            this.beginToDraw()
        })

    },
    beginToDraw() {
        wx.showLoading('图片生成中')
        // if(!this.ctx){
        //     this.ctx = wx.createCanvasContext('poster')
        // }
        // if (this.data.Android) {
        //     //安卓同比缩放
        //     this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        // }
        //画布内容区域清空
        this.ctx.clearRect(0, 0, 690, 280)
        //画店铺信息
        this.productPoster()

    },
    productPoster() {
        console.log('this.properties',this.properties)
        const { product_poster_bg, QrCode, poster_hotle } = this.data
        const { name, info, logo } = this.properties
        this.roundReact(0, 0, 690, 280, 0, 0, 0, '#FFFFFF').then(()=>{
            this.drawPosterImg(this.ctx, product_poster_bg, 0, 0, 690, 280).then(() => {
                this.drawPosterImg(this.ctx, logo, 492, 60, 150, 150).then(() => {
                    this.drawPosterText(this.ctx, 66, 100, 0, 0, 30, 42, 320, 32, [name], '#242C32')
                    this.drawPosterText(this.ctx, 66, 160, 0, 0, 30, 42, 360, 24, [info], '#575F66')
                    this.canvasToTempFilePath();
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
    drawPosterText(ctx, x, y, w, h, distance, lineHeight, maxWidth, fontSize, textArr, color){
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
            wrapText(this.canvas,ctx,`${textArr[i]}`, x, y + (FONTSIZE * i) + (distance * i), maxWidth, lineHeight)
            // ctx.fillText(`${textArr[i]}`, x, y + (FONTSIZE * i) + (distance * i))
        }

        // ctx.stroke()
        
    },
    canvasToTempFilePath() {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.canvasToTempFilePath({
                destWidth: 690,
                destHeight: 280,
                fileType: 'jpg',
                // canvasId: 'poster',
                canvas: this.canvas,
                success({ tempFilePath }) {
                    that.setData({
                        imgSrc: tempFilePath || '',
                    });
                    that.triggerEvent('drawCard',{cover:tempFilePath,idx:1})
                    wx.hideLoading();
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
            this.ctx.fillStyle = background
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