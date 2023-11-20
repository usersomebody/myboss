<template>
    <div>
       <router-view></router-view>
       <div>
           <index/>
       </div>
    </div>
</template>

<script>
import index from './component/index'

export default {
    data() {
        return {}
    },
    mounted() {

    },
    components: {
        index
    }
}
</script>
