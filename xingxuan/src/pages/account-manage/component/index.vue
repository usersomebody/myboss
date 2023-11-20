<template>
    <div>
        <el-card>
            <div class="box-card-between">
                <div class="box-card">
                    <div class="common-content">
                        <div class="common-content-title font-12">账户总额</div>
                        <div class="font-40">{{accountObj.total_balance}}</div>
                    </div>
                    <div class="common-content">
                        <div class="common-content-title font-12">已提现</div>
                        <div class="font-40">{{accountObj.expense_balance}}</div>
                    </div>
                    <div class="common-content">
                        <div class="common-content-title font-12">可提现金额<span style="margin-left:20px;color:#FE2F4F;">可提现金额是扣除平台{{accountObj.service_charge_rate}}%手续费后的金额</span></div>
                        <div class="font-40">{{accountObj.balance}}</div>
                    </div>
                </div>
                <el-popover
                    placement="bottom"
                    width="250"
                    offset="25"
                    trigger="click">
                    <div class="withdrawCode-center">
                        <img :src="qrcode" class="withdrawCode"/>
                        <div>使用微信扫码提现</div>
                    </div>
                    <el-button slot="reference" type="primary">提现</el-button>
                </el-popover>
            </div>
        </el-card>
        <el-card class="table-data-content">
            <div class="search-bar">
                <div style="font-size:12px;margin-bottom:20px;">收支记录</div>
                <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                    <el-form-item class="block m-l-20" label="下单时间">
                        <el-date-picker
                        v-model="searchData.payTime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="block m-l-20" label="">
                        <div class="" @click="onSearch(1)">
                            <el-button type="primary">查询</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                ref="multipleTable"
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                label="时间"
                prop="create_time_name"
                align="center">
                </el-table-column>
                <el-table-column
                label="动账类型"
                prop="address"
                align="center">
                <template slot-scope="scope">
                    <span>{{sourceType[scope.row.source_type]}}</span>
                    <el-tooltip v-if="scope.row.source_type == 2 && scope.row.remark" class="item" effect="dark" :content="scope.row.remark + ''" placement="bottom">
                        <img src="https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/reason.png" style="width:14px;height:14px;margin:0 10px;"/>
                    </el-tooltip>
                </template>
                </el-table-column>
                <el-table-column
                label="收支类型"
                prop="status"
                align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.balance_type == 1 ? '支出' : '收入'}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="收支金额"
                prop="money"
                align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.money}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="账户余额"
                prop="balance"
                align="center">
                </el-table-column>
                <el-table-column
                label="关联单号"
                prop="source_order"
                align="center">
                </el-table-column>
            </el-table>
            <div class="pagination-bar">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[10, 25, 50, 100]"
                :page-size="searchData.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="searchData.total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { accountList, storeQrCode } from '@/api/permission'

export default {
    data() {
        return {
            searchData:{
                payTime:'',
                limit: 10,
                page: 1,
                total: 0
            },
            accountObj:{

            },
            sourceType:{
                1: '提现',
                2: '提现驳回',
                3: '订单结算',
                4: '平台手续费'
            },
            tableData: [],
            qrcode: ''
        }
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    mounted() {

    },
    created() {
        this.getList()
        this.getQrCode()
    },
    methods: {
        async getList(){
            const { searchData } = this
            searchData.start_time = searchData.payTime.length ? searchData.payTime[0] : ''
            searchData.end_time = searchData.payTime.length ? searchData.payTime[1] : ''
            const data = await accountList(searchData)
            this.accountObj = {
                balance: data.balance,
                total_balance: data.total_balance,
                expense_balance: data.expense_balance,
                service_charge_rate:data.service_charge_rate
            }
            this.tableData = data.list
            this.searchData.total = data.total
        },
        async getQrCode(){
            const data = await storeQrCode()
            this.qrcode = data.qrcode
        },
        onSearch(page){
            this.searchData.page = page
            this.getList()
        },
        search_fincerecord() {
            this.onSearch(1)
        }, 
        handleSizeChange(val) {
            this.searchData.limit = val = val
            this.onSearch(1)
        },
        handleCurrentChange(val) {
            this.searchData.page = val
            this.onSearch(val)
        },
    }

}
</script>
<style lang="scss" scoped>
.table-data-content{
    margin-top:20px;
}
.box-card{
    display:flex;
    align-items: center;
}
.box-card-between{
    display:flex;
    align-items: center;
    justify-content: space-between;
}
.common-content{
    padding:20px 80px 20px 40px;
    border-right:1px solid #EFEFEF;
}
.common-content:last-child{
    border: none;
}
.common-content-title{
    margin-bottom:30px;
}
.font-12{
    font-size:12px;
}
.font-40{
    font-size:40px;
}
.withdrawCode{
    width:200px;
    height:200px;
    margin-bottom:20px;
}
.withdrawCode-center{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
<style>
.el-input input::-webkit-outer-spin-button,
.el-input input::-webkit-inner-spin-button{
    -webkit-appearance: none!important;
}
.el-input input[type="number"]{
    -moz-appearance: textfield;
}
.el-input .el-input__inner{
    line-height: 1px!important;
}
</style>

