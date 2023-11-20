<template>
    <div>
        <el-card class="box-card">
            <div class="search-bar">
                <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                    <el-form-item class="block" label="创建日期">
                    <el-date-picker
                        v-model="searchData.payTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="search_fincerecord">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="佣金状态" class="m-l-20">
                        <el-select v-model="searchData.commission_status" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in commissionStatus"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品ID" class="m-l-20">
                         <!-- v-model="searchValue" 
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod" -->
                        <el-cascader 
                        :props="props" 
                        :options="storeList" 
                        @change="getChildData" 
                       ></el-cascader>
                    </el-form-item>
                    <el-form-item label="平台返佣" class="m-l-20">
                        <el-select v-model="searchData.is_extra_bonus" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in extraBonus"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
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
                            <!-- <img :src="item.head_img" class="parent-logo"/> -->
                            <span class="margin-r-10 title-color">订单编号：{{item.order_id}}</span>
                            <span class="margin-r-10 title-color">下单时间：{{item.pay_time}}</span>
                        </div>
                        <el-table
                            ref="multipleTable"
                            :data="item.product"
                            border
                            tooltip-effect="dark"
                            style="width: 100%">
                            <el-table-column
                            :label="index == 0 ? '商品信息' : '' "
                            width="700">
                            <template slot-scope="scope">
                                <div class="flex-v-b">
                                    <div class="flex-v" style="width:90%;">
                                        <img :src="scope.row.thumb_img" class="child-log"/>
                                        <div>
                                            <p class="one-line">{{scope.row.title}}</p>
                                            <p>{{item.shop_name}}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p style="white-space:nowrap;">{{scope.row.price}}</p>
                                        <p>x1</p>
                                    </div>
                                </div>
                            </template>
                            </el-table-column>
                            <el-table-column
                            :label="index == 0 ? '推广位' : '' "
                            prop="promotion_source_name"
                            align="center">
                            </el-table-column>
                            <el-table-column
                            :label="index == 0 ? '成交价' : '' "
                            prop="price"
                            align="center">
                            </el-table-column>
                            <el-table-column
                            :label="index == 0 ? '佣金比例' : '' "
                            prop="ratio"
                            align="center">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.ratio}}%
                                </div>
                            </template>
                            </el-table-column>
                            <el-table-column
                            :label="index == 0 ? '佣金状态' : '' "
                            prop="commission_status"
                            align="center">
                                <template slot-scope="scope">
                                    <div>
                                        {{commissionStatusObj[scope.row.commission_status]}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                            :label="index == 0 ? '预估佣金' : '' "
                            prop="estimated_commission"
                            align="center">
                            </el-table-column>
                            <el-table-column
                            :label="index == 0 ? '平台返佣' : '' "
                            prop="system_price"
                            align="center">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="pagination-bar">
                    <div class="order-info flex-v-c">
                        <p>共{{dataOrder.total}}个订单</p>
                        <p class="order-total-money">订单总价：￥{{dataOrder.price_all}}</p>
                        <p>平台返佣：￥{{dataOrder.system_price}}</p>
                    </div>
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
import { getCustomerList, getPromoterOrder, getAllStore, getProductList } from '@/api/permission'
import { goodsRenderList } from '../../goods-manage/config'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            searchData: {
                authorizer_appid: '',
                page: 1,
                limit: 10,
                total: 0,
                payTime: [],
                product_id: '',
                shop_appid: '',
                commission_status: '',
                is_extra_bonus: ''
            },
            extraBonus:[{
                id: 1,
                name: '支持'
            }, {
                id: 2,
                name: '不支持'
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
            commissionStatus:[{
                id: 'SETTLEMENT_PENDING',
                name: '待结算'
            }, {
                id: 'SETTLEMENT_SUCCESS',
                name: '已结算'
            }, {
                id: 'SETTLEMENT_CANCELED',
                name: '取消结算'
            }],
            commissionStatusObj:{
                'SETTLEMENT_PENDING': '待结算',
                'SETTLEMENT_SUCCESS': '已结算',
                'SETTLEMENT_CANCELED': '取消结算'
            },
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
            dataOrder: {
                price_all: '',
                system_price: '',
                total: ''
            },
            searchValue: '',
            storeList:[],
            props: {
                lazy: true,
                // multiple: true,
                async lazyLoad (node, resolve) {
                    const { level } = node;
                    let param = {
                        authorizer_appid: node.data ? node.data.authorizer_appid ? node.data.authorizer_appid : '' : '',
                        limit: 100
                    }
                    if(!node.data || !node.data.authorizer_appid){
                        return
                    }
                    let nodes = []
                    let departments = []
                    const departmentData = await getProductList(param)
                    departments = departmentData.list.map((item)=>{
                            let obj = item
                            obj.leaf = 1
                            obj.value = item.product_id
                            obj.label = item.title.slice(0,8) + '...'
                            return obj
                    })
                    departments.unshift({
                        leaf: 1,
                        value: '0',
                        label: '全部'
                    })
                    resolve([...nodes, ...departments]);
                }
            }
        }
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    mounted() {

    },
    created() {
        this.searchData.authorizer_appid = this.$route.params.aid || ''
        this.getList()
        this.getStore()
    },
    methods: {
        // 店铺数据
        async getStore(){
            let param = {
                limit: 20
            }
            const store = await getAllStore(param)
            const departments = store.list.map((item)=>{
                    let obj = item
                    obj.leaf = store.list.length ? '' : 1
                    obj.value = item.authorizer_appid
                    obj.label = item.store_name
                    return obj
            })
            this.storeList = departments
        },
        async getList(){
            const { searchData } = this
            searchData.start_time = searchData.payTime.length ? searchData.payTime[0] : ''
            searchData.end_time = searchData.payTime.length ? searchData.payTime[1] : ''
            const data = await getPromoterOrder(searchData)
            this.dataOrder = {
                price_all: data.price_all,
                system_price: data.system_price,
                total: data.total
            }
            this.tableData = data.list
            this.searchData.total = data.total
        },
        async remoteMethod(){
            // const departmentData = await getProductList(param)
            //     departments = departmentData.list.map((item)=>{
            //             let obj = item
            //             obj.leaf = 1
            //             obj.value = item.product_id
            //             obj.label = item.title.slice(0,8) + '...'
            //             return obj
            //     })
            // this.storeList = departments
        },
        getChildData(value){
            this.searchData.product_id = value[1] == 0 ? '' : value[1]
            this.searchData.shop_appid = value[0]
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
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex % 2 === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
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
    justify-content: space-between;
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
    margin:0 20px;
}
.one-line{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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

