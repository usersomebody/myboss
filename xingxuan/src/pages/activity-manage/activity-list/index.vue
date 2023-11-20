<template>
    <div>
        <el-card class="box-card">
            <div class="search-bar">
                <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                    <el-form-item class="block" label="活动时间">
                    <el-date-picker
                        v-model="searchData.createTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="search_fincerecord">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="活动名称" class="m-l-20">
                        <el-input v-model="searchData.name" placeholder="请输入" @keyup.enter.native="onSearch(1)" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="活动状态" class="m-l-20">
                        <el-select v-model="searchData.status" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in statusMap"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="" @click="onSearch">
                    <!-- <el-button type="primary">重置</el-button> -->
                    <el-button type="primary">查询</el-button>
                </div>
            </div>
            <div class="table-content">
                <div class="action-header addGoodsBtn">
                    <el-button type="primary" @click="addGoods">新建</el-button>
                </div>
                <div class="">
                    <el-table
                        ref="multipleTable"
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        @row-click="handleRowClick"
                        style="width: 100%">
                        <el-table-column
                        label="活动banner"
                        align="center"
                        width="200">
                        <template slot-scope="scope">
                            <div class="flex-v-c">
                                <img :src="scope.row.banner_img" style="width:180px;height:90px;"/>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="活动名称"
                        align="center"
                        width="200">
                        <template slot-scope="scope">
                            <div class="flex-v-c">
                                <p>{{scope.row.name}}</p>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="type"
                        label="类型"
                        align="center"
                        width="220">
                        <template slot-scope="scope">
                            <div class="flex-v-c">
                                <p>{{scope.row.type == 1 ? '产品活动专区' : '跳转链接'}}</p>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="effective_time_name"
                        label="活动时间"
                        align="center"
                        width="340">
                        <template slot-scope="scope">
                            <p>{{scope.row.effective_time_name}} ~ {{scope.row.invalid_time_name}}</p>
                        </template>
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="status"
                        label="状态"
                        width="100"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span style="font-size:10px;">{{statusObj[scope.row.status]}}</span>
                        </template>
                        </el-table-column>
                         <el-table-column
                        prop="create_time_name"
                        label="创建时间"
                        align="center"
                        width="170">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        label="操作"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="action-color" @click.stop="delData(scope.row)">删除</span>
                            <span style="margin:0 10px;" class="action-color" @click.stop="importData(scope.row)">关联商品</span>
                            <span class="action-color" v-if="scope.row.status != 3 " @click.stop="activityOver(scope.row, 3)">结束活动</span>
                            <span class="action-color" v-if="scope.row.status == 3 " @click.stop="activityOver(scope.row, 1)">重新开启</span>
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
        <!-- 导入商品 -->
        <el-dialog
        width="70%"
        :title="dialogSelectTitle"
        :visible.sync="innerVisible"
        @close="onDialogClose(1)"
        :lock-scroll="true">
        <div>
            <!-- 公共可操作列表 -->
            <commonDialogTable
                v-if="showTable"
                :table-data-api="dialofgoodsapi"
                :table-render-list="tableRenderList"
                :table-type="'multipleTable'"
                :goods-id="goodsId"
                :act-id="actId"
                :act-type="2"
                @updateList="search_fincerecord"
                @checkChildItem="childCheckData"
                @hiddenTable="hiddenTable"/>
        </div>
        </el-dialog>
        <!-- 商品列表 -->
        <el-dialog
        width="70%"
        :title="dialogGoodsTitle"
        :visible.sync="goodsInnerVisible"
        @close="onDialogClose(2)"
        :lock-scroll="true">
        <div>
            <!-- 公共可操作列表 -->
            <commonDialogGoods
                v-if="showGoodsTable"
                :table-data-api="dialofgoodsapi"
                :table-render-list="tableGoodsRenderList"
                :table-type="'singleTable'"
                :act-id="actId"
                :update-data="updateData"
                @showInnerDialog="showInnerDialog"
                @hiddenGoodsTable="hiddenGoodsTable"/>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import { getProductList, activityAdd, activityList, activityEdit, activityAction, getLeagueList } from '@/api/permission'
import { goodsRenderList, selfGoodsRenderList  } from '../../goods-manage/config'
import commonDialogTable from '@/components/common-dialog-table'
import commonDialogGoods from '@/components/common-dialog-goods'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            dialofgoodsapi:getProductList,
            dialogGoodsTitle:'关联商品',
            goodsInnerVisible: false,
            dialofapi:getLeagueList,
            tableRenderList: goodsRenderList,
            tableGoodsRenderList: selfGoodsRenderList,
            dialogSelectTitle: '导入商品',
            showTable: false,
            showGoodsTable: false,
            innerVisible: false,
            searchData: {
                page: 1,
                limit: 10,
                total: 0,
                name: '',
                status: '',
                createTime: []
            },
            statusMap: [{
                id: 1,
                name: '正常'
            }, {
                id: 2,
                name: '禁用'
            }, {
                id: 3,
                name: '已结束'
            }, {
                id: 9,
                name: '删除'
            }],
            statusObj:{
                1: '正常',
                2: '禁用',
                3: '已结束',
                9: '删除'
            },
             tableData: [],

            editId: '',
            multipleSelection: [],
            multipleSelectId: [],
            filterType: 1,
            goodsId: '',
            actId: '',
            updateData: 1
        }
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    components:{
        commonDialogTable,
        commonDialogGoods
    },
    mounted() {

    },
    created() {
        this.getList()
    },
    methods: {

        async getList(){
            const { searchData } = this
            searchData.effective_time = searchData.createTime.length ? searchData.createTime[0] : ''
            searchData.invalid_time = searchData.createTime.length ? searchData.createTime[1] : ''
            const data = await activityList(searchData)
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
         getPrice(type){
            const { searchData } =  this
            if(!searchData.minPrice || !searchData.maxPrice){
                return
            }
            if(Number(searchData.maxPrice) < Number(searchData.minPrice) || Number(searchData.maxPrice) == Number(searchData.minPrice)){
                this.$message({
                    type: 'warning',
                    message: '最大最小值不合法'
                });
                this.searchData[type] = ''
                return
            }
        },
        handleSizeChange(val) {
            this.searchData.limit = val = val
            this.onSearch(1)
        },
        handleCurrentChange(val) {
            this.searchData.page = val
            this.onSearch(val)
        },
        onDialogClose(type){
            if(type == 1){
                this.showTable = false
                this.innerVisible = false
            }else{
                this.goodsInnerVisible = false
                this.showGoodsTable = false
            }
        },
        importData(item){
            this.actId = item.id
            this.updateData = 1
            this.goodsInnerVisible = true
            this.showGoodsTable = true
        },
        showInnerDialog(){
            this.showTable = true
            this.innerVisible = true
            this.updateData = 1
        },
        hiddenGoodsTable(){
            this.goodsInnerVisible = false
            this.showGoodsTable = false
        },
        hiddenTable(key){
            this.showTable = false
            this.innerVisible = false
            this.updateData = 2
            if(key == 'sure'){
                // 更新店铺自身数据列表
                this.onSearch(1)
            }
        },
        childCheckData(data){
            this.detailTableData = data
            let goods_id = data.map((item)=>{
                return item.id
            }).join(',')
            this.goodsId = goods_id
        },
        addGoods(){
            this.$router.push({name: 'activityAdd'})
        },
        activityOver(row, status){
            let param = {
                    type: 3,
                    id: row.id,
                    product_id: row.product_ids,
                    activity_status: status
                }
                this.setActivity(param)
        },
        delData(row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    let param = {
                        type: 1,
                        id: row.id,
                        product_id: row.product_ids,
                        activity_status: ''
                    }
                    this.setActivity(param)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
            });
        },
        async setActivity(param){
            const data = await activityAction(param)
            this.$message({
                type: 'success',
                message: '操作成功'
            });
            this.onSearch(1)
        },
        handleRowClick(row){
            localStorage.setItem('activityInfo', JSON.stringify(row))
            this.addGoods()
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
    justify-content: center;
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

