import moment from '../../utils/moment.js'
import { api, baseUrl } from '../../utils/api.js'
import { request } from '../../utils/util.js'
const app = getApp()
const { uploadImg, getContras, getContrastDetail } = api
Page({
    data:{
        selectStart:'',
        selectStartIndex:0,
        selectStartId:'',
        selectEnd:'',
        selectEndIndex:1,
        selectEndId:'',
        vipType:'',
        contrast_type:'',
        phone:'',
        timeList:[],


        // 拖拽
        images:[],
        imageWitdh:0,
        x:0,  // movable-view的坐标
        y:0,
        areaHeight:0,  // movable-area的高度
        hidden: true, // movable-view是否隐藏
        currentImg:'', // movable-view的图片地址
        currentIndex:0, // 要改变顺序的图片的下标
        pointsArr:[], // 每张图片的坐标
        flag:true, // 是否是长按
        scrollTop:0, // 滚动条距离顶部的距离


        // 代码冗余操作 暂时没想出来怎么写成可配置化组件  


      imagesEnd:[],
      ex:0,  // movable-view的坐标
      ey:0,
      eareaHeight:0,  // movable-area的高度
      ehidden: true, // movable-view是否隐藏
      ecurrentImg:'', // movable-view的图片地址
      ecurrentIndex:0, // 要改变顺序的图片的下标
      epointsArr:[], // 每张图片的坐标
      eflag:true, // 是否是长按
      name:'',
    },
    onLoad(options){
        this.setData({
            phone:options.phone,
            name:options.name,
            vipType:options.type,
            contrast_type:options.ctype || 1
        })
        wx.setNavigationBarTitle({
          title: options.ctype == 2 ? '体测数据对比' : '体测图片对比',
          success: function(res) {
            // success
          }
        })
        this.getTimeContras()
        
    },
    onShow(){

    },
    onReady() {
        // 计算图片
        this._handleComputedImage();
        //计算面积
        // this._handleComputedArea()
        // this._handleComputedAreaEnd()
    },
    
    // 监听滚动
    onPageScroll(e){
        this.data.scrollTop = e.scrollTop;
    },
    getTimeContras(){
        const { vipType, contrast_type, phone } = this.data
        request({
            url:app.globalData.baseUrl + api.testRecord,
            data:{
                type:vipType,
                phone,
                user_id:wx.getStorageSync('user_id'),
                contrast_type,
                method:'fitness.getcontrast'
            },
            method:'POST',
            isTologin:true,
            success:(res)=>{
                console.log('res',res)
                this.setData({
                    timeList:res
                })
            }
        })
    },
    bindPickerChange(e){
        const { timeList, selectEnd, selectStart } = this.data
        const { key } = e.currentTarget.dataset
        const { value } = e.detail
        if(key == 'selectStart'){
          if(selectEnd && selectEnd == timeList[value].fitness_test_time){
            wx.showModal({
              title:'对比时间不可以相同',
              showCancel:false
            })
            return
          }
            this.setData({
                selectStartIndex:value,
                selectStart:timeList[value].fitness_test_time,
                selectStartId:timeList[value].id,
            })
        }else{
          if(selectStart && selectStart == timeList[value].fitness_test_time){
            wx.showModal({
              title:'对比时间不可以相同',
              showCancel:false
            })
            return
          }
            this.setData({
                selectEndIndex:value,
                selectEnd:timeList[value].fitness_test_time,
                selectEndId:timeList[value].id,
            })
        }    
        if(this.data.selectStart && this.data.selectEnd){
          this.getContrastDetail()
        }
    },

    //查看对比图
    checkCompare(){
      const { vipType, contrast_type, phone, name } = this.data
      if(!app.globalData.compareData || app.globalData.compareData.length < 2){
        wx.showModal({
          title:'暂无体测数据'
        })
        return
      }
      wx.navigateTo({
        url: `/pages/bodyData/compareDetail?phone=${phone}&ctype=${contrast_type}&name=${name}`
      })
    },

  // 选择图片
  handleChooseImage(e) {
    let length = this.data.images.length;
    if (length == 9) {
      wx.showToast({
        title: "亲，最多只能选择九张图哦~",
        icon: "none",
        duration: 2000
      })
      return false;
    }
    let that = this;
    wx.chooseImage({
      count: 9 - this.data.images.length,
      sizeType: ['compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        let images = that.data.images;
        for (let i = 0; i < res.tempFilePaths.length;i++){
          images.push(res.tempFilePaths[i]);
        }
        that.setData({
          images
        },function(){
          //上传完之后更新面积
          that._handleComputedArea();
        });
        
      },
      fail: err => console.log(err)
    })
  },

  // 预览图片
  handlePreview(e){
    console.log('e_____',e)
    let index = e.target.dataset.index;
    let type = e.target.dataset.type
    let images = type == 1 ? this.data.images : this.data.imagesEnd;
    wx.previewImage({
      current: images[index], //当前预览的图片
      urls: images, //所有要预览的图片数组
    })
  },

  // 删除图片
  handleDelete(e){
    let index = e.target.dataset.index;
    let images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images
    },function(){
      this._handleComputedArea();
    });
  },
    //拖拽
    // 计算图片宽度
    _handleComputedImage(e){
      const windowWidth = app.globalData.windowWidth;
      console.log('windowWidth',windowWidth)
      // const width = windowWidth - 16;
      // const imageWitdh = (width - 16) / 3;
      const width = windowWidth - 60;
      const imageWitdh = width / 3;
      
      this.setData({
        imageWitdh
      })
    },
  // 计算movable-area的高度
  _handleComputedArea(e){
    let that = this;
    wx.createSelectorQuery().selectAll('.image-choose-container').boundingClientRect(function (rect) {
      that.setData({
        areaHeight: rect[0].height
      })
    }).exec()
  },

  // 计算每张图片的坐标
  _handleComputedPoints(e){
    let that = this;
    let query = wx.createSelectorQuery();
    let nodesRef = query.selectAll(".image-item");
    nodesRef.fields({
      dataset: true,
      rect: true
    }, (result) => {
      that.setData({
        pointsArr: result
      })
    }).exec()
  },

  // 长按图片
  handleLongTap(e){
    // 计算每张图片的坐标
    this._handleComputedPoints();
    this.setData({
      currentImg: e.currentTarget.dataset.url,
      currentIndex: e.currentTarget.dataset.index,
      hidden: false,
      flag: true,
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop
    })
  },

  // 移动的过程中
  handleTouchMove(e){
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
   // 首先先获得当前image-choose-container距离顶部的距离
    let that = this;
    wx.createSelectorQuery().selectAll('.image-choose-container').boundingClientRect(function (rect) {
      let top = rect[0].top;
      y = y - that.data.scrollTop - top;
      that.setData({
        // x: x - that.data.imageWitdh / 2 > 0 ? x - that.data.imageWitdh / 2:0,
        // y: y - that.data.imageWitdh / 2 > 0 ? y - that.data.imageWitdh / 2:0,
        x: x,
        y: y,
      })
    }).exec()
  },

  // 移动结束的时候
  handleTouchEnd(e){
    if (!this.data.flag) {
      // 非长按情况下
      return;
    }
    let  x = e.changedTouches[0].pageX;
    let y = e.changedTouches[0].pageY - this.data.scrollTop;
    const pointsArr = this.data.pointsArr;
    let data = this.data.images;
    for (var j = 0; j < pointsArr.length; j++) {
      const item = pointsArr[j];
      if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
        const endIndex = item.dataset.index;
        const beginIndex = this.data.currentIndex;
        //临时保存移动的目标数据
        let temp = data[beginIndex];
        //将移动目标的下标值替换为被移动目标的下标值
        data[beginIndex] = data[endIndex];
        //将被移动目标的下标值替换为beginIndex
        data[endIndex] = temp;
      }
    }
    this.setData({
      images: data,
      hidden: true,
      flag: false,
      currentImg: ''
    })
  },

  // 代码冗余操作 
  // 计算movable-area的高度
  _handleComputedAreaEnd(e){
    let that = this;
    wx.createSelectorQuery().selectAll('.image-choose-container-end').boundingClientRect(function (rect) {
      that.setData({
        eareaHeight: rect[0].height
      })
    }).exec()
  },

  // 计算每张图片的坐标
  _handleComputedPointsEnd(e){
    let that = this;
    let query = wx.createSelectorQuery();
    let nodesRef = query.selectAll(".image-item-end");
    nodesRef.fields({
      dataset: true,
      rect: true
    }, (result) => {
      that.setData({
        epointsArr: result
      })
    }).exec()
  },

  // 长按图片
  handleLongTapEnd(e){
    // 计算每张图片的坐标
    this._handleComputedPointsEnd();
    this.setData({
      ecurrentImg: e.currentTarget.dataset.url,
      ecurrentIndex: e.currentTarget.dataset.index,
      ehidden: false,
      eflag: true,
      ex: e.currentTarget.offsetLeft,
      ey: e.currentTarget.offsetTop
    })
  },

  // 移动的过程中
  handleTouchMoveEnd(e){
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
   // 首先先获得当前image-choose-container距离顶部的距离
    let that = this;
    wx.createSelectorQuery().selectAll('.image-choose-container-end').boundingClientRect(function (rect) {
      let top = rect[0].top;
      y = y - that.data.scrollTop - top;
      that.setData({
        // x: x - that.data.imageWitdh / 2 > 0 ? x - that.data.imageWitdh / 2:0,
        // y: y - that.data.imageWitdh / 2 > 0 ? y - that.data.imageWitdh / 2:0,
        ex: x,
        ey: y,
      })
    }).exec()
  },

  // 移动结束的时候
  handleTouchEndEnd(e){
    if (!this.data.eflag) {
      // 非长按情况下
      return;
    }
    let  x = e.changedTouches[0].pageX;
    let y = e.changedTouches[0].pageY - this.data.scrollTop;
    const pointsArr = this.data.epointsArr;
    let data = this.data.imagesEnd;
    for (var j = 0; j < pointsArr.length; j++) {
      const item = pointsArr[j];
      if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
        const endIndex = item.dataset.index;
        const beginIndex = this.data.ecurrentIndex;
        //临时保存移动的目标数据
        let temp = data[beginIndex];
        //将移动目标的下标值替换为被移动目标的下标值
        data[beginIndex] = data[endIndex];
        //将被移动目标的下标值替换为beginIndex
        data[endIndex] = temp;
      }
    }
    this.setData({
      imagesEnd: data,
      ehidden: true,
      eflag: false,
      ecurrentImg: ''
    })
  },
  //获取体重对比记录
  getContrastDetail(){
    const { selectStart, selectEnd, contrast_type, selectEndId, selectStartId } = this.data
      request({
        url:app.globalData.baseUrl + api.testRecord,
        data:{
          record_id:[selectStartId,selectEndId],
          user_id:wx.getStorageSync('user_id'),
          method:'fitness.getcontrastdetail'
        },
        method:'POST',
        isTologin:true,
        success:(res)=>{
          if(contrast_type == 1){
            let startImages = res.filter((item)=>{
              return item.fitness_test_time == selectStart
            })
            let endImages = res.filter((item)=>{
              return item.fitness_test_time == selectEnd
            })
            this.setData({
              images:startImages[0].imgs,
              imagesEnd:endImages[0].imgs
            })
          }
            app.globalData.compareData = res
            this._handleComputedArea()
            this._handleComputedAreaEnd()
            
        }
    })
  }
})