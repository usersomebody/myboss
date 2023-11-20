Component({
    data: {
      selected: 0,
      color: "#7A7E83",
      selectedColor: "#8F33FF",
      list: [
        {
          "pagePath": "../index/index",
          "text": "首页",
          "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_index.png",
          "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_index_select.png"
        },
        {
          "pagePath": "../classAppointment/classAppointment",
          "text": "约课",
          "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_booking.png",
          "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_booking_select.png"
        },
        // {
        //     "pagePath": "../videoList/videoList",
        //     "text": "",
        //     "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_live.png",
        //     "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_live_select.png"
        // },
        {
          "pagePath": "../courses/courses",
          "text": "已约",
          "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_booked.png",
          "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_booked_select.png"
        },
        {
          "pagePath": "../my/my",
          "text": "我的",
          "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_my.png",
          "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/system/applet/20210902/icon_my_select.png"
        }
      ]
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
        console.log('url',url)
        this.getNowFormatDate()
        wx.switchTab({url})
      },
      toLive(){
        wx.switchTab({
          url:'/pages/videoList/videoList'
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
        // wx.setStorageSync('swiper_current_index', 4)
      }
    }
  })