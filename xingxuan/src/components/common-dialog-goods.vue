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
        <el-table-column
          key="id"
          v-if="tableType == 'multipleTable'"
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
                  <div v-if="!item.isAction" class="white-space">{{scope.row[item.prop]}}</div>
                  <div v-else @click="delData(scope.row)" class="action-color">删除</div>
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
      <div class="tools-bar">
        <div>已选{{multipleSelection.length}}条</div>
        <div>
            <!-- <el-button @click="hiddenListTable('cancle')">取消</el-button>
            <el-button type="primary" @click="hiddenListTable('sure')">导入商品</el-button> -->
            <el-button type="primary" @click="addGoodsData">新增商品</el-button>
        </div>
      </div>
    </div>
</template>
<script>
import { getCateList, activityAction} from '@/api/permission'
export default {
    props:[
    'tableDataApi', 
    'tableRenderList', 
    'tableType', 
    'dialofapiType',
    'actId',
    'updateData',
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
                activity_id: '',
                activity_type: ''
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
            loading: false,
            cate_list: []
        }
    },
    created(){
        this.renderList = this.tableRenderList.concat()
        this.searchData.activity_id = this.actId
        this.searchData.activity_type = 1
        this.initList()
    },
    watch:{
        dialofapiType(val) {
            this.renderList = this.tableRenderList.concat()
            this.searchData = {
                page: 1,
                limit: 10,
                level_type: 1
            }
            this.initList()
        },
        updateData(){
            this.searchData = {
                page: 1,
                limit: 10,
                activity_id: this.actId,
                activity_type: 1
            }
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
            if (query !== '') {
            this.loading = true;
            const data = await getCateList()
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

        hiddenListTable(key){
            this.$emit('hiddenGoodsTable', key)
        },
        addGoodsData(){
            this.$emit('showInnerDialog')
            
        },
        delData(row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    let param = {
                        id: this.actId,
                        product_id: [row.product_id],
                        type: 4
                    }
                    this.setSample(param)
                    
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
            });
        },
        async setSample(param){
           const data = await activityAction(param)
           this.$message({
                type: 'success',
                message: '删除成功!'
            });
           this.onSearch(1) 
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
.action-color{
    color: #7A90BD;
}
</style>


