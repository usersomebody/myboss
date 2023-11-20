<template>
    <el-menu
        :collapse="isSidebarNavCollapse"
        background-color="rgb(10, 37, 88)"
        text-color="rgb(151, 169, 196)"
        active-text-color="#ffffff"
        :default-active="currentMenu"
    >
        <div class="video-data-content">
            <img class="video-data-logo" src="https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220408/7f7c8569955aff96c11440277be425eb.png" alt="">
            <span class="video-data-title">盈科星选后台</span>
        </div>
        <DynamicMenu :menuList="sidebarMenu"></DynamicMenu>
    </el-menu>
</template>

<script>
import DynamicMenu from '@/components/dynamic-menu'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            isCollapse: true
        }
    },
    computed: {
        ...mapState(['isSidebarNavCollapse']),
        ...mapState('permission', ['sidebarMenu', 'currentMenu'])
    },
    methods: {},
    components: {
        DynamicMenu
    }
}
</script>
<style>
.video-data-content{
  display:flex;
  align-items: center;
  padding: 13px 20px;
}
.video-data-logo{
  width:30px;
  height:22px;
  margin-right:9px;
}
.video-data-title{
  font-size: 16px;
  color: #fff;
  white-space: nowrap;
}
</style>
