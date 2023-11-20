<template>
    <div class="flex">
        <div class="left">
            <div class="flex user-top-info flex-a-center">

                <div class="">
                    <h4 class="user-name font-weight">部门管理</h4>
                </div>
            </div>
            <ul>
                <li v-for="(item,index) in switchList" :key="index" class="switch-item" :class="item.id === searchData.department_id ? 'active' : ''" @click="switchTab(item.id, item.name)">{{item.name}}</li>
            </ul>
        </div>
        <div class="right">
            <div>
                <div class="flex flex-a-center flex-j-between m-b-20">
                    <div class="flex flex-a-center" style="width:90%;">
                        <span class="sale-employee m-r-20">{{searchData.department_name}}: {{total}}</span>
                        <div v-if="multipleSelection.length" class="flex">
                            <div>已选<span class="m-l-r-20 color-409">{{multipleSelection.length}}</span>项</div>
                            <div class="vertical-line"></div>
                            <div class="deleteTitle" slot="reference" @click="isRemoveData"><i class="el-icon-delete"></i>删除</div>
                        </div>
                    </div>
                    <el-button type="primary" class="relation-role" @click="showAddMember">新建员工</el-button>
                </div>
                <el-table
                    :data="staffList"
                    ref="multipleTable"
                    style="width: 100%"
                    border
                    :header-cell-style="{ background: 'rgb(248, 248, 249)', color: 'rgb(98, 109, 116)', textAlign: 'center' }"
                    @selection-change="handleSelectionChange"
                    @row-click="seeDetail">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    prop="login_time_name"
                    label="最近登录时间"
                    align="center"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="姓名"
                    align="center"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="sex"
                    label="性别"
                    align="center"
                    width="180">
                        <template slot-scope="scope">{{ sexList[scope.row.sex] }}</template>
                    </el-table-column>
                    <el-table-column
                    prop="job"
                    align="center"
                    label="岗位">
                    </el-table-column>
                    <el-table-column
                    prop="phone"
                    align="center"
                    label="手机号">
                    </el-table-column>
                    <el-table-column
                    width="220"
                    prop="email"
                    align="center"
                    label="邮箱">
                    </el-table-column>
                    <el-table-column
                    prop="department_name"
                    align="center"
                    label="部门名称">
                    </el-table-column>
                    <el-table-column
                    prop="rule_name"
                    align="center"
                    label="角色">
                    </el-table-column>
                    <el-table-column
                    prop="super_name"
                    align="center"
                    label="上级名称">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog
        width="50%"
        :title="dialogTitle"
        :visible.sync="visible">
        <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="140px">
            <el-form-item label="手机号（登录名）" class="" prop="phone" style="width:50%">
                <el-input v-model="dataForm.phone" :disabled="iscanset" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="登录密码" class="" prop="password" style="width:50%">
                <el-input v-model="dataForm.password" placeholder="默认密码"></el-input>
            </el-form-item>
            <el-form-item label="姓名" class="" prop="name" style="width:50%">
                <el-input v-model="dataForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" class="" prop="email" style="width:50%">
                <el-input v-model="dataForm.email" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex" style="width:50%">
                <el-select v-model="dataForm.sex" clearable>
                    <el-option
                    v-for="item in sexArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="部门" prop="department_id" style="width:50%">
                <el-select v-model="dataForm.department_id" clearable @change="getSelectDepartmentData">
                    <el-option
                    v-for="item in switchList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="岗位" prop="job" class="" style="width:50%">
                <el-input v-model="dataForm.job" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="钉钉userid" prop="dingding_userid" class="" style="width:50%">
                <!-- <el-input v-model="dataForm.dingding_userid" placeholder="请输入"></el-input> -->
                <div class="flex flex-a-center">
                    <el-cascader v-if="showCascader" :props="props" :options="departmentList" v-model="selectDepartment" @change="getChildData"></el-cascader>
                    <div v-if="dataForm.department_name && dataForm.dingding_username" style="margin-left:20px;white-space:nowrap;">{{dataForm.department_name}}/{{dataForm.dingding_username}}</div>
                </div>
                
            </el-form-item>
            <el-form-item label="直属上级" prop="super_id" style="width:50%">
                <el-select v-model="dataForm.super_id" clearable>
                    <el-option
                    v-for="item in allStaffList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="role_id" style="width:50%">
                <el-select v-model="dataForm.role_id" clearable>
                    <el-option
                    v-for="item in allRoleList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button v-if="dialogTitle == '新建员工'" type="primary" @click="onDialogSubmit('dataForm', 1)">创建</el-button>
        <el-button v-else type="primary" @click="onDialogSubmit('dataForm', 2)">保存</el-button>
      </div>
    </el-dialog>
    </div>    
</template>
<script>
import { addAdminMember, userList, roleList, allDepartment, getDepartmentList, getDepartmentUser, updateUserInfo, delRole } from '@/api/permission'

import moment from 'moment'
export default {
    data() {
        return {
            showCascader: false,
            dialogTitle: '新建员工',
            switchList: [{
                id:1,
                name:'销售部门'
            }, {
                id:2,
                name:'媒介部门'
            }],
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            rules: {
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {
                        pattern: /^(13|15|18|14|17|16|19)[0-9]{9}$/,
                        message: '手机号码格式不正确',
                        trigger: 'blur'
                    }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                // email: [
                //     { required: false, message: '请输入邮箱', trigger: 'blur' },
                //     {
                //         type: 'email',
                //         message: '邮箱格式不正确',
                //         trigger: ['blur', 'change']
                //     }
                // ],
                department_id: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                job: [
                    { required: true, message: '岗位不可以为空', trigger: 'blur' },
                ],
                dingding_userid: [
                    { required: true, message: '钉钉userid不可以为空', trigger: 'blur' },
                ],
                super_id: [
                    { required: false, message: '请选择', trigger: 'change' },
                ],
                role_id: [
                    { required: true, message: '请选择', trigger: 'change' },
                ]
            },
            staffList: [],
           
            visible: false,
            options: [{
                id:1,
                name:'选项一'
            }],
            sexArr: [{
                id: 0,
                name: '未知'
            }, {
                id: 1,
                name: '男'
            }, {
                id: 2,
                name: '女'
            }],
            sexList: {
                0: '未知',
                1: '男',
                2: '女'
            }, 
            roleValue: '',
            dataForm: {
                role_id: '',
                super_id: '',
                dingding_userid: '',
                job: '',
                department_id: '',
                sex: '',
                email: '',
                phone: '',
                password: '',
                name: '',
                dingding_username: ''
            },
            searchData: {
                limit: 100,
                page: 1,
                department_id: '',
                department_name: ''
            },
            allRoleList: [],
            total: '',
            departmentList: [],
            selectDepartment: '',
            iscanset: false,
            multipleSelection: '',
            allStaffList: [],
            props: {
                lazy: true,
                async lazyLoad (node, resolve) {
                    const { level } = node;
                    let param = {
                        id: node.data.dept_id
                    }
                    let nodes = []
                    let departments = []
                    if(level == 1){
                        param = {
                            id: 1
                        }
                    }
                    // if(node.data.userid){
                    //     return
                    // }
                    console.log('node', node)
                    if(!node.data.userid){
                        const data = await getDepartmentUser(param)
                        nodes = data.list.map((item)=>{
                            let obj = item
                            obj.leaf = 1
                            obj.value = item.userid
                            obj.label = item.name
                            return obj
                        })
                    }
                    const departmentData = await getDepartmentList(param)
                    console.log('departmentData', departmentData)
                    departments = departmentData.map((item)=>{
                            let obj = item
                            obj.leaf = departmentData.length ? '' : 1
                            obj.value = item.dept_id
                            obj.label = item.name
                            return obj
                        })
                    resolve([...nodes, ...departments]);
                }
            }
        }
    },
    mounted() {
        this.getRoleList()
        this.getAllDepartment()
        this.getDepartmentList()
        this.getAllUserList()
    },
    methods: {
        async getDepartmentList() {
            let param = {
                id: 1
            }
            const data = await getDepartmentList(param)
            const allMemberData = await getDepartmentUser({id: 1})
            allMemberData.list.forEach((item)=>{
                item.leaf = 1
            })
            let allMember = data.concat(allMemberData.list)
            let companyDepartmentList = [{
                value: 1,
                label: '主部门',
                children: allMember.map((item)=>{
                    let obj = item
                    obj.value = item.dept_id || item.userid
                    obj.label = item.name
                    return obj
                })
            }]
            this.departmentList = companyDepartmentList
        },
        async addAuths(type) {
            const { dataForm } = this
            if((dataForm.dingding_userid + '').length < 12){
                this.$message({
                    type: 'error',
                    message: '钉钉userid不合法'
                });
                return
            }
            const data = type === 1 ? await addAdminMember(dataForm) : await updateUserInfo(dataForm)
            this.$message({
                type: 'success',
                message: type === 1 ? '新建成功!' : '修改成功!'
            });
            this.visible = false
            this.getUserList()
        },
        async getUserList() {
            const { searchData } = this
            console.log('searchData', searchData)
            const data = await userList(searchData)
            this.staffList = data.list
            this.total = data.total
        },
        async getAllUserList() {
            const { dataForm, switchList } = this
            let selectData = switchList.filter((item)=>{
                return item.id == dataForm.department_id
            })
            let param = {
                page: 1,
                limit: 100,
                department_id: selectData.length ? selectData[0].id : '',
                department_name: selectData.length ? selectData[0].name : ''
            }
            const data = await userList(param)
            this.allStaffList = data.list
        },
        async getRoleList() {
            const { dataForm } = this
            const data = await roleList(dataForm)
            this.allRoleList = data
        },
        async getAllDepartment() {
            const data = await allDepartment()
            this.switchList = data
            this.searchData.department_name = data[0].name
            this.searchData.department_id = data[0].id
            this.getUserList()
        },
        getSelectDepartmentData(){
            this.getAllUserList()
        },
        onDialogSubmit(formName, type){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addAuths(type)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        switchTab(id, name){
            this.searchData.department_id = id
            this.searchData.department_name = name
            this.getUserList()
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        getChildData(value){
            console.log('value', value)
            this.dataForm.dingding_department_id = value[value.length - 2]
            this.dataForm.dingding_userid = value[value.length - 1]
        },
        async seeDetail(row){
            const { departmentList } = this
            this.dialogTitle = '修改员工'
            this.rules.password[0].required = false
            this.iscanset = true
            this.visible = true
            row.super_id = row.super_id == 0 ? '' : row.super_id
            this.dataForm = row
            this.getAllUserList()
            // let param = {
            //     id: row.dingding_department_id
            // }
            // const data = await getDepartmentUser(param)
            // departmentList.forEach((item)=>{
            //     item.children.forEach((itm)=>{
            //         let children = itm.dept_id == row.dingding_department_id ? data.list.map((v)=>{
            //             let obj = v
            //             obj.leaf = 1
            //             obj.value = v.userid
            //             obj.label = v.name
            //             return obj
            //         }) : []
            //         itm.children = children
            //     })
            // })
            // let renderData = [parseInt(row.dingding_department_id), row.dingding_userid + '']
            // if(row.dingding_department_id != 1){
            //     renderData.unshift(1)
            // }
            // this.selectDepartment = renderData
            // this.departmentList = departmentList
            this.selectDepartment = ''
            this.showCascader = true
        },
        showAddMember(){
            this.visible = true;
            this.dialogTitle = '新建员工'; 
            this.showCascader = true; 
            this.iscanset = false
            this.selectDepartment = ''
            this.restDataFormValue()
        },
        restDataFormValue(){
            const { dataForm } = this
            for(let key in dataForm){
                dataForm[key] = ''
            }
            this.dataForm = dataForm
        },
        // 复选
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        isRemoveData(){
               this.$confirm('确认删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.handleDeleteClick()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });    
            });
        },
        // 删除员工
        async handleDeleteClick(){
            const { multipleSelection } = this
            let ids = multipleSelection.map((item)=>{
                return item.id
            })
            const data = await delRole({id:ids})
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            this.getUserList()
            
        },
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
    border-top:1px solid #ccc;
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
.sale-employee{
    font-size:18px;
    color: #0D85FA;
}
.el-select{
    width:100%;
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
.deleteTitle:hover{
    color:#409eff;
}
</style>

