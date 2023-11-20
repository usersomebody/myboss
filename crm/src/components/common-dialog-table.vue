<template>
    <div class="dialog-content">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="名称" class="">
                    <el-input v-model="searchData.name" placeholder="请输入客户名称"></el-input>
                </el-form-item>
                <el-form-item class="block m-l-20" label="创建日期">
                    <el-date-picker
                    v-model="searchData.createTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="block m-l-20">
                    <div class="" @click="onSearch">
                        <el-button type="primary">查询</el-button>
                    </div>
                </el-form-item>
            </el-form>
            
        </div>
        <el-table
        v-loading.body="tableLoading"
        :ref="tableType"
        :data="tableData"
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
        @row-dblclick="handledbClick"
        @row-click="handleCurrentChange"
        style="width: 100%">
        <el-table-column
          key="id"
          v-if="tableType == 'multipleTable'"
          type="selection">
        </el-table-column>
        <!-- <el-table-column
          :key="Math.random()"
          v-show="tableType == 'singleTable'"
          width="60">
          <template slot-scope="scope">
            <el-radio v-if="tableType == 'singleTable'" v-model="currentRadio" :label="scope.row.id">{{''}}</el-radio>
          </template>
        </el-table-column> -->
        <el-table-column
          v-for="(item, index) in renderList"
          :key="item.prop + '' + index"
          :prop="item.prop"
          :label="item.name"
          align="center"
          :fixed="item.fixed"
          :width="item.prop == 'description' ? '500px' : '160px'">
          <template slot-scope="scope">
              <div :style="index == 0 ? [firstStyle] : ''">
                  <el-radio v-if="tableType == 'singleTable' && index == 0" v-model="currentRadio" :label="scope.row.id">{{''}}</el-radio>
                  <div v-if="!item.isInput" :style="index == 0 ?  ['width:90%;text-align:left']  : ''" class="white-space">{{item.isJudge ? item.judge[scope.row[item.prop]] : scope.row[item.prop]}}</div>
                  <el-input v-else v-model="scope.row[item.prop]" @input="getEditValue" @blur="search_fincerecord"></el-input>
              </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          fixed="right">
          <template slot="header" slot-scope="scope">
            <i class="el-icon-setting" style="font-size:20px;" @click="showEditTableHeader"></i>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
        <div v-if="!isHiddenBtn" class="tools-bar">
            <el-button @click="hiddenListTable('cancle')">返回</el-button>
            <el-button type="primary" @click="hiddenListTable('sure')">确认</el-button>
        </div>
      </div>
      <el-dialog :title="listDialogTitle" :visible.sync="showDialog" @close="onDialogListClose()">
        <div>
            <el-transfer
                filterable
                filter-placeholder="请输入"
                v-model="tableShowValue"
                @change="handleChange"
                :titles="['显示字段', '隐藏字段']"
                :data="tableShowData">
            </el-transfer>
        </div>
        <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="onDialogListSubmit()">确认</el-button>
      </div>
    </el-dialog>
    </div>
</template>
<script>
export default {
    props:[
    'tableDataApi', 
    'tableRenderList', 
    'listDialogTitle', 
    'isCanSet', 
    'tableType', 
    'isHiddenBtn', 
    'dialofapiType', 
    'selectRadio', 
    'listType', 
    'listTypeInvoice', 
    'channelInvoiceStatus', 
    'scheduleIds', 
    'mediaId',
    'receiveStatus',
    'channelAccount',
    'channelPaymentStatus',
    'sourcePage'],
    data(){
        const generateData = _ => {
            const data = [];
            const cities = this.tableRenderList.map((item,index)=>{
                return item.name
            })
            
            cities.forEach((city, index) => {
            data.push({
                label: city,
                key: index,
            });
            });
            return data;
        }
        return{
            searchData: {
                page: 1,
                limit: 10,
                name: '',
                createTime: '',
                level_type: 3
            },
            totalRecord: 0,
            pageSize: 10,
            tableLoading: false,
            showDialog: false,
            multipleSelection: [],
            renderList: [],
            tableShowData: generateData(),
            tableShowValue: [],
            tableHiddenIndex: [],
            currentRadio: '',
            tableData: [],
            firstStyle:{
                'display': 'flex',
                'justify-content':'space-between',
                'align-items':'center',
                'width':'100%'
            },
            defaultValue: [],
            title: ''
        }
    },
    created(){
        
        console.log('props',this.props)
        this.currentRadio = this.selectRadio || ''
        this.renderList = this.tableRenderList.concat()
        this.initList()
    },
    watch:{
        dialofapiType(val) {
            this.renderList = this.tableRenderList.concat()
            this.currentRadio = this.selectRadio || ''
            this.searchData = {
                page: 1,
                limit: 10,
                name: '',
                createTime: '',
                level_type: 3
            }
            this.initList()
        },
        selectRadio(val){
            this.currentRadio = this.selectRadio || ''
        },
        scheduleIds(val){
            console.log('val___',val)
            this.defaultValue = val ? val.split(',') : ''
            // this.initList()
        }
    },
    methods: {
        async initList(title) {
            const { searchData } = this
            console.log('this.scheduleIds______________', this.scheduleIds)
            searchData.start_time = searchData.createTime.length ? searchData.createTime[0] : ''
            searchData.end_time = searchData.createTime.length ? searchData.createTime[1] : ''
            searchData.level_type = this.dialofapiType == 'media_id' ? 3 : 1
            // searchData.media_id = this.mediaId
            if(this.listType){
                searchData.type_status = 1
            }else{
                searchData.type_status = ''
            }
            if(this.listDialogTitle == '修改排期开票信息'){
                searchData.schedule_ids = this.scheduleIds
            }else if(this.listDialogTitle == '修改渠道账号信息'){
                searchData.media_id = this.scheduleIds
            }else{
                searchData.schedule_ids = ''
            }
            if(this.listTypeInvoice){
                searchData.invoice_get_status = 2 
            }
            if(this.channelInvoiceStatus){
                searchData.channel_invoice_status = 2
            }
            if(this.receiveStatus){
                searchData.receive_status = this.receiveStatus
            }
            if(this.channelPaymentStatus){
                searchData.channel_payment_status = this.channelPaymentStatus
            }
            if(this.channelAccount){
                searchData.choose_status = 1
            }
            if(this.sourcePage){
                searchData.source_page = this.sourcePage
            }
            console.log('this.tableDataApi', this.tableDataApi)

            const data = await this.tableDataApi(searchData)
            this.tableData = data.list
            this.totalRecord = data.total
            if(this.tableType == 'multipleTable' && this.scheduleIds){
                this.checkTableData()
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
        //多选操作
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        // 复选
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.$emit('checkChildItem', val)
            console.log('multipleSelection',val)
        },
        //单选
        handleCurrentChange(currentRow){
            if(this.tableType == 'multipleTable'){
                return
            }
            console.log('currentRow',currentRow)
            this.currentRadio = currentRow.id
            currentRow['currentRowRadio'] = this.dialofapiType
            this.$emit('checkItemRadio', currentRow)
        },
        //双击
        handledbClick(row, detail, test){
            const { renderList, tableRenderList } = this
            console.log({row, detail, test})
            let list = renderList.map((item)=>{
                let obj = item
                obj.isInput = item.prop == detail.property
                return obj
            })
            this.renderList = list
        },
        //table显示数据更改
        handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
            this.tableHiddenIndex = value
        },
        // 获取编辑数据
        getEditValue(val){
            console.log('val',val)
        },
        search_fincerecord(){
            this.$emit('updateList')
        },
        //dialog修改table字段
        onDialogListClose() {

        },
        onDialogListSubmit(){
            const { tableHiddenIndex, tableRenderList } = this
            let list = tableRenderList.filter((item, index)=>{
                return tableHiddenIndex.indexOf(index) == -1 && item
            })
            this.renderList = list
            this.showEditTableHeader()
        },
        showEditTableHeader(){
            if(!this.isCanSet){
                return
            }
            this.showDialog = !this.showDialog
        },
        hiddenListTable(key){
            this.$emit('hiddenTable', key)
        },
        // 复选框选中
        checkTableData(){
            const self = this
            const { tableData, scheduleIds } = this
            console.log('scheduleIds',scheduleIds)
            self.$nextTick(() => {
                tableData.forEach(function(item, idx) {
                    if (scheduleIds.indexOf(item.id) >= 0) {
                    self.$refs.multipleTable.toggleRowSelection(item, true)
                    }
                })
                self.tableData = tableData
            })
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
</style>


