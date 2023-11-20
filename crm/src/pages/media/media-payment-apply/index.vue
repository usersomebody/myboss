<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="渠道付款申请名称" class="">
                    <el-input v-model="searchData.name" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="对应媒体资源" class="m-l-20">
                    <el-input v-model="searchData.media_name" placeholder="请输入">
                        <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData('getMediaList', 'media_id', 'search')">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="对应媒体排期" class="m-l-20">
                    <el-input v-model="searchData.schedule_names" placeholder="请输入">
                        <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData('scheduleList', 'schedule_id', 'search')">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="审批提交人" class="m-l-20">
                    <el-select v-model="searchData.belong_userid" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in userListData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批状态">
                    <el-select v-model="searchData.type" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in paymentApprove"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="block m-l-20" label="创建日期">
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
                <el-form-item class="block m-l-20" label="到期日期">
                    <el-date-picker
                    v-model="searchData.payTime"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="search_fincerecord">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="排序方式" class="m-l-20">
                    <el-select v-model="searchData.sort" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in paymentSort"
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
                <el-button type="primary" icon="el-icon-plus"  @click="addDialogData">新建渠道付款申请</el-button>
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
        :table-render-list="paymentApplyRenderData"
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
                    <el-form-item label="渠道付款申请名称" prop="name"  style="width:25%;">
                        <el-input v-model.trim="dataForm.name" :disabled="isCanEdit" placeholder="请输入渠道付款申请名称"></el-input>
                    </el-form-item>
                    <el-form-item label="排期所有人" prop="accountOwner" style="width:25%;" label-width="100px">
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
                </div>
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
                    <el-form-item label="是否收到发票" prop="invoice_status"  style="width:25%;">
                        <el-select v-model="dataForm.invoice_status"  :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in isReceive"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-collapse-item>
            <el-collapse-item title="付款信息" name="2" class="bg-f5">
                <div class="flex">
                    <!-- <el-form-item label="转账类型" prop="pay_status"  style="width:25%;">
                        <el-select v-model="dataForm.pay_status"  :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in transferCarryOver"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="我司打款账号" prop="pay_company_id"  style="width:25%;">
                        <el-select v-model="dataForm.pay_company_id"  :disabled="isCanEdit" placeholder="请选择" @change="getPayCompanyType">
                            <el-option
                            v-for="item in payCompanyAccount"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="付款类型" prop="pay_type"  style="width:25%;">
                        <el-select v-model="dataForm.pay_type"  :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in payType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="付款金额" prop="pay_money" style="width:25%;">
                        <el-input v-model="dataForm.pay_money" :disabled="isCanEdit" placeholder="请输入付款金额">
                            <template slot="append"><span>元</span></template>
                        </el-input>
                    </el-form-item>
                </div>
            </el-collapse-item>
            <el-collapse-item title="银行卡收款信息" name="3" class="bg-f5">
                <div class="flex">
                    <el-form-item label="选择渠道收款账号" prop="channel_account_name_name"  style="width:25%;">
                        <el-input v-model="dataForm.channel_account_name_name"  placeholder="请输入收款账号">
                            <!-- @focus="goGetData('paymentaccountList', 'channel_account_id', 'submit')"
                            <i
                                class="el-icon-plus el-input__icon color-409"
                                slot="suffix"
                                @click="goGetData('paymentaccountList', 'channel_account_id', 'submit')">
                            </i> -->
                        </el-input>
                    </el-form-item>
                    <el-form-item label="收款账号状态" prop="account_status" style="width:25%;" class="m-l-40">
                        <!-- <el-input v-model="paymentAccountStatusObj[dataForm.channel_status]" placeholder="请输入收款账号状态">
                        </el-input> -->
                        <el-select v-model="dataForm.account_status"  placeholder="请选择收款账号状态">
                            <el-option
                            v-for="item in paymentAccountStatus"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收款开户行" prop="account_bank" style="width:25%;" class="m-l-40">
                        <el-input v-model="dataForm.account_bank" placeholder="请输入收款开户行">
                        </el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="收款账号" prop="account_name" style="width:25%;">
                        <el-input v-model="dataForm.account_name" placeholder="请输入收款账号">
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="dataForm.channel_account_name.channel_status == 4 || dataForm.channel_account_name.channel_status == 5" label="附件下载" prop="" style="width:25%;" class="m-l-40">
                         <el-button type="primary" @click="getExcelThree">附件下载<i class="el-icon-download el-icon--right" ></i></el-button>
                    </el-form-item>
                </div>
            </el-collapse-item>
            <el-collapse-item title="对私支付宝账号补充" name="4" class="bg-f5">
                <div class="flex">
                    <el-form-item label="对私收款人身份证号" prop="id_card" style="width:25%;">
                        <el-input v-model="dataForm.id_card" placeholder="请输入对私收款人身份证号">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="对私收款人手机号" prop="phone" style="width:25%;" class="m-l-40">
                        <el-input v-model="dataForm.phone" placeholder="请输入对私收款人手机号">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="对私支付宝收款名称+账号" prop="aliaccount" :disabled="isCanEdit" style="width:30%;" class="m-l-40" label-width="200px">
                        <el-input v-model="dataForm.aliaccount" placeholder="请输入对私支付宝收款名称+账号">
                        </el-input>
                    </el-form-item>
                </div>
            </el-collapse-item>
            <!-- <el-collapse-item title="权限数据" name="5" class="bg-f5">
                <div class="flex">
                    <el-form-item label="是否再次确认收款账户信息" prop="roleIds"  style="width:25%;">
                        <el-select v-model="dataForm.tempRoleIds" multiple placeholder="请选择">
                            <el-option
                            v-for="item in roles"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-collapse-item> -->
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2, 1)" v-if="dialogTitle=='修改渠道付款申请'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1, 1)" v-else>立即创建</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2, 2)" v-if="dialogTitle=='修改渠道付款申请'">保存并审核</el-button>
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
                :list-type="dialofapiType == 'schedule_id' ? 'invoice' : ''"
                :table-type="dialofapiType == 'schedule_id' ? 'multipleTable' : 'singleTable'"
                :channel-payment-status="dialofapiType == 'schedule_id' ? 3 : ''"
                :dialofapi-type="dialofapiType"
                :media-id="dataForm.media_id"
                :schedule-ids="dataForm.schedule_ids"
                :source-page="1"
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
import { paymentList, paymentAdd, paymentEdit, getMediaList, scheduleList, allPerson, paymentAccountList, selectConfigType, paymentDel } from '@/api/permission'
import { 
    customerTypeList, 
    paymentLevelDefaultData, 
    paymentApplyRenderData, 
    scheduleTableRenderList, 
    paymentApprove, 
    mediaResourceRenderData, 
    paymentSort, 
    paymentAccountRenderData, 
    isReceive,
    payType,
    carryOver,
    transferCarryOver,
    paymentAccountStatusObj,
    paymentAccountStatus
  } from '../config.js'
import { permissionBtn } from '@/utils/permissionBtn.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import commonSearchLevel from '@/components/common-search-level'

import moment from 'moment'
export default {
    data() {
        return {
            showTable: false,
            paymentAccountStatus,
            paymentAccountStatusObj,
            dialogSelectTitle: '媒体资源',
            editApi: paymentEdit,
            isReceive,
            carryOver,
            transferCarryOver,
            payType,
            levelDefaultData: paymentLevelDefaultData,
            paymentSort,
            paymentApprove,
            dialofapi: '',
            dialofapiType: 'media_id',
            totalRecord: 0,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新增用户',

            listDialogTitle: '更改列表显示数据',
            rules: {
                name: [
                    {
                        required: true,
                        message: '渠道付款申请名称不能为空',
                        trigger: 'blur'
                    }
                ],
                media_name: [
                    {
                        required: true,
                        message: '媒体资源不能为空',
                        trigger: 'change'
                    }
                ],
                schedule_names: [
                    {
                        required: true,
                        message: '媒体排期不能为空',
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
                pay_status: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                pay_company_id: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                pay_type: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                pay_money: [
                    {
                        required: true,
                        message: '付款金额',
                        trigger: 'blur'
                    }
                ],
                channel_account_name_name: [
                    {
                        required: true,
                        message: '收款账号不可为空',
                        trigger: 'change'
                    }
                ]
            },
            searchData: {
                keyWord: '',
                page: 1,
                size: 10,
                dataType: 1,
                createTime: '',
                level_type: 1,
                payTime: ''
            },
            dataForm: {
                channel_account_name:{
                    name:''
                },
                channel_account_name_name: '',
                pay_money: '',
                pay_type: '',
                pay_company_id: '', 
                pay_status: '',
                invoice_status: '',
                schedule_names: '',
                media_name: '',
                name: '',
                aliaccount: '',
                phone: '',
                id_card: '',
                account_status: '',
                account_bank: '',
                account_name: ''
            },
            tableData: [],

            customerTypeList,
            loaded: false,
            tableRenderList:[],
            paymentApplyRenderData,
            activeNames:['1'],
            provinceList: [],
            cityList: [],
            areaList: [],

            selectCheckData: [],

            userListData: [],
            userData: {},
            payCompanyAccount: [],

            isCanEdit: false,
            btn_permission: {},
            selectRadio: '',
            myPayCompanyType: '',
            detailTableData: []
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
        this.getAllPerson()
        this.getPayCompanyAccount()
        
    },
    methods:{
        async initList() {
            const { searchData } = this
            searchData.start_time = searchData.createTime.length ? searchData.createTime[0] : ''
            searchData.end_time = searchData.createTime.length ? searchData.createTime[1] : ''
            searchData.pay_start_time = searchData.payTime.length ? searchData.payTime[0] : ''
            searchData.pay_end_time = searchData.payTime.length ? searchData.payTime[1] : ''
            const data = await paymentList(searchData)
            data.list.forEach(item => {
                item.schedule_names = item.schedule_detail.length ? item.schedule_detail.map((item)=>{
                    let obj = item
                    return obj.name
                }).join('、') : ''
            });
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
        async submitData(type, submit){
            const { dataForm, userData, payCompanyAccount } = this
            let companyData = payCompanyAccount.filter((item)=>{
                return item.id == dataForm.pay_company_id
            })
            dataForm.pay_company_name = companyData[0].name
            dataForm.belong_userid = type === 2 ? '' : userData.id
            dataForm.department_id = type === 2 ? '' : userData.department_id
            dataForm.submit = submit
            // dataForm.phone = dataForm.channel_account_name ? dataForm.channel_account_name.phone : ''
            // dataForm.id_card = dataForm.channel_account_name ? dataForm.channel_account_name.id_card : ''
            let { id, ...subData } = dataForm
            const data = type === 1 ? await paymentAdd(subData) : await paymentEdit(dataForm)
            this.$message({
                type: 'success',
                message: type === 1 ? '创建成功!' : '修改成功!'
            });
            this.$refs['dataForm'].resetFields();
            this.onSearch(1)
            this.dialogVisible = false
        },
        //我司打款账号
        async getPayCompanyAccount(){
            const data = await selectConfigType({type_id: 6})
            this.payCompanyAccount = data
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
            const data = await paymentDel({id:id})
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
            const { dataForm, dialofapiType, myPayCompanyType } = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('account_status', myPayCompanyType, dataForm.channel_account_name)
                    if((myPayCompanyType == 2 && [1,2,3].indexOf(dataForm.channel_account_name.channel_status) > -1 ) || (myPayCompanyType != 2 && [4, 5].indexOf(dataForm.channel_account_name.channel_status) > -1 )){
                        this.$message({
                            type: 'warning',
                            message: '我司打款账号和渠道收款账号类型不一致'
                        });    
                        return
                    }
                    this.submitData(type, submit)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //hidden
        hiddenTable(key){
            if(key == 'sure'){
                const { detailTableData } = this
                // 后台同事要求字段给他放到外层  搞不懂 从channel_account_name里面去就可以了
                this.dataForm.channel_account_name = detailTableData[0].channel_account_name
                this.dataForm.channel_account_id = detailTableData[0].channel_account_name.id
                this.dataForm.channel_account_name_name = detailTableData[0].channel_account_name.name
                this.dataForm.aliaccount = detailTableData[0].aliaccount 
                this.dataForm.phone = detailTableData[0].channel_account_name.phone
                this.dataForm.id_card = detailTableData[0].channel_account_name.id_card
                this.dataForm.account_status = detailTableData[0].channel_account_name.account_status
                this.dataForm.account_bank = detailTableData[0].channel_account_name.account_bank
                this.dataForm.account_name = detailTableData[0].channel_account_name.account_name
            }
            this.innerVisible = false
            this.showTable = false
        },
        // 单选
        checkRadioData(data) {
            // if(data.currentRowRadio == 'schedule_id'){
            //     this.searchData.schedule_id = data.id
            //     this.searchData.schedule_name = data.name
            //     this.dataForm.schedule_id = data.id
            //     this.dataForm.schedule_name = data.name
            // }else 
            if(data.currentRowRadio == 'media_id'){
                this.searchData.media_id = data.id
                this.searchData.media_name = data.name
                // this.dataForm.media_id = data.id
                // this.dataForm.media_name = data.name
            }
            // else{
            //     console.log('data',data)
            //     this.dataForm.channel_account_name = data
            //     this.dataForm.channel_account_id = data.id
            //     this.dataForm.aliaccount = data.aliaccount
            // }
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
            console.log('this.dataForm.schedule_names', this.dataForm.schedule_names)
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
            data.channel_account_name = data.channel_account_name == null ? {} : data.channel_account_name
            // data.channel_account_name_name = data.channel_account_name == null ? {} : data.channel_account_name.name
            this.dataForm.schedule_names  = data.schedule_detail ? data.schedule_detail.length ? data.schedule_detail.map((item)=>{
                let obj = item
                return obj.name
            }).join('、') : '' : ''
            this.dataForm = Object.assign({},data)
            this.dialogVisible = true;
            this.dialogTitle = '修改渠道付款申请'
            this.isCanEdit = notEdit.indexOf(this.dataForm.type) > -1 ? true : false
            this.detailTableData = data.schedule_detail
            this.getPayCompanyType(data.pay_company_id)
        },
        goGetData(api, key, type){
            if(type == 'submit'){
                this.selectRadio = this.dataForm[key]
                console.log('this.selectRadio', this.selectRadio)
            }
            // if((api == 'scheduleList' || api == 'paymentaccountList') && (!this.dataForm.media_name || !this.dataForm.media_id)){
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
                this.innerVisible = true
            }else{
                this.tableRenderList = paymentAccountRenderData
                this.dialofapi = paymentAccountList
                this.dialofapiType = 'channel_account_id'
                this.dialogSelectTitle = '渠道收款账号'
            }
            this.showTable = true
        },
        getCurrentKey(checkedNodes,checkedKeys){
            console.log('keys',checkedNodes,checkedKeys)
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
            this.dialogTitle = '新建渠道付款申请'
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
        },
        getPayCompanyType(val){
            const { payCompanyAccount } = this
            let myPayCompanyType = payCompanyAccount.filter((item)=>{
                return item.id == val
            })
            this.myPayCompanyType = myPayCompanyType[0].level_type
        },
        getExcel(){
            const { dataForm } = this
            let jsonData = [{
                service_type: '互联网科技',
                start_time: '2022/4/1',
                end_time: '2022/5/1',
                service_content: '信息服务费',
                remark: '',
                settlement_money: dataForm.pay_money,
                name: dataForm.channel_account_name.name,
                id_card: dataForm.channel_account_name.id_card,
                phone: dataForm.channel_account_name.phone,
                account_name: dataForm.channel_account_name.account_name
            }]
            // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
            let str = `服务类型,开始日期,结束日期,服务内容,打款附言(10个字以内，非必填),结算金额,经营者姓名,身份证号,手机号码,收款账户\n`;
            //增加\t为了不让表格显示科学计数法或者其他格式
            for (let i = 0; i < jsonData.length; i++) {
                for (let item in jsonData[i]) {
                    str += `${jsonData[i][item] + '\t'},`;
                }
                str += '\n';
            }
            //encodeURIComponent解决中文乱码
            let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
            //通过创建a标签实现
            var link = document.createElement("a");
            link.href = uri;
            //对下载的文件命名
            link.download = "第三方附件.xls";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        getExcelTwo(){
            const { dataForm } = this
            let jsonData = [{
                service_type: '互联科技',
                start_time: '',
                end_time: '',
                service_content: '',
                remark: '',
                settlement_money: dataForm.pay_money,
                name: dataForm.channel_account_name.name,
                id_card: dataForm.channel_account_name.id_card,
                phone: dataForm.channel_account_name.phone,
                account_name: dataForm.channel_account_name.account_name
            }]
            //新方法
            // 服务类型,开始日期,结束日期,服务内容,打款附言,结算金额,经营者姓名,身份证号,手机号码,收款账户
            let str = '<tr><td>服务类型</td><td>开始日期</td><td>结束日期</td><td>服务内容</td><td>打款附言</td><td>结算金额</td><td>经营者姓名</td><td>身份证号</td><td>手机号码</td><td>收款账户</td></tr>';
            //循环遍历，每行加入tr标签，每个单元格加td标签
            for(let i = 0 ; i < jsonData.length ; i++ ){
                str+='<tr>';
                for(let item in jsonData[i]){
                    //增加\t为了不让表格显示科学计数法或者其他格式
                    str+=`<td>${ jsonData[i][item] + '\t'}</td>`;     
                }
                str+='</tr>';
            }
            //Worksheet名
            let worksheet = 'Sheet1'
            let uri = 'data:application/vnd.ms-excel;base64,';
        
            //下载的表格模板数据
            let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel" 
            xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
                <x:Name>${worksheet}</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
                </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                </head><body><table>${str}</table></body></html>`;
            //下载模板
            window.location.href = uri + this.toBase64(template)
        },
        toBase64 (s) { 
            return window.btoa(unescape(encodeURIComponent(s))) 
        },
        getExcelThree(){
            const { dataForm } = this
            let jsonData = [{
                service_type: '互联网科技',
                start_time: '2022/4/1',
                end_time: '2022/5/1',
                service_content: '信息服务费',
                remark: '',
                settlement_money: dataForm.pay_money,
                name: dataForm.channel_account_name.name,
                id_card: dataForm.channel_account_name.id_card,
                phone: dataForm.channel_account_name.phone,
                account_name: dataForm.channel_account_name.account_name
            }]
            let csvStr = jsonData.map((item) => {

            // 加\t是为了不让数字以科学计数法显示。

            let valueList = Object.keys(item).map((key) => item[key])

            return valueList.join(',\t')

            })

            csvStr = '服务类型,开始日期,结束日期,服务内容,打款附言(10个字以内，非必填),结算金额,经营者姓名,身份证号,手机号码,收款账户\n' + csvStr.join(',\n')



            // encodeURIComponent解决中文乱码。

            const href = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvStr)

            const aHtml = document.createElement('a')

            aHtml.download = '第三方附件.xlsx' // 通过修改后缀名伪装成Excel

            aHtml.href = href

            aHtml.click()


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
.fl .el-input .el-input__inner, .fl .el-select .el-input__inner{
    width: 200px!important;
}
</style>
