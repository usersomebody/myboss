<template>
    <div>
        <router-view></router-view>
        <div>
           <userContent/>
       </div>
    </div>
</template>

<script>
import userContent from './user-content'

export default {
    data() {
        return {}
    },
    components: {
        userContent
    },
    mounted() {

    },
    created(){
        console.log('this.$route',this.$route)
        console.log(this.$route.params.type)
    }
}
</script>
