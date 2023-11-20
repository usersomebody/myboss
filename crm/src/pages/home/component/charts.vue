<template>
    <div>
        <el-card class="box-card">
            <div class="search-bar">
                <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                    <el-form-item label="">
                        <el-select v-model="searchData.belong_userid" clearable>
                            <el-option
                            v-for="item in userListData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" class="m-l-20">
                        <el-select v-model="searchData.monthData" clearable @change="clearTime">
                            <el-option
                            v-for="item in filterOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="block m-l-20" label="">
                        <el-date-picker
                        v-model="searchData.createTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="updateDate">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="" @click="getChartData">
                    <el-button type="primary">查询</el-button>
                </div>
            </div>
        </el-card>
        <div class="flex-content">
            <div class="final-profit">
                <div class="final-profit-money color-636 font-14">排期销售额</div>
                <div class="final-profit-value color-071 font-30 font-weight">{{chartsData.customer_money}}</div>
                <div class="flex-content"><span class="color-636 font-14" style="margin-right: 12px">排期利润</span><span class="color-f9a font-14 font-weight">{{chartsData.final_profit}}</span></div>
            </div>
            <div id="myChart" :style="{ width: '80%', height: '350px', background: '#ffffff', padding: '46px 90px' }"></div>
        </div>
    </div>
</template>

<script>
// import echarts from "echarts";
import * as echarts from 'echarts'
import { getHomeData, allPerson, typeLevel } from '@/api/permission'
import moment from 'moment'
export default {
    data() {
        return {
            searchData: {
                belong_userid: '',
                createTime: '',
                level_type: '',
                monthData: ''
            },
            userListData: [{
                id: 1,
                name: '个人'
            }],
            defaultData: [{
                id: 1,
                name: '个人'
            }, {
                id: 2,
                name: '下属'
            }, {
                id: 3,
                name: '全部'
            }],
            userData: {},
            chartsData: {},
            filterOptions: [{
                id: 1,
                name: '本月',
                date: {}
            },{
                id: 2,
                name: '上一月',
                date: {}
            },{
                id: 3,
                name: '本季度',
                date: {}
            },{
                id: 4,
                name: '上一季度',
                date: {}
            },{
                id: 5,
                name: '本年',
                date: {}
            },{
                id: 6,
                name: '上一年',
                date: {}
            }]
        }
    },
    mounted(){
        const { filterOptions } = this
        this.userData = this.$store.state.permission.userData
        this.searchData.belong_userid = this.userData.id
        let start = moment().startOf('month').format('YYYY-MM-DD')
        let end = moment().endOf('month').format('YYYY-MM-DD')
        this.searchData.createTime = [start, end]
        this.getLevelData()
        this.getChartData()

        //初始化
        filterOptions.forEach((item)=>{
            item.date = this.calculationMonthData(item.id)
        })
        console.log('filterOptions', filterOptions)
        this.filterOptions = filterOptions
        this.ddReady()
    },
    methods:{
        async getLevelData() {
            const data = await typeLevel()
            this.searchData.level_type = data.length
            let levelData = this.defaultData.map((item)=>{
            let obj = item
                return data.indexOf(obj.id) > -1 ? obj : ''
            })
            this.userListData = levelData.filter((item)=>{
                return item
            })
            this.getAllPerson()
        },
        async getAllPerson(){
            let param = {
                path: this.$route.name,
                level: this.searchData.level_type
            }
            const data = await allPerson(param)
            if(this.searchData.level_type == 2){
                data.unshift({
                    id:  this.userData.id,
                    name: this.userData.name
                })
            }
            console.log('data', data)
            this.userListData = data
        }, 
        async getChartData(){
            const { searchData, userData, filterOptions } = this
            // searchData.belong_userid = userData.id
            if(searchData.createTime.length){
                searchData.start_time = searchData.createTime.length ? searchData.createTime[0] : ''
                searchData.end_time = searchData.createTime.length ? searchData.createTime[1] : ''
            }else{
                let checkDate = filterOptions.filter((item)=>{
                    return item.id == searchData.monthData
                })
                searchData.start_time = checkDate[0].date.startTime
                searchData.end_time = checkDate[0].date.endTime
            }
            const data = await getHomeData(searchData)
            this.chartsData = data.sumArr
            console.log('1', data)
            this.drawLine(data.staticsArr)
            
        },
        drawLine(chartsData){
            let myChart = echarts.init(document.getElementById("myChart"));
            myChart.setOption({
                title: {
                    text: '收益表'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    right: '40px',
                    data: ['排期销售额', '排期利润']
                },
                grid:{
                    x:70,
                    y:45,
                    x2:70,
                    y2:20,
                    borderWidth:1
                },
                toolbox: {
                    feature: {
                    saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: chartsData.time,
                    axisLabel :{
                        interval:0
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel :{
                        interval:0
                    }
                },
                series: [
                    {
                        name: '排期销售额',
                        type: 'line',
                        stack: 'Total',
                        data: chartsData.customer_money
                    },
                    {
                        name: '排期利润',
                        type: 'line',
                        stack: 'Total',
                        data: chartsData.final_profit
                    },
                ]
            });
        },
        calculationMonthData(type){
            // 本月 1 上月 2 本季度 3 上季度 4 本年 5 上一年 6
            let startTime = ''
            let endTime = ''
            switch (type) {
                case 1:
                    startTime = moment(moment().month(moment().month()).startOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
                    endTime = moment(moment().month(moment().month()).endOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss'); 
                    break;
                case 2:
                    startTime = moment(moment().month(moment().month() - 1).startOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
                    endTime = moment(moment().month(moment().month() - 1).endOf('month').valueOf()).format('YYYY-MM-DD HH:mm:ss');
                    break;
                case 3:
                    startTime = moment(moment().quarter(moment().quarter()).startOf('quarter').valueOf()).format('YYYY-MM-DD HH:mm:ss');
                    endTime = moment(moment().quarter(moment().quarter()).endOf('quarter').valueOf()).format('YYYY-MM-DD HH:mm:ss');
                    break;
                case 4:
                    startTime = moment(moment().quarter(moment().quarter() - 1).startOf('quarter').valueOf()).format('YYYY-MM-DD HH:mm:ss');
                    endTime = moment(moment().quarter(moment().quarter() - 1).endOf('quarter').valueOf()).format('YYYY-MM-DD HH:mm:ss');
                    break;
                case 5:
                    startTime = moment(moment().year(moment().year()).startOf('year').valueOf()).format('YYYY-MM-DD HH:mm:ss');
                    endTime = moment(moment().year(moment().year()).endOf('year').valueOf()).format('YYYY-MM-DD HH:mm:ss');
                    break;
                case 6:
                    startTime = moment(moment().year(moment().year() - 1).startOf('year').valueOf()).format('YYYY-MM-DD HH:mm:ss');
                    endTime = moment(moment().year(moment().year() - 1).endOf('year').valueOf()).format('YYYY-MM-DD HH:mm:ss');
            } 
            return { startTime, endTime }
        },
        updateDate(){
            this.searchData.monthData = ''
        },
        clearTime(){
            this.searchData.createTime = []
        },
        ddReady(){
            
        }
    }
    
}
</script>
<style>
.flex-content{
    display: flex;
    align-items: center;
}
.color-636{
    color: #63687D;
}
.font-14{
    font-size: 14px;
}
.color-071{
    color: #071A53;
}
.color-f9a{
    color: #F9A74F;
}
.font-30{
    font-size: 30px;
}
.final-profit{
    width:28%;
    height: 350px;
    background: #fff;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 2%;
}
.final-profit-money{
    margin-bottom: 26px;
}
.final-profit-value{
    margin-bottom: 45px;
}
.font-weight{
    font-weight: 600;
}
</style>
<style>
.el-date-editor .el-range-separator{
    padding:0;
}
</style>
