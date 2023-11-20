<template>
    <div>
        <div class="flex">
            <i class="el-icon-s-custom color-83B"></i>
            <span>账号密码</span>
        </div>
        <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="80px">
            <el-form-item label="原始密码" class="" prop="old_password" style="width:25%">
                <el-input v-model="dataForm.old_password" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="新密码" class="" prop="password"  style="width:25%">
                <el-input v-model="dataForm.password" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" class="" prop="again_password"  style="width:25%">
                <el-input v-model="dataForm.again_password" placeholder="请输入"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="footer-btn">
        <el-button type="primary" @click="submit('dataForm')">保存</el-button>
      </div>
    </div>
</template>
<script>
import { updatePassword } from '@/api/permission'
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
            if (this.dataForm.again_password !== '') {
                this.$refs.dataForm.validateField('again_password');
            }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.dataForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {

            dataForm: {

            },
            rules: {
                old_password: [
                    { required: true, message: '原密码不可为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                again_password: [
                    { required: true,  validator: validatePass2, trigger: 'blur' }
                ],
            },
            form: {
                circleUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            }
        }
    },

    mounted() {

    },
    methods: {
        async submitData(){
            const { dataForm } = this
            const data = await updatePassword(dataForm)
            this.$message({
                type: 'success',
                message:'修改成功!'
            });
        },
        submit(formName){
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitData()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style scoped>
.flex{
    display: flex;
    align-items: center;
    margin-bottom:20px;
}
.flex i{
    margin-right:10px;
}
.avatar{
    height:44px;
    width:44px;
    border-radius: 50%
}
.color-83B{
    color: #83BBFD;
}
</style>
