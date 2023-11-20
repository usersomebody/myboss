import moment from '../../utils/moment.js'


Component({
    data: {
        countDownDay: '00',
        countDownHour: '00',
        countDownMinute: '00',
        countDownSecond: '00',
        isActivityTime: false,
        timerSecond:0
    },
    properties: {
        startTime: {
            type: String,
            value: ''
        },
        endTime: {
            type: String,
            value: ''
        },
        currentTime: {
            type: String,
            value: ''
        },
        title:{
            type:String,
            value:''
        },
        activityTime: {
            type:Boolean,
            value:false
        },
        type:{
            type:String,
            value:''
        },
        styleType:{
            type:String,
            value:'1'
        }
    },
    attached() {
        this.judgeTimeValid()
    },
    observers: {
        'currentTime': function(val) {
          this.judgeTimeValid()
        }
    },
    detached(){
        clearInterval(this.interval)
    },
    methods: {
        //是否在活动期间
        judgeTimeValid() {
            const currentTime = this.properties.currentTime
            let timerSecond = 0;
            let isActivityTime = this.properties.activityTime
            const { endTime } = this.properties
            if(!isActivityTime){
                return;
            }
            if(isActivityTime){
                timerSecond = parseInt(new Date(this.properties.endTime).getTime() / 1000) - parseInt(new Date().getTime() / 1000)
            }

            this.setData({
                isActivityTime: isActivityTime,
                timerSecond,
            })
            this.activityTimer(timerSecond)
            
        },
        //倒计时
        activityTimer(timerSecond) {
            let totalSecond = timerSecond;//倒计时时间

            this.interval = setInterval(function () {
                // 秒数
                let second = totalSecond;

                // 天数位
                let day = Math.floor(second / 3600 / 24);
                let dayStr = day.toString();
                if (dayStr.length == 1) dayStr = '0' + dayStr;

                // 小时位
                let hr = Math.floor((second - day * 3600 * 24) / 3600);
                let hrStr = hr.toString();
                if (hrStr.length == 1) hrStr = '0' + hrStr;

                // 分钟位
                let min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
                let minStr = min.toString();
                if (minStr.length == 1) minStr = '0' + minStr;

                // 秒位
                let sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
                let secStr = sec.toString();
                if (secStr.length == 1) secStr = '0' + secStr;

                this.setData({
                    countDownDay: dayStr,
                    countDownHour: hrStr,
                    countDownMinute: minStr,
                    countDownSecond: secStr,
                });

                totalSecond--;
                if (totalSecond < 0) {
                    clearInterval(this.interval);
                    // wx.showToast({
                    //     title: '活动已结束',
                    // });
                    this.setData({
                        countDownDay: '00',
                        countDownHour: '00',
                        countDownMinute: '00',
                        countDownSecond: '00',
                    });
                    this.triggerEvent('updateData')//倒计时结束 主动触发拉取详情接口 

                }
            }.bind(this), 1000);
        }
    }
    /*
        活动时间逻辑
        倒计时显示
        1.startTime > currentTime > preheatTime 预热阶段倒计时
        2.endTime > currentTime > startTime 活动阶段倒计时
        3.currentTime > endTime || currentTime < preheatTime  不显示
    */
})
