<template>
    <div class="detail-container" >
        <div class="auth-title">{{authText}}</div>
        <div @click="goWxApp" class="auth-btn">返回</div>
    </div>
</template>
<script>
import { getTOMiniUrl } from '@/api/permission'
import { mapState } from 'vuex'
import { appOrH5, wxAppUrl, wxNavigateTo, isWxApp } from '../../utils/wxApp.js';
import { isDev } from '@/config/baseUrl'
export default {
    data() {
        return {
            is_not_auth: '-1',
            authText: '授权失败',
            miniUrl: ''
        }
    },
    created(){
        this.is_not_auth = location.href.indexOf('error') > -1
        this.authText = this.is_not_auth  ? '授权失败' : '授权成功'
        if(this.is_not_auth){
            this.$message({
                type: 'error',
                message: this.geturlparam('error')
            });
        }
        this.getAuth()
        this.$store.commit('LOGIN_OUT')
        localStorage.removeItem('token')
    },
    methods:{
        goWxApp(){
            if(this.geturlparam('wxapp') == 1){
                // window.location.href = this.miniUrl;
                window.opener = null;
                window.open("", "_self");
                window.close()
                WeixinJSBridge.call("closeWindow")
            }else{
                window.location.href = isDev ? `https://test.xingxuan.mnancheng.com/#/login` : 'https://xingxuan.mnancheng.com/#/login';
            }
        },
        geturlparam(data){
            let that=this
            // window.location.href 获取地址
            let url = window.location.href
            let p = url.split('?')[1]
            let params = new URLSearchParams(p)
            return params.get(data)
      },
      async getAuth(param){
            const data = await getTOMiniUrl(param)
            this.miniUrl = data
      }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.detail-container {
  width: 100%;
  min-height: 100vh;
  max-width: 640px;
  margin: 0 auto;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent;
  background: #f6f6f6;
  font-family: PingFangSC-Regular, 'Source Han Sans', Helvetica,"Droid Sans",Arial, sans-serif;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.auth-title{
    color:red;
    font-size:16px;
}
.auth-btn{
    padding:10px 40px;
    border:1px solid #eee;
    font-size:16px;
    background:#409eff;
    color:#fff;
    margin-top:20px;
    border-radius:10px;
}
.color-red{
    color:red;
}
</style>
