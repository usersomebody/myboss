<template>
    <div class="login-container">
        <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
            <h3 class="title">盈科CRM</h3>
            <el-form-item prop="phone">
                <span class="svg-container svg-container_login">
                    <svg-icon icon-class="user" />
                </span>
                <el-input name="phone" type="text" v-model="loginForm.phone" autoComplete="off" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password"></svg-icon>
                </span>
                <el-input name="password" :type="pwdType" @keyup.enter.native="login" v-model="loginForm.password" autoComplete="off"
                placeholder="请输入密码"></el-input>
                <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
            </el-form-item>
            <div class="save-password"><el-checkbox v-model="savePassword">记住密码</el-checkbox></div>
            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="login">
                登录
                </el-button>
            </el-form-item>
            <!-- <div class="update-password">
                <el-button type="text" @click="updatePassword">忘记密码</el-button>
            </div> -->
            <!-- <div class="tips">用户为admin的时候，能够看到所有的权限列表，其余账号只能看到部分</div> -->
        </el-form>
    </div>
</template>

<script>
import { login } from '@/api/permission'
import { setTimeout } from 'timers';
export default {
    data() {
        const validateUsername = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error('请输入正确的用户名'))
            } else {
                callback()
            }
        }
        const validatePass = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error('密码不能小于5位'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                phone: '',
                password: ''
            },
            loginRules: {
                password: [
                    { required: true, trigger: 'blur', validator: validatePass }
                ]
            },
            loading: false,
            pwdType: 'password',
            savePassword: false
        }
    },
    mounted(){
        let accountInfo = JSON.parse(localStorage.getItem('accountInfo'))
        this.loginForm = accountInfo && accountInfo.phone && accountInfo.password ? accountInfo : this.loginForm
        this.savePassword = accountInfo && accountInfo.phone && accountInfo.password ? true : false
    },
    methods: {
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } else {
                this.pwdType = 'password'
            }
        },
        async login() {
            const { loginForm } = this
            try {
                if(this.savePassword){
                    localStorage.setItem('accountInfo', JSON.stringify(loginForm))
                }else{
                    localStorage.removeItem('accountInfo')
                }
                let data = await login(this.loginForm)
                let token = data.token
                this.$store.commit('LOGIN_IN', token)
                this.$store.commit('USER_INFO', data)
                let path = data.permission.length ? data.permission[0].vue_route : '/home'
                this.$router.replace({path: path })
            } catch (e) {
                console.log(e)
            }
        },
        updatePassword(){

        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #606266;

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 30px;
        width: 90%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 30px;
            &:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: #fff !important;
            }
        }
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    // background-color: $bg;
    background: url('https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220505/bc851b83ded5f24b98b3f32d4544a23a.png') no-repeat;
    .login-form {
        position: absolute;
        right: 0;
        width: 360px;
        padding: 35px 35px 15px 35px;
        margin-top:310px;
        margin-right:300px;
        background: #fff;
        border-radius: 8px;
        .save-password{
            margin-bottom:32px;
        }
        .update-password{
            display: flex;
            justify-content: center;
            align-items: center;
            .el-button--text{
                color: rgb(48, 50, 76)!important;
            }
        }
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }
    .svg-container {
        padding: 0 5px 0 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 20px;
        display: inline-block;
        &_login {
            font-size: 20px;
        }
    }
    .title {
        font-size: 20px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
        color: rgb(48, 50, 76);
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 0;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
    .fontcontainer{
        color:#889aa4;
        padding-left:10px;
    }
    .el-form-item{
        border: 1px solid #DCDCDC;
        background: rgba(0, 0, 0, 0);
        height: 40px;
        .el-form-item__content{
            line-height: 30px!important;
        }
    }
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #606266;
            height: 47px;
            caret-color: #606266;
            &:-webkit-autofill {
                 box-shadow: 0 0 0px 1000px white inset !important;
                -webkit-text-fill-color: #606266 !important;
            }
        }
    }
}
</style>
