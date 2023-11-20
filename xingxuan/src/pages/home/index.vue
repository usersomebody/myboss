<template>
    <div>
        <router-view></router-view>
        <TotalStatus/>
        <charts/>
    </div>
</template>

<script>
import TotalStatus from './component/total-status'
import charts from './component/charts'

export default {
    data() {
        return {}
    },
    mounted() {

    },
    components: {
        TotalStatus,
        charts
    }
}
</script>
