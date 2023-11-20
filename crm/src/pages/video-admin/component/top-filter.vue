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
                <el-input placeholder="请输入视频标题关键词搜索" v-model="form.keyword" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="search_fincerecord"></el-button>
                </el-input>
            </div>
            <div class="form-content">
                <div class="form-content-type">
                    <el-form-item label="分类">
                        <ul class="cat-ul">
                            <li class="cat-li color-base font-14" v-for="(item,index) in typeList" :key="index" :class="form.cat_id == item.id ? 'active' : ''" @click="changeTypeId(item.id, 'cat_id')">{{item.name}}</li>
                        </ul>
                    </el-form-item>
                </div>
                <div class="form-content-select">
                    <el-form-item label="点赞">
                        <el-select v-model="form.like" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in likeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="评论">
                        <el-select v-model="form.comment" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in commentList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分享">
                        <el-select v-model="form.share" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in shareList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时长">
                        <el-select v-model="form.duration" clearable @change="search_fincerecord">
                            <el-option
                            v-for="item in durationList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="form-content-switch form-content-select">
                    <el-form-item label="话题">
                        <ul class="cat-ul">
                            <li class="cat-li color-base font-14" v-for="(item,index) in topicList" :key="index" :class="form.is_topic == item.id ? 'active' : ''" @click="changeTypeId(item.id, 'is_topic')">{{item.name}}</li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="挂链">
                        <ul class="cat-ul">
                            <li class="cat-li color-base font-14" v-for="(item,index) in linkList" :key="index" :class="form.is_link == item.id ? 'active' : ''" @click="changeTypeId(item.id, 'is_link')">{{item.name}}</li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="是否有直播记录">
                        <ul class="cat-ul">
                            <li class="cat-li color-base font-14" v-for="(item,index) in liveList" :key="index" :class="form.live_type == item.id ? 'active' : ''" @click="changeTypeId(item.id, 'live_type')">{{item.name}}</li>
                        </ul>
                    </el-form-item>
                </div>
                <div class="form-item">
                    <el-form-item label="时间">
                        <ul class="cat-ul">
                            <li class="cat-li color-base font-14" v-for="(item,index) in timeArr" :key="index" :class="form.time_type == item.id ? 'active' : ''" @click="changeTypeId(item.id, 'time_type')">{{item.name}}</li>
                        </ul>
                        <!-- <el-date-picker
                        v-model="form.date"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        >
                        </el-date-picker> -->
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
            <el-radio-group v-model="form.type" @change="getList">
                <el-radio-button :label="1">点赞增长率</el-radio-button>
                <el-radio-button :label="2">评论增长率</el-radio-button>
                <el-radio-button :label="3">分享增长率</el-radio-button>
            </el-radio-group>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            border
            class="cursor"
            style="width: 100%"
            :header-cell-style="{ background: 'rgb(248, 248, 249)', color: 'rgb(98, 109, 116)' }"
            @row-dblclick="handleDbClick"
          >
            <el-table-column prop="name" label="视频内容" align="center" width="480">
                <template slot-scope="scoped">
                <div class="flex-box">
                    <img
                    :src="scoped.row.cover"
                    alt=""
                    class="video-cover"
                    />
                    <div class="video-content-right">
                        <div class="video-title">{{scoped.row.description}}</div>
                        <div class="video-topic flex-box">
                            <div class="">引用话题</div>
                            <div class="topic-list flex-box">
                                <div class="topic-item" v-for="(itm, index) in scoped.row.topicsArr" :key="index" v-if="index < 3">{{itm}}</div>
                            </div>
                        </div>
                        <div class="video-time">视频时长：{{scoped.row.duration}}s</div>
                    </div>
                </div>
               
              </template>
            </el-table-column>
            <el-table-column prop="head_img" label="视频号" align="center">
              <template slot-scope="scoped">
                <img
                  :src="scoped.row.avatar"
                  alt=""
                  class="head-img"
                />
                <div class="head-name">{{scoped.row.nickname}}</div>
              </template>
            </el-table-column>
            
            <el-table-column
              prop="createTime"
              label="发布时间"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="saveAmount"
              label="直播销售额"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="growth"
              label="增长率"
              align="center">
                <template slot-scope="scoped">
                    <span style="color: rgb(34, 186, 163)">{{scoped.row.growth}}</span>
                </template>
            </el-table-column>
            <el-table-column
              prop="likes"
              label="点赞"
              align="center"
            >
            </el-table-column
            ><el-table-column
              prop="comments"
              label="评论"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="shares"
              label="分享"
              align="center"
            >
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
import { getVideoType, getVideoList } from '@/api/permission'
import { likeList, shareList, commentList, durationList, topicList, linkList, liveList } from './config.js'
export default {
    data() {
        return {
            tableData: [],
            form: {
                date: '',
                keyword: '',
                cat_id: '-1',
                like: '',
                comment: '',
                share: '',
                duration: '',
                type:1,
                is_link: '-1',
                is_topic: '-1',
                time_type: 1,
                live_type: '-1',
                limit:10,
                page:1
            },
            likeList,
            shareList,
            commentList,
            durationList,
            topicList,
            linkList,
            liveList,
            typeList: [],
            timeArr: [],
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
        this.timeDataInit()
        this.getTypeData()
        this.getList()
    },
    methods: {
        timeDataInit(){
        // 选择时间数据初始化
        let timeArr = []
        let obj = {
            id:1,
            start:'',
            end:'',
            name:'昨天',
            val:1
        }
        for(let i=0; i<3; i+=1){
           switch (i) {
                case 0:
                    obj = {
                        id: i + 1,
                        start:this.timestamp_to_date(new Date().getTime() - 3600 * 1000 * 24),
                        end:this.timestamp_to_date(new Date().getTime()),
                        name:'昨天',
                        val:1
                    }
                    timeArr.push(obj)
                    break;
                case 1:
                    obj = {
                        id:i + 1,
                        start:this.timestamp_to_date(new Date().getTime() - 3600 * 1000 * 24 * 3),
                        end:this.timestamp_to_date(new Date().getTime()),
                        name:'近三天',
                        val:1
                    }
                    timeArr.push(obj)
                    break;
                case 2:
                    obj = {
                        id:i + 1,
                        start:this.timestamp_to_date(new Date().getTime() - 3600 * 1000 * 24 * 7),
                        end:this.timestamp_to_date(new Date().getTime()),
                        name:'近7天',
                        val:1
                    }
                    timeArr.push(obj)
                    break;
            } 
        }
            this.timeArr = timeArr
            const end = this.timestamp_to_date(new Date().getTime());
            const start = this.timestamp_to_date(new Date().getTime() - 3600 * 1000 * 24);
            this.form.date = [start, end]
            this.form.start_time = start
            this.form.end_time = end
        },
        //获取分类数据
        async getTypeData() {
            const data = await getVideoType()
            let addData = {id:-1, name:'不限'}
            for(let key in data){
                data[key].unshift(addData)
            }
            this.typeList = data.categoryList
        },
        async getList() {
            try{
                const { form } = this
                for(let key in form){
                    form[key] = form[key] == '不限' ? '-1' : form[key]
                }
                // form.start_time = form.date[0]
                // form.end_time = form.date[1]
                const data = await getVideoList(form)
                this.tableData = data.list
                this.total = data.total
                this.loaded = false
            }catch(error){
                console.log('error',error)
            }
            
        },
        //搜索
        search_fincerecord() {
            this.form.page = 1
            this.loaded = true
            this.getList()
        },
        changeTypeId(id, type) {
            const { timeArr } = this
            this.form[type] = id
            if(type == 'time_type'){
                let date = timeArr.filter((item)=>{
                    return item.id == id
                })
                console.log('date',date)
                this.form.start_time = date[0].start
                this.form.end_time = date[0].end
            }
            this.search_fincerecord()
            
        },
        goNext(data){
            const { videoJumpUrl } = data
            // location.href = videoJumpUrl
            window.open(videoJumpUrl)
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
    height: 96px;
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
    font-size:14px;
}
.video-topic{
    margin:10px 0 20px;
}
.video-time{
    text-align: left
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
  .form-content-select .el-form-item{
      margin-right: 34px;
  }
  .form-content-type .el-form-item__label, .form-content-select .el-form-item__label, .form-item .el-form-item__label{
      color: rgb(125, 143, 153)!important;
      font-size: 14px;
  }
  .el-date-editor .el-range-separator{
      padding: 0 0!important;
  }
</style>
