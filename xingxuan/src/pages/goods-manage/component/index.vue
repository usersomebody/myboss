<template>
    <div>
        <el-card class="box-card">
            <el-tabs v-model="searchData.status" @tab-click="handleClick">
                <el-tab-pane v-for="(item, index) in typeList" :key="index" :label="item.name + '(' + item.num + ')'" :name="item.id"></el-tab-pane>
            </el-tabs>
            <div class="search-bar">
                <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                    <el-form-item label="商品编号">
                        <el-input v-model="searchData.product_id" placeholder="请输入" clearable @keyup.enter.native="onSearch(1)"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" class="m-l-20">
                        <el-input v-model="searchData.title" placeholder="请输入" clearable @keyup.enter.native="onSearch(1)"></el-input>
                    </el-form-item>
                    <el-form-item label="价格区间" class="m-l-20">
                        <el-input v-model="searchData.min_price" placeholder="￥ 最小价格" type="number" clearable style="width:140px" @blur="getPrice('min_price')"></el-input>
                        <span class="line">-</span>
                        <el-input v-model="searchData.max_price" placeholder="￥ 最大价格" type="number" clearable style="width:140px" @blur="getPrice('max_price')"></el-input>
                    </el-form-item>
                    <el-form-item v-if="is_manager == 2" label="小商店" class="m-l-20">
                        <el-select v-model="searchData.store_name" clearable  filterable @change="search_fincerecord">
                            <el-option
                            v-for="item in miniStoreList"
                            :key="item.authorizer_appid"
                            :label="item.store_name"
                            :value="item.store_name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div>
                        <el-form-item label="商品类目" class="">
                            <el-select
                                v-model="searchData.cate_name"
                                multiple
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :remote-method="remoteMethod"
                                :loading="loading">
                                <el-option
                                v-for="item in cate_list"
                                :key="item.cat_id"
                                :label="item.name"
                                :value="item.cat_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="is_manager == 2" label="认证状态" class="m-l-20">
                            <el-select v-model="searchData.is_auth" clearable @change="search_fincerecord">
                                <el-option
                                v-for="item in statusMap"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="m-l-20">
                            <div class="" >
                                <el-button type="primary" @click="onSearch">查询</el-button>
                                <el-button type="primary" @click="restSearch">重置</el-button>
                            </div>
                        </el-form-item>
                        
                    </div>
                </el-form>
            </div>
            <div class="table-content">
                <div class="action-header">
                    <div class="action-list">
                        <div v-if="is_manager == 2 && multipleSelection.length">
                            <el-button type="text" @click="examineData(1)">通过</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" @click="examineData(2)">拒绝</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" @click="delData">删除</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" @click="showSetCommission">设置平台返佣</el-button>
                        </div>
                        <el-button v-else-if="multipleSelection.length" type="text" @click="showSetCommission">领样设置</el-button>
                    </div>
                    <el-button v-if="is_manager == 1" type="primary" style="float:left;margin-bottom:20px;" @click="importData">导入商品</el-button>
                </div>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    label="商品名称"
                    align="center"
                    width="400">
                    <template slot-scope="scope">
                        <div class="flex-v-c">
                            <img style="width:45px;height:45px;margin-right:10px;" :src="scope.row.head_img_name"/>
                            <p class="text-left">{{scope.row.title}}</p>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="product_id"
                    label="SupId"
                    align="center"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="min_price_float"
                    label="价格"
                    >
                    </el-table-column>
                    <el-table-column
                    v-if="is_manager == 1"
                    align="center"
                    prop="commission_value_float"
                    label="佣金"
                    >
                    </el-table-column>
                    <el-table-column
                    v-if="is_manager == 2"
                    align="center"
                    prop="shop_name"
                    label="小商店"
                    >
                    </el-table-column>
                    <el-table-column
                    v-if="is_manager == 2"
                    align="center"
                    prop="is_auth"
                    label="认证状态"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row.is_auth == 1 ? '已认证' : '未认证'}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="免费领样"
                    >
                    <template slot-scope="scope">
                        <span @click="showSetSample(scope.row)">{{scope.row.is_sample_free == 1 && scope.row.sell_order_num > 0 ? '≥' + scope.row.sell_order_num : scope.row.is_sample_free == 1 ? '支持' : '不支持'}}</span>
                        <i v-if="is_manager == 1"  @click="showSetSample(scope.row)" class="el-icon-edit"></i>
                    </template>
                    </el-table-column>
                    <el-table-column
                    v-if="is_manager == 1"
                    align="center"
                    label="免费领样库存"
                    >
                    <template slot-scope="scope">
                        <span v-if="!scope.row.f_s_s">{{scope.row.is_sample_free == 1 ? scope.row.free_sample_stock : '-'}}</span>
                        <el-input :ref="scope.row.id + '-' + 1" v-if="scope.row.f_s_s" v-model="scope.row.free_sample_stock" placeholder="请输入" clearable :autofocus="true" @blur="getStockVal(scope.row, 1)" style="width:100px;"></el-input>
                        <i v-if="scope.row.is_sample_free == 1 && !scope.row.f_s_s" class="el-icon-edit" @click="updateStockVal(scope.row, 1)"></i>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="成本领样"
                    >
                    <template slot-scope="scope">
                        <span @click="showSetSample(scope.row)">{{scope.row.is_sample_buy == 1 ? '支持' : '不支持'}}</span>
                        <i v-if="is_manager == 1"  @click="showSetSample(scope.row)" class="el-icon-edit"></i>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    v-if="is_manager == 1"
                    prop="costStock"
                    label="成本领样库存"
                    >
                    <template slot-scope="scope">
                        <span v-if="!scope.row.b_s_s">{{scope.row.is_sample_buy == 1 ? scope.row.buy_sample_stock : '-'}}</span>
                        <el-input :ref="scope.row.id + '-' + 2" v-if="scope.row.b_s_s" v-model="scope.row.buy_sample_stock" placeholder="请输入" clearable :autofocus="true" @blur="getStockVal(scope.row, 2)" style="width:100px;"></el-input>
                        <i v-if="scope.row.is_sample_buy == 1 && !scope.row.b_s_s" class="el-icon-edit" @click="updateStockVal(scope.row, 2)"></i>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    v-if="is_manager == 1"
                    prop="buy_price_float"
                    label="成本价格"
                    >
                    <template slot-scope="scope">
                        <span v-if="!scope.row.b_p_f">{{scope.row.is_sample_buy == 1 ? scope.row.buy_price_float : '-'}}</span>
                        <el-input :ref="scope.row.id + '-' + 3" v-if="scope.row.b_p_f" v-model="scope.row.buy_price_float" placeholder="请输入" clearable :autofocus="true" @blur="getStockVal(scope.row, 3)" style="width:100px;"></el-input>
                        <i v-if="scope.row.is_sample_buy == 1 && !scope.row.b_p_f" class="el-icon-edit" @click="updateStockVal(scope.row, 3)"></i>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="check_status"
                    label="审核状态"
                    width="240"
                    >
                    <template slot-scope="scope">
                        <span>{{approveStatusMap[scope.row.check_status]['name']}}</span>
                        <el-tooltip v-if="is_manager == 1 && scope.row.check_status == 3" class="item" effect="dark" :content="scope.row.refusal_cause + ''" placement="bottom">
                            <!-- <i class="el-icon-s-flag" style="margin:0 10px;"></i> -->
                            <img src="https://qizhifan.oss-cn-hangzhou.aliyuncs.com/xingxuan/public/applet/reason.png" style="width:14px;height:14px;margin:0 10px;"/>
                        </el-tooltip>
                        <span v-if="is_manager == 1 && scope.row.check_status == 3" class="action-color" style="font-size:10px;" @click="restSubData(scope.row)">重新提交</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    v-if="is_manager == 2"
                    label="是否支持平台返佣"
                    >
                    <template slot-scope="scope">
                        <el-switch :value="scope.row.is_extra_bonus == 1 ? true : false" @change="actionMessage(scope.row)"></el-switch>
                    </template>
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
            </div>
        </el-card>
        <!-- 设置平台返佣 and  领样设置 -->
        <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
        @close="onDialogClose()">
        <!-- 设置平台返佣 -->
        <div v-if="is_manager == 2" class="flex-v">
            <div style="margin-right:40px;">是否支持平台返佣</div>
            <div>
                <el-radio v-model="commission_radio" label="1">支持</el-radio>
                <el-radio v-model="commission_radio" label="2">不支持</el-radio>
            </div>
        </div>
        <!-- 设置领样配置 -->
        <div v-if="is_manager == 1">
            <div class="common-radio-box">
                <div class="flex-v">
                    <div style="margin-right:40px;">免费领样</div>
                    <div>
                        <el-radio v-model="freeSample" label="1">支持</el-radio>
                        <el-radio v-model="freeSample" label="2">不支持</el-radio>
                    </div>
                </div>
                <div class="flex-v">
                    <span>推客账号近30天销量不小于</span>
                    <el-input v-model="freeLimit" placeholder="" clearable style="width:100px; margin:10px 20px 0;"></el-input>
                    <span>免费领样</span>
                </div>
                <p class="common-tips">设置免费领样的商品需要在列表填写库存才能生效</p>
            </div>
            <div class="common-radio-box">
                <div class="flex-v">
                    <div style="margin-right:40px;">成本领样</div>
                    <div>
                        <el-radio v-model="costSample" label="1">支持</el-radio>
                        <el-radio v-model="costSample" label="2">不支持</el-radio>
                    </div>
                </div>
                <p class="common-tips">成本领样的订单金额,平台收取10%的服务费;设置成本领样的商品需要填写成本价和库存后才能生效</p>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitData">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 商品列表 -->
         <el-dialog
        width="70%"
        :title="dialogSelectTitle"
        :visible.sync="innerVisible"
        :lock-scroll="true">
        <div>
            <!-- 公共可操作列表 -->
            <commonDialogTable
                v-if="showTable"
                :table-data-api="dialofapi"
                :table-render-list="tableRenderList"
                :table-type="'multipleTable'"
                :goods-id="goodsId"
                @updateList="search_fincerecord"
                @checkChildItem="childCheckData"
                @hiddenTable="hiddenTable"/>
        </div>
    </el-dialog>
    </div>
</template>

<script>
import { getCateList, getProductList, getLeagueList, actionProducts, productSetStock, productSetRule, productSetSampleRest, getAllStore  } from '@/api/permission'
import { statusMap, approveStatusMap, goodsRenderList } from '../config'
import commonDialogTable from '@/components/common-dialog-table'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            dialofapi:getLeagueList,
            tableRenderList: goodsRenderList,
            dialogSelectTitle: '导入商品',
            showTable: false,
            innerVisible: false,
            dialogTitle: '',
            dialogVisible: false,
            approveStatusMap,
            miniStoreList: [],
            statusMap,
            cate_list:[],
            typeList: [{
                id: '0',
                name: '全部',
                num: 0,
            }, {
                id:'1',
                name: '待审核',
                num: 0,
            }, {
                id: '2',
                name: '已通过',
                num: 0,
            }, {
                id: '3',
                name: '已拒绝',
                num: 0,
            }],
            activeName: '0',
            searchData: {
                page: 1,
                limit: 10,
                total: 0,
                number: '',
                title: '',
                max_price: '',
                min_price: '',
                store_name: '',
                cate_name: '',
                is_auth: '',
                status: ''
            },
             tableData: [],

            freeStock: '1',
            costStock: '2',
            costPrice: '3',
            editId: '',
            multipleSelection: [],
            multipleSelectId: [],
            commission_radio: '1',
            freeSample: '1',
            costSample: '1',
            freeLimit: '',
            settingId: '',
            loading: false,
            // 弹层数据
            detailTableData: [],
            goodsId: '',
            sampleActionType: 1
        }
    },
    components:{
        commonDialogTable
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    mounted() {

    },
    created() {
        this.getList()
        this.getStore()
    },
    methods: {
        restSearch(){
            this.searchData = {
                page: 1,
                limit: 10,
                total: 0,
                number: '',
                title: '',
                max_price: '',
                min_price: '',
                store_name: '',
                cate_name: '',
                is_auth: '',
                status: '0'
            }
            this.onSearch(1)
        },
        handleClick(tab, event) {
            console.log(tab, event);
            const { searchData } = this
            for(let key in searchData){
                if(key != 'status' && key != 'limit' && key != 'total'){
                    searchData[key] = ''
                }
            }
            this.searchData = searchData
            this.onSearch(1)
        },
        async getList(){
            const { searchData } = this
            const data = await getProductList(searchData)
            this.typeList[0].num = data.all_count || 0
            this.typeList[1].num = data.un_count || 0
            this.typeList[2].num = data.pass_count || 0
            this.typeList[3].num = data.refuse_count || 0
            data.list.forEach((item)=>{
                item.b_p_f = false
                item.b_s_s = false
                item.f_s_s = false
            })
            this.tableData = data.list
            this.searchData.total = data.total
        },
        // 店铺数据
        async getStore(){
            const store = await getAllStore()
            this.miniStoreList = store.list
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
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            let multipleSelectId = val.map((item)=>{
                return item.id
            })
            this.multipleSelectId = multipleSelectId
        },
        actionMessage(row){
            // 仅在关闭时提示 测试要求
            if(row.is_extra_bonus == 1){
                this.$confirm('关闭以后，会对之前已经产生过的订单数据有所影响!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.getSwitchVal(row)
                }).catch(() => {
                       
                });
            }else{
                this.getSwitchVal(row)
            }
            
        },
        async getSwitchVal(row){
            let param = {
                id: [row.id],
                type: 4,
                refusal_cause: '',
                is_extra_bonus: row.is_extra_bonus == 1 ? 2 : 1
            }
            const data = await actionProducts(param)
            this.$message({
                type: 'success',
                message: '操作成功!'
            });
            this.onSearch(1)
        },
        async setSample(param){
            
           const data = await actionProducts(param)
           this.$message({
                type: 'success',
                message: param.type == 3 ? '删除成功!' : '操作成功!'
           })
           this.onSearch(1) 
        },
        examineData(type){
            if(!this.multipleSelectId.length){
                this.$message({
                    type: 'error',
                    message: '请勾选操作数据!'
                });
                return
            }
            // type 1 通过 2 拒绝 
            if(type == 2){
                this.$prompt('', '拒绝理由', {
                    dangerouslyUseHTMLString: true,
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value})=>{
                    let param = {
                        id: this.multipleSelectId,
                        type: 2,
                        refusal_cause: value
                    }
                    this.setSample(param)
                }).catch(()=>{

                });
            }else{
                let param = {
                        id: this.multipleSelectId,
                        type: 1,
                        refusal_cause: ''
                    }
                this.setSample(param)
            }
        },
        // 删除
        delData(){
            if(!this.multipleSelectId.length){
                this.$message({
                    type: 'error',
                    message: '请勾选操作数据!'
                });
                return
            }
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    let param = {
                        id: this.multipleSelectId,
                        type: 3,
                        refusal_cause: ''
                    }
                    this.setSample(param)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
            });
        },
        // 显示设置佣金弹窗
        showSetCommission(){
            this.sampleActionType = 1
            this.dialogTitle = this.is_manager == 2 ? '设置平台返佣' : '领样设置'
            this.dialogVisible = true
        },
        // 显示领样弹窗
        showSetSample(row){
            if(this.is_manager == 2){
                return
            }
            if(row.check_status != 2){
                this.$message({
                    type: 'error',
                    message: '商品未审核通过设置失败'
                });   
                return
            }
            this.editId = row.id
            this.freeSample = row.is_sample_free + '' || '1'
            this.costSample = row.is_sample_buy + '' || '1'
            this.freeLimit = row.sell_order_num || ''
            this.sampleActionType = 2
            this.dialogTitle = '领样设置'
            this.dialogVisible = true
        },
        onDialogClose(){
            this.freeSample = '1'
            this.costSample = '1'
            this.freeLimit = ''
            this.editId = ''
            this.showTable = false

        },
        // 设置领样
        async setSampleAccount(){
            const { editId, freeSample, costSample, freeLimit, multipleSelectId, sampleActionType} = this
            let param = {
                id: sampleActionType == 2 ? [editId] : multipleSelectId,
                is_sample_buy: costSample,
                is_sample_free: freeSample,
                sell_order_num: freeLimit,
            }
            const data = await productSetStock(param)
            this.$message({
                type: 'success',
                message: '设置成功'
            }); 
            this.onSearch(1)
        },
        submitData(){
            if(this.is_manager == 2){
                let param = {
                    id: this.multipleSelectId,
                    type: 4,
                    refusal_cause: '',
                    is_extra_bonus: this.commission_radio
                }
                this.setSample(param)
            }else{
                this.setSampleAccount()
            }
            this.dialogVisible = false
        },
        async getStockVal(row, type){
            const { id, free_sample_stock, buy_sample_stock, buy_price_float, sell_order_num } = row
            let param = {
                id,
                free_sample_stock,
                buy_sample_stock,
                buy_price:buy_price_float,
                sell_order_num,
            }
            const data = await productSetRule(param)
            this.$message({
                type: 'success',
                message: '设置成功'
            });
            this.getList()
            // 成本价格小于等于 价格 - 佣金
        },
        updateStockVal(row, type){
            const { tableData } = this
            // 1 免费领样库存 2 成本领样库存 3 成本价格
            this.editId = row.id
            this.tableData.forEach((item)=>{
                if(type == 1){
                    item.f_s_s = item.id == row.id ? true : false
                    item.b_s_s = false
                    item.b_p_f = false
                }else if(type == 2 ){
                    item.f_s_s = false
                    item.b_s_s = item.id == row.id ? true : false
                    item.b_p_f = false
                }else if(type == 3){
                    item.f_s_s = false
                    item.b_s_s = false
                    item.b_p_f = item.id == row.id ? true : false
                }
            })

            setTimeout(()=>{
                let key = row.id + '-' + type
                this.$refs[key].focus()
            },150)
            
        },
        importData(){
            this.innerVisible = true
            this.showTable = true
        },
        hiddenTable(key){
            this.innerVisible = false
            this.showTable = false
            this.onSearch(1)
        },
        childCheckData(data){
            this.detailTableData = data
            let goods_id = data.map((item)=>{
                return item.productId
            }).join(',')
            this.goodsId = goods_id
        },
        handleSizeChange(val) {
            this.searchData.limit = val = val
            this.onSearch(1)
        },
        handleCurrentChange(val) {
            this.searchData.page = val
            this.onSearch(val)
        },
        async remoteMethod(query) {
            if (query !== '') {
            this.loading = true;
            const data = await getCateList()
                this.loading = false;
                this.cate_list = data
            } else {
            this.cate_list = [];
            }
        },
        async restSubData(item){
            let param = {
                id: item.id,
                type: 1
            }
            const data = await productSetSampleRest(param)
            this.$message({
                type: 'success',
                message: '提交成功'
            });
            this.onSearch(1)
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
.action-color{
    color: #7A90BD;
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
.text-left{
    text-align: left;
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

