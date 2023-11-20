<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="客户名称" class="">
                    <el-input v-model="searchData.name" placeholder="请输入客户名称" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="客户所有人" class="m-l-20">
                    <el-select v-model="searchData.belong_userid" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in userListData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户联系人" class="m-l-20">
                    <el-input v-model="searchData.linkman" placeholder="请输入客户联系人" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="客户级别" class="m-l-20">
                    <el-select v-model="searchData.level" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in customerLevel"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行业类型" class="m-l-20">
                    <el-select v-model="searchData.business_type" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in industryData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="searchData.phone" placeholder="请输入客户联系方式" @keyup.enter.native="onSearch(1)"></el-input>
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
                <!-- <el-form-item class="block m-l-20" label="到期日期">
                    <el-date-picker
                    v-model="searchData.expireTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item> -->
                <el-form-item label="排序方式" class="m-l-20">
                    <el-select v-model="searchData.sort" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in customerSortList"
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
                    :is-only="1"
                    :default-data="levelDefaultData"
                    @levelList="getLevelValue"/>
                </el-form-item>
                <!-- <el-form-item label="" class="search-input">
                    <el-input v-model="searchData.keyWord" placeholder="搜索此列表" suffix-icon="el-icon-search"></el-input>
                </el-form-item> -->
            </el-form>
            <div class="tools-bar">
                <!-- <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
                <el-button type="primary" icon="el-icon-plus"  @click="addDialogData">新建客户</el-button>
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
        :table-render-list="tableRenderList"
        :list-dialog-title="listDialogTitle"
        :is-can-set="false"
        :table-type="'multipleTable'"
        :edit-api="editApi"
        @updateList="search_fincerecord"
        @seeDetail="seeDetail"
        @checkItem="checkData"/>
      <div class="pagination-bar">
        <el-pagination
          @limit-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-limit="searchData.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()" width="70%">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="100px">
        <el-collapse v-model="activeNames" @change="handleCollapseChange">
            <el-collapse-item title="基本信息" name="1" class="bg-f5">
                <div class="flex">
                    <!-- <el-form-item label="客户类型" prop="type"  style="width:25%;">
                        <el-select v-model="dataForm.type" disabled placeholder="请选择">
                            <el-option
                            v-for="item in roles"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="客户所有人" prop="belong_userid" style="width:25%;" label-width="100px">
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
                <div>
                    <el-form-item label="客户名称" prop="name" style="width:25%;">
                        <!-- <template v-if="dialogTitle=='修改客户信息'">{{dataForm.loginName}}</template> -->
                        <el-input v-model.trim="dataForm.name" placeholder="请输入客户名称"></el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="客户联系人" prop="linkman"  style="width:25%;">
                        <el-input v-model.trim="dataForm.linkman" placeholder="请输入客户联系人"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="客户微信或QQ" prop="link_type" style="width:25%;" label-width="120" class="m-l-40">
                        <el-select v-model="dataForm.link_type" placeholder="请选择">
                            <el-option
                            v-for="item in qqOrWechart"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="手机号" prop="phone"  style="width:25%;">
                        <el-input v-model.trim="dataForm.phone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ" prop="link_qq" style="width: 25%;">
                        <el-input v-model="dataForm.link_qq" placeholder="请输入QQ号"></el-input>
                    </el-form-item>
                    <el-form-item label="微信" prop="link_wx" style="width: 25%;">
                        <el-input v-model="dataForm.link_wx" placeholder="请输入微信号"></el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <!-- <el-form-item label="电话" prop="tel_phone"  style="width:25%;">
                        <el-input v-model="dataForm.tel_phone" placeholder="请输入电话"></el-input>
                    </el-form-item> -->
                    <el-form-item label="行业类型" prop="business_type" style="width:25%;">
                        <el-select v-model="dataForm.business_type" placeholder="请选择" :disabled="industryIsFix">
                            <el-option
                            v-for="item in industryData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户级别" prop="level" style="width:25%;" >
                        <el-select v-model="dataForm.level" placeholder="请选择">
                            <el-option
                            v-for="item in customerLevel"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="省" prop="province" style="width:25%;">
                        <el-select v-model="dataForm.province" placeholder="请选择省份" @change="getProviceData('city')">
                            <el-option
                            v-for="item in provinceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="市" prop="city" style="width:25%;">
                        <el-select v-model="dataForm.city" placeholder="请选择市" @change="getProviceData('area')">
                            <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区" prop="area" style="width:25%;">
                        <el-select v-model="dataForm.area" placeholder="请选择区" @change="getProviceData('1')">
                            <el-option
                            v-for="item in areaList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="详细地址" prop="address"  style="width:25%;">
                        <el-input v-model="dataForm.address" placeholder="请输入详细地址"></el-input>
                    </el-form-item>
                    <el-form-item label="客户来源" prop="origin" style="width:25%;">
                        <el-select v-model="dataForm.origin" placeholder="请选择客户来源">
                            <el-option
                            v-for="item in sourceData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="备注" prop="description" style="width: 50%;">
                        <el-input type="textarea" :rows="4" v-model="dataForm.description" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </div>
            </el-collapse-item>
            <el-collapse-item title="客户开票信息" name="2">
                <div class="flex">
                    <el-form-item label="开票抬头" prop="invoice_title"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_title" placeholder="请输入开票抬头"></el-input>
                    </el-form-item>
                    <el-form-item label="开票账户" prop="invoice_account"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_account" placeholder="请输入开票账户"></el-input>
                    </el-form-item>
                    <el-form-item label="开户行" prop="invoice_bank"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_bank" placeholder="请输入开户行"></el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="开票税号" prop="invoice_tax"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_tax" placeholder="请输入开票税号"></el-input>
                    </el-form-item>
                    <el-form-item label="开票地址" prop="invoice_address"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_address" placeholder="请输入开票地址"></el-input>
                    </el-form-item>
                    <el-form-item label="开票电话" prop="invoice_phone"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_phone" placeholder="请输入开票电话"></el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="发票邮寄信息" prop="invoice_to_address"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_to_address" placeholder="请输入发票邮寄信息"></el-input>
                    </el-form-item>
                </div>
            </el-collapse-item>
            <!-- <el-collapse-item title="数据权限" name="3">
                <div class="flex">
                    <el-form-item label="所属部门" prop="department" style="width:25%;">
                        <el-select v-model="dataForm.department" placeholder="请选择所属部门">
                            <el-option
                            v-for="item in customerSource"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            @change="getProviceData">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属公海" prop="openSea" style="width:25%;" class="m-l-40">
                        <el-select v-model="dataForm.openSea" placeholder="请选择所属公海">
                            <el-option
                            v-for="item in customerSource"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            @change="getProviceData">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-collapse-item> -->
            <el-collapse-item title="上级客户" name="4">
                <div class="flex">
                    <el-form-item label="上级客户" prop="cname"  style="width:25%;" >
                        <el-input v-model="dataForm.cname" placeholder="请输入上级客户" @focus="goGetData('cid', 'submit')">
                            <i
                                class="el-icon-plus el-input__icon color-409"
                                slot="suffix"
                               @click="goGetData('cid', 'submit')">
                            </i>
                        </el-input>
                    </el-form-item>
                </div>
            </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2)" v-if="dialogTitle=='修改客户信息'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1)" v-else>立即创建</el-button>
      </div>
    </el-dialog>
    <el-dialog
        width="70%"
        title="上级客户"
        :visible.sync="innerVisible">
        <div>
            <!-- 公共可操作列表 -->
            <commonDialogTable
                :table-data-api="dialofapi"
                :table-render-list="customerTableRenderList"
                :list-dialog-title="listDialogTitle"
                :select-radio="selectRadio"
                :is-can-set="false"
                :table-type="'singleTable'"
                @updateList="search_fincerecord"
                @checkItemRadio="checkRadioData"
                @hiddenTable="hiddenTable"/>
        </div>
    </el-dialog>
  </el-card>
  </div>
</template>
<script>
import { 
    getUserList, 
    getCustomerList, 
    addCustomer, 
    editCustomer, 
    delCustomer, 
    addconfirmCustomer, 
    selectConfigType, 
    userList, 
    allPerson,
    getProvince
    } from '@/api/permission'
import { customerTypeList, customerRenderData, customerSortList, customerLevel, customerLevelDefaultData } from '../config.js'
import { permissionBtn } from '@/utils/permissionBtn.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import commonSearchLevel from '@/components/common-search-level'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
    data() {
        return {
            editApi: editCustomer,
            levelDefaultData: customerLevelDefaultData,
            customerLevel,
            customerSortList,
            dialofapi: getCustomerList,
            totalRecord: 0,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新建客户',

            listDialogTitle: '更改列表显示数据',
            roles: [
                {
                    id: 1,
                    roleName: '超级管理员'
                },
                {
                    id: 2,
                    roleName: '普通用户'
                }
            ],
            qqOrWechart: [
                {
                    id: 1,
                    name: '微信'
                },
                {
                    id: 2,
                    name: 'QQ'
                }
            ],
            rules: {
                // cty: [
                //     {
                //         required: true,
                //         message: '客户类型不可为空',
                //         trigger: 'change'
                //     }
                // ],
                name: [
                    {
                        required: true,
                        message: '客户名称不可为空',
                        trigger: 'blur'
                    }
                ],
                linkman: [
                    {
                        required: true,
                        message: '客户联系人不可为空',
                        trigger: 'blur'
                    }
                ],
                phone: [
                    { required: false, message: '请输入手机号', trigger: 'blur' },
                    {
                        pattern: /^(13|15|18|14|17|16|19)[0-9]{9}$/,
                        message: '手机号码格式不正确',
                        trigger: 'blur'
                    }
                ],
                business_type: [
                    {
                        required: true,
                        message: '行业类型不可为空',
                        trigger: 'change'
                    }
                ],
                // link_type: [
                //     {
                //         required: true,
                //         message: '请选择',
                //         trigger: 'change'
                //     }
                // ],
                level: [
                    {
                        required: true,
                        message: '请选择客户级别',
                        trigger: 'change'
                    }
                ]
            },
            searchData: {
                keyWord: '',
                page: 1,
                limit: 10,
                createTime: [],
                name: '',
                belong_userid: '',
                linkman: '',
                level: '',
                level_type: 1,
                business_type: '',
                phone: '',
                start_time: '',
                end_time: '',
                sort: ''
            },
            dataForm: {
                cname: '',
                invoice_to_address: '',
                invoice_phone: '',
                invoice_address: '',
                invoice_tax: '',
                invoice_bank: '',
                invoice_account: '',
                invoice_title: '',
                description: '',
                origin: '',
                address: '',
                area: '',
                city: '',
                province: '',
                level: '',
                business_type: '',
                tel_phone: '',
                link_phone: '',
                phone: '',
                link_type: '',
                link_qq: '',
                link_wx: '',
                linkman: '',
                type: '',
                belong_userid: '',
                name: ''
            },
            tableData: [],

            customerTypeList,
            tableRenderList: customerRenderData,
            customerTableRenderList: customerRenderData,
            
            activeNames:['1'],
            provinceList: [],
            cityList: [],
            areaList: [],

            selectCheckData: [],
            industryData: [],//行业类型
            industryIsFix: false,
            sourceData: [],//客户来源
            userListData: [],//用户列表
            userData: {},
            btn_permission: {},
            selectRadio: ''
        }
    },
    components:{
        commonTable,
        commonDialogTable,
        commonSearchLevel
    },
    computed: {
        // ...mapState('permission', 'btn_permission')
    },
    created() {
        this.tableRenderList = customerRenderData
        this.userData = this.$store.state.permission.userData
        this.btn_permission = permissionBtn(this.$route.name)
        console.log('permissionBtn(this.$route.name)',permissionBtn(this.$route.name))
        this.initList()
        this.getIndustryData()
        this.getUserList()
        this.getProviceData()
    },
    methods: {        
        // 客户列表
        async initList() {
            const { searchData } = this
            searchData.start_time = searchData.createTime.length ? searchData.createTime[0] : ''
            searchData.end_time = searchData.createTime.length ? searchData.createTime[1] : ''
            const data = await getCustomerList(searchData)
            this.tableData = data.list
            this.totalRecord = data.total
        },
        async submitData(type){
            try{
                console.log('?????')
                const { dataForm, userData, provinceList, cityList, areaList } = this
                const { province, city, area } = this.dataForm
                let provinceData = provinceList.length ? provinceList.filter((item)=>{
                    return item.id == province
                }) : ''
                let cityData = cityList.length ? cityList.filter((item)=>{
                    return item.id == city
                }) : ''
                let areaData = areaList.length ? areaList.filter((item)=>{
                    return item.id == area
                }) : ''
                dataForm.province = provinceData.length ? provinceData[0].name : ''
                dataForm.province_code = provinceData.length ? provinceData[0].id : ''
                dataForm.city = cityData.length ? cityData[0].name : ''
                dataForm.city_code = cityData.length ? cityData[0].id : ''
                dataForm.area = areaData.length ? areaData[0].name : ''
                dataForm.area_code = areaData.length ? areaData[0].id : ''
                dataForm.belong_userid = type === 2 ? '' : userData.id
                dataForm.department_id = type === 2 ? '' : userData.department_id
                let { id, ...subData } = dataForm
                const data = type === 1 ? await addCustomer(subData) : await editCustomer(dataForm)
                this.$message({
                    type: 'success',
                    message: type === 1 ? '创建成功!' : '修改成功!'
                });
                this.$refs['dataForm'].resetFields();
                this.onSearch(1)
                this.dialogVisible = false
            }catch(error){
                if(error.code === 201){
                    this.$confirm(error.msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.secondarySubmitData()
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });          
                    });
                }
                
            }
        },
        // 如果用户已存在二次确认接口
        async secondarySubmitData(type){
            const { dataForm } = this
            const data = await addconfirmCustomer(dataForm)
            this.$message({
                type: 'success',
                message: '创建成功!'
            });
            this.$refs['dataForm'].resetFields();
            this.onSearch(1)
            this.dialogVisible = false
        },
        //行业类型
        async getIndustryData(){
            const data = await selectConfigType({type_id: 1})
            this.industryData = data
            this.customerSource()
            
        },     
        async customerSource(){
            const { tableRenderList, industryData } = this
            const data = await selectConfigType({type_id: 5})
            this.sourceData = data
            let businessJudgeData = this.toObj(industryData)
            let originJudgeData = this.toObj(data)
            this.tableRenderList.forEach((item)=>{
                item.judge = item.prop == 'business_type' ? businessJudgeData : item.prop == 'origin' ? originJudgeData : {}
            })
            console.log('judgeData', this.tableRenderList)
        },   
        async getUserList(){
            let param = {
                path: this.$route.name,
                level: this.searchData.level_type
            }
            const data = await allPerson(param)
            this.userListData = data
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
            const data = await delCustomer({id:id})
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
        toObj(list){
            let info = {}
            list.forEach(element => {
                info[element.id] = element.name
            });
            return info
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
            console.log('val', val)
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
        handleEdit(index, row) {
            this.dialogVisible = true
            this.dialogTitle = '修改客户信息'
            this.dataForm.tempRoleIds = []
            for (let x of Object.keys(this.dataForm)) {
                if (
                    x === 'tempRoleIds' &&
                    typeof row.roleList === 'object' &&
                    row.roleList.length > 0
                ) {
                    for (let item of row.roleList) {
                        this.dataForm.tempRoleIds.push(item.id)
                    }
                } else {
                    this.dataForm[x] = row[x]
                }
            }
        },
        onDialogSubmit(formName, type) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitData(type)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        
        //hidden
        hiddenTable(key){
            this.innerVisible = false
        },
        
        // 单选
        checkRadioData(data) {
            this.dataForm.cname = data.name
            this.dataForm.cid = data.id
        },
        submitRadioData() {
            // 上级客户数据
            this.innerVisible = false
        },
        //复选
        checkData(data) {
            this.selectCheckData = data
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
            console.log('tableRenderList', tableRenderList)
            this.searchData.page = 1
            let list = tableRenderList.map((item)=>{
                let obj = item
                obj.isInput = false
                return obj
            })
            this.tableRenderList = list
            this.initList()
        },
        
        handleCollapseChange(val){
            console.log('val',val)
        },

        goGetData(key, type){
            if(type == 'submit'){
                this.selectRadio = this.dataForm[key]
                console.log('this.selectRadio', this.selectRadio)
            }
            this.innerVisible = true
        },
        seeDetail(data){
            const { btn_permission } = this
            if(!btn_permission.edit.isHas){
                this.$message.error('无权操作')
                return 
            }
            data.origin = data.origin ? data.origin : ''
            this.dataForm = Object.assign({},data)
            this.dialogVisible = true;
            this.dialogTitle = '修改客户信息'
            this.getpcaData('city')
            this.getpcaData('area')
        },
        addDialogData(){
            const { btn_permission } = this
            console.log('btn_permission',btn_permission)
            if(!btn_permission.add.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dialogVisible = true;
            this.dialogTitle = '新建客户'
            this.isCanEdit = false
            // this.$refs['dataForm'].resetFields()
            this.restDataFormValue()

        },
        getLevelValue(type){
            this.searchData.level_type = type
            this.getUserList()
            this.initList()
        },
        //省市区数据
        async getProviceData(type){
            const { province, city, area } = this.dataForm
            console.log('this.dataForm',this.dataForm)
            if(type == 1){
                return
            }
            let param = {
                id: type ? type == 'city' ? province : city : '',
                level: type ? type == 'city' ? 2 : 3 : 1
            }
            const data = await getProvince(param)
            if(!type){
                this.provinceList = data
                return
            }
            if( type == 'city' ){
                this.cityList = data
                return
            }
            if( type == 'area'){
                this.areaList = data
            }
        },
        // 获取编辑数据
        async getpcaData(type){
            const { province_code, city_code, area_code } = this.dataForm
            let param = {
                id: type ? type == 'city' ? province_code : city_code : '',
                level: type ? type == 'city' ? 2 : 3 : 1
            }
            const data = await getProvince(param)
            if( type == 'city' ){
                this.cityList = data
                return
            }
            if( type == 'area'){
                this.areaList = data
            }
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
.search-bar .el-form-item{
    margin-bottom: 12px;
}
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
