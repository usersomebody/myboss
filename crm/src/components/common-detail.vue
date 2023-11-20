<template>
   <el-dialog :title="dialogTitle" :visible.sync="showDialogValue" @close="onDialogClose" width="35%"  :close-on-click-modal="false">
      <el-scrollbar style="height:720px;">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="140px">
          <div v-for="(item, index) in dialogData" :key="index">
            <el-form-item v-if="item.template == 'info'" :label="item.name" :prop="item.key" style="width:70%;"  label-width="140px">
                <el-popover
                    placement="top-start"
                    width="300"
                    trigger="hover">
                    <div class="flex">
                        <el-image
                        style="width: 100px; height: 100px; margin-right: 10px;"
                        :src="userData.avatar"
                        fit="cover"></el-image>
                        <div class="account-info">
                            <h4 class="color-158">{{userData.name}}</h4>
                            <div class="font-12 color-ccc">{{userData.department_name}} {{userData.job}}</div>
                            <div class="font-12 color-ccc">邮箱：{{userData.email ? userData.email : '正式邮箱未填写'}}</div>
                            <div class="font-12 color-ccc">电话：{{userData.tel_phone ? userData.tel_phone : '电话未填写'}}</div>
                            <div class="font-12 color-ccc">手机：{{userData.phone}}</div>
                        </div>
                    </div>
                    <div slot="reference" class="v-c-center">
                        <el-image
                        style="width: 20px; height: 20px; margin-right: 10px;"
                        :src="userData.avatar"
                        fit="cover"></el-image>
                        <span>{{userData.name}}</span>
                    </div>
                </el-popover>
            </el-form-item>
            <el-form-item v-if="item.template == 'inputSelect'" :label="item.name" :prop="item.key"  style="width:70%;">
                <el-input v-model="dataForm[item.key]" placeholder="请选择" disabled>
                     <!-- <i
                        class=""
                        slot="suffix"
                        @click="goGetData">
                        <el-popover
                        placement="right"
                        width="400"
                        trigger="click">
                        <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                        </el-input>

                        <el-tree
                        class="filter-tree"
                        :data="data"
                        :props="defaultProps"
                        show-checkbox
                        node-key="id"
                        :filter-node-method="filterNode"
                        @check="getCurrentKey"
                        ref="tree">
                        </el-tree>
                        <i
                        class="el-icon-plus el-input__icon"
                        slot="reference">
                        </i>
                    </el-popover>
                    </i> -->
                </el-input>
            </el-form-item>
            <el-form-item v-if="item.template == 'input' && !item.hidden" :label="item.name" :prop="item.key" style="width:70%;">
                <el-input v-model.trim="dataForm[item.key]" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="item.template == 'slotInput'" :label="item.name" :prop="item.key" style="width:70%;">
                <el-input v-model="dataForm[item.key]" placeholder="请输入">
                    <template slot="append">{{item.slotText}}</template>
                </el-input>
            </el-form-item>
            <el-form-item v-if="item.template == 'select' && !item.hidden" :label="item.name" :prop="item.key"  style="width:70%;">
                <el-select v-model="dataForm[item.key]" :multiple="false" :disabled="item.disable"  placeholder="请选择">
                    <el-option
                    v-for="itm in item.list"
                    :key="itm.id"
                    :label="itm.name"
                    :value="itm.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="item.template == 'switch'" :label="item.name" :prop="item.key" style="width: 70%;">
                <el-switch v-model="dataForm[item.key]" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item v-if="item.template == 'textarea'" :label="item.name" :prop="item.key" style="width: 70%;">
                <el-input type="textarea" :rows="4" v-model="dataForm[item.key]" placeholder="请输入内容"></el-input>
            </el-form-item>
          </div>
      </el-form>
     </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogClose">取 消</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2)" v-if="isEdit==2">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1)" v-else>立即创建</el-button>
      </div>
    </el-dialog>
</template>
<script>
import { addMedia, editMedia } from '@/api/permission'

export default {
    props:['dialogData', 'detailInfo', 'dialogType', 'dialogTitle', 'dialogVisible', 'isEdit'],
    data(){
        return{
            rules: {},
            dataForm: {},
            showDialogValue: true,
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
            },
            userData: {}
        }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      dialogType(val){
        this.dataForm.type = parseInt(this.dialogType)
      }
    },
    created(){
        this.userData = this.$store.state.permission.userData
        const { detailInfo, dialogData } = this
        this.dataForm = this.toObj(dialogData)
        this.rules = this.getValidationRules(dialogData)
        this.dataForm.department_id = this.isEdit == 2 ? '' : this.userData.department_id
        this.dataForm.department_name = this.isEdit == 2 ? '' : this.userData.department_name
        this.dataForm.belong_userid = this.isEdit == 2 ? '' : this.userData.id
        this.dataForm.type = parseInt(this.dialogType)
        console.log('isEdit', this.isEdit)
        if(Object.keys(detailInfo).length){
            this.dataForm = { ...detailInfo }
        }
    },
    methods: {
        //提取验证规则
        getValidationRules(list){
            let rule = {}
            list.forEach((item)=>{
                if(item.require){
                    rule = {...rule,...item.rule}
                }
            })
            return rule
        },
        toObj(list){
            let info = {}
            list.forEach(element => {
                info[element.key] = ''
            });
            return info
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        getCurrentKey(checkedNodes,checkedKeys){
            console.log('keys',checkedNodes,checkedKeys)
        },
        goGetData(){

        },

        onDialogSubmit(formName, type) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitData(type)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async submitData(type){
            const { dataForm } = this
            let { id, ...subData } = dataForm
            const data = type === 1 ? await addMedia(subData) : await editMedia(dataForm)
            this.$message({
                type: 'success',
                message: type === 1 ? '创建成功!' : '修改成功!'
            });
            this.$refs['dataForm'].resetFields();
            // this.dialogVisible = false
            this.$emit('hiddenDialog')
        },
        onDialogClose() {
            // this.$refs.dataForm.resetFields()
            this.$emit('hiddenDialog')
        }
    }
}
</script>
<style>
</style>

