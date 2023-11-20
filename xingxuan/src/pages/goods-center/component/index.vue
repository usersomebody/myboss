<template>
    <div>
        <el-card class="good-center box-card">
            <div class="search-bar">
                <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                    <el-form-item label="商品名称">
                        <el-input placeholder="请输入小商店商品名称" v-model="searchData.query" class="input-with-select" clearable @blur="onSearch(1)" @keyup.enter.native="onSearch(1)">
                            <el-select v-model="searchData.query_type" slot="prepend" placeholder="请选择">
                                <el-option label="商品名称" value="0"></el-option>
                                <el-option label="小商店名称" value="1"></el-option>
                                <el-option label="supid" value="2"></el-option>
                                <el-option label="APPID" value="3"></el-option>
                            </el-select>
                            <el-button slot="append" icon="el-icon-search" @click="onSearch(1)"></el-button>
                        </el-input>
                    </el-form-item>
                    <div class="categoryList">
                        <el-form-item label="" >
                            <span v-for="(item, index) in category" :key='index' class="categoryItem" :class="item.cat_id == searchData.cate_ids ? 'active' : ''" @click="switchCatType(item.cat_id)">{{item.name}}</span>
                        </el-form-item>
                    </div>
                    <div class="filter-content">
                        <div class="filter-content-item">
                            <div class="filter-content-title">价格区间</div>
                            <div>
                                <el-input v-model="searchData.min_price" placeholder="￥ 最小价格" type="number" clearable style="width:120px;font-size:12px;" @blur="getPrice('min_price')"></el-input>
                                <span class="line">-</span>
                                <el-input v-model="searchData.max_price" placeholder="￥ 最大价格" type="number" clearable style="width:120px;font-size:12px;" @blur="getPrice('max_price')"></el-input>
                            </div>
                        </div>
                        <div class="filter-content-item">
                            <div class="filter-content-title">最低佣金</div>
                            <div>
                                <el-input v-model="searchData.min_value" placeholder="￥" style="width:100px;font-size:12px;" clearable @blur="onSearch(1)" @keyup.enter.native="onSearch(1)"></el-input>
                            </div>
                        </div>
                        <div class="filter-content-item">
                            <div class="filter-content-title">最低佣金比例</div>
                            <div>
                                <el-input v-model="searchData.min_radio" placeholder="%" style="width:100px;font-size:12px;"  clearable @blur="onSearch(1)"  @keyup.enter.native="onSearch(1)"></el-input>
                            </div>
                        </div>
                        <div class="filter-content-item">
                            <div class="filter-content-title">排序</div>
                            <div class="filter-content-action">
                                <span class="font-s-9f8" :class="searchData.sort_type == 1 ? 'active' : ''" @click="switchTab(1)">价格<i class="el-icon-top"></i></span>
                                <el-divider direction="vertical"></el-divider>
                                <span class="font-s-9f8" :class="searchData.sort_type == 2 ? 'active' : ''" @click="switchTab(2)">价格<i class="el-icon-bottom"></i></span>
                                <el-divider direction="vertical"></el-divider>
                                <span class="font-s-9f8" :class="searchData.sort_type == 5 ? 'active' : ''" @click="switchTab(5)">佣金<i class="el-icon-bottom"></i></span>
                                <el-divider direction="vertical"></el-divider>
                                <span class="font-s-9f8" :class="searchData.sort_type == 3 ? 'active' : ''" @click="switchTab(3)">佣金比例<i class="el-icon-bottom"></i></span>
                            </div>
                        </div>
                        <div class="filter-content-item">
                            <div class="filter-content-title" style="height:16px;"></div>
                            <div>
                                <el-checkbox v-model="searchData.has_coupon" label="1" @change="onSearch(1)">含联盟券</el-checkbox>
                            </div>
                        </div>
                        <div class="fillter-btn">
                            <el-button type="primary" @click="onSearch(1)">查询</el-button>
                            <el-button type="primary" @click="restSearch">重置</el-button>
                        </div>
                    </div>
                </el-form>
            </div>
            <div class="table-content">
                <div class="action-header">
                    <div class="action-list">
                        <el-button v-if="multipleSelection.length" type="text" @click="bindProduct">加入小程序</el-button>
                    </div>
                </div>
                <el-table
                    :data="tableData"
                    ref="multipleTable"
                    border
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <el-table-column
                    type="selection"
                    :selectable="canSelect" 
                    width="55">
                    </el-table-column>
                    <el-table-column
                    label="商品名称"
                    align="center"
                    width="400">
                    <template slot-scope="scope">
                        <div class="flex-v-c">
                            <img style="width:45px;height:45px;margin-right:10px;" :src="scope.row.head_img"/>
                            <p class="text-left">{{scope.row.title}}</p>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="shop_name"
                    label="店铺名称"
                    align="center"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="productId"
                    label="SupId"
                    align="center"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="价格"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.has_coupon == 1 ? scope.row.discount_price_float : scope.row.min_price_float}}</span>
                        <span v-if="scope.row.has_coupon == 1" class="line-through">{{scope.row.min_price_float}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="commission_value_float"
                    label="佣金"
                    show-overflow-tooltip>
                    </el-table-column>
                   <el-table-column
                    align="center"
                    prop="commission_radio"
                    label="佣金比例"
                    show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>{{scope.row.commission_radio}}%</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="status"
                    label="操作"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="font-size:10px;" class="action-color" :class="scope.row.type_use == '-1' ? 'act-btn-disable' : ''" @click="binShop(scope.row)">加入小程序</span>
                    </template>
                    </el-table-column>
  
                </el-table>
                <div class="pagination-bar">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 25, 50]"
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
import { mapState } from 'vuex'
import { getCateList, getLeagueList, bindLeagueProduct  } from '@/api/permission'

export default {
    data() {
        return {
            searchData: {
                page: 1,
                limit: 10,
                total: 0,
                number: '',
                query: '',
                query_type: '0',
                max_price: '',
                min_price: '',
                min_radio: '',
                min_value: '',
                has_coupon: '',
                cate_ids: 0
            },
            category: [],
            tableData: [],

            editId: '',
            multipleSelection: [],
            multipleSelectId: [],
            sort_type: 1

        }
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    mounted() {

    },
    created() {
        this.getList()
        this.getCatList()
    },
    methods: {
        async getList(){
            const { searchData } = this
            const data = await getLeagueList({...searchData,has_coupon:searchData.has_coupon ? 1 : ''})
            this.tableData = data.list
            this.searchData.total = data.total
        },
        // 商品类目
        async getCatList(){
            const data = await getCateList()
            data.unshift({
                cat_id:0,
                name: '全部'
            })
            this.category = data
        },
        // 导入商品
        async binShop(item){
            const { productId, type_use } = item
            if(type_use == '-1'){
                this.$message({
                    type: 'error',
                    message: '该商品已导入'
                });
                return
            }
            let param = {
                product_ids: productId
            }
            const data = await bindLeagueProduct(param)
            this.$message({
                type: 'success',
                message: '导入成功'
            });
        },
        async bindProduct(){
            const { multipleSelectId } = this 
            let param = {
                product_ids: multipleSelectId.join(',')
            }
            const data = await bindLeagueProduct(param)
            this.$message({
                type: 'success',
                message: '导入成功'
            });
            this.onSearch(1)
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            let multipleSelectId = val.map((item)=>{
                return item.productId
            })
            this.multipleSelectId = multipleSelectId
        },
        restSearch(){
            this.searchData = {
                page: 1,
                limit: 10,
                total: 0,
                number: '',
                query: '',
                query_type: '0',
                max_price: '',
                min_price: '',
                min_radio: '',
                min_value: '',
                has_coupon: '',
                cate_ids: 0
            }
            this.onSearch(1)
        },
        onSearch(page){
            this.searchData.page = page
            this.getList()
        },
        searchList(id){
            this.searchData.categoryId = id
        },
        search_fincerecord() {
            this.onSearch(1)
        },
        getPrice(type){
            const { searchData } =  this
            if(!searchData.min_price || !searchData.max_price){
                return
            }
            if(Number(searchData.max_price) < Number(searchData.min_price) || Number(searchData.max_price) == Number(searchData.min_price)){
                this.$message({
                    type: 'warning',
                    message: '最大最小值不合法'
                });
                this.searchData[type] = ''
                return
            }
            this.search_fincerecord()
        },
        handleSizeChange(val) {
            this.searchData.limit = val = val
            this.onSearch(1)
        },
        handleCurrentChange(val) {
            this.searchData.page = val
            this.onSearch(val)
        },
        switchTab(type){
            this.searchData.sort_type = type
            this.onSearch(1)
        },
        switchCatType(id){
            this.searchData.cate_ids = id
            this.search_fincerecord()
            
        },
        rowStyle({row, rowIndex}){
            if(row.type_use == 1){
                return 'can_use_class';
            }else{
                return 'disable_class';
            }
            return '';
        },
        canSelect(row,index){
            if(row.type_use == '-1'){
                return false
            }
            return true  
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
    // justify-content: center;
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
.categoryItem{
    margin-right:30px;
}
.categoryItem.active{
    color: #409EFF;
}
.categoryList{
    padding: 10px 0;
    border-bottom:1px solid #EFEFEF;
}
.filter-content{
    width:100%;
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
.act-btn-disable{
    color:#E8E8E8!important;
}
.fillter-btn{
    width:40%;
    display:flex;
    align-items: center;
    justify-content: flex-end;
}
.line-through{
    text-decoration: line-through;
    font-size:12px;
    margin-left:10px;
    color:rgb(179, 179, 179);
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
.good-center .el-select .el-input {
    width: 130px;
}
.good-center .input-with-select .el-input-group__prepend {
    background-color: #fff;
}
.el-table .disable_class{
    background:#E8E8E8!important;
}

/* .el-button--primary {
    color: #FFF;
    background-color: #FE2F4F;
    border-color: #FE2F4F;
}
.el-button--goon.is-active,
.el-button--goon:active {
  background: #20B2AA;
  border-color: #20B2AA;
  color: #fff;
}

.el-button--goon:focus,
.el-button--goon:hover {
  background: #48D1CC;
  border-color: #48D1CC;
  color: #fff;
}

.el-button--goon {
  color: #FFF;
  background-color: #20B2AA;
  border-color: #20B2AA;
} */
</style>

