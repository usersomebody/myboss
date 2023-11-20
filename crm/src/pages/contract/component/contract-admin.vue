<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="主题" class="">
                    <el-input v-model="searchData.name" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="客户名称" class="m-l-10">
                    <el-input v-model="searchData.customer_name" placeholder="请输入">
                        <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData('customer_id', 'search')">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="合同编号" class="m-l-10">
                    <el-input v-model="searchData.contract_num" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="合同状态" class="m-l-10">
                    <el-select v-model="searchData.contract_status" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in contractStatus"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所有人" class="m-l-10">
                    <el-select v-model="searchData.belong_userid" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in userListData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="block" label="开始日期">
                    <el-date-picker
                    v-model="searchData.beginTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="search_fincerecord">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="block m-l-20" label="结束日期">
                    <el-date-picker
                    v-model="searchData.finishTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="search_fincerecord">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="block m-l-20" label="签约日期">
                    <el-date-picker
                    v-model="searchData.signTime"
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
                        v-for="item in contractSortList"
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
            <el-form :inline="true" :model="searchData" class="fl" style="width:84%;">
                <!-- <el-form-item label="">
                    <el-select v-model="searchData.dataType" clearable>
                        <el-option
                        v-for="item in customerTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
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
                <el-button type="primary" icon="el-icon-plus"  @click="addDialogData">新建合同</el-button>
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
        :table-render-list="contractTableRenderData"
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
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="140px">
        <el-collapse v-model="activeNames" @change="handleCollapseChange">
            <el-collapse-item title="基本信息" name="1" class="bg-f5">
                <el-form-item label="主题" class="" prop="name" style="width:70%">
                    <el-input v-model.trim="dataForm.name" placeholder="请输入"  @keyup.enter.native="search_fincerecord()"></el-input>
                </el-form-item>
                <el-form-item label="客户" prop="customer_name"  style="width:70%">
                    <el-input v-model="dataForm.customer_name" placeholder="请输入上级客户" @focus="goGetData('customer_id', 'submit')">
                        <i
                            class="el-icon-plus el-input__icon color-409"
                            slot="suffix"
                            @click="goGetData('customer_id', 'submit')">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="总金额" prop="money" style="width:70%;">
                        <el-input v-model.trim="dataForm.money" placeholder="请输入">
                            <template slot="append"><span>元</span></template>
                        </el-input>
                </el-form-item>
                <el-form-item label="合同类型" style="width:70%">
                    <el-select v-model="dataForm.contract_type" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in contractType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合同状态" style="width:70%">
                    <el-select v-model="dataForm.contract_status" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in contractStatus"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款方式" style="width:70%">
                    <el-select v-model="dataForm.pay_status" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in payType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始日期" prop="start_time_name"  style="width:70%">
                    <el-date-picker
                    v-model="dataForm.start_time_name"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" prop="end_time_name"  style="width:70%">
                    <el-date-picker
                    v-model="dataForm.end_time_name"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="合同编号" class="" style="width:70%">
                    <el-input v-model="dataForm.contract_num" placeholder="请输入"  @keyup.enter.native="search_fincerecord()"></el-input>
                </el-form-item>
                <el-form-item label="客户方签约人" class="" style="width:70%">
                    <el-input v-model="dataForm.customer_people" placeholder="请输入"  @keyup.enter.native="search_fincerecord()"></el-input>
                </el-form-item>
                <el-form-item label="我方签约人" prop="superior"  style="width:70%">
                    <el-select v-model="dataForm.company_id" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in allUserList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签约日期" prop="sign_time_name"  style="width:70%">
                    <el-date-picker
                    v-model="dataForm.sign_time_name"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="description" style="width:70%">
                    <el-input type="textarea" :rows="4" v-model="dataForm.description" placeholder="请输入备注"></el-input>
                </el-form-item>
                <!-- <el-form-item label="上传合同图片" prop="remark" style="width: 70%;">
                    <el-upload
                        class="avatar-uploader"
                        name="image"
                        :action="uploadUrl + '/venue/upload/uploadImg'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess">
                        <el-image v-if="content_pic" :src="content_pic" class="avatar" :preview-src-list="previewImg"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item> -->
                <el-form-item label="上传合同图片" prop="remark" style="width: 70%;">
                    <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl + '/venue/upload/uploadImg'"
                        list-type="picture-card"
                        name="image"
                        accept="image"
                        :file-list="imgListArr"
                        :on-success="getAvatarList"
                        :on-preview="handlePictureCardPreview"
                        :before-upload="beforeAvatarUpload"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogImageVisible" :append-to-body="true">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2)" v-if="dialogTitle=='修改合同信息'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1)" v-else>立即创建</el-button>
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
import { userList, allPerson, contractList, contractAdd, contractEdit, contractDel, getCustomerList, selectConfigType  } from '@/api/permission'
import { customerTypeList, contractStatus, payType, contractTableRenderData, contractSortList, contactLevelDefaultData } from '../config.js'
import { customerRenderData } from '../../customer/config.js'
import { permissionBtn } from '@/utils/permissionBtn.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import commonSearchLevel from '@/components/common-search-level'

import { uploadUrl } from '@/config/baseUrl.js'
import moment from 'moment'
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            levelDefaultData:contactLevelDefaultData,
            dialogImageUrl: '',
            dialogImageVisible: false,
            disabled: false,
            dialogSelectTitle: '客户名称',
            editApi: contractEdit,
            contractSortList,
            contractTableRenderData,
            payType,
            uploadUrl,
            content_pic: '',
            dialofapi: getCustomerList,
            totalRecord: 0,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新增用户',

            listDialogTitle: '更改列表显示数据',
            contractStatus,
            rules: {
                name: [
                    {
                        required: true,
                        message: '主题不能为空',
                        trigger: 'blur'
                    }
                ],
                customer_name: [
                    {
                        required: true,
                        message: '客户不能为空',
                        trigger: ['blur', 'change']
                    }
                ],
                money: [
                    {
                        required: true,
                        message: '总金额不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            searchData: {
                keyWord: '',
                page: 1,
                limit: 10,
                dataType: 1,
                createTime: '',
                beginTime: '',
                finishTime: '',
                signTime: ''
            },
            dataForm: {
                name: '',
                customer_name: '',
                money: '',
                description: '',
                sign_time: '',
                contract_type: '',
                dataType: '',
                pay_status: '',
                start_time: '',
                end_time: '',
                contract_num: '',
                customer_people: '',
                company_id: ''
            },
            tableData: [],

            customerTypeList,
            tableRenderList:customerRenderData,
            activeNames:['1'],
            provinceList: [],
            cityList: [],
            areaList: [],

            selectCheckData: [],

            userListData: [],
            userData: {},
            allUserList: [],
            contractType: [],
            btn_permission: {},
            selectRadio: '',
            previewImg: [],
            imgListArr: []
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
        console.log('permissionBtn(this.$route.name)', permissionBtn(this.$route.name))
        this.initList()
        this.getAllPerson()
        this.getUserList()
        this.getContractType()
    },
    methods: {
        async initList() {
            const { searchData } = this
            searchData.start_contract_time_begin = searchData.beginTime.length ? searchData.beginTime[0] : ''
            searchData.end_contract_time_begin = searchData.beginTime.length ? searchData.beginTime[1] : ''
            searchData.start_contract_time_finish = searchData.finishTime.length ? searchData.finishTime[0] : ''
            searchData.end_contract_time_finish = searchData.finishTime.length ? searchData.finishTime[1] : ''
            searchData.start_sign_time = searchData.signTime.length ? searchData.signTime[0] : ''
            searchData.end_sign_time = searchData.signTime.length ? searchData.signTime[1] : ''
            const data = await contractList(searchData)
            this.tableData = data.list
            this.totalRecord = data.total
        },
        async getUserList(){
            let param = {
                limit:20,
                page:1,
                // role_id: 4
            }
            const data = await userList(param)
            this.allUserList = data.list
        }, 
        async getAllPerson(){
            let param = {
                path: this.$route.name,
                level: this.searchData.level_type
            }
            const data = await allPerson(param)
            this.userListData = data
        }, 
        async getContractType(){
            const data = await selectConfigType({type_id: 7})
            this.contractType = data
            let judge = this.toObj(data)
            this.contractTableRenderData.forEach((item)=>{
                item.judge = item.prop == 'contract_type' ?  judge : item.judge || false
            })
        },
        toObj(data){
            let info = {}
            data.forEach((item)=>{
                info[item.id] = item.name
            })
            return info
        },
        async submitData(type){
            const { dataForm, userData } = this
            dataForm.belong_userid = type === 2 ? '' : userData.id
            dataForm.department_id = type === 2 ? '' :  userData.department_id
            dataForm.sign_time = dataForm.sign_time_name
            dataForm.end_time = dataForm.end_time_name
            dataForm.start_time = dataForm.start_time_name
            let { id, ...subData } = dataForm
            const data = type === 1 ? await contractAdd(subData) : await contractEdit(dataForm)
            this.$message({
                type: 'success',
                message: type === 1 ? '创建成功!' : '修改成功!'
            });
            this.onSearch(1)
            this.dialogVisible = false
            this.$refs['dataForm'].resetFields();
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
            const data = await contractDel({id:id})
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

        handleCollapseChange(val){
            console.log('val',val)
        },
        seeDetail(data){
            const { btn_permission } = this
            if(!btn_permission.edit.isHas){
                this.$message.error('无权操作')
                return 
            }
            data.company_id = data.company_id == 0 ? '' : data.company_id
            data.contract_type = data.contract_type == 0 ? '' : data.contract_type
            this.dataForm = Object.assign({},data)
            this.content_pic = this.dataForm.content_pic
            this.previewImg = [this.dataForm.content_pic]
            this.dialogVisible = true;
            this.dialogTitle = '修改合同信息'
            if(this.dataForm.content_pic){
                let imgListArr = this.dataForm.content_pic.split(',')
                this.imgListArr = imgListArr.map((item, index)=>{
                    let obj = {}
                    obj.name = index + '.png'
                    obj.url = item
                    return obj
                })
            }
        },
        addDialogData(){
            const { btn_permission } = this
            if(!btn_permission.add.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dialogVisible = true;
            this.dialogTitle = '新建合同'
            this.isCanEdit = false
            // this.$refs['dataForm'].resetFields()
            this.restDataFormValue()
        },
        getLevelValue(type){
            this.searchData.level_type = type
            this.getAllPerson()
            this.initList()
        },
        goGetData(key, type){
            if(type == 'submit'){
                this.selectRadio = this.dataForm[key]
                console.log('this.selectRadio', this.selectRadio)
            }
            this.innerVisible = true
        },

        handleAvatarSuccess(res, file) {
            this.content_pic = res.content.url;
            this.dataForm.content_pic = res.content.url
            this.previewImg = [res.content.url]
        },

        handleRemove(file) {
            console.log(file);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogImageVisible = true;
        },
        getAvatarList(response, file, fileList){
            console.log('res, file', response, file, fileList)
            let pic = fileList.map((item)=>{
                let obj = item
                return obj.response ? obj.response.content.url : obj.url
            }).join(',')
                this.dataForm.content_pic = pic
        },
        restDataFormValue(){
            const { dataForm } = this
            for(let key in dataForm){
                dataForm[key] = ''
            }
            this.dataForm = dataForm
            this.imgListArr = []
        },
        beforeAvatarUpload(file, fileList) {
            let suffix = this.getFileType(file.name) //获取文件后缀名
            let suffixArray = ['jpg', 'png', 'jpeg', 'gif'] //限制的文件类型，根据情况自己定义
            if (suffixArray.indexOf(suffix) === -1) {
                this.$message({
                    message: '文件格式错误',
                    type: 'error',
                    duration: 2000
                })
                return false
            }
            return suffixArray
        },
        getFileType(name) {
            let startIndex = name.lastIndexOf('.')
            if (startIndex !== -1) {
                return name.slice(startIndex + 1).toLowerCase()
            } else {
                return ''
            }
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

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
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
