
import { api, baseUrl } from '../../utils/api.js'
import { telReg } from '../../utils/common.js'
import { request } from '../../utils/util.js'

const app = getApp()
const { getCheckCode, registered, loginChain, loginCode } = api
Page({
    data:{
        submitList:[{
            name:'phone',
            place:'请输入手机号',
            require:true,
            value:'',
            type:'number',
            show:true,
            max:11,
        },{
            name:'password',
            place:'请输入密码',
            require:true,
            value:'',
            type:'password',
            show:false,
            max:50,
        },{
            name:'code',
            place:'请输入验证码',
            require:true,
            value:'',
            type:'number',
            show:false,
            max:50,
        },{
            name:'store_name',
            place:'请输入场馆名称',
            require:true,
            value:'',
            type:'text',
            show:false,
            max:50,
        },{
            name:'principal',
            place:'请输入场馆负责人姓名',
            require:true,
            value:'',
            type:'text',
            show:false,
            max:50,
        }],
        submitText:'登录',
        loginType:1,
        seconds:60,
        codeDisable:false,
        showOverlayer:false,
        showSucces:false,
        redirectUrl:''
    },
    onLoad(options){
        const { loginType } = this.data
        let showList = this.showInput(loginType)
        this.setData({
            submitList:showList,
            redirectUrl:options.path
        })
        console.log('options',options)
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
        })
    },
    //查看密码
    checkPassword(){
        const { submitList } = this.data
        submitList[1].type = submitList[1].type == 'text' ? 'password' : 'text'
        this.setData({
            submitList
        })
    },
    changeType(e){
        const { type } = e.currentTarget.dataset
        let showList = this.showInput(type)
        this.setData({
            loginType:type,
            submitList:showList,
            submitText:type == 3 ? '注册' : '登录'
        })
    },
    // 显示的内容
    showInput(type){
        const { submitList } = this.data
        // 1: 密码 2：验证码 3:注册 
        submitList.forEach(t => {
            t.show = type == 1 && t.name == 'password' ? true : type == 2 && t.name == 'code' ? true : type == 3 && (t.name == 'code' || t.name == 'store_name' || t.name == 'principal' ) ? true : false
            if(t.name == 'phone'){
                t.show = true
            }
        });
        return submitList
    },
    //输入框的值
    inputVal(e){
        const { name } = e.currentTarget.dataset
        const { value } = e.detail
        this.throttle(this.setInputValue,null,100,value,name)//节流处理input时间 可以不用
        
    },
    setInputValue(context,text){
        const { submitList } = this.data
        let list = submitList.map((item)=>{
            let obj = item
            obj.value = text == item.name ? context : item.value
            return obj
        })
        this.setData({
            submitList:list
        })
    },
    throttle(fn, context, delay, text, name) {
        clearTimeout(fn.timeoutId);
        fn.timeoutId = setTimeout(()=>{
          fn.call(context, text, name);
        }, delay);
    },
    //验证码倒计时
    timer() {
        let that = this
        let seconds = setInterval(()=>{
          if (that.data.seconds> 1) {
            that.setData({
              seconds: that.data.seconds-1
            })
          } else {
            that.setData({
              seconds: 60,
              codeDisable: false
            })
            clearInterval(seconds)
          }
        }, 1000);
    },
    getCode(){
        wx.showLoading('获取中...')
        let verifyData = this.toObj()
        if(!telReg(verifyData['phone'])){
            wx.showToast({
                title: '手机号有误',
                icon: 'none',
                duration: 1000
            })
            return
        }
        // 验证码请求
        request({
            url:baseUrl + getCheckCode,
            data:{
                phone:verifyData['phone']
            },
            method:'POST',
            success: (res)=>{
                wx.showToast({title:'获取成功'})
                this.setData({
                    codeDisable:true
                })
                this.timer()
            }
        })
    },
    toObj(){
        const { submitList } = this.data
        let list = submitList.concat()
        let info = {}
        list.forEach((item)=>{
            info[item.name] = item.value
        })
        return info
    },
    // 数据提交
    // 登录或者注册
    apply(){
        // 根据当前切换的类型进行数据的验证
        // 1:密码 2:验证码 3:注册
        const { loginType, submitList } = this.data
        //提取数据
        let submitData = this.toObj()
        console.log('submitData',submitData)
        //手机号必校验
        if(!telReg(submitData.phone)){
            wx.showToast({
                title: '手机号有误',
                icon: 'none',
                duration: 1000
            })
            return
        }
        if(loginType == 1 && !submitData.password){
            wx.showToast({
                title: '密码不可以为空',
                icon: 'none',
                duration: 1000
            })
            return
        }
        if( (loginType == 2 || loginType == 3) && !submitData.code){
            wx.showToast({
                title: '验证码不可以为空',
                icon: 'none',
                duration: 1000
            })
            return
        }
        if(loginType == 3){
            if(!submitData.store_name){
                wx.showToast({
                    title: '场馆名称不可以为空',
                    icon: 'none',
                    duration: 1000
                })
                return
            }
            if(!submitData.principal){
                wx.showToast({
                    title: '负责人姓名不可以为空',
                    icon: 'none',
                    duration: 1000
                })
                return
            }
        }
        wx.showLoading('正在登录...')
        if(loginType == 3){
            this.register(submitData)
        }else if(loginType == 2){
            //验证码登录
            this.loginCode(submitData)
        }else{
            // 密码登录
            this.loginChain(submitData)
        }
    },
    close(){
        this.setData({
            showOverlayer:false,
            showSucces:false,
        })
    },
    // 注册请求
    register(submit){
         const { showList } = this.data
        request({
            url:baseUrl + registered,
            data:{
                phone:submit['phone'],
                sms_code:submit['code'],
                name:submit['store_name'],
                principal:submit['principal']
            },
            method:'POST',
            success: (res)=>{
                wx.hideLoading()
                this.setData({
                    showOverlayer:true,
                    showSucces:true,
                    loginType:1
                })
                let showList = this.showInput(1)
                this.setData({
                    submitList:showList,
                    submitText:'登录'
                })
            }
        })
    },
    // 验证码登录请求
    loginCode(submit){
        request({
            url:baseUrl + loginCode,
            data:{
                phone:submit['phone'],
                sms_code:submit['code']
            },
            method:'POST',
            success:(res)=>{
                wx.hideLoading()
                wx.showModal({
                    title:'登录成功',
                    showCancel: false,
                    success:()=>{
                        this.setUserData(res,submit['password'])
                    }
                })
            }
        })
    },
    // 密码登录请求
    loginChain(submit){
        request({
            url:baseUrl + loginChain,
            data:{
                phone:submit['phone'],
                password:submit['password']
            },
            method:'POST',
            success:(res)=>{
                wx.hideLoading()
                wx.showModal({
                    title:'登录成功',
                    showCancel: false,
                    success:()=>{
                        this.setUserData(res,submit['password'])
                    }
                })
            }
        })
    },
    // 登录成功存贮数据跳转页面
    setUserData(data,word){
        const { staffStoreList, staffInfo }  = data
        const { redirectUrl } = this.data
        //用户token
        wx.setStorageSync('auth_token',staffInfo.token)
        //用户userInfo
        let userInfo = {
            uid:staffInfo.sta_id,
            avatar:staffInfo.head_img,
            nickName:staffInfo.sta_name,
            phone:staffInfo.phone,
            sex:staffInfo.sex
        }
        wx.setStorageSync('user_info',userInfo)
        //店铺id
        wx.setStorageSync('store_id',staffInfo.store_id)
        //店铺列表
        // wx.setStorageSync('store_list',staffStoreList)
        //userPassword
        wx.setStorageSync('user_pass_word',word || '')
        //跳转店铺列表页面
        console.log('decodeURIComponent(redirectUrl)',decodeURIComponent(redirectUrl))
        wx.redirectTo({
            url: redirectUrl ? decodeURIComponent(redirectUrl) : '/pages/store/store'
        })
    },
    //分享
    onShareAppMessage() {
        
    }
})