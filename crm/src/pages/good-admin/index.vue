<template>
    <div>
       <router-view></router-view>
       <div>
           <topFilter/>
       </div>
    </div>
</template>

<script>
import topFilter from './component/top-filter'

export default {
    data() {
        return {}
    },
    mounted() {

    },
    components: {
        topFilter
    },
}
</script>
