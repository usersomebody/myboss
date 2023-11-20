<template>
    <div class="detail-container">
        <el-card class="box-card" v-if="dataLen">
            <h5>基础信息</h5>
            <div class="base-info-item common-size-color">
                <span class="info-item-title">订单状态</span><span>{{statusObj[orderInfo.info.status]}}</span>
            </div>
            <div class="base-info-item common-size-color">
                <span class="info-item-title">订单编号</span><span>{{orderInfo.info.ordersn}}</span>
            </div>
            <div class="base-info-item common-size-color">
                <span class="info-item-title">下单时间</span><span>{{orderInfo.info.create_time_name}}</span>
            </div>
            <div class="base-info-item common-size-color">
                <span class="info-item-title">支付方式</span><span>{{orderInfo.info.paytype == 1 ? '微信支付' : ''}}</span>
            </div>
            <div class="base-info-item common-size-color">
                <span class="info-item-title">支付时间</span><span>{{orderInfo.info.pay_time_name}}</span>
            </div>
            <!-- <div class="base-info-item common-size-color">
                <span class="info-item-title">交易单号</span><span>{{orderInfo.info.ordersn}}</span>
            </div> -->
        </el-card>
        <el-card class="box-card" v-if="dataLen">
            <h5>买家</h5>
            <div class="base-info-item common-size-color">
                <span class="info-item-title">微信昵称</span><span>{{orderInfo.buy_info.nickname}}</span>
            </div>
            <div class="base-info-item common-size-color">
                <span class="info-item-title">手机号</span><span>{{orderInfo.buy_info.phone}}</span>
            </div>
            <!-- <div class="base-info-item common-size-color">
                <span class="info-item-title">性别</span><span>已发货</span>
            </div> -->
            <div class="base-info-item common-size-color">
                <span class="info-item-title">用户地址</span><span>{{orderInfo.buy_info.address}}</span>
            </div>
        </el-card>
        <el-card class="box-card" v-if="dataLen">
            <h5>订单商品</h5>
            <div class="order-detail">
                <div class="goods-detail">
                    <img :src="orderInfo.product_info.head_img" class="goods-img"/>
                    <div class="goods-info">
                        <div class="font-12 color-b2b">{{orderInfo.product_info.title}}</div>
                        <div class="font-12 color-b2b"></div>
                    </div>
                </div>
                <div class="order-price">
                    <div class="font-12 color-b2b">￥{{orderInfo.product_info.min_price}}</div>
                    <div class="font-12 color-b2b">x1</div>
                </div>
            </div>
            <div class="base-info-item common-size-color">
                <span class="info-item-title">商品总价</span><span>￥{{orderInfo.product_info.price}}</span>
            </div>
            <!-- <div class="base-info-item common-size-color">
                <span class="info-item-title">订单运费</span><span>￥0.00</span>
            </div>
            <div class="base-info-item common-size-color">
                <span class="info-item-title">商品改价</span><span>￥0.00</span>
            </div> -->
            <div class="base-info-item common-size-color">
                <span style="color:#5D5D5D;font-size:14px;">总1件，实付款</span><span style="color:#333;font-size:16px;">￥{{orderInfo.product_info.price}}</span>
            </div>
        </el-card>
        <el-card class="box-card" v-if="dataLen">
            <h5>物流信息</h5>
            <div class="logistics-content">
                <div class="logistics-status">
                    {{orderInfo.express_info.express.state}}
                </div>
                <div class="logistics-cover">
                    <img :src="orderInfo.express_info.head_img" class="product-cover"/>
                </div>
                <div class="font-12 color-b2b">{{orderInfo.express_info.expresscom}}</div>
                <div class="font-12 color-b2b bor-bot">物流编号：{{orderInfo.express_info.expresssn}}</div>
                <div class="logistics-info">
                    <div class="logistics-item" v-for="(item,index) in orderInfo.express_info.express.data" :key="index">
                        <div class="indication-point color-3cc"></div>
                        <div class="logistics-info-item">
                            <div class="logistics-info-item-title">{{item.context}}</div>
                            <div class="font-12 color-b2b" style="margin:6px 0;">{{item.status}}</div>
                            <div class="font-12 color-b2b">{{item.ftime}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>

    </div>
</template>

<script>

import { mapState } from 'vuex'
import { shopOrderDetail } from '@/api/permission'
import { expressState } from '../config.js'
export default {
    data() {
        return {
            searchData:{
                id: ''
            },
            statusObj:{
                1: '待付款',
                2: '已付款 待发货',
                3: '已发货 待收货',
                4: '已收货 已完成',
                5: '取消订单'
            },
            expressState,
            orderInfo: {},
            dataLen: 0
        }
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    mounted() {

    },
    created() {
        this.searchData.id = this.$route.params.id || ''
        this.getDetail()
    },
    methods: {
         async getDetail(){
            const { searchData } = this
            const data = await shopOrderDetail(searchData)
            let dataLen = Object.keys(data).length
            this.dataLen = dataLen
            this.orderInfo = data
        },
    }

}
</script>
<style lang="scss" scoped>
.box-card h5{
    margin-bottom:20px;
}
.detail-container{
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
}
.order-detail{
   width:70%;
   display: flex;
   justify-content: space-between;
   padding:10px 0;
   border-bottom:1px solid #F6F6F6;
}
.goods-info{
    margin-left:10px;
}
.goods-detail{
    display: flex;
    align-items: center;
}
.box-card{
    width:45%;
    margin:10px;
}
.base-info-item{
    margin:10px 0;
    display: flex;
}
.info-item-title{
    margin-right:20px;
    width:60px;
}
.common-size-color{
    color: #B6B6B6;
    font-size: 12px;
}
.font-12{
    font-size: 12px!important;
}
.color-b2b{
    color:#b2b2b2!important;
}
.goods-img{
    width:50px;
    height:50px;
}
.order-price{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.logistics-content{
    width:70%;
    padding:18px 12px;
    background:#F7F7F7;
    border-radius:8px;
}
.logistics-status{
    font-size:12px;
    color:#3CCD81;
    display: flex;
    justify-content: flex-end;
}
.logistics-cover{
    display:flex;
    align-items: center;
    margin-bottom:15px;
}
.logistics-item{
    display:flex;
    align-items: baseline;
}
.product-cover{
    width: 45px;
    height: 45px;
    margin-right: 6px;
}
.bor-bot{
    padding-bottom:10px;
    border-bottom:1px solid #EFEFEF;
}
.logistics-info-item-title{
    font-size:16px;
    color:#393839;
}
.indication-point{
    display:block;
    width:5px;
    height:5px;
    border-radius:50%;
    background:#b2b2b2;
    margin-right:10px;
}
.color-3cc{
    background:#3CCD81;
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

