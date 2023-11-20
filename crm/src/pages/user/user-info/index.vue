<template>
    <div>
        <div class="flex">
            <i class="el-icon-s-custom color-83B"></i>
            <span>个人信息</span>
        </div>
        <el-form ref="dataForm" :model="dataForm" label-width="80px">
            <el-form-item label="头像" class="" prop="avatar" style="width:70%">
                <div class="avatar-box">
                    <img v-if="dataForm.avatar" :src="dataForm.avatar" class="avatar"/>
                    <el-upload
                        class="avatar-uploader"
                        name="image"
                        :action="uploadUrl + '/venue/upload/uploadImg'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </div>
            </el-form-item>
            <el-form-item label="姓名" class="" prop="name" style="width:25%">
                <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="部门名称" class="" prop="department_name" style="width:25%">
                <span>{{dataForm.department_name}}</span>
            </el-form-item>
            <el-form-item label="职位" class="" prop="job" style="width:25%">
                <el-input v-model="dataForm.job" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="直属上级" class="" prop="super_name" style="width:25%">
                <el-input v-model="dataForm.super_name" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="角色" class="" prop="rule_name" style="width:25%">
                <el-input v-model="dataForm.rule_name" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="钉钉userid" class="" prop="dingding_userid" style="width:25%">
                <el-input v-model="dataForm.dingding_userid" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号码" class="" prop="phone" style="width:25%">
                <el-input v-model="dataForm.phone" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" class="" prop="email" style="width:25%">
                <el-input v-model="dataForm.email" placeholder="请输入"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="footer-btn">
        <el-button type="primary" @click="submit()">保存</el-button>
      </div>
    </div>
</template>
<script>
import { uploadUrl } from '@/config/baseUrl.js'
import { updateUserInfo } from '@/api/permission'
export default {
    data() {
        return {
            uploadUrl,
            dataForm: JSON.parse(localStorage.getItem('userInfo')),
            form: {

            },
            content_pic: ''
        }
    },

    mounted() {

    },
    methods: {
        async submit(){
            const { dataForm } = this
            const data = await updateUserInfo(dataForm)
            this.$message({
                type: 'success',
                message:'修改成功!'
            });
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))
            userInfo.avatar = dataForm.avatar
            userInfo.email = dataForm.email
            userInfo.dingding_userid = dataForm.dingding_userid
            userInfo.name = dataForm.name
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
        },
        handleAvatarSuccess(res, file) {
            this.content_pic = res.content.url;
            this.dataForm.avatar = res.content.url
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
    border-radius: 50%;
    margin-right:40px;
}
.color-83B{
    color: #83BBFD;
}
.avatar-box{
    display: flex;
    align-items: center;
}
</style>
<style>
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 44px;
    height: 44px;
    line-height: 44px;
    text-align: center;
  }
  .avatar {
    width: 44px;
    height: 44px;
    display: block;
  }
</style>

