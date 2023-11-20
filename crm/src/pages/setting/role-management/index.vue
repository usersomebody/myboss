<template>
    <div class="flex">
        <div class="left">
            <div class="flex user-top-info flex-a-center">

                <div class="">
                    <h4 class="user-name font-weight">管理角色</h4>
                </div>
            </div>
            <ul>
                <li v-for="(item,index) in switchList" :key="index" class="switch-item" :class="item.id === switchId ? 'active' : ''" @click="switchTab(item.id)">{{item.name}}</li>
            </ul>
        </div>
        <div class="right">
            <div class="flex flex-a-center flex-j-between">
                <div style="width:90%;">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <template v-for="(item, index) in roleSettingList">
                            <el-tab-pane :label="item.name" :name="item.id"  :key="index"></el-tab-pane>
                        </template>
                    </el-tabs>
                </div>
                <el-button type="primary" plain class="relation-role" @click="showRoleList">关联员工</el-button>
            </div>
            
            <div v-if="activeName == 1">
                <el-table
                    :data="roleListData"
                    stripe
                    border
                    center
                    style="width: 100%"
                    :header-cell-style="{ background: 'rgb(248, 248, 249)', color: 'rgb(98, 109, 116)', textAlign: 'center' }">
                    <el-table-column
                    prop="name"
                    label="姓名"
                    align="center"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="department_name"
                    label="部门"
                    align="center"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="job"
                    align="center"
                    label="职位">
                    </el-table-column>
                     <el-table-column
                    prop="rule_name"
                    align="center"
                    label="角色">
                    </el-table-column>
                    <!-- <el-table-column
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button slot="reference" type="text" @click="isRemoveData(scope.row)">删除</el-button>
                    </template>
                    
                    </el-table-column> -->
                </el-table>
            </div>
            <div v-if="activeName == 2">
                <el-table
                    :data="roleList"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="id"
                    label="可见页面"
                    width="240">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked" @change="updateCheck(scope.row, scope.row.id, 'father')">{{scope.row.name}}</el-checkbox>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="功能权限">
                    <template slot-scope="scope">
                        <div class="role-item">
                            <div v-for="(item, index) in scope.row.detail" :key="index" class="children-item">
                                <el-checkbox v-model="item.checked" @change="updateCheck(scope.row, item.id, 'children')">{{item.name}}</el-checkbox>
                            </div>
                        </div>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog
        width="50%"
        title="关联员工"
        :visible.sync="visible">
        <div>
            <span class="m-r-20">选择员工</span>
            <el-select v-model="roleValue" clearable multiple placeholder="请选择">
                <el-option
                v-for="item in roleListData"
                :key="item.id"
                :label="item.name + '_' + item.rule_name"
                :value="item.id">
                </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="onDialogSubmit()" >保存</el-button>
            </div>
        </div>
    </el-dialog>
    </div>    
</template>
<script>
import { roleList, getAllAuth, editAuth, userList, chooseRole, delRole } from '@/api/permission'

import moment from 'moment'
export default {
    data() {
        return {
            switchList: [],
            switchId: 1,
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            activeName: '1',

            roleSettingList: [{
                id:'1',
                name:'角色员工'
            }],

            roleListData: [],
            roleList: [],
            visible: false,
            roleValue: '',
            submitData: {}
        }
    },
    mounted() {
        this.getRoleList()
        this.getUserList()
    },
    methods: {
        async getRoleList(type) {
            const data = await roleList()
            this.switchList = data
            if(!type){
                this.getAllAuths()
            }
            if(type){
                this.currenCheckedRole()
            }
        },
        async getAllAuths() {
            const data = await getAllAuth()
            this.roleList = data
            this.currenCheckedRole()
        },
        async editAuths() {
            const { submitData } = this
            const data = await editAuth(submitData)
            this.$message({
                type: 'success',
                message: '修改成功!'
            });
        },
        async getUserList(id) {
            const { switchId } = this
            let param = {
                limit:20,
                page:1,
                role_id: id ? switchId : '1'
            }
            const data = await userList(param)
            this.roleListData = data.list
        },
        //关联员工
        async chooseRoleUser() {
            const { switchId,  roleValue} = this
            let param = {
                id: switchId,
                user_id: roleValue
            }
            const data = await chooseRole(param)
            this.$message({
                type: 'success',
                message: '关联成功!'
            });
            this.visible = false
        },
        // 删除员工
        async handleDeleteClick(row){
            const data = await delRole({id: row.id})
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            this.getUserList(this.switchId)
            
        },
        isRemoveData(row){
               this.$confirm('确认删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.handleDeleteClick(row)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });    
            });
        },
        //当前选中的权限
        currenCheckedRole(){
            const { switchId, switchList, roleList } = this
            let selectRole = switchList.filter((item)=>{
                return item.id == switchId
            })
            let selcetRoleAuth = selectRole[0].id == 1 ? [] : selectRole[0].auth_code.split(',')
            let role  = roleList.map((item)=>{
                let obj = item
                obj.checked = !selcetRoleAuth.length ? true : selcetRoleAuth.indexOf(item.auth_code) > -1 ? true : false
                item.detail.map((itm)=>{
                    let o = itm
                    itm.checked = !selcetRoleAuth.length ? true : selcetRoleAuth.indexOf(itm.auth_code) > -1 ? true : false
                    return o
                })
                return obj
            })
            this.roleList = role
        },
        onDialogSubmit(){
            this.chooseRoleUser()
        },
        switchTab(id){
            const { activeName } = this
            this.switchId = id
            if(this.switchId == 1){
                this.roleSettingList = [{
                    id:'1',
                    name:'角色员工'
                }]
                this.activeName = '1'
            }else{
                this.roleSettingList = [{
                    id:'1',
                    name:'角色员工'
                }, {
                    id:'2',
                    name:'角色权限'
                }]
            }
            if(activeName == 2){
                this.getRoleList(1)
                // this.currenCheckedRole()
                return
            }
            this.getUserList(id)
        },
        handleClick(tab, event) {
            const { activeName } = this
            if(activeName == 2){
                this.currenCheckedRole()
                return
            }
        },
        
        updateCheck(row, id, type){
            const { roleList, switchId } = this
            let list = roleList.map((item)=>{
                let obj = item
                obj.detail.map((itm)=>{
                    let objc = itm
                    objc.checked = type == 'father' && item.id == id ? obj.checked ? true : false : itm.checked 
                    return objc
                })
                return obj
            })
            list.forEach(element => {
                element.checked = element.detail.length ? element.detail.some((item)=>{
                    return item.checked == true ? true : element.checked
                }) : element.checked
            });
            this.roleList = list
            let authList = []
            list.forEach((item)=>{
                if(item.checked){
                    authList = [...authList, item.auth_code, item.relevance_code]
                }
                item.detail.forEach((itm)=>{
                    if(itm.checked){
                        authList = [...authList, itm.auth_code, item.relevance_code]
                    }
                })
            })
            let realAuthList = Array.from(new Set(authList))
            this.submitData = {
                auth_code: realAuthList.join(',') ? realAuthList.join(',') : '100000',
                id: switchId
            }
            this.editAuths()
        },
        showRoleList(){
            this.getUserList()
            this.visible = true
        }
    }
}
</script>
<style scoped>
.flex{
    display: flex;
}
.flex-a-center{
    align-items: center;

}
.flex-j-between{
    justify-content: space-between
}
.left{
    width:200px;
    margin-right:6px;
}
.user-top-info{
    padding:20px 20px 20px 10px;
    background:#fff;
    border-radius:4px;
}
.avatar{
    width:44px;
    height:44px;
    border-radius: 50%;
    margin-right:10px;
}
.switch-item{
    height:36px;
    line-height:36px;
    padding-left:8px;
    background:#fff;
    font-size:14px;
    box-sizing: border-box;
}
.active{
    border-left:2px solid #0D85FA;
    background:rgba(0,0,0,0);
    box-sizing: border-box;
}
.font-weight{
    font-weight:600;
}
.user-name{
    font-size:16px;
    margin-bottom:6px;
    color: #2B3567!important;
}
.user-tips{
    font-size:14px;
}
.right{
    width: 100%;
    background:#fff;
    padding: 20px;
    border-radius: 6px;
}
.relation-role{
    float: right;
}
.role-item{
    display:flex;
    flex-wrap: wrap;
    align-items: center;
}
.children-item{
    margin-right:20px;
}
.dialog-footer{
    padding: 20px 20px 0;
    border-top:1px solid #DCDFE6;
    margin-top:20px;
    display: flex;
    justify-content: flex-end;
}
.m-r-20{
    margin-right:20px;
}
.m-b-20{
    margin-bottom: 20px;
}
</style>

