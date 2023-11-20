<template>
    <div>
        <el-card class="box-card">
            <el-form :inline="true" ref="dataForm" :rules="rules" :model="dataForm" class="fl" style="width:100%;">
                <el-form-item class="block" label="服务费" label-width="90px" prop="service_charge_rate">
                    <el-input placeholder="请输入" v-model="dataForm.service_charge_rate"  clearable>
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <div>
                    <el-form-item class="block" label="平台返佣" label-width="90px">
                        <el-input placeholder="请输入" v-model="dataForm.extra_bonus_rate" clearable>
                            <template slot="append">%</template>
                        </el-input>                        
                    </el-form-item>
                    <div class="warning-text">平台返佣修改以后，原本产生的订单也会根据修改过后的平台返佣去改变。</div>
                    
                </div>
                <div>
                    <el-form-item class="block" label="客服二维码" label-width="90px" prop="customer_service_qrcode">
                        <el-upload
                            class="avatar-uploader"
                            name="image"
                            accept="image"
                            :action="uploadUrl + '/venue/upload/uploadImg'"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess">
                            <img v-if="dataForm.customer_service_qrcode" :src="dataForm.customer_service_qrcode" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item class="block" label="联系电话" label-width="90px" prop="customer_service_link">
                        <el-input placeholder="请输入" v-model="dataForm.customer_service_link" clearable>
                        </el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item class="block" label="" label-width="90px">
                        <el-button type="primary" @click="submitData">
                            保存
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { getCustomerList, getPlatformInfo, editPlatformInfo } from '@/api/permission'
import { goodsRenderList } from '../../goods-manage/config'
import { uploadUrl } from '@/config/baseUrl.js'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            uploadUrl,
            dataForm: {
                service_charge_rate: '',
                extra_bonus_rate: '',
                customer_service_qrcode: '',
                customer_service_link: ''
            },
            rules: {
                service_charge_rate: [
                    {
                        required: true,
                        message: '服务费不能为空',
                        trigger: 'blur'
                    }
                ],
                customer_service_link: [
                    {
                        required: true,
                        message: '联系电话不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(13|15|18|14|17)[0-9]{9}$/,
                        message: '手机号码格式不正确',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    mounted() {

    },
    created() {
        this.getConfigInfo()
    },
    methods: {
        async getConfigInfo(){
            let data = await getPlatformInfo()
            this.dataForm = data
        },
         submitData(){
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.submit()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async submit(){
            const { dataForm }= this
            let data = await editPlatformInfo(dataForm)
            this.$message({
                type: 'success',
                message: '修改成功'
            });
            this.getConfigInfo()
        },
        handleAvatarSuccess(res, file) {
            this.dataForm.customer_service_qrcode = res.content.url
        }
    }
}
</script>
<style lang="scss" scoped>
.search-bar{
    overflow: hidden;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .warning-text{
      color:red;
      font-size:14px;
      padding-left:90px;
      margin-bottom:10px;
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

