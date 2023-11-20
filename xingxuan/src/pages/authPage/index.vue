<template>
    <div class="detail-container" >
        <div @click="goWxApp" class="auth-btn">去授权</div>
    </div>
</template>
<script>
import { getAuthUrl } from '@/api/permission'
import { mapState } from 'vuex'
import { appOrH5, wxAppUrl, wxNavigateTo } from '../../utils/wxApp.js';
import { isDev } from '@/config/baseUrl'
export default {
    data() {
        return {
            is_not_auth: '-1',
            authText: '授权失败',
            go_auth_url: ''
        }
    },
    created(){
        let param = {
            url: encodeURIComponent(`${ isDev ? 'https://test.xingxuan.mnancheng.com/#/backPage' : 'https://xingxuan.mnancheng.com/#/backPage'}`),
            keyword: this.geturlparam('unionid'),
            auth_type: 'promoter',
        }
        this.getAuth(param)
    },
    methods:{
        goWxApp(){
            window.location.href = this.go_auth_url
        },
        geturlparam(urlName){
            let that=this
            // window.location.href 获取地址
            let url = window.location.href
            let p = url.split('?')[1]
            let params = new URLSearchParams(p)
            return params.get(urlName)
      },
      async getAuth(param){
            const data = await getAuthUrl(param)
            this.go_auth_url = data.url
        },
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
