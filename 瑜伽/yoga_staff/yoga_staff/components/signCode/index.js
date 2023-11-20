import { compareVersion } from '../../utils/common.js'
import { alertError } from '../../utils/util.js'
import { wrapText } from '../../utils/canvasUpdate.js'
const app = getApp()
const { SDKVersion } = wx.getSystemInfoSync();
const photosAlbum = 'scope.writePhotosAlbum'

Component({
    data:{
        isIphoneX:false,
        posterWidth:"",
        posterHeight:'',
        sWidth:650,
        sHeight:914,
        imgSrc:'',
        canUseOpenSettingBtn: compareVersion(SDKVersion, '2.0.7') > -1,
        album:'',
        product_poster_bg:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220311/2340f6b026de2bd299fa63cbaddf8c67.png',
        logo:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210615/8e7e5291c1f86155a3c05124d4897b84.png'
    },
    properties: {
        qrcode:{
            type:String,
            value:''
        },
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
        const { sWidth, sHeight } = this.data
        const reverse_height = sHeight * 0.5;
        const posterHeight = `${reverse_height}px`;
        const posterWidth = `${reverse_height * sWidth / this.data.sHeight}px`;

        this.setData({
            posterHeight,
            posterWidth,
            Android,
            sWidth: sWidth,
            sHeight: sHeight,
        })

        this.checkSetting()
        this.initPoster()
        console.log('???????????')
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
        this.ctx.clearRect(0, 0, 650, 914)
        //画店铺信息
        this.productPoster()

    },
    productPoster() {
        let sotre_name = wx.getStorageSync('store_info')
        const { product_poster_bg, posterInfo, qrcode, poster_hotle, logo } = this.data
        this.roundReact(0, 0, 650, 914, 0, 0, 0, '#FFFFFF').then(()=>{
            this.drawPosterImg(this.ctx, product_poster_bg, 0, 0, 650, 914).then(() => {
                this.drawPosterImg(this.ctx, qrcode, 96, 53, 460, 523).then(()=>{
                    this.drawPosterText(this.ctx, 325, 584, 0, 0, 0, 40, 330, 28, sotre_name.sto_name, '#9B77F4')
                    //输入的场馆地址信息
                    this.canvasToTempFilePath();
                })
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
    drawPosterText(ctx, x, y, w, h, distance, lineHeight, maxWidth, fontSize, text, color){
        let FONTSIZE = fontSize
        ctx.font = `${fontSize}px sans-serif`
        // let textWidth = ctx.measureText(text).width || 0
        // let drawWidth = textWidth + 40
        ctx.textBaseline = 'top'
        ctx.textAlign = 'center'
        ctx.fillStyle = color
        //画文案
        ctx.fillText(text, x, y)
        // ctx.stroke()
        
    },
    canvasToTempFilePath() {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.canvasToTempFilePath({
                destWidth: 690,
                destHeight: 914,
                fileType: 'jpg',
                // canvasId: 'poster',
                canvas: this.canvas,
                success({ tempFilePath }) {

                    that.setData({
                        imgSrc: tempFilePath || ''
                    });
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
                wx.showToast({
                    title:'保存成功',
                    icon:'none'
                })
                that.setData({
                    showTips: true
                })
                setTimeout(() => {
                    that.setData({
                        showTips: false
                    });
                }, 1500);
            },
            fail() {
                alertError('保存失败!');
            }
        })
    },
    }
})