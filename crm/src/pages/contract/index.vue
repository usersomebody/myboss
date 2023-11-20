<template>
    <div>
       <router-view></router-view>
       <div>
           <contractAdmin/>
       </div>
    </div>
</template>

<script>
import contractAdmin from './component/contract-admin'

export default {
    data() {
        return {}
    },
    mounted() {

    },
    components: {
        contractAdmin
    }
}
</script>
