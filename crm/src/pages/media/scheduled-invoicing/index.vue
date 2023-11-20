<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="开票抬头" class="">
                    <el-input v-model="searchData.name" placeholder="请输入客户名称" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="审批状态" class="m-l-20">
                    <el-select v-model="searchData.type" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in invoiceStatus"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开票类型" class="m-l-20">
                    <el-select v-model="searchData.invoice_status" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in invoiceType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开票税号" class="m-l-20">
                    <el-input v-model="searchData.tax_name" placeholder="请输入客户名称" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="申请开票金额" class="m-l-10">
                    <el-input v-model="searchData.start_invoice_money" placeholder="请输入客户名称" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="创建人">
                    <el-select v-model="searchData.belong_userid" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in userListData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="block m-l-10" label="开票日期">
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
                <el-form-item label="排序方式" class="m-l-10">
                    <el-select v-model="searchData.sort" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in invoiceSort"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="" @click="onSearch">
                <el-button type="primary">查询</el-button>
            </div>
        </div>
    </el-card>
    <el-card class="box-card">
        <div v-if="!selectCheckData.length" class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:82%;">
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
                <el-button type="primary" icon="el-icon-plus"  @click="addDialogData">新建排期开票</el-button>
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
        :table-render-list="invoiceRenderData"
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
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="100px">
        <el-collapse v-model="activeNames" @change="handleCollapseChange">
            <el-collapse-item title="基本信息" name="1" class="bg-f5">
                <div class="flex">
                    <!-- <el-form-item label="业务类型" prop="invoiceInfo"  style="width:25%;">
                        <el-input v-model="dataForm.invoiceInfo" placeholder="请输入发票邮寄信息"></el-input>
                    </el-form-item> -->
                    <el-form-item label="所有人" prop="accountOwner" style="width:25%;" label-width="100px">
                        <el-popover
                            placement="top-start"
                            width="300"
                            trigger="hover">
                            <div class="flex">
                                <el-image
                                style="width: 100px; height: 100px; margin-right: 10px;"
                                :src="userData.avatar"
                                fit="cover"></el-image>
                                <div class="account-info">
                                    <h4 class="color-158">{{userData.name}}</h4>
                                    <div class="font-12 color-ccc">{{userData.department_name}} {{userData.job}}</div>
                                    <div class="font-12 color-ccc">邮箱：{{userData.email ? userData.email : '正式邮箱未填写'}}</div>
                                    <div class="font-12 color-ccc">电话：{{userData.tel_phone ? userData.tel_phone : '电话未填写'}}</div>
                                    <div class="font-12 color-ccc">手机：{{userData.phone}}</div>
                                </div>
                            </div>
                            <div slot="reference" class="v-c-center">
                                <el-image
                                style="width: 20px; height: 20px; margin-right: 10px;"
                                :src="userData.avatar"
                                fit="cover"></el-image>
                                <span>{{userData.name}}</span>
                            </div>
                        </el-popover>
                    </el-form-item>
                    <el-form-item label="开票抬头" prop="name"  style="width:25%;">
                        <el-input v-model.trim="dataForm.name" :disabled="isCanEdit" placeholder="请输入开票抬头"></el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="我司开票公司" prop="company_id"  style="width:25%;">
                        <el-select v-model="dataForm.company_id"  :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开票类型" prop="invoice_status"  style="width:25%;">
                        <el-select v-model="dataForm.invoice_status"  :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in invoiceType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="普票邮箱" prop="email"  style="width:25%;">
                        <el-input v-model="dataForm.email" :disabled="isCanEdit" placeholder="请输入普票邮箱"></el-input>
                    </el-form-item> -->
                </div>
                <div class="flex">
                    <el-form-item label="开票项目" prop="invoice_name"  style="width:25%;">
                        <el-input v-model.trim="dataForm.invoice_name" :disabled="isCanEdit" placeholder="请输入开票项目"></el-input>
                    </el-form-item>
                    <el-form-item label="开票税号" prop="tax_name"  style="width:25%;">
                        <el-input v-model.trim="dataForm.tax_name" :disabled="isCanEdit" placeholder="请输入开票税号"></el-input>
                    </el-form-item>
                    <el-form-item label="开票账号" prop="invoice_account"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_account" :disabled="isCanEdit" placeholder="请输入开票账号"></el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="开票银行" prop="invoice_bank"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_bank" :disabled="isCanEdit" placeholder="请输入开票银行"></el-input>
                    </el-form-item>
                    <el-form-item label="开票地址" prop="invoice_address"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_address" :disabled="isCanEdit" placeholder="请输入开票地址"></el-input>
                    </el-form-item>
                    <el-form-item label="开票电话" prop="invoice_phone"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_phone" :disabled="isCanEdit" placeholder="请输入开票电话"></el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <!-- <el-form-item label="排期明细以那个为准？" prop="schedule_status"  style="width:25%;">
                        <el-select v-model="dataForm.schedule_status"  :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in invoiceDetail"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="本次申请排期开票明细" prop="originalprice" style="width:25%;">
                        <el-upload
                            class="upload-demo"
                            drag
                            :on-change="handleUploadChange"
                            :action="uploadUrl + '/merchant/system.upload/uploadImg'">
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </el-form-item> -->
                    <el-form-item label="媒体排期" prop="schedule_ids" style="width:25%;">
                        <el-input v-model="dataForm.schedule_ids" @focus="goGetData" placeholder="请输入媒体排期">
                            <i
                                class="el-icon-plus el-input__icon color-409"
                                slot="suffix"
                                @click="goGetData">
                            </i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="申请开票金额" prop="invoice_money" style="width:25%;">
                        <el-input v-model.trim="dataForm.invoice_money" :disabled="isCanEdit" placeholder="请输入申请开票金额">
                            <template slot="append"><span>元</span></template>
                        </el-input>
                    </el-form-item>
                </div>
            </el-collapse-item>
            <!-- <el-collapse-item title="财务填写信息" name="2" class="bg-f5">
                <div class="flex">
                    <el-form-item label="转账类型" prop="invoice_pic"  style="width:50%;">
                        <el-upload
                            :action="uploadUrl + '/merchant/system.upload/uploadImg'"
                            list-type="picture-card"
                            :disabled="isCanEdit"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogImageVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="财务开票时间" prop="invoice_time_name"  style="width:25%;">
                        <el-date-picker
                        v-model="dataForm.invoice_time_name"
                        :disabled="isCanEdit"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
            </el-collapse-item> -->
            <el-collapse-item title="排期开票明细" name="2" class="bg-f5">
               <div class="flex">
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
                    :table-render-list="paymentCollectionChildRenderData"
                    :is-can-set="false"/>
               </div>
            </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2)" v-if="dialogTitle=='修改排期开票信息'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1)" v-else>立即创建</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2, 2)" v-if="dialogTitle=='修改排期开票信息'">保存并审核</el-button>
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
                :list-dialog-title="dialogTitle"
                list-type="invoice"
                list-type-invoice="invoice"
                :schedule-ids="dataForm.schedule_ids"
                :is-can-set="false"
                :table-type="'multipleTable'"
                :source-page="2"
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
import { invoiceList, invoiceAdd, invoiceEdit, invoiceDel, scheduleList, allPerson, selectConfigType } from '@/api/permission'
import { 
    invoiceRenderData,
    invoiceLevelDefaultData,
    customerTypeList, 
    scheduleTableRenderList, 
    invoiceSort,
    invoiceStatus,
    invoiceType } from '../config.js'
import { paymentCollectionChildRenderData } from '../../payCollection/config.js'
import { permissionBtn } from '@/utils/permissionBtn.js'
import { accAdd } from '@/utils/common.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import commonSearchLevel from '@/components/common-search-level'
import { uploadUrl } from '@/config/baseUrl.js'
import moment from 'moment'
export default {
    data() {
        return {
            showTable:false,
            dialogSelectTitle: '媒体排期',
            paymentCollectionChildRenderData,
            editApi: invoiceEdit,
            invoiceRenderData,
            levelDefaultData: invoiceLevelDefaultData,
            invoiceSort,
            invoiceStatus,
            invoiceType,
            uploadUrl,
            dialofapi: scheduleList,
            totalRecord: 0,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新增用户',

            // upload 上传
            dialogImageUrl: '',
            dialogImageVisible: false,
            disabledImage: false,

            listDialogTitle: '更改列表显示数据',
            invoiceDetail: [{
                id: 1,
                name: '系统填写'
            }, {
                id: 2,
                name: '手动上传'
            }],
            rules: {
                name: [
                    {
                        required: true,
                        message: '登录名不能为空',
                        trigger: 'blur'
                    }
                ],
                company_id: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                invoice_status: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                invoice_name: [
                    {
                        required: true,
                        message: '开票项目不可为空',
                        trigger: 'blur'
                    }
                ],
                tax_name: [
                    {
                        required: true,
                        message: '开票税号不可为空',
                        trigger: 'blur'
                    }
                ],
                schedule_status: [
                    {
                        required: false,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                schedule_ids: [
                    {
                        required: true,
                        message: '媒体排期不可为空',
                        trigger: 'change'
                    }
                ],
                invoice_money: [
                    {
                        required: true,
                        message: '开票金额不可为空',
                        trigger: 'blur'
                    }
                ],
            },
            searchData: {
                keyWord: '',
                page: 1,
                size: 10,
                dataType: 1,
                level_type: 1,
                createTime: ''
            },
            dataForm: {
                invoice_time_name: '',
                nvoice_pic: '',
                invoice_money: '',
                schedule_ids: '',
                schedule_status: '',
                invoice_phone: '',
                invoice_address: '',
                invoice_bank: '',
                invoice_account: '',
                tax_name: '',
                invoice_name: '',
                email: '',
                name: '',
                company_id: '', 
                invoice_status: ''
            },
            tableData: [],

            customerTypeList,
            loaded: false,
            tableRenderList:scheduleTableRenderList,
            activeNames:['1'],

            selectCheckData: [],

            detailTableData: [],

            userListData: [],

            userData: {},

            companyList: [],

            isCanEdit: false,

            btn_permission: {}
        }
    },
    components:{
        commonTable,
        commonDialogTable,
        commonSearchLevel
    },
    created() {
        this.btn_permission = permissionBtn(this.$route.name)
        this.userData = this.$store.state.permission.userData
        this.initList()
        this.getAllPerson()
        this.getCompanyName()
    },
    methods: {
        async initList() {
            const { searchData } = this
            searchData.start_time = searchData.createTime.length ? searchData.createTime[0] : ''
            searchData.end_time = searchData.createTime.length ? searchData.createTime[1] : ''
            const data = await invoiceList(searchData)
            data.list.forEach((item)=>{
                item.schedule_names = item.schedule_detail.length ? item.schedule_detail.map((itm)=>{
                    return itm.name
                }).join(',') : ''
            })
            this.tableData = data.list
            this.totalRecord = data.total
        },
        async getAllPerson(){
            let param = {
                path: this.$route.name,
                level: this.searchData.level_type
            }
            const data = await allPerson(param)
            this.userListData = data
        },
        async getCompanyName(){
            const data = await selectConfigType({type_id: 2})
            this.companyList = data
        },
        async submitData(type, submit){
            const { dataForm, userData, companyList } = this
            let companyData = companyList.filter((item)=>{
                return item.id == dataForm.company_id
            })
            dataForm.company_name = companyData[0].name
            dataForm.belong_userid = type === 2 ? '' : userData.id
            dataForm.department_id = type === 2 ? '' : userData.department_id
            dataForm.submit = submit
            dataForm.invoice_time = dataForm.invoice_time_name
            let { id, ...subData } = dataForm
            const data = type === 1 ? await invoiceAdd(subData) : await invoiceEdit(dataForm)
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
            const data = await invoiceDel({id:id})
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
            this.pageSize = val
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
            this.dataForm.invoice_money = receive_money
            this.innerVisible = false
            this.showTable = false
        },
        // 单选
        checkRadioData(data) {
            
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
            this.dataForm = Object.assign({},data)
            this.dialogVisible = true;
            this.dialogTitle = '修改排期开票信息'
            this.isCanEdit = notEdit.indexOf(this.dataForm.type) > -1 ? true : false
            this.detailTableData = data.schedule_detail
        },
        goGetData(){
            console.log('??????')
            this.innerVisible = true
            this.showTable = true
        },
        getCurrentKey(checkedNodes,checkedKeys){
            console.log('keys',checkedNodes,checkedKeys)
        },
        handleUploadChange(file, fileList){
            console.log("upload",file, fileList)
        },
        //上传
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogImageVisible = true;
        },
        getLevelValue(type){
            this.searchData.level_type = type
            this.getAllPerson()
            this.initList()
        },
        addDialogData(){
            const { btn_permission } = this
            if(!btn_permission.add.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dialogVisible = true;
            this.dialogTitle = '新建排期开票'
            this.isCanEdit = false
            this.dataForm.scheduleIds = ''
            // this.$refs['dataForm'].resetFields()
            this.restDataFormValue()
        },
        restDataFormValue(){
            const { dataForm } = this
            for(let key in dataForm){
                dataForm[key] = ''
            }
            this.dataForm = dataForm
            this.detailTableData = []
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
.upload-demo .el-upload-dragger{
    width:270px;
    height:40px;
}
.flex .el-upload--picture-card{
    width:80px;
    height:80px;
    line-height:80px;
}
.flex .el-upload-list__item{
    width:80px;
    height:80px;
}
.fl .el-input .el-input__inner, .fl .el-select .el-input__inner{
    width: 200px!important;
}
</style>
