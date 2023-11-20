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
            <div class="form-content">
                <el-form-item label="操作人">
                    <el-select v-model="form.add_people" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in actionUserList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker
                    v-model="form.date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="search_fincerecord"
                    >
                    </el-date-picker>
                </el-form-item>
            </div>
            </el-form>
        </div>
    </div>
    <!-- 列表 -->
    <div class="table-content">
        <div class="table">
          <el-table
            :data="tableData"
            border
            class="cursor"
            style="width: 100%"
            :header-cell-style="{ background: 'rgb(248, 248, 249)', color: 'rgb(98, 109, 116)' }"
          >
            <el-table-column
              prop="create_time_name"
              label="操作时间"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="user_name"
              label="操作人"
              align="center"
            >
            </el-table-column>
             <el-table-column
              prop="type"
              label="操作类型"
              align="center"
            >
                <template slot-scope="scoped">
                    <div class="head-name">{{statusMap[scoped.row.type]}}</div>
              </template>
            </el-table-column>
             <el-table-column
              prop="content"
              label="内容"
              align="center"
            >
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
import { systemLog, userList } from '@/api/permission'
import { statusMap } from './config.js'
export default {
    data() {
        return {
            statusMap,
            tableData: [],
            form: {
                date: '',
                add_people: '',
                limit:10,
                page:1
            },
            total: 0,
            actionUserList: []
        }
    },
    created() {
        this.getList()
        this.getUserList()
    },
    methods: {
        async getList() {
            const { form } = this
            try{
                form.start_time = form.date.length ? form.date[0] : ''
                form.end_time = form.date.length ? form.date[1] : ''
                const data = await systemLog(form)
                this.tableData = data.list
                this.total = data.total
                this.loaded = false
            }catch(error){
                console.log('error',error)
            }
            
        },
        // 操作人
        async getUserList() {
            try{
                const data = await userList()
                this.actionUserList = data.list
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
