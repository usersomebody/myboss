<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="渠道收款账号名称" class="">
                    <el-input v-model="searchData.name" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="对应媒体资源" class="m-l-20">
                    <el-input v-model="searchData.media_name" placeholder="请输入">
                        <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData('media_id', 'search')">
                        </i>
                    </el-input>
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
                <el-form-item label="渠道收款账号性质">
                    <el-select v-model="searchData.channel_status" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in carryOver"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款账号状态" class="m-l-10">
                    <el-select v-model="searchData.account_status" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in paymentAccountStatus"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款开户行" class="m-l-10">
                    <el-input v-model="searchData.account_bank" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="收款账号" class="m-l-10">
                    <el-input v-model="searchData.account_name" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="排序方式">
                    <el-select v-model="searchData.sort" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in paymentAccountSort"
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
                    <el-input v-model="searchData.keyWord" placeholder="搜索此列表" suffix-icon="el-icon-search"></el-input>
                </el-form-item> -->
            </el-form>
            <div class="tools-bar">
                <!-- <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
                <el-button type="primary" icon="el-icon-plus"  @click="addDialogData">新建渠道付款账号</el-button>
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
        :table-render-list="paymentAccountRenderData"
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px">
        <el-collapse v-model="activeNames" @change="handleCollapseChange">
            <el-collapse-item title="基本信息" name="1" class="bg-f5">
                <el-form-item label="所有人" prop="accountOwner" style="width:70%" label-width="140px">
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
                <el-form-item label="媒体资源" prop="media_name"  style="width:70%">
                    <el-input v-model="dataForm.media_names" placeholder="请输入媒体资源" @focus="goGetData('media_id', 'submit')">
                        <i
                            class="el-icon-plus el-input__icon color-409"
                            slot="suffix"
                            @click="goGetData('media_id', 'submit')">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="渠道收款账号性质" prop="channel_status"  style="width:70%">
                    <el-select v-model="dataForm.channel_status"  :disabled="isCanEdit" placeholder="请选择" @change="getChannelStatusVal">
                        <el-option
                        v-for="item in carryOver"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道收款账号名称" prop="name" style="width:70%">
                    <el-input v-model.trim="dataForm.name" :disabled="isCanEdit" placeholder="请输入渠道收款的账号名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="收款账号状态" prop="account_status"  style="width:70%">
                    <el-select v-model="dataForm.account_status"  :disabled="isCanEdit" placeholder="请选择">
                        <el-option
                        v-for="item in paymentAccountStatus"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款开户行" prop="account_bank" style="width:70%">
                    <el-input v-model.trim="dataForm.account_bank" :disabled="isCanEdit" placeholder="请输入收款开户行">
                    </el-input>
                </el-form-item>
                <el-form-item label="收款账号" prop="account_name" style="width:70%">
                    <el-input v-model.trim="dataForm.account_name" :disabled="isCanEdit" type="number" placeholder="请输入收款账号">
                    </el-input>
                </el-form-item>
                <el-form-item label="对私收款人身份证号" prop="id_card" style="width:70%">
                    <el-input v-model="dataForm.id_card" :disabled="isCanEdit" placeholder="请输入对私收款人身份证号">
                    </el-input>
                </el-form-item>
                <el-form-item label="对私收款人手机号" prop="phone" style="width:70%">
                    <el-input v-model="dataForm.phone" :disabled="isCanEdit" placeholder="请输入对私收款人手机号">
                    </el-input>
                </el-form-item>
                <el-form-item label="备注" prop="description" style="width: 70%;">
                    <el-input type="textarea" :rows="4" v-model="dataForm.description" :disabled="isCanEdit" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2, 1)" v-if="dialogTitle=='修改渠道账号信息'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1, 1)" v-else>立即创建</el-button>
        <!-- <el-button type="info" @click="onDialogSubmit('dataForm', 2, 2)" v-if="dialogTitle=='修改渠道账号信息'">保存并审核</el-button> -->
        <!-- <el-button type="primary" @click="onDialogSubmit('dataForm', 1, 2)" v-else>创建并审核</el-button> -->
      </div>
    </el-dialog>
    <el-dialog
        width="70%"
        :title="dialogSelectTitle"
        :visible.sync="innerVisible">
        <div>
            <!-- 公共可操作列表 -->
            <commonDialogTable
                :table-data-api="dialofapi"
                :table-render-list="tableRenderList"
                :list-dialog-title="listDialogTitle"
                :dialofapi-type="'media_id'"
                :select-radio="selectRadio"
                :is-can-set="false"
                :table-type="'multipleTable'"
                channel-account="1"
                :schedule-ids="dataForm.media_ids"
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
import { paymentAccountList, getMediaList, allPerson, paymentAccountAdd, paymentAccountEdit, paymentAccountDel } from '@/api/permission'
import { 
    customerTypeList, 
    customerRenderData, 
    paymentAccountRenderData, 
    paymentAccountLevelDefaultData, 
    paymentAccountSort, 
    mediaResourceRenderData, 
    carryOver, 
    paymentAccountStatus } from '../config.js'
import { permissionBtn } from '@/utils/permissionBtn.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import commonSearchLevel from '@/components/common-search-level'
import moment from 'moment'
export default {
    data() {
        return {
            dialogSelectTitle: '媒体资源',
            editApi: paymentAccountEdit,
            paymentAccountStatus,
            carryOver,
            paymentAccountSort,
            levelDefaultData: paymentAccountLevelDefaultData,
            paymentAccountRenderData,
            dialofapi: getMediaList,
            totalRecord: 0,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新增用户',

            listDialogTitle: '更改列表显示数据',
            rules: {
                media_names: [
                    {
                        required: true,
                        message: '媒体资源不能为空',
                        trigger: 'change'
                    }
                ],
                channel_status:[
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '渠道收款的账号名称不能为空',
                        trigger: 'blur'
                    }
                ],
                account_status:[
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                account_bank:[
                    {
                        required: true,
                        message: '开户行不可为空',
                        trigger: 'blur'
                    }
                ],
                account_name:[
                    {
                        required: true,
                        message: '收款账号不可为空',
                        trigger: 'blur'
                    }
                ],
                id_card:[
                    {
                        required: false,
                        message: '对私收款人身份证号不可为空',
                        trigger: 'blur'
                    }
                ],
                phone:[
                    {
                        required: false,
                        message: '对私收款人手机号不可为空',
                        trigger: 'blur'
                    }
                ]
            },
            searchData: {
                keyWord: '',
                page: 1,
                limit: 10,
                dataType: 1,
                expireTime: '',
                createTime: '',
                level_type: 1
            },
            dataForm: {
                description: '',
                phone: '',
                id_card: '',
                account_name: '', 
                account_bank: '',
                account_status: '',
                name: '',
                channel_status: '', 
                media_name: ''
            },
            tableData: [],

            customerTypeList,
            tableRenderList:mediaResourceRenderData,
            activeNames:['1'],

            selectCheckData: [],

            userListData: {},

            userData: {},

            isCanEdit: false,

            btn_permission: {},

            selectRadio: '',
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
    },
    methods: {
        async initList() {
            const { searchData } = this
            searchData.start_time = searchData.createTime.length ? searchData.createTime[0] : ''
            searchData.end_time = searchData.createTime.length ? searchData.createTime[1] : ''
            const data = await paymentAccountList(searchData)
            data.list.forEach(item => {
                item.media_names = item.schedule_detail.length ? item.schedule_detail.map((item)=>{
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
            const { dataForm, userData } = this
            dataForm.belong_userid = type === 2 ? '' : userData.id
            dataForm.department_id = type === 2 ? '' : userData.department_id
            dataForm.submit = submit
            let { id, ...subData } = dataForm
            const data = type === 1 ? await paymentAccountAdd(subData) : await paymentAccountEdit(dataForm)
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
            const data = await paymentAccountDel({id:id})
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
            this.innerVisible = false
        },
        // 单选
        checkRadioData(data) {
            console.log('单选')
            this.searchData.media_id = data.id
            this.searchData.media_name = data.name
            this.dataForm.media_id = data.id
            this.dataForm.media_name = data.name
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
            this.dataForm.media_ids = data.map((item)=>{
                return item.id
            }).join(',')
            this.dataForm.media_names = data.map((item)=>{
                return item.name
            }).join(',')
            console.log('this.dataForm.schedule_names', this.dataForm.media_names)
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
            let notEdit = [2, 3]
             const { btn_permission, rules } = this
            if(!btn_permission.edit.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dataForm = Object.assign({},data)
            this.dataForm.media_names  =  data.schedule_detail ? data.schedule_detail.length ? data.schedule_detail.map((item)=>{
                let obj = item
                return obj.name
            }).join('、') : '' : ''
            this.dialogVisible = true;
            this.dialogTitle = '修改渠道账号信息'
            this.isCanEdit = notEdit.indexOf(this.dataForm.type) > -1 ? true : false
            if(this.dataForm.channel_status == 4 || this.dataForm.channel_status == 5){
                rules['id_card'][0].required = true
                rules['phone'][0].required = true
            }
            this.rules = rules
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
            this.dialogTitle = '新建渠道付款账号'
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
        getChannelStatusVal(val){
            const { rules } = this
            if(val == 4 || val == 5){
                rules['id_card'][0].required = true
                rules['phone'][0].required = true
            }else{
                rules['id_card'][0].required = false
                rules['phone'][0].required = false
            }
            this.rules = rules
            console.log('val', val)
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
.el-input input::-webkit-outer-spin-button,
.el-input input::-webkit-inner-spin-button{
    -webkit-appearance: none!important;
}
.el-input input[type="number"]{
    -moz-appearance: textfield;
}
.el-input .el-input__inner{
    line-height: 1px!important;
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
