import { compareVersion } from '../../utils/common.js'
const app = getApp()
const { SDKVersion } = wx.getSystemInfoSync();
const photosAlbum = 'scope.writePhotosAlbum'

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
        product_poster_bg:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210915/9ce5e0974be69edef65f32c4cde3e5e7.jpg',
        QrCode:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210916/d9a4a5f23c0ae9b59a491ba2a3b4f1bc.png',
        logo:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210615/8e7e5291c1f86155a3c05124d4897b84.png'
    },
    properties: {},
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
            sWidth: Android ? 375 : 750,
            sHeight: Android ? 667 : 1334,
        })

        this.checkSetting()
        this.initPoster()
        
    },
    methods:{
    //海报初始化
    initPoster() {
        const query = wx.createSelectorQuery().in(this)
        console.log('wx.createSelectorQuery()',wx.createSelectorQuery().select('#poster'))
        query.select('#poster').fields({
            node: true,
            size: true
        }).exec((res) => {
            console.log('res',res)
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
            console.log('canvas', this.canvas)
            this.beginToDraw()
        })
    },
    beginToDraw() {
        wx.showLoading('图片生成中')
        // if(!this.ctx){
        //     this.ctx = wx.createCanvasContext('poster')
        // }
        if (this.data.Android) {
            //安卓同比缩放
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        //画布内容区域清空
        this.ctx.clearRect(0, 0, 750, 1334)
        // this.ctx.draw()
        //画布底框的边框
        // const { posterInfo } = this.data
        // if (this.data.poster_all) {
        //     //画全部
        //     if (posterInfo.length) {
        //         this.fastSharePoster()
        //     } else {
        //         this.productPoster()
        //     }
        //     return
        // }
        // //主题或者单品
        // //画主题
        // if (posterInfo.pic_type) {
        //     if (posterInfo.pic_type == 1) {
        //         this.productPoster()
        //     } else {
        //         this.drawThemeTypeOne()
        //     }
        //     return
        // }
        //画单品
        this.productPoster()

    },
    productPoster() {
        const { product_poster_bg, posterInfo, QrCode, poster_hotle, logo } = this.data
        this.drawPosterImg(this.ctx, product_poster_bg, 0, 0, 750, 1334).then(() => {
            this.roundReact(0, 1048, 750, 292, 0, 0, 0,'rgba(0,0,0,.5)').then(() => {
                this.drawPosterImg(this.ctx, QrCode, 524, 1102, 188, 188).then(()=>{
                    this.drawPosterText(this.ctx, 34, 1102, 0, 0, 34, ['场馆名称：', '联系人：', '场馆地址：'], '#FFFFFF')
                    this.canvasToTempFilePath();
                })
                //     this.drawProductImg(this.ctx, posterInfo.product_cover, 70, 522, 610, 340).then(() => {
                //         let radiusWidth = 90
                //         if (posterInfo.mode_type == 3) {
                //             radiusWidth = 156
                //         }
                //         this.drawSaveBtn(this.ctx, 90, 542, radiusWidth, 38, 19, 110, 548, posterInfo.city_str, 0)
                //         this.ctx.restore()
                //         this.drawAvatar(this.ctx, QrCode, 148, 140, 616, 1196).then(() => {
                //             this.drawPosterTextInfoOne(poster_hotle)
                //         })
                //     })
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
    //画产品图片
    drawProductImg(ctx, imgUrl, x, y, w, h) {
        return this.getLocalPath(`${imgUrl}!500X500`).then(bg => {
            return new Promise((resolve, reject) => {
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
    drawPosterTextInfoOne(poster_hotle) {
        const { posterInfo } = this.data
        const { avatarUrl } = this.data.userInfo
        this.drawPosterImg(this.ctx, poster_hotle, 70, 1016, 28, 28).then(() => {
            let text = posterInfo.mode_type == 1 ? '精品酒店，有品质' : '多选一酒店，随心选订'
            let width = posterInfo.mode_type == 1 ? 240 : 292
            this.drawSaveBtn(this.ctx, 70, 1110, width, 38, 19, 90, 1116, text, 1)
            this.drawAvatar(this.ctx, avatarUrl, 72, 68, 104, 94).then(() => {
                // this.drawHotelName(this.ctx)
                // this.drawName(this.ctx)
                this.canvasToTempFilePath();
            })
        })
    },
    roundPath(x, y, w, h, r, backColor) {
        return new Promise(resolve => {
            this.ctx.beginPath();
            this.ctx.moveTo(x + r, y);
            this.ctx.arcTo(x + w, y, x + w, y + h, r);
            this.ctx.arcTo(x + w, y + h, x, y + h, r);
            this.ctx.arcTo(x, y + h, x, y, r);
            this.ctx.arcTo(x, y, x + w, y, r);
            this.ctx.closePath();
            this.ctx.setFillStyle(backColor || '#FFFFFF');
            this.ctx.fillRect(x, y, w, h);
            this.ctx.save();
            this.ctx.clip();

            this.ctx.restore();
            resolve();
        })
    },
    //头像
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
    drawSaveBtn(ctx, x, y, w, h, r, tx, ty, text, sign) {
        ctx.font = '24px sans-serif'
        let textWidth = ctx.measureText(text).width || 0
        let drawWidth = textWidth + 40
        ctx.beginPath()
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + drawWidth - r, y);
        ctx.arc(x + drawWidth - r, y + r, r, 1.5 * Math.PI, 0.5 * Math.PI, false);
        ctx.lineTo(x + r, y + h);
        ctx.arc(x + r, y + r, r, 0.5 * Math.PI, 1.5 * Math.PI, false);
        if (sign == 1) {
            const grd = ctx.createLinearGradient(70, 1085, 310, 1085)
            grd.addColorStop(0, '#DFB479')
            grd.addColorStop(1, '#F0D5AC')
            ctx.fillStyle = grd
        } else {
            if (!text) {
                ctx.fillStyle = 'rgba(224,179,121,0)'
            } else {
                ctx.fillStyle = 'rgba(224,179,121,.8)'
            }
        }
        ctx.fill()
        ctx.textBaseline = 'top'
        ctx.textAlign = 'left'
        ctx.font = '24px normal'
        ctx.fillStyle = '#603105'
        ctx.fillText(text, tx, ty);
    },
    //海报文案
    drawPosterText(ctx, x, y, w, h, distance,textArr, color){
        let FONTSIZE = 40
        ctx.font = '40px sans-serif'
        // let textWidth = ctx.measureText(text).width || 0
        // let drawWidth = textWidth + 40
        ctx.textBaseline = 'top'
        ctx.textAlign = 'left'
        ctx.fillStyle = color
        //画文案
        for(let i=0;i<textArr.length;i+=1){
            ctx.fillText(`${textArr[i]}`, x, y + (FONTSIZE * i) + (distance * i))
        }

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

                    console.log('tempFilePath', tempFilePath)
                    that.setData({
                        imgSrc: tempFilePath || ''
                    });
                    wx.hideLoading();

                    resolve();
                },
                fail(res) {
                    console.log('res', res)
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