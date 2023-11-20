Component({
    data: {
      selected: 0,
      color: "rgb(102, 102, 102)",
      selectedColor: "#FC5639",
      list: [
        {
          "pagePath": "/pages/index/index",
          "text": "首页",
          "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/3934e0e3e279c8d62d956774edd691da.png",
          "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/deeb5ada718bbf3b18d9b14ff2246eb0.png"
        },
        {
          "pagePath": "/pages/my/index",
          "text": "个人中心",
          "iconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/d7c19a5d98e25b62780782f8ed9d3956.png",
          "selectedIconPath": "https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220602/60c062fa143a5461d1c21122f5398cc3.png"
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