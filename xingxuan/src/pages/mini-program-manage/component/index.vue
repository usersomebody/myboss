<template>
    <div>
        <el-card class="box-card">
            <div v-if="is_manager == 2" class="search-bar">
                <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                    <el-form-item label="店铺名称">
                        <el-input v-model="searchData.store_name" placeholder="请输入" clearable @keyup.enter.native="onSearch(1)"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" class="m-l-20">
                        <el-input v-model="searchData.phone" placeholder="请输入" clearable @keyup.enter.native="onSearch(1)"></el-input>
                    </el-form-item>
                    <el-form-item label="绑定状态" class="m-l-20">
                        <el-select v-model="searchData.is_authorization" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in statusMap"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="" @click="onSearch">
                    <!-- <el-button type="primary">重置</el-button> -->
                    <el-button type="primary">查询</el-button>
                </div>
            </div>
            <div class="table-content">
                <div class="action-header addGoodsBtn">
                    <el-button v-if="is_manager == 2" type="primary" @click="addGoods({}, 1)">新建商户</el-button>
                </div>
                <div class="">
                    <div v-for="(item, index) in tableData" :key="index">
                        <div class="title-header">
                            <span class="margin-r-10 title-color">商户名称：{{item.company_name}}</span>
                            <span class="margin-r-10 title-color">联系人：{{item.name}}</span>
                            <span class="margin-r-10 title-color">手机号：{{item.phone}}</span>
                            <!-- <span class="margin-r-10 title-color">登录密码：</span> -->
                            <span class="action-color margin-r-10" @click="getAuthUrl(item.phone)">授权添加</span>
                            <span class="action-color margin-r-10" @click="addGoods(item, 2)">编辑</span>
                        </div>
                        <div>
                            <el-table
                                ref="multipleTable"
                                :data="item.detail"
                                border
                                tooltip-effect="dark"
                                :header-cell-style="{display:index != 0 ? 'none' : ''}"
                                style="width: 100%">
                                <el-table-column
                                :label="index == 0 ? '店铺头像' : '' "
                                align="center"
                                width="200">
                                <template slot-scope="scope">
                                    <div class="flex-v-c">
                                        <img :src="scope.row.head_img" style="width:50px;height:50px;border-radius:50%;"/>
                                    </div>
                                </template>
                                </el-table-column>
                                <el-table-column
                                :label="index == 0 ? '店铺名称' : '' "
                                align="center"
                                width="200">
                                <template slot-scope="scope">
                                    <div class="flex-v-c">
                                        <p>{{scope.row.store_name}}</p>
                                    </div>
                                </template>
                                </el-table-column>
                                <el-table-column
                                prop="authorizer_appid"
                                :label="index == 0 ? 'APPID' : '' "
                                align="center"
                                width="240">
                                </el-table-column>
                                <el-table-column
                                align="center"
                                prop="is_authorization"
                                :label="index == 0 ? '绑定状态' : '' "
                                show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span style="font-size:10px;">{{statusObj[scope.row.is_authorization]}}</span>
                                </template>
                                </el-table-column>
                                <el-table-column
                                align="center"
                                v-if="is_manager == 2"
                                :label="index == 0 ? '商品是否自动审核通过' : '' "
                                show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-switch :value="scope.row.is_need_check == 1 ? false : true" @change="getSwitchVal(item.id, scope.row)"></el-switch>
                                </template>
                                </el-table-column>
                                <el-table-column
                                align="center"
                                :label="index == 0 ? '操作' : '' "
                                show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <!-- <span v-if="is_manager == 2" class="action-color" @click="delData(item.id, scope.row)">删除</span> -->
                                    <span style="margin:0 10px;" class="action-color" @click="importData(scope.row)">查看商品</span>
                                    <span v-if="scope.row.is_authorization != 2" class="action-color" @click="getAuthUrl(item.phone)">重新授权</span>
                                </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>

                </div>
                
                <div class="pagination-bar" v-if="is_manager == 2">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="searchData.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchData.total">
                    </el-pagination>
                </div>
            </div>
        </el-card>
         <!-- 设置平台返佣 and  领样设置 -->
        <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
        @close="onDialogClose()">
        <div>
            <el-form :inline="true" ref="dataForm" :model="dataForm" :rules="rules" class="fl" style="width:100%;" label-width="90px">
                <el-form-item label="商户名称" prop="company_name">
                    <el-input v-model="dataForm.company_name" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="name">
                    <el-input v-model="dataForm.name" clearable placeholder="请输入"></el-input>
                </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="dataForm.phone" clearable :disabled="iscanset" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="dataForm.password" clearable placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
        </div>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitData('dataForm')">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 商品列表 -->
         <el-dialog
        width="70%"
        :title="dialogSelectTitle"
        :visible.sync="innerVisible"
        :lock-scroll="true">
        <div v-if="showTable">
            <!-- 公共可操作列表 -->
            <commonDialogTable
                :table-data-api="dialofapi"
                :table-render-list="tableRenderList"
                :table-type="'singleTable'"
                :goods-id="goodsId"
                :auth-id="auth_id"
                :is-not-import="1"
                :data-test="1"
                @updateList="search_fincerecord"
                @checkChildItem="childCheckData"
                @hiddenTable="hiddenTable"/>
        </div>
    </el-dialog>
    </div>
</template>

<script>
import { storeList, getAuthUrl, isAutoCheck, getProductList, accountEdit, accountAdd } from '@/api/permission'
import { goodsRenderList } from '../../goods-manage/config'
import commonDialogTable from '@/components/common-dialog-table'
import { isDev } from '@/config/baseUrl'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            dialofapi:getProductList,
            tableRenderList: goodsRenderList,
            dialogSelectTitle: '商品列表',
            showTable: false,
            innerVisible: false,
            dialogTitle: '新建商户',
            dialogVisible: false,
            auth_id: '',
            iscanset:false,
            searchData: {
                page: 1,
                limit: 10,
                total: 0,
                number: '',
                store_name: '',
                phone: '',
                is_authorization: ''
            },
            statusMap: [{
                id: 1,
                name: '待授权'
            }, {
                id: 2,
                name: '已授权'
            }, {
                id: 3,
                name: '取消授权'
            }],
            statusObj:{
                1: '未授权',
                2: '已授权',
                3: '取消授权'
            },
             tableData: [],

            editId: '',
            multipleSelection: [],
            multipleSelectId: [],
            filterType: 1,
            goodsId: '',
            dataForm: {
                company_name: '',
                name: '',
                phone: '',
                password: ''
            },
            rules: {
                company_name: [
                    {
                        required: false,
                        message: '商户名称不能为空',
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '联系人',
                        trigger: 'blur'
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: '手机号码',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(13|15|18|14|17)[0-9]{9}$/,
                        message: '手机号码格式不正确',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '密码',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    components:{
        commonDialogTable
    },
    mounted() {

    },
    created() {
        this.getList()
    },
    methods: {
        async getList(){
            const { searchData }= this
            let data = await storeList(searchData)
            this.tableData = data.list
            this.searchData.total = data.total
        },
        async getAuthUrl(phone){
            let param = {
                url: encodeURIComponent(isDev ? 'https://test.xingxuan.mnancheng.com/#/backPage' : 'https://xingxuan.mnancheng.com/#/backPage'),
                keyword: phone,
                auth_type: 'shop'
            }
            let data = await getAuthUrl(param)
            window.location.href = data.url
            
        },
        async addAccount(){
            const { dialogTitle,  dataForm} = this
            let data = dialogTitle == '新建商户' ? await accountAdd(dataForm) : await accountEdit(dataForm)
            this.$message({
                type: 'success',
                message: '操作成功!'
            });
            this.onSearch(1)
        },
        onSearch(page){
            this.searchData.page = page
            this.getList()
        },
        search_fincerecord() {
            this.onSearch(1)
        },
        getPrice(type){
            const { searchData } =  this
            if(!searchData.minPrice || !searchData.maxPrice){
                return
            }
            if(Number(searchData.maxPrice) < Number(searchData.minPrice) || Number(searchData.maxPrice) == Number(searchData.minPrice)){
                this.$message({
                    type: 'warning',
                    message: '最大最小值不合法'
                });
                this.searchData[type] = ''
                return
            }
        },
        handleSizeChange(val) {
            this.searchData.limit = val = val
            this.onSearch(1)
        },
        handleCurrentChange(val) {
            this.searchData.page = val
            this.onSearch(val)
        },
        async getSwitchVal(parentId, row){
            let param = {
                id: row.id,
                type: 2,
                is_need_check: row.is_need_check == 1 ? 2 : 1
            }
            const data = await isAutoCheck(param)
            this.$message({
                type: 'success',
                message: '操作成功!'
            });
            this.onSearch(1)
            // 调取修改接口
        },
        onDialogClose(){
            this.showTable = false
        },
        submitData(formName){
            const { dataForm } = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogVisible = false
                    this.addAccount()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        importData(item){
            this.auth_id = item.authorizer_appid
            this.innerVisible = true
            this.showTable = true
        },
        hiddenTable(key){
            this.innerVisible = false
            this.showTable = false
        },
        childCheckData(data){
            this.detailTableData = data
            let goods_id = data.map((item)=>{
                return item.id
            }).join(',')
            this.goodsId = goods_id
        },
        addGoods(item, type){
            this.dialogTitle = type == 1 ? '新建商户' : '修改商户'
            this.iscanset = type == 1 ? false : true
            this.rules['phone'][0].required = type == 1 ? true : false
            this.rules['password'][0].required = type == 1 ? true : false
            this.dialogVisible = true
            let ishasItem = Object.keys(item).length
            this.dataForm = {
                company_name: ishasItem ? item.company_name : '',
                phone: ishasItem ? item.phone : '',
                password: '',
                name: ishasItem ? item.name : ''
            }
            if(type == 2){
                this.dataForm.id = item.id
            }
        },
        delData(parentId, row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
            });
        }
    }

}
</script>
<style lang="scss" scoped>
.search-bar{
    overflow: hidden;
}
.line{
    color:#D0D0D0;
    margin:0 20px; 
}
.m-l-10{
    margin-left: 10px;
}
.m-l-20{
    margin-left: 20px;
}
.action-list{
    float: right;
}
.flex-v{
    display: flex;
    align-items: center;
}
.flex-v-c{
    display: flex;
    justify-content: center;
    align-items: center;
}
.flex-v-b{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.common-tips{
    color: #FFB165;
    font-size: 12px;
    margin-top: 10px;
}
.common-radio-box{
    margin-bottom: 60px;
}
.pagination-bar{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top:20px;
}

.filter-content{
    display: flex;
    align-items: center;
    padding: 20px 0;
}
.filter-content-item{
    margin-right: 15px;
}
.filter-content-title{
    margin-bottom: 10px;
    font-size: 10px;
}
.filter-content-action{
    padding:10px 10px;
    border:1px solid #E9E9EC;
    border-radius:4px;
}
.font-s-9f8{
    font-size: 10px;
    color: #9F8F85;
}
.font-s-9f8.active{
    color:#409EFF;
}
.action-color{
    color: #7A90BD;
}
.margin-r-10{
    margin-right:10px;
}
.addGoodsBtn{
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
}
.title-color{
    color: #585358;
}
.title-header{
    background: #F7F9FA;
    padding:10px 15px;
    font-size:12px;
}
</style>
<style>
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
</style>

