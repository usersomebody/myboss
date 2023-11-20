<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="姓名" class="">
                    <el-input v-model="searchData.name" placeholder="请输入客户名称" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="所有人" class="m-l-20">
                    <el-select v-model="searchData.belong_userid" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in userListData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司名称" class="m-l-20">
                    <el-input v-model="searchData.customer_name" placeholder="请输入">
                        <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData('customer_id', 'search')">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="联系方式"  class="m-l-20">
                    <el-input v-model="searchData.phone" placeholder="请输入客户联系方式" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item class="block" label="创建日期">
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
                <el-form-item label="排序方式">
                    <el-select v-model="searchData.sort" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in sortList"
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
        <div class="search-bar" v-if="!selectCheckData.length">
            <el-form :inline="true" :model="searchData" class="fl" style="width:81%;">
                <el-form-item label="">
                    <commonSearchLevel
                    :default-data="levelDefaultData"
                    @levelList="getLevelValue"/>
                </el-form-item>
                <!-- <el-form-item label="" class="search-input">
                    <el-input v-model="searchData.keyWord" placeholder="搜索此列表" suffix-icon="el-icon-search"></el-input>
                </el-form-item> -->
            </el-form>
            <div class="tools-bar">
                <!-- <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
                <el-button type="primary" icon="el-icon-plus"  @click="addDialogData">新增联系人</el-button>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="searchData.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()" width="35%" >
      <el-scrollbar style="height:720px;">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="100px">
            <el-form-item label="联系人所有人" prop="accountOwner" style="width:70%;"  label-width="100px">
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
            <el-form-item label="公司名称" prop="customer_name"  style="width:70%;">
                <el-input v-model="dataForm.customer_name" placeholder="请选择" @focus="goGetData('customer_id', 'submit')">
                    <i
                        class="el-icon-plus el-input__icon color-409"
                        slot="suffix"
                        @click="goGetData('customer_id', 'submit')">
                    </i>
                </el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name" style="width:70%;">
                <el-input v-model.trim="dataForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone"  style="width:70%;">
                <el-input v-model.trim="dataForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="部门职务" prop="job"  style="width:70%;">
                <el-input v-model.trim="dataForm.job" placeholder="请输入部门职务"></el-input>
            </el-form-item>
            <el-form-item label="关系程度" prop="relation"  style="width:70%;">
                <el-select v-model="dataForm.relation" placeholder="请选择关系程度">
                    <el-option
                    v-for="item in relationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="微信号" prop="wx_code"  style="width:70%;">
                <el-input v-model="dataForm.wx_code" placeholder="请输入微信号"></el-input>
            </el-form-item>
            <el-form-item label="QQ" prop="qq_code"  style="width:70%;">
                <el-input v-model="dataForm.qq_code" placeholder="请输入QQ号"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="tel_phone"  style="width:70%;">
                <el-input v-model="dataForm.tel_phone" placeholder="请输入电话"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件" prop="email"  style="width:70%;">
                <el-input v-model="dataForm.email" placeholder="请输入电子邮件"></el-input>
            </el-form-item>
            <el-form-item label="长驻地址" prop="address"  style="width:70%;">
                <el-input v-model="dataForm.address" placeholder="请输入长驻地址"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex" style="width:70%;">
                <el-select v-model="dataForm.sex" placeholder="请选择">
                    <el-option
                    v-for="item in sexType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="免打扰" prop="disturb" style="width: 70%;">
                <el-switch v-model="dataForm.disturb">
                </el-switch>
            </el-form-item>
            <el-form-item label="备注" prop="description" style="width: 70%;">
                <el-input type="textarea" :rows="4" v-model="dataForm.description" placeholder="请输入内容"></el-input>
            </el-form-item>
            <!-- <el-form-item label="所属部门" prop="department"  style="width:70%;">
                <el-input v-model="dataForm.department" placeholder="部门名称">
                    <i
                        class="el-icon-plus el-input__icon"
                        slot="suffix"
                        @click="goGetData('disable')">
                    </i>
                </el-input>
            </el-form-item> -->
            <el-form-item label="出生日期" prop="birthday_name"  style="width:70%;">
                <el-date-picker
                v-model="dataForm.birthday_name"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
      </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2)" v-if="dialogTitle=='修改联系人信息'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1)" v-else>立即创建</el-button>
      </div>
    </el-dialog>
    <el-dialog
        width="70%"
        title="公司名称"
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
import { getUserList, getCustomerList, getContactsList, editContacts, addContacts, delContacts, userList, allPerson } from '@/api/permission'
import { customerTypeList, contactsRenderData, customerSortList, customerRenderData, relationList, contactsLevelDefaultData } from '../config.js'
import { permissionBtn } from '@/utils/permissionBtn.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import commonSearchLevel from '@/components/common-search-level'

import moment from 'moment'
export default {
    data() {
        return {
            editApi: editContacts,
            levelDefaultData: contactsLevelDefaultData,
            dialofapi: getCustomerList,
            totalRecord: 0,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新增用户',

            listDialogTitle: '更改列表显示数据',
            sexType: [
                {
                    id: 0,
                    name: '未知'
                },
                {
                    id: 1,
                    name: '男'
                },
                {
                    id: 2,
                    name: '女'
                }
            ],
            rules: {
                customer_name: [
                    {
                        required: true,
                        message: '公司名称不能为空',
                        trigger: 'change'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '真实姓名不能为空',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 20,
                        message: '真实姓名长度在 1 到 20 个字符',
                        trigger: 'blur'
                    }
                ],
                phone: [
                    {
                        required: false,
                        message: '联系电话不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(13|15|18|14|17)[0-9]{9}$/,
                        message: '手机号码格式不正确',
                        trigger: 'blur'
                    }
                ],
                job: [
                    {
                        required: true,
                        message: '请输入部门职务',
                        trigger: 'blur'
                    }
                ]
                // department: [
                //     {
                //         required: true,
                //         message: '请输入部门名称',
                //         trigger: 'blur'
                //     }
                // ]
            },
            searchData: {
                keyWord: '',
                page: 1,
                limit: 10,
                createTime: [],
                name: '',
                belong_userid: '',
                phone: '',
                start_time: '',
                end_time: '',
                sort: '',
                customer_id: '',
                level_type: 1,
            },
            dataForm: {
                birthday_name: '',
                description: '',
                disturb: '',
                sex: '',
                address: '',
                email: '',
                tel_phone: '',
                qq_code: '',
                wx_code: '',
                relation: '',
                job: '',
                phone: '',
                name: '',
                customer_name: ''
            },
            tableData: [],

            customerTypeList,
            tableRenderList: contactsRenderData,
            customerTableRenderList: customerRenderData,
            sortList: customerSortList,
            selectCheckData: [],

            userListData: [],
            userData: {},
            relationList,
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
        this.getUserList()
    },
    methods: {
        async initList() {
            const { searchData } = this
            searchData.start_time = searchData.createTime.length ? searchData.createTime[0] : ''
            searchData.end_time = searchData.createTime.length ? searchData.createTime[1] : ''
            const data = await getContactsList(searchData)
            this.tableData = data.list
            this.totalRecord = data.total
        },
        async getUserList(){
            let param = {
                path: this.$route.name,
                level: this.searchData.level_type
            }
            const data = await allPerson(param)
            this.userListData = data
        }, 
        async submitData(type){
            const { dataForm, userData } = this
            dataForm.disturb = dataForm.disturb ? 2 : 1
            dataForm.belong_userid = type === 2 ? '' : userData.id
            dataForm.department_id = type === 2 ? '' : userData.department_id
            dataForm.birthday = dataForm.birthday_name
            let { id, ...subData } = dataForm
            const data = type === 1 ? await addContacts(subData) : await editContacts(dataForm)
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
            const data = await delContacts({id:id})
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
            this.searchData.customer_id = data.id
            this.searchData.customer_name = data.name

            this.dataForm.customer_id = data.id
            this.dataForm.customer_name = data.name
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
            this.searchData.page = 1
            let list = tableRenderList.map((item)=>{
                let obj = item
                obj.isInput = false
                return obj
            })
            this.tableRenderList = list
            // this.getList()
        },
        seeDetail(data){
            const { btn_permission } = this
            if(!btn_permission.edit.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dataForm = Object.assign({},data)
            this.dataForm.disturb = this.dataForm.disturb == 2 ? true : false
            this.dialogVisible = true;
            this.dialogTitle = '修改联系人信息'
        },
        addDialogData(){
            const { btn_permission } = this
            if(!btn_permission.add.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dialogVisible = true;
            this.dialogTitle = '新增联系人'
            this.isCanEdit = false
            // this.$refs['dataForm'].resetFields()
            this.restDataFormValue()
        },
        goGetData(key, type){
            if(type == 'submit'){
                this.selectRadio = this.dataForm[key]
                console.log('this.selectRadio', this.selectRadio)
            }
            this.innerVisible = true
        },
        getLevelValue(type){
            this.searchData.level_type = type
            this.getUserList()
            this.initList()
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
.v-c-center{
    display: flex;
    // justify-content: center;
    justify-content: flex-start;
    align-items: center;    
}
.m-l-40{
    margin-left:40px;
}
.m-l-20{
    margin-left: 20px;
}
.pagination-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top:20px;
}
.font-12{
    font-size:12px;
}
.color-ccc{
    color:#ccc;
}
.color-158{
    color:#1587ce;
}
.account-info{
    margin-left:20px;
}
.scrollbar-wrapper {
    overflow-x: hidden !important;
}
.vertical-line{
    height:20px;
    width:1px;
    background:#ccc;
    margin:0 20px;
}
.m-b-20{
    margin-bottom:20px;
}
.color-409{
    color: #409EFF;
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
