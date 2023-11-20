<template>
    <div>
       <router-view></router-view>
       <div>
           <payCollection/>
       </div>
    </div>
</template>

<script>
import payCollection from './component/pay-collection'

export default {
    data() {
        return {}
    },
    mounted() {

    },
    components: {
        payCollection
    }
}
</script>
