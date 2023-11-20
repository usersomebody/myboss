<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="排期开票" class="m-l-20">
                    <el-input v-model="searchData.keyWord" placeholder="请输入"  @keyup.enter.native="search_fincerecord()">
                        <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="业务类型" class="m-l-20">
                    <el-select v-model="searchData.dataType" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in customerTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="媒体排期" class="">
                    <el-input v-model="searchData.keyWord" placeholder="请输入"  @keyup.enter.native="search_fincerecord()"></el-input>
                </el-form-item>
                <el-form-item label="媒体报价" class="">
                    <el-input v-model="searchData.keyWord" placeholder="请输入"  @keyup.enter.native="search_fincerecord()"></el-input>
                </el-form-item>
                <el-form-item label="开票金额" class="">
                    <el-input v-model="searchData.keyWord" placeholder="请输入"  @keyup.enter.native="search_fincerecord()"></el-input>
                </el-form-item>
                <el-form-item label="媒体-客户是否需要发票" class="m-l-20">
                    <el-select v-model="searchData.dataType" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in customerTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建人" class="m-l-20">
                    <el-select v-model="searchData.dataType" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in customerTypeList"
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
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="">
                <el-button type="primary">查询</el-button>
            </div>
        </div>
    </el-card>
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
            <div class="tools-bar">
                <!-- <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
                <el-button type="primary" icon="el-icon-plus"  @click="dialogVisible = true;dialogTitle='新建媒体排期'">新建渠道付款申请</el-button>
            </div>
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
        :is-can-set="false"
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="140px">
        <el-collapse v-model="activeNames" @change="handleCollapseChange">
            <el-collapse-item title="基本信息" name="1" class="bg-f5">
                <el-form-item label="业务类型" prop="superior"  style="width:70%">
                    <el-input v-model="dataForm.superior" placeholder="请输入上级客户" @focus="goGetData">
                        <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="排期开票" style="width:70%;">
                    <el-input v-model="searchData.keyWord" placeholder="请输入"  @focus="goGetData">
                        <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="媒体排期" style="width:70%;">
                    <el-input v-model="searchData.keyWord" placeholder="请输入"  @focus="goGetData">
                        <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="媒体-排期状态">
                    <span>未填写</span>
                </el-form-item>
                <el-form-item label="媒体-客户是否需要发票">
                    <span>未填写</span>
                </el-form-item>
                <el-form-item label="媒体-客户发票是否已开">
                    <span>未填写</span>
                </el-form-item>
                <el-form-item label="媒体-排期报价">
                    <span>未填写</span>
                </el-form-item>
                <el-form-item label="媒体排期-申请开票金额" prop="originalprice" style="width:70%;">
                        <el-input v-model="dataForm.originalprice" placeholder="请输入">
                            <template slot="append"><span>元</span></template>
                        </el-input>
                    </el-form-item>
            </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="info" @click="onDialogSubmit()" v-if="dialogTitle=='修改用户信息'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
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
                :table-render-list="tableRenderList"
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
import { getUserList, testList } from '@/api/permission'
import { customerTypeList, customerRenderData } from '../config.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import moment from 'moment'
export default {
    data() {
        return {
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
            defaultTreeProps: {
                children: 'childPermList',
                label: 'permissionName'
            },
            rules: {
                loginName: [
                    {
                        required: true,
                        message: '登录名不能为空',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 50,
                        message: '登录名长度在 1 到 50 个字符',
                        trigger: 'blur'
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
                mobile: [
                    {
                        required: true,
                        message: '联系电话不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(13|15|18|14|17)[0-9]{9}$/,
                        message: '手机号码格式不正确',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱地址',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur, change'
                    }
                ]
            },
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

            filterText: '',
            data: [{
                id: 1,
                label: '一级 1',
                children: [{
                    id: 4,
                    label: '二级 1-1',
                    children: [{
                        id: 9,
                        label: '三级 1-1-1'
                    }, {
                        id: 10,
                        label: '三级 1-1-2'
                    }]
                }]
                }, {
                id: 2,
                label: '一级 2',
                children: [{
                    id: 5,
                    label: '二级 2-1'
                }, {
                    id: 6,
                    label: '二级 2-2'
                }]
                }, {
                id: 3,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id: 8,
                    label: '二级 3-2'
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    components:{
        commonTable,
        commonDialogTable
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
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
        handleChangeStatus(index, row) {},
        handleResetPwd(index, row) {
            this.$confirm('确认重置该用户的登录密码？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {})
        },
        handleEdit(index, row) {
            this.dialogVisible = true
            this.dialogTitle = '修改用户信息'
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
        onDialogSubmit() {},
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
