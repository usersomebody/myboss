<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="客户名称" class="">
                    <el-input v-model="searchData.keyWord" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="回款编号" class="m-l-20">
                    <el-input v-model="searchData.receive_num" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="回款方式" class="m-l-20">
                    <el-select v-model="searchData.receive_type" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in payType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请状态" class="m-l-20">
                    <el-select v-model="searchData.type" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in receiveStatus"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div>
                <el-form-item class="block" label="开始日期">
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
                <el-form-item class="block m-l-10" label="回款日期">
                    <el-date-picker
                    v-model="searchData.receiveTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="search_fincerecord">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="排序方式" class="m-l-10">
                    <el-select v-model="searchData.sort" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in sortList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                </div>
            </el-form>
            <div class="" @click="onSearch">
                <el-button type="primary">查询</el-button>
            </div>
        </div>
    </el-card>
    <el-card class="box-card">
        <div v-if="!selectCheckData.length" class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:84%;">
                <el-form-item label="">
                    <commonSearchLevel
                    :default-data="levelDefaultData"
                    @levelList="getLevelValue"/>
                </el-form-item>
                <!-- <el-form-item label="" class="search-input">
                    <el-input v-model="searchData.keyWord" placeholder="搜索此列表" suffix-icon="el-icon-search" @keyup.enter.native="search_fincerecord()"></el-input>
                </el-form-item> -->
            </el-form>
            <div class="tools-bar">
                <!-- <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
                <el-button type="primary" icon="el-icon-plus"  @click="addDialogData">新建回款</el-button>
            </div>
        </div>
        <div v-else class="flex m-b-20">
            <div>已选<span class="m-l-r-20 color-409">{{selectCheckData.length}}</span>项</div>
            <div class="vertical-line"></div>
            <div class="" slot="reference" @click="isRemoveData"><i class="el-icon-delete"></i>删除</div>
        </div>
    <div>
    <!-- 公共可操作列表 -->
      <commonTable
        :table-data="tableData"
        :table-render-list="paymentCollectionRenderData"
        :list-dialog-title="listDialogTitle"
        :is-can-set="false"
        :table-type="'multipleTable'"
        :edit-api="editApi"
        @seeDetail="seeDetail"
        @updateList="search_fincerecord"
        @checkItem="checkData"/>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="searchData.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()" width="50%">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="100px">
        <el-collapse v-model="activeNames" @change="handleCollapseChange">
            <el-collapse-item title="基本信息" name="1" class="bg-f5">
                <div class="flex">
                    <el-form-item label="回款编号" class="" prop="" style="width:40%">
                        <el-input v-model="dataForm.keyWord" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item class="self" label="回款日期" prop="receive_time"  style="width:40%">
                        <el-date-picker
                            v-model="dataForm.receive_time"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="客户名称" prop="customer_name"  style="width:40%" >
                        <el-input v-model="dataForm.customer_name" @focus="goGetData('getCustomerList', 'customer_id', 'submit')" placeholder="请选择客户名称" class="disabled-cover-color">
                            <i
                                class="el-icon-plus el-input__icon color-409"
                                slot="suffix"
                                @click="goGetData('getCustomerList', 'customer_id', 'submit')">
                            </i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="媒体排期" prop="schedule_names"  style="width:40%">
                        <el-input v-model="dataForm.schedule_names" @focus="goGetData('scheduleList', 'schedule_ids', 'submit')" placeholder="请选择媒体排期">
                            <i
                                class="el-icon-plus el-input__icon color-409"
                                slot="suffix"
                                @click="goGetData('scheduleList', 'schedule_ids', 'submit')">
                            </i>
                        </el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="回款金额" prop="receive_money" class="" style="width:40%">
                        <el-input v-model.trim="dataForm.receive_money" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="回款方式" prop="receive_type" style="width:40%">
                        <el-select v-model="dataForm.receive_type" clearable>
                            <el-option
                            v-for="item in payType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                
                <el-form-item label="备注" prop="description" style="width:40%">
                    <el-input type="textarea" :rows="4" v-model="dataForm.description" placeholder="请输入备注"></el-input>
                </el-form-item>
                <div class="flex showTableStyle">
                   <!-- <el-form-item label="媒体排期">
                        <el-input v-model="searchData.keyWord" placeholder="请输入"  @keyup.enter.native="search_fincerecord()">
                            <i
                                class="el-icon-plus el-input__icon"
                                slot="suffix"
                                @click="goGetData">
                            </i>
                        </el-input>
                    </el-form-item> -->
                    <commonTable
                    style="width:100%;"
                    :table-data="detailTableData"
                    :table-render-list="scheduleTableRenderList"
                    :is-can-set="false"/>
               </div>
            </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2, 1)" v-if="dialogTitle=='修改回款信息'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1, 1)" v-else>立即创建</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2, 2)" v-if="dialogTitle=='修改回款信息'">保存并审核</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1, 2)" v-else>创建并审核</el-button>
      </div>
    </el-dialog>
    <el-dialog
        width="70%"
        :title="dialogSelectTitle"
        :visible.sync="innerVisible">
        <div>
            <!-- 公共可操作列表 -->
            <commonDialogTable
                v-if="showTable"
                :table-data-api="dialofapi"
                :table-render-list="tableRenderList"
                :list-dialog-title="listDialogTitle"
                :select-radio="selectRadio"
                :is-can-set="false"
                list-type="invoice"
                :receive-status="dialofapiType == 'customer_id' ? '' : 2"
                :dialofapi-type="dialofapiType"
                :table-type="dialofapiType == 'customer_id' ? 'singleTable' : 'multipleTable'"
                :schedule-ids="dataForm.schedule_ids"
                :source-page="4"
                @updateList="search_fincerecord"
                @checkItemRadio="checkRadioData"
                @checkChildItem="childCheckData"
                @hiddenTable="hiddenTable"/>
        </div>
    </el-dialog>
  </el-card>
  </div>
</template>
<script>
import { receiveList, receiveAdd, receiveEdit, receiveDel, getCustomerList, scheduleList } from '@/api/permission'
import { customerTypeList, payCollectionLevelDefaultData, payCollectionSortList, paymentCollectionRenderData, payType, receiveStatus, paymentCollectionChildRenderData } from '../config.js'
import { accAdd } from '@/utils/common.js'
import { customerRenderData } from '../../customer/config.js'
import { scheduleTableRenderList } from '../../media/config.js'
import { permissionBtn } from '@/utils/permissionBtn.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import commonSearchLevel from '@/components/common-search-level'
import moment from 'moment'
export default {
    data() {
        return {
            showTable:false,
            dialogSelectTitle: '客户名称',
            editApi: receiveEdit,
            receiveStatus,
            payType,
            paymentCollectionRenderData,
            scheduleTableRenderList: paymentCollectionChildRenderData,
            sortList: payCollectionSortList,
            levelDefaultData: payCollectionLevelDefaultData,
            imageUrl: '',
            dialofapi: '',
            totalRecord: 0,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新增用户',
            dialofapiType: 'customer_id',
            listDialogTitle: '更改列表显示数据',
            rules: {
                receive_time: [
                    {
                        required: true,
                        message: '回款日期不能为空',
                        trigger: 'change'
                    }
                ],
                customer_name: [
                    {
                        required: true,
                        message: '客户名称不能为空',
                        trigger: ['blur', 'change']
                    }
                ],
                schedule_names: [
                    {
                        required: true,
                        message: '媒体排期不能为空',
                        trigger: 'change'
                    }
                ],
                receive_type: [
                    {
                        required: true,
                        message: '回款方式不能为空',
                        trigger: 'change'
                    }
                ],
                receive_money: [
                    {
                        required: true,
                        message: '回款金额不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            searchData: {
                keyWord: '',
                page: 1,
                size: 10,
                createTime: '',
                level_type: 1,
                receive_time: '',
                
            },
            dataForm: {
                schedule_names: '',
                customer_name: '',
                description: '',
                receive_type: '',
                receive_money: '',
                customer_name: '', 
                keyWord: '', 
                receive_time: ''
            },
            tableData: [],

            customerTypeList,
            tableRenderList:customerRenderData,
            activeNames:['1'],
            provinceList: [],
            cityList: [],
            areaList: [],

            selectCheckData: [],

            detailTableData: [],

            btn_permission: {},

            selectRadio: ''
        }
    },
    components:{
        commonTable,
        commonDialogTable,
        commonSearchLevel
    },
    created() {
        this.userData = this.$store.state.permission.userData
        this.btn_permission = permissionBtn(this.$route.name)
        this.initList()
    },
    methods: {
        async initList() {
            const { searchData } = this
            searchData.start_time = searchData.createTime.length ? searchData.createTime[0] : ''
            searchData.end_time = searchData.createTime.length ? searchData.createTime[1] : ''
            searchData.start_receive_time = searchData.receive_time.length ? searchData.receive_time[0] : ''
            searchData.end_receive_time = searchData.receive_time.length ? searchData.receive_time[1] : ''
            const data = await receiveList(searchData)
            this.tableData = data.list
            this.totalRecord = data.total
        },
        async submitData(type, submit){
            const { dataForm, userData } = this
            dataForm.belong_userid = type === 2 ? '' : userData.id
            dataForm.department_id = type === 2 ? '' : userData.department_id
            dataForm.submit = submit
            let { id, ...subData } = dataForm
            const data = type === 1 ? await receiveAdd(subData) : await receiveEdit(dataForm)
            this.$message({
                type: 'success',
                message: type === 1 ? '创建成功!' : '修改成功!'
            });
            this.$refs['dataForm'].resetFields();
            this.onSearch(1)
            this.dialogVisible = false
            
        },
        //删除数据
        async removeData(){
            const { selectCheckData, btn_permission } = this
            if(!btn_permission.del.isHas){
                this.$message.error('无权操作')
                return 
            }
            let id = selectCheckData.map((item)=>{
                return item.id
            })
            const data = await receiveDel({id:id})
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            this.onSearch(1)
            this.selectCheckData = []
        },
        isRemoveData(){
               this.$confirm('确认删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.removeData()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });    
            });
        },
        onDialogClose() {
            this.dataForm.tempRoleIds = []
            this.$refs.dataForm.resetFields()
            this.showTable = false

        },
        handleSizeChange(val) {
            this.searchData.limit = val
            this.onSearch(1)
        },
        handleCurrentChange(val) {
            this.searchData.page = val
            this.onSearch()
        },
        onSearch(type) {
            const { searchData } = this
            if(type == 1){
                for(let key in searchData){
                    searchData[key] = key == 'page' ? 1 : key == 'limit' ? 10 : key == 'level_type' ? searchData[key] : ''
                }
                this.searchData = searchData
            }
            // this.searchData.page = 1
            this.initList()
        },
        onDialogSubmit(formName, type, submit) {
            console.log('dataForm', this.dataForm)
            
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitData(type, submit)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //hidden
        hiddenTable(key){
            const { detailTableData } = this
            let receive_money = ''
            if(key == 'sure'){
            // 回款金额
                receive_money = detailTableData.reduce((pre, cur) => accAdd(pre, cur.customer_money), 0);
            }
            this.dataForm.receive_money = receive_money
            this.innerVisible = false
            this.showTable = false
        },
        // 单选
        checkRadioData(data) {
            this.dataForm.customer_id = data.id
            this.dataForm.customer_name = data.name
            console.log('dataForm', this.dataForm)
            
        },
        submitRadioData() {
            // 上级客户数据
            this.innerVisible = false
        },
        //复选
        checkData(data) {
            this.selectCheckData = data
        },
        childCheckData(data){
            this.detailTableData = data
            this.dataForm.schedule_ids = data.map((item)=>{
                return item.id
            }).join(',')
            this.dataForm.schedule_names = data.map((item)=>{
                return item.name
            }).join(',')
            
        },
        // 数据导出
        exportData(){
            return
            var fileName = "抽奖活动用户参与表.xls"; //生成Blob对象，通过创建的a标签点击下载
            var objectUrl = URL.createObjectURL(new Blob([response.data]));
            var link = document.createElement("a");
            link.download = decodeURIComponent(fileName);
            link.href = objectUrl;
            link.click();
        },

        //搜索
        search_fincerecord() {
            const { tableRenderList } = this
            this.searchData.page = 1
            let list = tableRenderList.map((item)=>{
                let obj = item
                obj.isInput = false
                return obj
            })
            this.tableRenderList = list
            // this.getList()
        },

        handleCollapseChange(val){
            console.log('val',val)
        },
        seeDetail(data){
            const { btn_permission } = this
            if(!btn_permission.edit.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dataForm = Object.assign({},data)
            this.dataForm.schedule_names  = data.schedule_detail.length ? data.schedule_detail.map((item)=>{
                let obj = item
                return obj.name
            }).join('、') : ''
            this.content_pic = this.dataForm.content_pic
            this.dialogVisible = true;
            this.dialogTitle = '修改回款信息'
            this.detailTableData = data.schedule_detail
            
        },
        addDialogData(){
            const { btn_permission } = this
            if(!btn_permission.add.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dialogVisible = true;
            this.dialogTitle = '新建回款'
            this.isCanEdit = false
            // this.$refs['dataForm'].resetFields()
            this.restDataFormValue()
        },
        getLevelValue(type){
            this.searchData.level_type = type
            this.initList()

        },
        goGetData(api, key, type){
            if(type == 'submit'){
                this.selectRadio = this.dataForm[key]
            }
            if(api == 'scheduleList'){
                this.tableRenderList = scheduleTableRenderList
                this.dialofapi = scheduleList
                this.dialofapiType = 'schedule_id'
                this.dialogSelectTitle = '媒体排期'
            }else{
                this.tableRenderList = customerRenderData
                this.dialofapi = getCustomerList
                this.dialofapiType = 'customer_id'
                this.dialogSelectTitle = '客户名称'
            }
            console.log('schedule_ids__________', this.dataForm.schedule_ids)
            this.innerVisible = true
            this.showTable = true
        },
        restDataFormValue(){
            const { dataForm } = this
            for(let key in dataForm){
                dataForm[key] = ''
            }
            this.dataForm = dataForm
        }
    }
}
</script>

<style lang="scss">
.fr{
    float:right;
}
.fl{
    float:left;
}
.search-bar{
    overflow: hidden;
}
.box-card:first-child{
    margin-bottom:15px;
}
.tools-bar{
  margin-bottom:20px;
  float:right;
}
.search-input{
    float: right;
}
.flex{
    display: flex;
}
.m-l-40{
    margin-left:40px;
}
.m-l-20{
    margin-left: 20px;
}
.m-l-10{
    margin-left: 10px;
}
.m-l-r-20{
    margin:0 10px;
}
.m-b-20{
    margin-bottom:20px;
}
.pagination-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top:20px;
}
.v-c-center{
    display: flex;
    justify-content: center;
    align-items: center;    
}
.vertical-line{
    height:20px;
    width:1px;
    background:#ccc;
    margin:0 20px;
}
.color-409{
    color:#409eff;
}
.showTableStyle{
    width:100%;
    justify-content: center;
    align-items: center;
}
.deleteTitle:hover{
    color:#409eff;
}
</style>
<style>
.el-collapse-item__header{
    background: #f5f5f5;
    padding-left: 20px;
    color: rgb(1, 153, 255)!important;
    margin-bottom: 30px;
}
.el-select{
    display: flex!important;
}
.self .el-input, .el-date-editor.el-input__inner{
    width: 100%!important;
}
</style>
