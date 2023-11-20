<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="媒体名称" class="">
                    <el-input v-model="searchData.name" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="资源类型" class="m-l-20">
                    <el-select v-model="searchData.type" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in mediaResourceType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司名称" class="m-l-20">
                    <el-input v-model="searchData.companyName" placeholder="请输入" @keyup.enter.native="onSearch(1)">
                        <!-- <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData">
                        </i> -->
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
            <el-form :inline="true" :model="searchData" class="fl" style="width:82%;">
                <el-form-item label="">
                    <commonSearchLevel
                    is-page-name="resources"
                    :default-data="levelDefaultData"
                    @levelList="getLevelValue"/>
                </el-form-item>
                <!-- <el-form-item label="" class="search-input">
                    <el-input v-model="searchData.keyWord" placeholder="搜索此列表" suffix-icon="el-icon-search" @keyup.enter.native="search_fincerecord()"></el-input>
                </el-form-item> -->
            </el-form>
            <div class="tools-bar">
                <!-- <el-button type="primary" icon="el-icon-download" @click="exportData" style="margin-right:10px;">导出</el-button> -->
                <el-dropdown @command="showDialog">
                    <el-button type="primary" icon="el-icon-plus" >新增媒体资源</el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in mediaTypeList" :key="index" :command="item.id">{{item.name}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
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
    <commonDetail
          v-if="dialogType && dialogVisible"
          :dialog-data="dialogData"
          :detail-info="detailInfo"
          :dialog-type="dialogType"
          :dialog-title="dialogTitle"
          :dialog-visible="dialogVisible"
          :is-edit="dialogIsEdit"
          @hiddenDialog="closeDialog"/>
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
import { getUserList, getCustomerList, getMediaList, addMedia, editMedia, allPerson, delMedia } from '@/api/permission'
import { customerTypeList, mediaResourceRenderData, addMediaType, mediaResourceType, customerSortList, mediaLevelDefaultData } from '../config.js'
import { customerRenderData } from '../../customer/config.js'
import { permissionBtn } from '@/utils/permissionBtn.js'
import commonTable from '@/components/common-table'
import commonDetail from '@/components/common-detail'
import commonDialogTable from '@/components/common-dialog-table'
import commonSearchLevel from '@/components/common-search-level'

import moment from 'moment'
export default {
    data() {
        return {
            editApi: editMedia,
            levelDefaultData: mediaLevelDefaultData,
            dialofapi: getCustomerList,
            totalRecord: 0,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新增用户',
            dialogType: '',
            dialogData: [],
            listDialogTitle: '更改列表显示数据',

            searchData: {
                keyWord: '',
                page: 1,
                limit: 10,
                dataType: 1,
                level_type: 1,
                createTime: ''
            },
            dataForm: {},
            tableData: [],

            customerTypeList,
            tableRenderList: mediaResourceRenderData,
            mediaTypeList: addMediaType,
            mediaResourceType,
            sortList: customerSortList,
            customerTableRenderList: customerRenderData,

            selectCheckData: [],
            detailInfo: {},

            userListData: [],
            btn_permission: {}
        }
    },
    components:{
        commonTable,
        commonDetail,
        commonDialogTable,
        commonSearchLevel
    },
    created() {
        this.btn_permission = permissionBtn(this.$route.name)
        this.initList()
        this.getUserList()
    },
    methods: {
        async initList() {
            const { searchData } = this
            searchData.start_time = searchData.createTime.length ? searchData.createTime[0] : ''
            searchData.end_time = searchData.createTime.length ? searchData.createTime[1] : ''
            const data = await getMediaList(searchData)
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
            const data = await delMedia({id:id})
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
        closeDialog(){
            this.onSearch(1)
            this.dialogVisible = false
        },
        //hidden
        hiddenTable(key){
            this.innerVisible = false
        },
        // 单选
        checkRadioData(data) {
            this.searchData.companyName = data.name
            this.searchData.company = data.id
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

        goGetData(){
            this.innerVisible = true
        },
        getLevelValue(type){
            console.log('type',type)
            this.searchData.level_type = type
            this.getUserList()
            this.initList()
        },
        seeDetail(data){
            const { btn_permission } = this
            if(!btn_permission.edit.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dataForm = Object.assign({},data)
            this.detailInfo = data
            this.showDialog(data.type, 2)
        },
        //显示弹窗
        showDialog(command, type){
            const { mediaTypeList, btn_permission } = this
            if(!btn_permission.add.isHas){
                this.$message.error('无权操作')
                return 
            }
            let data = mediaTypeList.filter((item)=>{
                return item.id == command
            })
            this.dialogVisible = true
            this.dialogTitle = type == 2 ? '修改' + data[0].name : '新建' + data[0].name
            this.dialogIsEdit = type == 2 ? 2 : 1
            this.detailInfo = type == 2 ? this.detailInfo : {}
            this.dialogType = data[0].id
            this.dialogData = data[0].renderData
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
