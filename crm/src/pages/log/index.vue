<template>
    <div>
       <router-view></router-view>
       <div>
           <systemLog/>
       </div>
    </div>
</template>

<script>
import systemLog from './component/system-log'

export default {
    data() {
        return {}
    },
    components: {
        systemLog
    },
    mounted() {

    }
}
</script>
<style>
.fl .el-input .el-input__inner, .fl .el-select .el-input__inner{
    width: 200px!important;
}
</style>
