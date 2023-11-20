<template>
    <div>
        <el-card class="box-card">
            <div class="search-bar">
                <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                    <el-form-item label="订单状态">
                        <el-select v-model="searchData.status" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in statusMap"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="block m-l-20" label="下单时间">
                        <el-date-picker
                        v-model="searchData.payTime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="search_fincerecord">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="商家名称" class="m-l-20">
                        <el-input v-model="searchData.name" placeholder="请输入" clearable @keyup.enter.native="onSearch(1)"></el-input>
                    </el-form-item>
                </el-form>
                <div class="" >
                    <el-button type="primary" @click="onSearch(1)">查询</el-button>
                    <el-button type="primary" @click="restSearch">重置</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="box-card" style="margin-top:10px;">
            <div class="table-content">
                <div class="">
                    <!-- <div class="action-header" v-if="multipleSelection.length">
                        <span @click="examineData(1)">通过</span>
                        <el-divider direction="vertical"></el-divider>
                        <span @click="examineData(2)">拒绝</span>
                    </div> -->
                    <el-table
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column
                        label="订单编号"
                        align="center"
                        prop="withdraw_sn"
                        width="230">
                        </el-table-column>
                        <el-table-column
                        label="商家名称"
                        prop="store_name"
                        align="center"
                        width="230">
                        </el-table-column>
                        <el-table-column
                        label="提现金额"
                        prop="money"
                        align="center"
                        width="100">
                        </el-table-column>
                        <el-table-column
                        label="实际打款金额"
                        prop="money"
                        align="center"
                        width="120">
                        </el-table-column>
                        <el-table-column
                        label="收款账户类型"
                        align="center"
                        width="120">
                            <template slot-scope="scope">
                              <span style="margin:0 10px;" >微信</span>  
                            </template>
                        </el-table-column>
                        <el-table-column
                        label="收款账户"
                        prop="nickname"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        label="订单状态"
                        prop="address"
                        align="center">
                        <template slot-scope="scope">
                            <span>{{statusObj[scope.row.status]}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="申请时间"
                        prop="create_time_name"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        label="付款时间"
                        prop="pay_time_name"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        label="备注"
                        prop="address"
                        align="center">
                            <template slot-scope="scope">
                              <span style="margin:0 10px;" >{{scope.row.check_remark}}</span>  
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="操作">
                            <template slot-scope="scope">
                                <!-- <span class="action-color" @click="delData(item.id, scope.row)">删除</span> -->
                                <span style="margin:0 10px;" v-if="scope.row.status == 5"  class="action-color" @click="examineData(scope.row, 4)">重新打款</span>
                                <span style="margin:0 10px;" v-if="scope.row.status == 1" class="action-color" @click="examineData(scope.row, 4)">通过</span>
                                <span style="margin:0 10px;" v-if="scope.row.status == 1" class="action-color" @click="examineData(scope.row, 3)">拒绝</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
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
            </div>
        </el-card>
    </div>
</template>

<script>
import { getCustomerList, getWithdrawList, withdrawCheck } from '@/api/permission'
import { goodsRenderList } from '../../goods-manage/config'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            searchData: {
                page: 1,
                limit: 10,
                total: 0,
                name: '',
                payTime: [],
                status: ''
            },
            statusMap: [{
                id: 1,
                name: '提现中'
            }, {
                id: 2,
                name: '已通过'
            }, {
                id: 3,
                name: '已拒绝'
            }, {
                id: 4,
                name: '已打款'
            }, {
                id: 5,
                name: '打款失败'
            }],
            statusObj:{
                1: '提现中',
                2: '已通过',
                3: '已拒绝',
                4: '已打款',
                5: '打款失败'
            },
             tableData: [],

            editId: '',
            multipleSelection: [],
            multipleSelectId: [],
            filterType: 1,
            goodsId: '',
            dataForm: {
                name: '',
                account: '',
                phone: '',
                password: ''
            },
            textValue: ''
        }
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    mounted() {

    },
    created() {
        this.getList()
    },
    methods: {
        restSearch(){
            this.searchData = {
                page: 1,
                limit: 10,
                total: 0,
                name: '',
                payTime: [],
                status: ''
            }
            this.onSearch(1)
        },
        async getList(){
            const { searchData } = this
            searchData.start_time = searchData.payTime.length ? searchData.payTime[0] : ''
            searchData.end_time = searchData.payTime.length ? searchData.payTime[1] : ''
            const data = await getWithdrawList(searchData)
            this.tableData = data.list
            this.searchData.total = data.total
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
        delData(row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            let multipleSelectId = val.map((item)=>{
                return item.id
            })
            this.multipleSelectId = multipleSelectId
        },
        examineData(item, type){
            let param = {
                status: type,
                id: item.id,
                check_mark:''
            }
            // type 4 通过 3 拒绝 
            if(type == 3){
                this.$prompt('', '拒绝理由', {
                    dangerouslyUseHTMLString: true,
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value})=>{
                    if(!value){
                        this.$message({
                            type: 'error',
                            message: '拒绝理由不可为空'
                        }); 
                        return
                    }
                    param.check_mark = value
                    this.auditData(param)
                }).catch(()=>{

                });
                return
            }
            this.$confirm('确认通过?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.auditData(param)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
            });
        },
        async auditData(param){
            try{
                const data = await withdrawCheck(param)
                this.$message({
                    type: 'success',
                    message: '操作成功'
                });  
                this.onSearch(1)
            }catch(err){
                this.onSearch(1)
            }
            
        }
    }

}
</script>
<style lang="scss" scoped>
.search-bar{
    overflow: hidden;
}
.line{
    color:#D0D0D0;
    margin:0 20px; 
}
.m-l-10{
    margin-left: 10px;
}
.m-l-20{
    margin-left: 20px;
}
.action-list{
    float: right;
}
.flex-v{
    display: flex;
    align-items: center;
}
.flex-v-c{
    display: flex;
    align-items: center;
}
.flex-v-b{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.common-tips{
    color: #FFB165;
    font-size: 12px;
    margin-top: 10px;
}
.common-radio-box{
    margin-bottom: 60px;
}
.pagination-bar{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top:20px;
}

.filter-content{
    display: flex;
    align-items: center;
    padding: 20px 0;
}
.filter-content-item{
    margin-right: 15px;
}
.filter-content-title{
    margin-bottom: 10px;
    font-size: 10px;
}
.filter-content-action{
    padding:10px 10px;
    border:1px solid #E9E9EC;
    border-radius:4px;
}
.font-s-9f8{
    font-size: 10px;
    color: #9F8F85;
}
.font-s-9f8.active{
    color:#409EFF;
}
.action-color{
    color: #7A90BD;
}
.margin-r-10{
    margin-right:10px;
}
.addGoodsBtn{
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
}
.title-color{
    color: #585358;
}
.title-header{
    background: #F7F9FA;
    padding:10px 15px;
    font-size:12px;
    display: flex;
    align-items: center;
}
.parent-logo{
    width:25px;
    height:25px;
    border-radius:50%;
    margin-right:10px;
}
.child-log{
    width:50px;
    height:50px;
    margin-right:10px;
}
.order-total-money{
    margin:0 10px;
}
.action-header{
    margin-bottom: 20px;
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

