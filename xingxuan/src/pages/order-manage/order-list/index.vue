<template>
    <div>
        <el-card class="box-card">
            <el-tabs v-model="searchData.status" @tab-click="handleClick">
                <el-tab-pane v-for="(item, index) in typeList" :key="index" :label="item.name + '(' + item.num + ')'" :name="item.id"></el-tab-pane>
            </el-tabs>
            <div class="search-bar">
                <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                    <el-form-item label="订单号">
                        <el-input v-model="searchData.ordersn" placeholder="填写订单号" clearable @keyup.enter.native="onSearch(1)"></el-input>
                    </el-form-item>
                    <el-form-item class="block m-l-20" label="下单时间">
                        <el-date-picker
                        v-model="searchData.payTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="search_fincerecord">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="商家名称" class="m-l-20">
                        <el-input v-model="searchData.title" clearable placeholder="填写商家名称" @keyup.enter.native="onSearch(1)"></el-input>
                    </el-form-item>
                    <div>
                        <el-form-item label="手机号">
                            <el-input v-model="searchData.phone" clearable placeholder="填写下单手机号" @keyup.enter.native="onSearch(1)"></el-input>
                        </el-form-item>
                        <el-form-item label="收件人" class="m-l-20">
                            <el-input v-model="searchData.real_name" clearable placeholder="填写下单收件人" @keyup.enter.native="onSearch(1)"></el-input>
                        </el-form-item>
                    </div>
                    
                </el-form>
                <div class="">
                    <!-- <el-button type="primary">重置</el-button> -->
                    <el-button type="primary" @click="onSearch">查询</el-button>
                    <el-button type="primary" @click="restSearch">重置</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="box-card" style="margin-top:10px;">
            <div class="table-content">
                <div class="">
                    <div class="action-header">
                        <el-radio-group v-model="searchData.order_type" style="margin-bottom: 30px;" @change="onSearch(1)">
                            <el-radio-button label="0">全部</el-radio-button>
                            <el-radio-button label="1">免费领样</el-radio-button>
                            <el-radio-button label="2">成本领样</el-radio-button>
                        </el-radio-group>
                        <el-button type="primary" style="float:right;margin-bottom:20px;" @click="postGoods(1, {})">批量发货</el-button>
                    </div>
                    <el-table
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column
                        label="商品信息"
                        align="center"
                        width="500">
                        <template slot-scope="scope">
                            <div class="flex-v-c">
                                <img :src="scope.row.product_info.head_img" class="child-log"/>
                                <div>
                                    <p class="one-line text-left">{{scope.row.product_info.title}}</p>
                                    <p class="text-left">￥{{scope.row.product_info.min_price}}</p>
                                </div>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="订单编号/下单时间"
                        align="center"
                        width="240">
                        <template slot-scope="scope">
                            <p>{{scope.row.ordersn}}</p>
                            <span>{{scope.row.create_time_name}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="实付金额"
                        align="center">
                        <template slot-scope="scope">
                            <span>￥{{scope.row.price}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        v-if="searchData.order_type != 1"
                        label="结算状态"
                        align="center">
                        <template slot-scope="scope">
                            <span>{{settlementStatus[scope.row.settlement_status]}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        v-if="searchData.order_type != 1"
                        label="结算金额"
                        align="center">
                        <template slot-scope="scope">
                            <span>￥{{scope.row.settlement_sprice}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="买家沟通"
                        align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.remark">
                                <span>买家 {{scope.row.address.realname}}</span>
                                <span>留言 {{scope.row.remark}}</span>
                            </span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="订单状态"
                        prop="address"
                        align="center">
                        <template slot-scope="scope">
                            <p>{{statusObj[scope.row.status]}}</p>
                            <p class="action-color" v-if="scope.row.status == 2 || scope.row.status == 3 || scope.row.status == 4" @click="goDetail(scope.row)">详情</p>
                            <p class="action-color" v-if="scope.row.status == 2" @click="postGoods(2, scope.row)">立即发货</p>
                            <p class="action-color" v-if="scope.row.status == 2" @click="examineData(2, scope.row)">拒绝领样</p>
                            <p class="action-color" v-if="scope.row.status == 3" @click="updateExpress(scope.row, 3)">修改物流</p>
                        </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-bar">
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
        <el-dialog
            title="订单发货"
            :visible.sync="dialogVisible"
            :width="showPostType == 1 ? '30%' : '50%'"
            @close="onDialogClose()">
            <div v-if="showPostType == 1">
                <div>
                    <h3>功能介绍:</h3>
                    <p>使用excel快速导入进行订单发货</p>
                    <p>如果重复导入数据将以最新导入数据为准，请谨慎使用</p>
                    <p>数据导入订单状态自动修改为已发货</p>
                    <p>一次导入的数据不要太多，大量数据请分批导入</p>
                    <p>如果重复导入数据将以最新导入数据为准，请谨慎使用</p>
                    <h3>使用方法:</h3>
                    <p>1下载Excel模板文件并录入信息</p>
                    <p>2选择快递公司</p>
                    <p>3上传excel导入</p>
                    <h3>格式要求:</h3>
                    <p>Excel第一列必须订单编号, 第二列必须快递单号</p>
                    <p>请确认编号与快递单号的备注</p>
                </div>
                <div class="select-company">
                    <el-form ref="dataForm" :rules="rules" :model="dataForm">
                        <el-form-item label="快递公司">
                            <el-select v-model="dataForm.expresscom" filterable placeholder="请选择" @change="getExpressValue">
                                <el-option
                                v-for="item in expressList"
                                :key="item.express_code"
                                :label="item.expresscom"
                                :value="item.express_code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Excel">
                            <el-upload
                                class="upload-demo"
                                :action="uploadUrl + '/venue/upload/uploadImg'"
                                :on-success="handleChangeSuccess"
                                name="image"
                                accept="file"
                                :before-upload="beforeAvatarUpload"
                                :file-list="fileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div v-if="showPostType == 2">
                <div class="card-box">
                    <div class="flex-v">
                        <img src="https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/images/20220615/0d1190f5c6ccd96aa182ea7d93130bd0.png" class="post-img"/>
                        <span>{{shipmentDetail.address.realname}}</span>
                        <span>{{shipmentDetail.address.mobile}}</span>
                        <span>{{shipmentDetail.address.province}} {{shipmentDetail.address.city}} {{shipmentDetail.address.area}} {{shipmentDetail.address.address}}</span>
                    </div>
                    <div class="goods-info">
                        <div class="flex-v">
                            <img :src="shipmentDetail.product_info.head_img" class="goods-img"/>
                            <div style="margin:0 6px;">
                                <p class="flex-v-b">
                                    <span>{{shipmentDetail.product_info.title}}</span><span style="margin-left:10px;">￥{{shipmentDetail.product_info.min_price}}</span>
                                </p>
                                <p>颜色随机</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-box">
                    <el-form :inline="true" :model="dataForm">
                        <el-form-item label="发货方式">
                            <el-radio v-model="dataForm.postType" label="1">自己联系物流</el-radio>
                            <p>自己联系物流公司下单,上传快递单号完成发货</p>
                        </el-form-item>
                        <div>
                            <el-form-item label="快递公司" >
                            <el-select v-model="dataForm.expresscom" filterable placeholder="请选择或搜索" @change="getExpressValue">
                                <el-option
                                v-for="item in expressList"
                                :key="item.express_code"
                                :label="item.expresscom"
                                :value="item.express_code">
                                </el-option>
                            </el-select>
                            </el-form-item>
                            <el-form-item label="物流单号">
                                <el-input v-model="dataForm.expresssn" clearable placeholder="请输入物流单号"></el-input>
                            </el-form-item>
                        </div>
                        
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="showPostType == 1" @click="downloadExcel">下载模板</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitData">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { getCustomerList, shopOrderList, actionShopOrder, getAllExpress, updateExpress, bulkShipment } from '@/api/permission'
import { goodsRenderList } from '../../goods-manage/config'
import { uploadUrl } from '@/config/baseUrl.js'

import { mapState } from 'vuex'

export default {
    data() {
        return {
            uploadUrl,
            dialogVisible: false,
            typeList: [{
                id: '0',
                name: '全部',
                num: 0,
            }, {
                id:'1',
                name: '待付款',
                num: 0,
            }, {
                id: '2',
                name: '待发货',
                num: 0,
            }, {
                id: '3',
                name: '待收货',
                num: 0,
            }, {
                id: '4',
                name: '已完成',
                num: 0,
            }, {
                id: '5',
                name: '取消订单',
                num: 0,
            }],
            searchData: {
                page: 1,
                limit: 10,
                total: 0,
                title: '',
                ordersn: '',
                payTime: [],
                status: '',
                order_type: '0',
                real_name: '',
                phone: ''
            },
            settlementStatus:{
                1: '待结算',
                2: '已结算',
                3: '取消结算',
                0: '不参与结算'
            },
            statusObj:{
                1: '待付款',
                2: '已付款 待发货',
                3: '已发货 待收货',
                4: '已收货 已完成',
                5: '取消订单'
            },
            tableData: [],
            expressList: [],
            editId: '',
            multipleSelection: [],
            multipleSelectId: [],
            filterType: 1,
            goodsId: '',
            dataForm: {
                id: '',
                remark_seller: '',
                expresscom: '',
                file: '',
                postType: '1',
                expresssn: '',
                type: '',
                express_code: ''
            },
            rules: {
                expresscom: [
                    {
                        required: true,
                        message: '快递公司不能为空',
                        trigger: 'change'
                    }
                ],
                file: [
                    {
                        required: true,
                        message: '文件不能为空',
                        trigger: 'change'
                    }
                ],
            },
            activeName: '1',
            fileList: [],
            showPostType: 1,
            shipmentDetail: {},
            updateType: ''
        }
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    mounted() {

    },
    created() {
        this.getList()
        this.getAllExpress()
    },
    methods: {
        restSearch(){
            this.searchData = {
                page: 1,
                limit: 10,
                total: 0,
                title: '',
                ordersn: '',
                payTime: [],
                status: '0',
                order_type: '0',
                real_name: '',
                phone: ''
            }
            this.onSearch(1)
        },
        handleClick(tab, event) {
            console.log(tab, event);
            const { searchData } = this
            for(let key in searchData){
                if(key != 'status' && key != 'limit' && key != 'total'){
                    searchData[key] = ''
                }
            }
            this.searchData = searchData
            this.onSearch(1)
        },
        async getList(){
            const { searchData } = this
            if(searchData.payTime == null){
                searchData.payTime = []
            }
            searchData.start_time = searchData.payTime.length ? searchData.payTime[0] : ''
            searchData.end_time = searchData.payTime.length ? searchData.payTime[1] : ''
            const data = await shopOrderList(searchData)
            this.typeList[0].num = data.all_count || 0
            this.typeList[1].num = data.un_pay || 0
            this.typeList[2].num = data.un_count || 0
            this.typeList[3].num = data.pass_count || 0
            this.typeList[4].num = data.complete_count || 0
            this.typeList[5].num = data.cancel || 0
            this.tableData = data.list
            this.searchData.total = data.total
        },
        async getAllExpress(){
            let param = {
                is_often: 1,
                expresscom: this.dataForm.expresscom
            }
            const data = await getAllExpress(param)
            this.expressList = data
        },
        // 批量发货
        async platformBulkShipment(){
            if(!this.dataForm.file){
                this.$message({
                    type: 'error',
                    message: '文件不可为空!'
                });
                return
            }
            const param = new FormData();
            param.append("excel", this.dataForm.file);
            param.append("expresscom", this.dataForm.expresscom);
            param.append("express_code", this.dataForm.express_code);
            let options = {headers: {'content-type':  'multipart/form-data; boundary=something'},isNeedQr: true}
            const data = await bulkShipment(param, options)
            this.$message({
                type: 'success',
                message: '操作成功!'
            });
            this.dialogVisible = false
        },
        async orderAction(){
            const { dataForm } = this
            const data = await actionShopOrder(dataForm)
            this.$message({
                type: 'success',
                message: '操作成功!'
            });
            this.onSearch(1)
            this.dialogVisible = false
        },
        onSearch(page){
            this.searchData.page = page
            this.getList()
        },
        search_fincerecord() {
            this.onSearch(1)
        },
        handleSizeChange(val) {
            this.searchData.limit = val = val
            this.onSearch(1)
        },
        handleCurrentChange(val) {
            this.searchData.page = val
            this.getList(val)
        },
        delData(row){
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
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            let multipleSelectId = val.map((item)=>{
                return item.id
            })
            this.multipleSelectId = multipleSelectId
        },
        examineData(type, item){
            // type 1 发货 2 拒绝 
            if(type == 2){
                this.$prompt('', '拒绝理由', {
                    dangerouslyUseHTMLString: true,
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value})=>{
                    if(!value){
                        this.$message({
                            message: '拒绝理由不可为空',
                            type: 'error',
                        })
                        return
                    }
                    this.dataForm.remark_seller = value
                    this.dataForm.id = item.id
                    this.dataForm.type = 2
                    this.orderAction()
                }).catch(()=>{

                });
            }
        },
        postGoods(type, item){
            if(Object.keys(item).length){
                this.dataForm.id = item.id
                this.shipmentDetail = item
            }
            this.showPostType = type
            this.dialogVisible = true
            this.updateType = ''
        },
        handleChangeSuccess(file, fileList){
            console.log({file,fileList})
            // this.dataForm.file = file.content.url

        },
        onDialogSubmit(formName, type, submit) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.submitData(type, submit)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        onDialogClose(){
            this.showPostType = 1
            this.dataForm.file = ''
            this.dataForm.expresscom = ''
        },
        goDetail(item){
            this.$router.push("/orderDetail/" + item.id)
        },
        downloadExcel(){
            let fileName = '文件模板'
            let link = document.createElement("a");
            link.download = decodeURIComponent(fileName);
            link.href = 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/wechat/file/20220606/de33f1a701a4d3ff0e6e1954e1f10739.xlsx';
            link.click();
        },
        submitData(){
            const { showPostType } = this
            if(this.showPostType == 1){
                this.platformBulkShipment()
            }else if(this.showPostType == 2){
                if(this.updateType){
                    this.editExpressInfo()
                    return
                }
                this.dataForm.type = 1
                this.dataForm.express_id = this.dataForm.expresscom,
                this.orderAction()
            }

        },
        beforeAvatarUpload(file, fileList) {
            // const fd = new FormData();
            // fd.append("file", file);
            let suffix = this.getFileType(file.name) //获取文件后缀名
            let suffixArray = ['xlsx'] //限制的文件类型，根据情况自己定义
            if (suffixArray.indexOf(suffix) === -1) {
                this.$message({
                    message: '文件格式错误',
                    type: 'error',
                    duration: 2000
                })
                return false
            }
            
            this.dataForm.file = file
            return suffixArray
        },
        getFileType(name) {
            let startIndex = name.lastIndexOf('.')
            if (startIndex !== -1) {
                return name.slice(startIndex + 1).toLowerCase()
            } else {
                return ''
            }
        },
        getExpressValue(expressId){
            const { expressList } = this
            let expressValue =  expressList.filter((item)=>{
                return item.express_code == expressId
            })
            this.dataForm.express_code = expressValue[0].express_code
            this.dataForm.expresscom = expressValue[0].expresscom
        },
        updateExpress(item, updateType){
            if(Object.keys(item).length){
                this.shipmentDetail = item
            }
            const { express_code, expresscom, expresssn, id } = item
            this.dataForm.express_code = express_code
            this.dataForm.expresscom = expresscom
            this.dataForm.expresssn = expresssn
            this.updateType = updateType
            this.dataForm.id = id
            this.showPostType = 2
            this.dialogVisible = true
        },
        async editExpressInfo(){
            const { dataForm } = this
            const data = await updateExpress(dataForm)
            this.dialogVisible = false
            this.$message({
                message: '操作成功',
                type: 'success',
            })
            this.onSearch(1)
            this.dialogVisible = false
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
    display: flex;
    align-items: center;
}
.parent-logo{
    width:25px;
    height:25px;
    border-radius:50%;
    margin-right:10px;
}
.child-log{
    width:50px;
    height:50px;
    margin-right:10px;
}
.order-total-money{
    margin:0 10px;
}
.action-header{
    margin-bottom: 20px;

}
.select-company{
    margin-top: 20px;
}
.post-img{
    width: 18px;
    height: 18px;
    margin-right:10px;
    border-radius:50%;
}
.goods-img{
    width:26px;
    height:26px;
    margin-right:4px;
}
.card-box{
    padding: 18px 22px;
    background: #F7F7F7;
    border-radius:8px;
    margin-bottom:10px;
}
.goods-info{
    padding:4px 6px;
    background:#fff;
    margin-top:18px;
    border-radius:4px;
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
.text-left{
    text-align: left;
}
</style>

