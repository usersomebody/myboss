<template>
  <div class="content">
    <div class="el-form">
        <div class="search_fincerecord">
            <el-form
            ref="form"
            :model="form"
            :inline="true"
            label-position="left"
            >
            <!-- label-width="100px" -->
            <div class="form-search">
                <el-input placeholder="请输入内容" v-model="form.keyword" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="search_fincerecord"></el-button>
                </el-input>
            </div>
            <div class="form-content">
                <div class="form-content-type">
                    <el-form-item label="商品来源">
                        <ul class="cat-ul">
                            <li class="cat-li color-base font-14" v-for="(item,index) in goodsTypeList" :key="index" :class="form.sid == item.value ? 'active' : ''" @click="changeTypeId(item.value, 'sid')">{{item.name}}</li>
                        </ul>
                    </el-form-item>
                </div>
                <div class="form-content-type">
                    <el-form-item label="商品分类">
                        <ul class="cat-ul">
                            <li class="cat-li color-base font-14" v-for="(item,index) in typeList" :key="index" :class="form.cid == item.id ? 'active' : ''" @click="changeTypeId(item.id, 'cid')">{{item.name}}</li>
                        </ul>
                    </el-form-item>
                </div>
                <div class="form-item">
                    <el-form-item label="时间:">
                        <el-date-picker
                        v-model="form.date"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        @change="search_fincerecord"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="价格区间" style="margin-left:60px;">
                        <el-select v-model="form.price" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in priceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <!-- <el-form-item label="">
                    <el-button
                        class="search_course-btn btn_blu"
                        type="primary"
                        :loading="loaded"
                        @click="search_fincerecord"
                        >查询</el-button
                    >
                </el-form-item> -->
            </div>
            </el-form>
        </div>
    </div>
    <!-- 列表 -->
    <div class="table-content">
        <div class="radio-filter">
            <el-radio-group v-model="form.type"  @change="getList">
                <el-radio-button :label="1">场均销量</el-radio-button>
                <el-radio-button :label="2">场均销售额</el-radio-button>
                <el-radio-button :label="3">关联直播</el-radio-button>
            </el-radio-group>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            border
            class="cursor"
            style="width: 100%"
            :header-cell-style="{ background: 'rgb(248, 248, 249)', color: 'rgb(98, 109, 116)' }"
          >
            <el-table-column prop="title" label="商品信息" align="center" width="480">
                <template slot-scope="scoped">
                <div class="flex-box">
                    <img
                    :src="scoped.row.cover"
                    alt=""
                    class="video-cover"
                    />
                    <div class="video-content-right">
                        <div class="video-title">{{scoped.row.title}}</div>
                        <div class="video-time">￥ {{scoped.row.minPrice}}</div>
                    </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="liveCount"
              label="关联直播"
              align="center"
            >
                <template slot-scope="scoped">
                    <span :style="form.type == 3 ?  'color: rgb(34, 186, 163)' : '' ">{{scoped.row.liveCount}}</span>
                </template>
            </el-table-column
            ><el-table-column
              prop="aveSaleCount"
              label="场均销量"
              align="center"
            >
                <template slot-scope="scoped">
                    <span :style="form.type == 1 ?  'color: rgb(34, 186, 163)' : '' ">{{scoped.row.aveSaleCount}}</span>
                </template>
            </el-table-column
            ><el-table-column
              prop="aveSaleAmount"
              label="场均销售额"
              align="center"
            >
                <template slot-scope="scoped">
                    <span :style="form.type == 2 ?  'color: rgb(34, 186, 163)' : '' ">{{scoped.row.aveSaleAmount}}</span>
                </template>
            </el-table-column
            ><el-table-column
              prop="shopName"
              label="店铺"
              align="center"
            >
                <template slot-scope="scoped">
                    <span>{{scoped.row.shopName ? scoped.row.shopName : '--'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="操作" align="center">
              <template slot-scope="scoped">
                <span class="details-btn" @click="goNext(scoped.row)"
                  >查看详情</span
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="form.page"
              :page-sizes="[2, 10, 20, 30, 50]"
              :page-size="form.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { getVideoType, getGoodsList } from '@/api/permission'
import { priceList } from './config.js'
export default {
    data() {
        return {
            tableData: [],
            form: {
                sid:'-1',
                cid:'-1',
                date: '',
                keyword: '',
                price: '',
                type:1,
                limit:10,
                page:1
            },
            priceList,
            typeList: [],
            goodsTypeList: [],
            loaded:false,
            pickerOptions: {
                shortcuts: [{
                    text: '昨天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近3天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近7天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        console.log(end,start)
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            total:0,
            
        }
    },
    created() {
        const end = this.timestamp_to_date(new Date().getTime());
        const start = this.timestamp_to_date(new Date().getTime() - 3600 * 1000 * 24 * 7);
        this.form.date = [start, end]
        this.form.start_time = start
        this.form.end_time = end
        this.getTypeData()
        this.getList()
    },
    methods: {
        //获取分类数据
        async getTypeData() {
            const data = await getVideoType()
            let addData = {id:-1, value:-1, name:'不限'}
            for(let key in data){
                data[key].unshift(addData)
            }
            this.typeList = data.goodsCategory
            this.goodsTypeList = data.goodsSource
        },
        async getList() {
            const { form } = this
            for(let key in form){
                form[key] = form[key] == '不限' ? '-1' : form[key]
            }
            form.start_time = form.date == null ? '' : form.date[0]
            form.end_time = form.date == null ? '' : form.date[1]
            const data = await getGoodsList(form)
            console.log('data',data)
            this.tableData = data.list
            this.total = data.total
            this.loaded = false
        },
        //搜索
        search_fincerecord() {
            this.form.page = 1
            this.loaded = true
            this.getList()
        },
        changeTypeId(id, type) {
            this.form[type] = id
            this.search_fincerecord()
        },
        goNext(data){
            const { goodsJumpUrl } = data
            // location.href = goodsJumpUrl
            window.open(goodsJumpUrl)

        },
        //   分页
        handleSizeChange(val) {
            this.form.limit = val;
            this.form.page = 1;
            this.getList();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.getList();
            console.log(`当前页: ${val}`);
        },

        timestamp_to_date(unixtime) {
            let dateTime = new Date(parseInt(unixtime));
            let year = dateTime.getFullYear();
            let month = dateTime.getMonth() + 1;
            if (month > 0 && month < 10) {
                month = "0" + month;
            }
            let day = dateTime.getDate();
            if (day > 0 && day < 10) {
                day = "0" + day;
            }
            let timeSpanStr = year + "-" + month + "-" + day;
            return timeSpanStr;
        }
    }
}
</script>

<style lang="scss" scoped>
.font-14{
    font-size: 14px;
}
.color-base{
    color:rgb(83, 95, 102);
}
.form-search{
    margin-bottom:10px;
}
.form-content{
    padding: 16px 20px;
    background: #fff;
    border-radius: 4px;
}
.cat-ul{
    display:inline-flex;
    align-items: center;
    flex-wrap: wrap;
}
.cat-li{
    text-align: center;
    border-radius: 4px;
    margin-right: 12px;
    padding: 0 8px;
    color: rgb(83, 95, 102);
}
.cat-li.active{
    background: rgba(1, 153, 255, 0.2);
    color: rgb(1, 153, 255);
}
.cat-li:hover{
    background: rgba(1, 153, 255, 0.2);
    color: rgb(1, 153, 255);
}
.table-content{
    margin-top: 10px;
    margin-bottom: 10px;
    background:#fff;
    border-radius: 4px;
    padding: 20px;
}
.radio-filter{
    margin-bottom:10px;
}
.video-cover{
    width: 64px;
    height: 64px;
    margin-right: 6px;
}
.head-img{
    width: 48px;
    height: 48px;
    border-radius:50%;
}
.flex-box{
    display:flex;
    align-items: center;
}
.video-content-right{
    width:80%;
    display:flex;
    flex-direction: column;
}
.video-title{
    text-align: left;
    color: rgb(83, 95, 102);
    font-weight: 700;
    font-size:14px;
}
.video-topic{
    margin:10px 0 20px;
}
.video-time{
    text-align: left;
    font-size: 14px;
    color:rgb(246, 67, 36);
    margin-top: 25px;
}
.topic-list{
    margin-left:10px;
}
.topic-list .topic-item{
    padding:0 8px;
    height:22px;
    line-height: 22px;
    color:rgb(86, 96, 102);
    background: rgb(239, 243, 249);
    font-size:12px;
    margin-right:20px;
}
.details-btn{
    padding: 5px 7px;
    border: 1px solid rgb(1, 153, 255);
    box-sizing: border-box;
    background: rgb(204, 235, 255);
    color: rgb(1, 153, 255);
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    border-radius: 2px;
}
</style>
<style>
 .input-with-select .el-input-group__append{
    background-color: rgb(1, 153, 255)!important;
  }
  .input-with-select .el-input-group__append .el-icon-search{
    color: #fff;
  }
  .form-content-type .el-form-item__content{
      width: 95%;
  }
  .form-content-type .el-form-item{
      width:100%;
  }
  .form-content-select .el-form-item{
      margin-right: 34px;
  }
  .form-content-type .el-form-item__label, .form-content-select .el-form-item__label, .form-item .el-form-item__label{
      color: rgb(125, 143, 153)!important;
      font-size: 14px;
  } 
</style>
