<template>
    <div>
        <el-card class="box-card">
            <div class="search-bar">
                <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                    <el-form-item label="推客账号">
                        <el-input v-model="searchData.promotor_name" placeholder="请输入" clearable @keyup.enter.native="onSearch(1)"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="手机号" class="m-l-20">
                        <el-input v-model="searchData.phone" placeholder="请输入" clearable @keyup.enter.native="onSearch(1)"></el-input>
                    </el-form-item> -->
                    <el-form-item label="推客类型" class="m-l-20">
                        <el-select v-model="searchData.promotor_way" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in promotorType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="" @click="onSearch(1)">
                    <!-- <el-button type="primary">重置</el-button> -->
                    <el-button type="primary">查询</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="box-card" style="margin-top:10px;">
            <div class="table-content">
                <div class="">
                    <div v-for="(item, index) in tableData" :key="index">
                        <div class="title-header">
                            <img :src="item.head_img" class="parent-logo"/>
                            <span class="margin-r-10 title-color">微信昵称：{{item.nickname}}</span>
                            <!-- <span class="margin-r-10 title-color">手机号：{{item.phone}}</span> -->
                        </div>
                        <div>
                            <el-table
                                ref="multipleTable"
                                :data="item.detail"
                                border
                                tooltip-effect="dark"
                                :header-cell-style="{display:index != 0 ? 'none' : ''}"
                                style="width: 100%">
                                <el-table-column
                                :label="index == 0 ? '推客账号' : '' "
                                align="center"
                                width="900">
                                <template slot-scope="scope">
                                    <div class="flex-v-c">
                                        <img :src="scope.row.head_img" class="child-log"/>
                                        <p>{{scope.row.promotor_name}}</p>
                                    </div>
                                </template>
                                </el-table-column>
                                <el-table-column
                                align="center"
                                :label="index == 0 ? '操作' : '' "
                                show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <!-- <span class="action-color" @click="delData(item.id, scope.row)">删除</span> -->
                                    <span style="margin:0 10px;" class="action-color" @click="importData(scope.row)">查看订单</span>
                                </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>

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
import { getCustomerList, getPromoterList, getAllStore } from '@/api/permission'
import { goodsRenderList } from '../../goods-manage/config'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            searchData: {
                page: 1,
                limit: 10,
                total: 0,
                number: '',
                promotor_name: '',
                phone: '',
                status: ''
            },
            promotorType:[{
                id: 1,
                name: '其他',
            }, {
                id: 2,
                name: '视频号',
            }, {
                id: 3,
                name: '小商店',
            }],
            statusMap: [{
                id: 1,
                name: '已授权'
            }, {
                id: 2,
                name: '未授权'
            }, {
                id: 3,
                name: '已取消'
            }],
            statusObj:{
                1: '已授权',
                2: '未授权',
                3: '已取消'
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
        async getList(){
            const { searchData } = this
            const data = await getPromoterList(searchData)
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
        importData(item){
            // this.$router.push({ path: '/pushOrderDetail', query: { aid: item.authorizer_appid }})
             this.$router.push("/pushOrderDetail/" + item.authorizer_appid)
        },
        delData(parentId, row){
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
    border-radius:50%;
    margin-right:10px;
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

