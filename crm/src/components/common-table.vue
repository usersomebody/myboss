<template>
    <div>
        <el-table
        v-loading.body="tableLoading"
        :ref="tableType"
        :data="tableData"
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
        @cell-dblclick="handledbClick"
        @row-click="handleClick"
        style="width: 100%">
        <el-table-column
          key="id"
          v-if="tableType == 'multipleTable'"
          type="selection"
          fixed
          width="60">
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
          :min-width="item.prop == 'company_name' ? '240' : '160'">
          <template slot-scope="scope">
              <el-radio v-if="tableType == 'singleTable' && index == 0" v-model="currentRadio" :label="scope.row.id">{{''}}</el-radio>
              <span v-if="item.isSecond" class="white-space">{{scope.row[item.prop] ? scope.row[item.prop][item.sProp] : ''}}</span>
              <el-input v-else-if="item.isInput && scope.row.id == updateId" v-model="scope.row[item.prop]" @input="getEditValue" @blur="search_fincerecord"></el-input>
              <span v-else class="white-space">{{item.isJudge ? item.judge[scope.row[item.prop]] : scope.row[item.prop]}}</span>
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
    props:['tableData', 'tableRenderList', 'listDialogTitle', 'isCanSet', 'tableType', 'editApi'],
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
            tableLoading: false,
            showDialog: false,
            multipleSelection: [],
            renderList: [],
            tableShowData: generateData(),
            tableShowValue: [],
            tableHiddenIndex: [],
            currentRadio: '',
            updateId: '',
            updateObj: {
                id: '',
                key: '',
                value: ''
            }
        }
    },
    created(){
        this.renderList = this.tableRenderList.concat()
    },
    
    methods: {
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
            this.$emit('checkItem', val)
            console.log('multipleSelection',val)
        },
        //单选
        handleCurrentChange(currentRow){
            this.currentRadio = currentRow.id
            console.log('currentRow',currentRow)
            this.$emit('checkItemRadio', this.currentRadio)
        },
        //双击
        handledbClick(row, detail, test){
            const { renderList, tableRenderList } = this
            let list = renderList.map((item)=>{
                let obj = item
                obj.isInput = item.prop == detail.property
                return obj
            })
            this.updateObj = {
                id: row.id,
                key: detail.property,
                val: ''
            }
            this.updateId = row.id
            this.renderList = list
        },
        //单击
        handleClick(row, column, cell){
            console.log('row',row, column, cell)
            // if(column.property == 'name' || column.property == 'customer_name'){
                this.$emit('seeDetail', row)
            // }
        },
        //table显示数据更改
        handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
            this.tableHiddenIndex = value
        },
        // 获取编辑数据
        getEditValue(val){
            console.log('val',val)
            this.updateObj.val = val
        },
        async search_fincerecord(){
            try{
                const { updateObj } = this
                let param = {
                    id: updateObj.id,
                    [updateObj.key]:updateObj.val
                }
                const data = await this.editApi(param)
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
                this.$emit('updateList')
            }catch(error){
                
            }
        },
        //dialog修改table字段
        onDialogListClose() {

        },
        onDialogListSubmit(){
            const { tableHiddenIndex, tableRenderList } = this
            let list = tableRenderList.filter((item, index)=>{
                return tableHiddenIndex.indexOf(index) == -1 && item
            })
            console.log('list',list)
            this.renderList = list
            this.showEditTableHeader()
        },
        showEditTableHeader(){
            if(!this.isCanSet){
                return
            }
            this.showDialog = !this.showDialog
        },
        seeDetail(row, index){
            this.$emit('seeDetail', row)
        }
    }
}
</script>
<style scoped>
.white-space{
    width:90%;
    white-space: nowrap;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>


