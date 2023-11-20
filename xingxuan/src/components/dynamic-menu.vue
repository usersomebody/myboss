<template>
  <div class='menu-container'>
    <!-- <div class="video-data-content">
      <img class="video-data-logo" src="https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20220408/7f7c8569955aff96c11440277be425eb.png" alt="">
      <span class="video-data-title">视频号数据平台</span>
    </div> -->
    <template v-for='(v, index) in menuList'>
      <el-submenu
        :index='v.name'
        v-if='v.children && v.children.length > 0 '
        :key='v.id'
        @click='gotoRoute(v)'
      >
        <template slot='title'>
            <img v-if="v.meta && v.meta.cover" :src="current === v.id ? v.meta.checkCover : v.meta.cover" style="margin-right:8px;"/>
            <svg-icon v-if="v.meta && v.meta.icon" :icon-class="v.meta.icon"></svg-icon>
            <span>{{v.meta.name}}</span>
        </template>
        <el-menu-item-group>
          <!-- <my-nav :menuList='v.children'></my-nav> -->
          <template v-for='item in v.children'>
            <el-menu-item
              :key='item.id'
              :index='item.name'
              @click='gotoRoute(item)'
            >
              <img v-if="item.meta && item.meta.cover" :src="current === item.id ? item.meta.checkCover : item.meta.cover" style="margin-right:8px;"/>
              <svg-icon v-else-if="item.meta && item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
              <span slot='title'>{{item.meta.name}}</span>
            </el-menu-item>
          </template>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item
        :key='v.id'
        :index='v.name'
        @click='gotoRoute(v)'
        v-else-if="v.meta.name"
      >
        <!-- <i
          class='iconfont'
          :class='v.meta.icon'
        ></i> -->
        <img v-if="v.meta && v.meta.cover" :src="current === v.id ? v.meta.checkCover : v.meta.cover" style="margin-right:8px;"/>
        <svg-icon v-else-if="v.meta && v.meta.icon" :icon-class="v.meta.icon"></svg-icon>
        <span slot='title'>{{v.meta.name}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
    name: 'my-nav',
    props: {
        menuList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data(){
      return {
        current:'',
        activeIndex: ''
      }
    },
    methods: {
        gotoRoute(v) {
          console.log('v', v)
          this.current = v.id
          this.$router.push({ name: v.name })
        },
        getval(index, indexPath){
          console.log(index, indexPath)
        }
        
    }
}
</script>

<style lang='scss'>
.menu-container {
  .svg-icon{
    margin-right:10px;
  }
}
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
