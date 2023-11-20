<template>
    <div class="dialog-content">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="商品编号">
                    <el-input v-model="searchData.product_id" placeholder="请输入" clearable @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="商品名称" class="m-l-20">
                    <el-input v-model="searchData.title" placeholder="请输入" clearable @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="价格区间" class="m-l-20">
                    <el-input v-model="searchData.min_price" placeholder="￥ 最小价格" clearable type="number" style="width:140px" @blur="getPrice('min_price')"></el-input>
                    <span class="line">-</span>
                    <el-input v-model="searchData.max_price" placeholder="￥ 最大价格" clearable type="number" style="width:140px" @blur="getPrice('max_price')"></el-input>
                </el-form-item>
                <div>
                    <el-form-item label="商品类目" class="">
                        <el-select
                                v-model="searchData.cate_name"
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
                    <el-form-item class="m-l-20">
                        <div class="" @click="onSearch">
                            <el-button type="primary">查询</el-button>
                        </div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <el-table
        v-loading.body="tableLoading"
        :ref="tableType"
        :data="tableData"
        max-height="400"
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <!-- :row-class-name="rowStyle" -->
        <el-table-column
          key="id"
          v-if="tableType == 'multipleTable'"
          :selectable="canSelect" 
          type="selection">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in renderList"
          :key="item.prop + '' + index"
          :prop="item.prop"
          :label="item.name"
          align="center">
          <template slot-scope="scope">
              <div>
                  <div class="white-space">{{scope.row[item.prop]}}</div>
              </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="searchData.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
      <div v-if="!isNotImport" class="tools-bar">
        <div>已选{{multipleSelection.length}}条</div>
        <div>
            <el-button @click="hiddenListTable('cancle')">取消</el-button>
            <el-button type="primary" @click="hiddenListTable('sure')">导入商品</el-button>
        </div>
      </div>
    </div>
</template>
<script>
import { getCateList, bindLeagueProduct, activityAction} from '@/api/permission'

export default {
    props:[
    'tableDataApi', 
    'tableRenderList', 
    'tableType', 
    'isNotImport',
    'authId',
    'actId',
    'actType',
    'goodsId'],
    data(){
        return{
            searchData: {
                page: 1,
                limit: 10,
                product_id: '',
                title: '',
                min_price: '',
                max_price: '',
                cate_name: '',
                authorizer_appid: ''
            },
            totalRecord: 0,
            tableLoading: false,
            multipleSelection: [],
            renderList: [],
            tableData: [],
            firstStyle:{
                'display': 'flex',
                'justify-content':'space-between',
                'align-items':'center',
                'width':'100%'
            },
            cate_list: [],
            loading: false
        }
    },
    created(){
        this.searchData.authorizer_appid = this.authId
        this.searchData.activity_id = this.actId || ''
        this.searchData.activity_type = this.actType || ''
        this.searchData.status = this.actType ? 2 : ''
        this.renderList = this.tableRenderList.concat()
        this.initList()
    },
    watch:{
        authId(val){
            this.searchData.page = 1
            this.searchData.limit = 10
            this.searchData.authorizer_appid = val
            this.initList()
        }
    },
    methods: {
        async initList() {
            const { searchData } = this
            const data = await this.tableDataApi(searchData)
            this.tableData = data.list
            this.totalRecord = data.total
            if(this.tableType == 'multipleTable' && this.goodsId){
                this.checkTableData()
            }
        },
        async remoteMethod(query) {
            console.log(query)
            if (query !== '') {
            this.loading = true;
            const data = await getCateList({cate_name:query})
                this.loading = false;
                this.cate_list = data
            } else {
            this.cate_list = [];
            }
        },
        handleSizeChange(val) {
            this.searchData.limit = val
            this.searchData.page = 1
            this.onSearch()
        },
        handleCurrentPageChange(val) {
            this.searchData.page = val
            this.onSearch()
        },
        onSearch({ pageNumber = 1 } = {}) {
            
            this.initList()
        },
        
        // 复选
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.$emit('checkChildItem', val)
            console.log('multipleSelection',val)
        },

        async hiddenListTable(key){
            if(key == 'cancle'){
                this.$emit('hiddenTable', key)
                return
            }
            if(key == 'sure' && !this.multipleSelection.length){
                this.$message({
                    type: 'error',
                    message: '请选择导入的商品'
                });
                return
            }
            let param = {
                
            }
            if(!this.actId){
                param.product_ids =  this.multipleSelection.map((item)=>{
                    return item.productId
                }).join(',')
            }
            if(this.actId){
                param.type = 2
                param.id = this.actId
                param.product_id = this.multipleSelection.map((item)=>{
                    return item.product_id
                })
            }
            const data = this.actId ? await activityAction(param) : await bindLeagueProduct(param)
            this.$message({
                type: 'success',
                message: '导入成功'
            });
            this.$emit('hiddenTable', key)
        },
        // 复选框选中
        checkTableData(){
            const self = this
            const { tableData, goodsId } = this
            self.$nextTick(() => {
                tableData.forEach(function(item, idx) {
                    if (goodsId.indexOf(item.id) >= 0) {
                    self.$refs.multipleTable.toggleRowSelection(item, true)
                    }
                })
                self.tableData = tableData
            })
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
        updateTable(){

        },
        rowStyle({row, rowIndex}){
            if(row.type_use == '-1'){
                return 'disable_class';
            }else{
                return 'can_use_class';
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
<style scoped>
.white-space{
    white-space: nowrap;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.dialog-content .el-radio{
    margin-right: 10px;
}
.pagination-bar{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top:20px;
}
.tools-bar{
    padding:20px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top:1px solid #D3D3D3;
    margin-top:20px;
}
.line{
    color:#D0D0D0;
    margin:0 20px; 
}
.act-btn-disable{
    color:#E8E8E8!important;
}
</style>


