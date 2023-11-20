<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="公司名称" class="">
                    <el-input v-model="searchData.name" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
            </el-form>
            <div class="" @click="onSearch">
                <el-button type="primary">查询</el-button>
            </div>
        </div>
    </el-card>
    <el-card class="box-card">
        <div v-if="!selectCheckData.length" class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:80%;">
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
                <el-button type="primary" icon="el-icon-plus"  @click="addDialogData">新建渠道开票</el-button>
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
        :table-render-list="channelInvoiceRenderData"
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="140px">
        <el-collapse v-model="activeNames" @change="handleCollapseChange">
            <el-collapse-item title="基本信息" name="1" class="bg-f5">
                <div class="flex">
                    <!-- <el-form-item label="对应媒体资源" prop="media_name"  style="width:25%;">
                        <el-input v-model="dataForm.media_name" @focus="goGetData('getMediaList', 'media_id', 'submit')" placeholder="请输入对应媒体资源">
                            <i
                                class="el-icon-plus el-input__icon color-409"
                                slot="suffix"
                               @click="goGetData('getMediaList', 'media_id', 'submit')">
                            </i>
                        </el-input>
                    </el-form-item> -->
                    <el-form-item label="对应媒体排期" prop="schedule_names"  style="width:25%;">
                        <el-input v-model="dataForm.schedule_names" @focus="goGetData('scheduleList', 'schedule_id', 'submit')" placeholder="请输入对应媒体排期">
                            <i
                                class="el-icon-plus el-input__icon color-409"
                                slot="suffix"
                               @click="goGetData('scheduleList', 'schedule_id', 'submit')">
                            </i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="公司名称" prop="company_name" style="width:25%;" class="m-l-40">
                        <el-input v-model="dataForm.company_name" placeholder="请输入公司名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="开票金额" prop="invoice_money" style="width:25%;" class="m-l-40">
                        <el-input v-model="dataForm.invoice_money" placeholder="请输入开票金额">
                        </el-input>
                    </el-form-item>
                </div>
            </el-collapse-item>
            
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2, 1)" v-if="dialogTitle=='修改渠道开票'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1, 1)" v-else>立即创建</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2, 2)" v-if="dialogTitle=='修改渠道开票'">保存并审核</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1, 2)" v-else>创建并审核</el-button>
      </div>
    </el-dialog>
    <el-dialog
        width="70%"
        :title="dialogSelectTitle"
        :visible.sync="innerVisible">
        <div>
            <!-- 公共可操作列表 -->
            <!-- :list-type="dialofapiType == 'schedule_id' ? 'invoice' : ''" -->
            <commonDialogTable
                v-if="dialofapi"
                :table-data-api="dialofapi"
                :table-render-list="tableRenderList"
                :list-dialog-title="listDialogTitle"
                :select-radio="selectRadio"
                :is-can-set="false"
                :dialofapi-type="dialofapiType"
                :table-type="dialofapiType == 'media_id' ? 'singleTable' : 'multipleTable'"
                :media-id="dataForm.media_id"
                list-type="invoice"
                :channel-invoice-status="dialofapiType == 'media_id' ? '' : 'invoice'"
                :schedule-ids="dataForm.schedule_ids"
                :source-page="3"
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
import { getChannelInvoiceList, addChannelInvoice, editChannelInvoice, getMediaList, scheduleList, allPerson, paymentAccountList, selectConfigType, delChannelInvoice } from '@/api/permission'
import { 
    channelInvoiceRenderData, 
    scheduleTableRenderList, 
    mediaResourceRenderData,
    channelInvoiceLevelDefaultData
  } from '../config.js'
import { permissionBtn } from '@/utils/permissionBtn.js'
import { accAdd } from '@/utils/common.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import commonSearchLevel from '@/components/common-search-level'

import moment from 'moment'
export default {
    data() {
        return {
            dialogSelectTitle: '媒体资源',
            editApi: editChannelInvoice,
            levelDefaultData: channelInvoiceLevelDefaultData,
            dialofapi: '',
            dialofapiType: 'media_id',
            totalRecord: 0,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新增用户',

            listDialogTitle: '更改列表显示数据',
            rules: {
                company_name: [
                    {
                        required: true,
                        message: '公司名称不能为空',
                        trigger: 'blur'
                    }
                ],
                // media_name: [
                //     {
                //         required: true,
                //         message: '媒体资源不能为空',
                //         trigger: 'change'
                //     }
                // ],
                schedule_names: [
                    {
                        required: true,
                        message: '媒体排期不能为空',
                        trigger: 'change'
                    }
                ],
                invoice_money: [
                    {
                        required: true,
                        message: '开票金额',
                        trigger: 'blur'
                    }
                ]
            },
            searchData: {
                name: '',
                page: 1,
                limit: 10,
                level_type: ''
            },
            dataForm: {
                invoice_money: '',
                schedule_names: '',
                media_name: '',
                name: '',
                schedule_ids: '',
                company_name: ''
            },
            tableData: [],

            loaded: false,
            tableRenderList:[],
            channelInvoiceRenderData,
            activeNames:['1'],

            selectCheckData: [],

            userData: {},
            isCanEdit: false,
            btn_permission: {},
            selectRadio: '',

            skuTree: [],

            input: '',
            isTable: false,
            standData: [],
            list: [],
            group: [],

            
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
    methods:{
        async initList() {
            const { searchData } = this
            const data = await getChannelInvoiceList(searchData)
            data.list.forEach((item)=>{
                item.schedule_names = item.schedule_detail.length ? item.schedule_detail.map((itm)=>{
                    return itm.name
                }).join(',') : ''
            })
            this.tableData = data.list
            this.totalRecord = data.total
        },
        async submitData(type, submit){
            const { dataForm, userData } = this
            dataForm.belong_userid = type === 2 ? '' : userData.id
            dataForm.department_id = type === 2 ? '' : userData.department_id
            dataForm.submit = submit
            let { id, ...subData } = dataForm
            const data = type === 1 ? await addChannelInvoice(subData) : await editChannelInvoice(dataForm)
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
            const data = await delChannelInvoice({id:id})
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
            const { dataForm, dialofapiType } = this
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
            if(key == 'sure' && this.dialofapiType == 'schedule_id'){
            // 回款金额
                this.dataForm.invoice_money = detailTableData.reduce((pre, cur) => accAdd(pre, cur.customer_money), 0);
                if(detailTableData.length){
                    let channel_company_name = detailTableData.map((item)=>{
                        return item.channel_company_name
                    })
                    let realName = channel_company_name.filter((item)=>{
                        return item
                    })
                    this.dataForm.company_name = realName.length ? realName.join(',') : ''
                }
            }
            this.innerVisible = false
        },
        // 单选
        checkRadioData(data) {
            this.dataForm.media_id = data.id
            this.dataForm.media_name = data.name
            // this.dataForm.company_name = data.company
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
            this.loaded = true
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
            let notEdit = [2, 3]
            const { btn_permission } = this
            if(!btn_permission.edit.isHas){
                this.$message.error('无权操作')
                return 
            }
            let schedule_names = data.schedule_detail.length ? data.schedule_detail.map((item)=>{
                return item.name
            }).join(',') : ''
            data.schedule_names = schedule_names
            this.dataForm = Object.assign({},data)
            this.dialogVisible = true;
            this.dialogTitle = '修改渠道开票'
            this.isCanEdit = notEdit.indexOf(this.dataForm.type) > -1 ? true : false
        },
        goGetData(api, key, type){
            if(type == 'submit'){
                this.selectRadio = this.dataForm[key]
                console.log('this.selectRadio', this.selectRadio)
            }
            // if(api == 'scheduleList' && (!this.dataForm.media_name || !this.dataForm.media_id)){
            //     this.$message({
            //         type: 'warning',
            //         message: '请选择对应媒体资源'
            //     })
            //     return
            // }
            if(api == 'getMediaList'){
                this.tableRenderList = mediaResourceRenderData
                this.dialofapi = getMediaList
                this.dialofapiType = 'media_id'
                this.dialogSelectTitle = '媒体资源'
            }else if(api == 'scheduleList'){
                this.tableRenderList = scheduleTableRenderList
                this.dialofapi = scheduleList
                this.dialofapiType = 'schedule_id'
                this.dialogSelectTitle = '媒体排期'
            }
            this.innerVisible = true
        },
        getCurrentKey(checkedNodes,checkedKeys){
            console.log('keys',checkedNodes,checkedKeys)
        },
        getLevelValue(type){
            this.searchData.level_type = type
            this.initList()
        },
        addDialogData(){
            const { btn_permission } = this
            if(!btn_permission.add.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dialogVisible = true;
            this.dialogTitle = '新建渠道开票'
            this.isCanEdit = false
            // this.$refs['dataForm'].resetFields()
            this.restDataFormValue()
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

<style lang="scss" scoped>
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
    // justify-content: center;
    justify-content: flex-start;
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
.deleteTitle:hover{
    color:#409eff;
}
.table,.stand {
        padding: 40px;
    }
    .table {
        height: 500px;
    }
    .add {
        margin-top: 20px;
    }
    .attr {
        margin-bottom: 10px;
    }
    .el-input {
        width: auto;
        
    }
    .putt {
        display: inline-block;
        position: relative;
        margin-right: 10px;  
    }
    .append {
        width: 40px;
        height: 40px;
        background-color: aqua;
        line-height: 40px;
        text-align: center;
        display: inline-block;
        font-size: 28px;
        cursor: pointer;
        vertical-align: middle;
    }
    .title {
        background-color: bisque;
        margin-right: 10px;
    }
    .close {
        position: absolute;
        width: 15px;
        height: 15px;
        background-color: burlywood;
        border-radius: 50%;
        line-height: 15px;
        text-align: center;
        right: -5px;
        top: -5px;
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
.fl .el-input .el-input__inner, .fl .el-select .el-input__inner{
    width: 200px!important;
}
</style>
