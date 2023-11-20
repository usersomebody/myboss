<template lang="html">
<div>
    <el-card class="box-card">
        <div v-if="!selectCheckData.length" class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:84%;">
                <el-form-item label="">
                    <el-select v-model="searchData.dataType" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in customerTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="" class="search-input">
                    <el-input v-model="searchData.keyWord" placeholder="搜索此列表" suffix-icon="el-icon-search" @keyup.enter.native="search_fincerecord()"></el-input>
                </el-form-item> -->
            </el-form>
            <!-- <div class="tools-bar">
                <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
                <el-button type="primary" icon="el-icon-plus"  @click="dialogVisible = true;dialogTitle='新建媒体排期'">新建渠道付款申请</el-button>
            </div> -->
        </div>
        <div v-else class="flex m-b-20">
            <div>已选<span class="m-l-r-20 color-409">{{selectCheckData.length}}</span>项</div>
            <div class="vertical-line"></div>
            <div class="" @click="removeData"><i class="el-icon-delete"></i>删除</div>
        </div>
    <div>
    <!-- 公共可操作列表 -->
      <commonTable
        :table-data="tableData"
        :table-render-list="tableRenderList"
        :list-dialog-title="listDialogTitle"
        :is-can-set="true"
        :table-type="'multipleTable'"
        @updateList="search_fincerecord"
        @checkItem="checkData"/>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
  </el-card>
  </div>
</template>
<script>
import { getUserList, testList } from '@/api/permission'
import { customerTypeList, customerRenderData } from '../config.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import moment from 'moment'
export default {
    data() {
        return {
            imageUrl: '',
            dialofapi: testList,
            totalRecord: 0,
            pageSize: 10,
            tableLoading: false,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新增用户',

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
            customerLevel: [
                {
                    id: 1,
                    name: '微信'
                },
                {
                    id: 2,
                    name: 'QQ'
                }
            ],
            customerIndustry: [
                {
                    id: 1,
                    name: '微信'
                },
                {
                    id: 2,
                    name: 'QQ'
                }
            ],
            customerSource: [
                {
                    id: 1,
                    name: '微信'
                },
                {
                    id: 2,
                    name: 'QQ'
                }
            ],
           
            searchData: {
                keyWord: '',
                page: 1,
                size: 10,
                dataType: 1,
                expireTime: '',
                createTime: ''
            },
            dataForm: {
                id: '',
                loginName: '',
                tempRoleIds: [],
                roleIds: '',
                name: '',
                mobile: '',
                address: '',
                email: '',
                wechart: '',
                textarea: '',
                industry: '',
                province: '',
                city: '',
                area: '',
                source: '',
                remark: '',
                invoiceHeader: '',
                invoiceAccount: '',
                invoiceBank: '',
                invoiceInfo: '',
                department: '',
                openSea: '',
                superior: ''
            },
            tableData: [{
                id:1,
                a:1,
                b:2,
                c:3,
                d:4,
                e:5,
                f:6,
                g:7,
                h:8
            },{
                id:2,
                a:1,
                b:2,
                c:3,
                d:4,
                e:5,
                f:6,
                g:7,
                h:8
            }],

            customerTypeList,
            page: 1,
            size: 10,
            loaded: false,
            tableRenderList:customerRenderData,
            activeNames:['1'],
            provinceList: [],
            cityList: [],
            areaList: [],

            selectCheckData: [],
        }
    },
    components:{
        commonTable,
        commonDialogTable
    },
    created() {
        // this.initList()
    },
    methods: {
        async initList() {
            const data = await getUserList()
            this.tableData = data
        },
        onDialogClose() {
            this.dataForm.tempRoleIds = []
            this.$refs.dataForm.resetFields()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.onSearch()
        },
        handleCurrentChange(val) {
            this.onSearch({ pageNumber: val })
        },
        onSearch({ pageNumber = 1 } = {}) {},
        toDateTime(row, column, cellValue) {
            return cellValue
                ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
                : ''
        },
        roleFormatter(row, column, cellValue) {
            let result = []
            if (typeof row.erpMemberRoles === 'object' && row.erpMemberRoles.length > 0) {
                for (let item of row.erpMemberRoles) {
                    result.push(item.roleName)
                }
            }
            return result.join('，')
        },
        
        //hidden
        hiddenTable(key){
            console.log('key_____', key)
            this.innerVisible = false
        },
        //删除数据
        removeData(){
            
        },
        // 单选
        checkRadioData(data) {
            console.log('单选数据', data)
        },
        submitRadioData() {
            // 上级客户数据
            this.innerVisible = false
        },
        //复选
        checkData(data) {
            this.selectCheckData = data
            console.log('复选数据', data)
        },
        // 数据导出
        exportData(){
            return
            var fileName = "抽奖活动用户参与表.xls"; //生成Blob对象，通过创建的a标签点击下载
            var objectUrl = URL.createObjectURL(new Blob([response.data]));
            var link = document.createElement("a");
            // console.log(link);
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

        goGetData(){
            console.log('??????')
            this.innerVisible = true
            console.log('this.innerVisible',this.innerVisible)
        },
        getArea(){
            
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        getCurrentKey(checkedNodes,checkedKeys){
            console.log('keys',checkedNodes,checkedKeys)
        },
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
    margin-bottom:30px;
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
    justify-content: flex-start;
    // justify-content: center;
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
</style>
