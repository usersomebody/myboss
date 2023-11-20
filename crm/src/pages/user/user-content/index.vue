<template>
    <div class="flex">
        <div class="left">
            <div class="flex user-top-info flex-a-center">
                <el-image
                    class="avatar"
                    :src="userInfo.avatar"
                    fit="cover"></el-image>
                <div class="">
                    <h4 class="user-name font-weight">{{userInfo.name}}</h4>
                    <p class="user-tips">{{userInfo.rule_name}}</p>
                </div>
            </div>
            <ul>
                <li v-for="(item,index) in switchList" :key="index" class="switch-item" :class="item.id === switchId ? 'active' : ''" @click="switchTab(item.id)">{{item.name}}</li>
            </ul>
        </div>
        <div class="right">
            <userInfo
            v-if="switchId == 1"/>
            <updatePassword
            v-if="switchId == 2"/>
        </div>
    </div>

</template>
<script>
import userInfo from '../user-info'
import updatePassword from '../update-password'

export default {
    data() {
        return {
            userInfo: JSON.parse(localStorage.getItem('userInfo')),
            switchList: [{
                id:1,
                name:'个人信息'
            }, {
                id:2,
                name:'账号密码'
            }],
            switchId: 1,
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        }
    },
    components: {
        userInfo,
        updatePassword
    },
    mounted() {

    },
    methods: {
        switchTab(id){
            this.switchId = id
        }
    }
}
</script>
<style scoped>
.flex{
    display: flex;
}
.flex-a-center{
    align-items: center;

}
.left{
    width:200px;
    margin-right:6px;
}
.user-top-info{
    padding:20px;
    background:#fff;
    border-radius:4px;
}
.avatar{
    width:44px;
    height:44px;
    border-radius: 50%;
    margin-right:10px;
}
.switch-item{
    height:36px;
    line-height:36px;
    padding-left:8px;
    background:#fff;
    font-size:14px;
    box-sizing: border-box;
}
.active{
    border-left:2px solid #0D85FA;
    background:rgba(0,0,0,0);
    box-sizing: border-box;
}
.font-weight{
    font-weight:600;
}
.user-name{
    font-size:16px;
    margin-bottom:6px;
}
.user-tips{
    font-size:14px;
}
.right{
    width: 100%;
    background:#fff;
    padding: 20px;
    border-radius: 6px;
}
</style>
