<template>
    <div>
        <el-select v-model="dataType" clearable @change="updateValue">
            <el-option
            v-for="item in levelData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>
<script>
import { typeLevel } from '@/api/permission'

export default {
    props: ['defaultData', 'isOnly', 'isPageName'],
    data(){
        return{
            dataType: 1,
            levelData: [],
            userData: {}
        }
    },
    created(){
        this.userData = this.$store.state.permission.userData
        this.getLevelData()
    },
    methods:{
        async getLevelData() {
            const { role_id, department_main_id  } = this.userData
            const data = await typeLevel()
            let filterData = []
            // resources  这里得代码 我自己都看着恶心想吐 实在不想这样写 但是业务方呢边一直在变 一天改一次 改吐了 以后来的老哥望理解
            //超级管理员
            // if(role_id == 1){
            //     filterData = data
            // }else if((role_id == 4 || role_id == 6 || (role_id == 2 && department_main_id == 2)) && this.isPageName == 'resources'){
            //     //媒体资源 + 媒介
            //     filterData = [1, 3]
            // }else if((role_id == 3 || (role_id == 2 && department_main_id == 1)) && this.isPageName == 'resources'){
            //     //媒体资源 + 销售
            //     filterData = [3]
            // }else if(this.isOnly){
            //     //客户列表 合同
            //     filterData = [1]
            // }else{
            //     filterData = data
            // }
            if(this.isPageName == 'resources'){
                filterData = [1,2,3]
            }else if(this.isOnly && role_id != 1){
                //客户列表 合同
                filterData = [1]
            }else{
                filterData = data
            }
            let levelData = this.defaultData.map((item)=>{
                let obj = item
                return filterData.indexOf(obj.id) > -1 ? obj : ''
            })
            this.levelData = levelData.filter((item)=>{
                return item
            })
            this.dataType = this.levelData[0].id
            this.$emit('levelList',this.levelData[0].id)
        },
        updateValue(){
            this.$emit('levelList',this.dataType)
        }
    }
}
</script>
<style>

</style>


