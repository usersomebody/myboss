import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
import { compareVersion } from '../../utils/common.js'
import { alertError } from '../../utils/util.js'
import { wrapText } from '../../utils/canvasUpdate.js'
const app = getApp()
const { SDKVersion } = wx.getSystemInfoSync();
const photosAlbum = 'scope.writePhotosAlbum'
const { getQrCode, qrCode } = api
Component({
    data:{
        isIphoneX:false,
        posterWidth:"",
        posterHeight:'',
        sWidth:750,
        sHeight:1334,
        imgSrc:'',
        canUseOpenSettingBtn: compareVersion(SDKVersion, '2.0.7') > -1,
        album:'',
        showOverlayer:true,
        product_poster_bg:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220314/8b1a2476a5ad48a393300da0ee874786.png',
        QrCode:'',
        logo:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210615/8e7e5291c1f86155a3c05124d4897b84.png',
        showPoster:false
    },
    properties: {
        articleCover:{
            type:String,
            value:''
        },
        title:{
            type:String,
            value:''
        },
        shareDesc:{
            type:String,
            value:''
        },
        posterContent:{
            type:String,
            value:''
        },
        infoId:{
            type:String,
            value:''
        },
        sid:{
            type:String,
            value:''
        },
        redirectUrl:{
            type:String,
            value:''
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
        const posterHeight = `${reverse_height}px`;
        const posterWidth = `${reverse_height * 750 / this.data.sHeight}px`;

        this.setData({
            posterHeight,
            posterWidth,
            Android,
            sWidth: 750,
            sHeight: 1334,
        })

        this.checkSetting()
        this.getQrCode().then((code)=>{
            this.initPoster()
        })
        
    },
    methods:{
        getQrCode(){
            const { infoId, sid, redirectUrl } = this.data
        return new Promise((resolve,reject)=>{
                request({
                    url:  baseUrl + qrCode,
                    data: {
                        id:infoId || '',
                        sid:sid || wx.getStorageSync('store_id') || '',
                        page:'pages/information/detail',
                        check_path:false,
                        env_version:'release',//要打开的小程序版本。正式版为 release，体验版为 trial，开发版为 develop  自主
                        width:300,
                        is_hyaline:true
                    },
                    // isTologin:true,
                    method:'POST',
                    // redirectUrl,
                    success:res=> {
                        this.setData({
                            QrCode:res
                        })
                        resolve(res)
                    },
                }).catch((err)=>{
                    console.log('err',err)
                    this.setData({
                        showOverlayer:!this.data.showOverlayer
                    })
                    if(err.code == 400){
                        return
                    }
                    wx.showModal({
                        title:'二维码获取失败'
                    })
                    reject('二维码获取失败')
                })
            }) 
        },
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
        wx.showLoading({title:'图片生成中'})
        // if(!this.ctx){
        //     this.ctx = wx.createCanvasContext('poster')
        // }
        // if (this.data.Android) {
        //     //安卓同比缩放
        //     this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        // }
        //画布内容区域清空
        this.ctx.clearRect(0, 0, 750, 1334)
        //画店铺信息
        this.productPoster()

    },
    productPoster() {
        const { product_poster_bg, posterInfo, QrCode, poster_hotle, logo, articleCover, posterContent, title  } = this.data
        this.roundReact(0, 0, 750, 1334, 20, 0, 0, '#FFFFFF').then(()=>{
            this.drawPosterImg(this.ctx, product_poster_bg, 0, 0, 750, 1334).then(() => {
                this.drawPosterImg(this.ctx, articleCover, 145, 365, 460, 344).then(() => {
                // this.roundReact(0, 1048, 750, 292, 0, 0, 0,'rgba(0,0,0,.5)').then(() => {
                    this.drawPosterImg(this.ctx, QrCode, 137, 865, 120, 120).then(()=>{
                        this.drawPosterText(this.ctx, 146, 272, 0, 0, 0, 42, 450, 32, title, '#19191A')
                        this.drawPosterText(this.ctx, 146, 727, 0, 0, 0, 42, 450, 28, posterContent, '#666666')
                        this.drawPosterText(this.ctx, 280, 890, 0, 0, 0, 42, 450, 32, '长按识别二维码', '#333333')
                        this.drawPosterText(this.ctx, 280, 940, 0, 0, 0, 42, 450, 24, '进入去约课呗小程序查看详情', '#666666')
                        //输入的场馆地址信息
                        // this.drawPosterText(this.ctx, 234, 1110, 0, 0, 34, 40, 280, 28, ['去约瑜伽', '魏蒙恩', '杭州市西湖区丰盛九玺12幢8楼'], '#FFFFFF')
                        this.canvasToTempFilePath();
                    })
                })
                // })
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
        ctx.textAlign = 'left'
        ctx.fillStyle = color
        //画文案
        let textWidth = ctx.measureText(text).width || 0
        wrapText(this.canvas,ctx,`${text}`, x, y, maxWidth, lineHeight, 1)
            // ctx.fillText(`${textArr[i]}`, x, y + (FONTSIZE * i) + (distance * i))

        // ctx.stroke()
        
    },
    canvasToTempFilePath() {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.canvasToTempFilePath({
                destWidth: 750,
                destHeight: 1334,
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
                wx.showToast({title:'保存成功',icon:'none'})
                that.setData({
                    showTips: true
                })
                setTimeout(() => {
                    that.setData({
                        showTips: false
                    });
                }, 1500);
                that.triggerEvent('drawPoster')//更新
                
            },
            fail() {
                alertError('保存失败!');
            }
        })
    },
    closeBox(){
        const { showOverlayer }  = this.data
        this.setData({
            showOverlayer:!showOverlayer
        })
        this.triggerEvent('drawPoster')
    }
    }
})