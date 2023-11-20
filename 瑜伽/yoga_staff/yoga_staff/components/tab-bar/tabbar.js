Component({
    data: {
      selected: 0,
      color: "#7A7E83",
      selectedColor: "#8F33FF",
      list: [
        {
          "pagePath": "/pages/index/index",
          "text": "首页",
          "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/index-icon.png",
          "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/index-icon-select.png"
        },
        {
          "pagePath": "/pages/appointment/appointment",
          "text": "约课",
          "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/class-icon.png",
          "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/class-icon-selct.png"
        },
        {
          "pagePath": "/pages/vip/vip",
          "text": "会员",
          "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/vip-icon.png",
          "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/vip-icon-select.png"
        },
        {
            "pagePath": "/pages/information/index",
            "text": "精选",
            "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211118/2ab568b9a8b5bafc9045d120656f3474.png",
            "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211217/c5ef86d0cb82006f60fb329f48a5b87e.png"
        },
        {
          "pagePath": "/pages/my/my",
          "text": "管理",
          "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/my-icon.png",
          "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/merchant_applet/20211018/my-icon-select.png"
        }
      ],
      today: ''
    },
    properties: {
        selected: {
            type: Number,
            value: 0
        },
    },
    attached() {
        this.setData({
            selected:this.properties.selected
        })
    },
    methods: {
      switchTab(e) {
        const data = e.currentTarget.dataset
        const url = data.path
        this.getNowFormatDate()
        wx.switchTab({url})
      },
      toShare(){
        wx.switchTab({
          url:'/pages/share/share'
        })
      },
      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        let weeks = ['日', '一', '二', '三', '四', '五', '六'];
        let day = new Date().getDay();
        wx.setStorageSync('checkedDate', currentdate)
        wx.setStorageSync('checkedWeek', weeks[day])
        wx.setStorageSync('swiper_current_index', 4)
      }
    }
  })