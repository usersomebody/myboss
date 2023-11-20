<template>
    <aside class="aside__top">
        <span
            class="iconfont icon-nav toggleNavCollapse"
            :class="{active:isSidebarNavCollapse}"
            @click="toggleNavCollapse"
        >
        </span>
        <el-breadcrumb separator="/">
            <transition-group name="breadcrumb">
                <!-- 防止面包屑导航出现 首页/首页， v-if="route.name!='home'" -->
                <template v-for="(route,i) in crumbList">
                    <!-- v-if="route.name!='home' && route.meta.name!='首页'" -->
                    <el-breadcrumb-item
                        :key="route.name"
                        :to="{name:route.name}"
                        :class="{'is-last-link':i==crumbList.length-1}"
                        v-if="i == crumbList.length - 1"
                    >
                        {{route.meta.name}}
                    </el-breadcrumb-item>
                </template>
            </transition-group>
        </el-breadcrumb>
        <div class="aside__top--right">
            <div class="user-msg">
                <el-dropdown trigger="click" placement="top">
                    <span>
                        <img class="user-img" :src="userInfo.is_manager == 1 ? storeInfo.head_img : avatar" alt="">
                        <span class="user-name">{{userInfo.is_manager == 1 ? storeInfo.store_name : '盈科星选'}}</span>
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="userInfo.is_manager == 1 && storeList.length > 1"><div @click="switchStore">切换店铺</div></el-dropdown-item>
                        <el-dropdown-item><div @click="loginOut">退出</div></el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <!-- <div class="quit-system" @click="loginOut">
                <span class="">退出</span>
            </div> -->
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            append-to-body
            :before-close="handleClose">
            <ul>
                <li class="li-item" v-for="(item,index) in storeList" :key="index">
                    <div class="item-left">
                        <div class="item-info">
                            <img class="logo-pic" :src="item.head_img"/>
                            <div class="item-content">
                                <p class="item-name">{{item.store_name}}</p>
                                <p class="color-919">{{item.authorizer_appid}}</p>
                            </div>
                        </div>
                        <el-button type="primary" class="btn-bg" @click="nextInto(item)">点击进入</el-button>
                    </div>
                </li>
            </ul>
        </el-dialog>
    </aside>
</template>

<script>
import { login, bindStore } from '@/api/permission'
import { isDev } from '@/config/baseUrl'
import { shopkeeperList, platformList } from '../../../login/config.js'
import { mapState } from 'vuex'

export default {
    inject:['reload'],
    data() {
        return {
            dialogVisible: false,
            storeList: [],
            userInfo: {},
            storeInfo: {}
        }
    },
    computed: {
        ...mapState(['isSidebarNavCollapse', 'crumbList']),
        ...mapState('permission', ['avatar', 'account'])
    },
    created(){
        this.storeList = JSON.parse(localStorage.getItem('detailInfo'))
        this.storeInfo = JSON.parse(localStorage.getItem('storeInfo'))
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        
    },
    methods: {
        toggleNavCollapse() {
            this.$store.commit('toggleNavCollapse')
        },
        loginOut() {
            localStorage.removeItem('detailInfo')
            localStorage.removeItem('storeInfo')
            localStorage.removeItem('userInfo')
            this.$store.commit('LOGIN_OUT')
            /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
            window.location.reload()
        },
        goUserInfo(type){
            this.$router.push({name: 'user', params:{ type: type}})
        },
        nextInto(info){
            const { id } = info
            const { userInfo } = this
            let is_auth = info.is_authorization == 2 ? 1 : 2
            let param = {
                    authorizer_appid: info.authorizer_appid
                }
            this.goBindStore(param)
            
            this.dialogVisible = false
        },
        async goBindStore(param){
            try{
                let options = {headers: {token:  localStorage.getItem('token'), 'content-type': 'application/x-www-form-urlencoded'}}
                let data = await bindStore(param, options)
                if(data.is_manager == 2){
                    data.permission = platformList
                }else{
                    data.permission = shopkeeperList
                }
                let token = data.token
                localStorage.setItem('storeInfo', JSON.stringify(data.store_info))
                this.$store.commit('LOGIN_IN', token)
                this.$store.commit('USER_INFO', data)
                let path = data.permission.length ? data.permission[0].vue_route : '/home'
                this.reload()
                // this.$router.push({path: path })
            }catch(err){
                this.$message({
                    type: 'error',
                    message: err
                });
            }
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        switchStore(){
            this.dialogVisible = true
        }
    }
}
</script>

<style lang="scss" scoped>
.aside__top {
    border-bottom: 1px solid #e5e5e5;
    height: 50px;
    line-height: 50px;
    position: fixed;
    left: 200px;
    top: 0;
    right: 0;
    background: #fff;
    z-index: 1000;
    transition: left 0.25s;
    .toggleNavCollapse {
        display: inline-block;
        margin-left: 8px;
        padding: 0 10px;
        font-size: 26px;
        vertical-align: middle;
        color: #333;
        cursor: pointer;
        transition: all 0.5s;
        &.active {
            transform: rotate(90deg);
        }
    }

    .aside__top--right {
        position: absolute;
        right: 10px;
        top: -1px;
        bottom: 0px;
        > div {
            position: relative;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            margin-left: 10px;
            padding: 0 15px;
            cursor: pointer;
            &:hover::after {
                transform-origin: 0 0;
                transform: scaleX(1);
            }
            &:first-child:before {
                border: none;
            }
            &::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 2px;
                background: #ef4747;
                transform: scaleX(0);
                transform-origin: right 0;
                transition: transform 0.5s;
            }
            &::before {
                content: '';
                position: absolute;
                height: 20px;
                top: 50%;
                left: -8px;
                margin-top: -10px;
                border-left: 1px solid #ccc;
            }
            &.email {
                i {
                    position: absolute;
                    left: 18px;
                    top: -12px;
                    border-radius: 20px;
                    background: red;
                    color: #fff;
                    text-align: center;
                    font-size: 12px;
                    line-height: 1.5;
                    min-width: 20px;
                    min-height: 20px;
                }
            }
            &.user-msg {
                .user-img {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    vertical-align: middle;
                }
                .user-name {
                    color: #758eb5;
                    padding: 0 4px;
                }
            }
            .iconfont {
                position: relative;
                font-size: 24px;
                color: #758eb5;
            }
        }
    }
}
.breadcrumb-enter,
.breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
    transition: all 0.6s;
}

.breadcrumb-leave-active {
    position: absolute;
}
ul{
    .li-item{
        margin-bottom:20px;
        .item-left{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .item-info{
                display: flex;
                align-items: center;
                .logo-pic{
                    width: 60px;
                    // height: 60px;
                    margin-right: 20px;
                }
                .item-content{
                    .item-name{
                        margin-bottom: 20px;
                    }
                }
                
            }
            .btn-bg{
                background: #FE2F4F;
                border: 1px solid #FE2F4F;
            }
        }
    }
}
.color-919{
    color: #9196B4;
}
</style>
