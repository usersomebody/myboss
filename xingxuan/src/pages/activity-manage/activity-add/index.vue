<template>
    <div>
        <el-card class="box-card activity-add">
            <el-form :inline="true" ref="dataForm" :rules="rules" :model="dataForm" class="fl" style="width:100%;">
                <el-form-item class="block" label="活动名称" label-width="90px" prop="name">
                    <el-input placeholder="请输入" v-model="dataForm.name" clearable>
                    </el-input>
                </el-form-item>
                <div>
                    <el-form-item class="block" label="活动banner" label-width="90px">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl + '/venue/upload/uploadImg'"
                            list-type="picture-card"
                            name="image"
                            accept="image"
                            :limit="1"
                            :file-list="imgListArr"
                            :on-success="getAvatarList"
                            :on-preview="handlePictureCardPreview"
                            :before-upload="beforeAvatarUpload"
                            :data-type="'banner'"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogImageVisible" :append-to-body="true">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                        <div class="color-red">建议尺寸710x240px</div>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item class="block" label="活动描述" label-width="90px" prop="remark">
                        <el-input
                        style="width:355px;"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="dataForm.remark"
                        maxlength="140"
                        show-word-limit
                        clearable
                        >
                        </el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item class="block" label="活动类型" label-width="90px" prop="type">
                        <el-radio-group v-model="dataForm.type" @change="getRadio">
                            <el-radio label="1">产品活动专区</el-radio>
                            <el-radio label="2">跳转链接</el-radio>
                            <div class="color-red">请在活动列表页关联商品</div>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div v-if="dataForm.type == 2">
                    <el-form-item class="block" label="链接" label-width="90px" prop="link">
                        <el-input
                        style="width:355px;"
                        placeholder="请输入链接"
                        v-model="dataForm.link"
                        show-word-limit
                        clearable
                        >
                        </el-input>
                    </el-form-item>
                </div>
                <div v-if="dataForm.type == 1">
                    <el-form-item class="block" label="活动详情图" label-width="90px" prop="detail_img">
                        <el-upload
                            class="avatar-uploader"
                            name="image"
                            accept="image"
                            list-type="picture-card"
                            :file-list="detailImgListArr"
                            :on-preview="handlePictureCardPreviewDetail"
                            :limit="1"
                            :data-type="'detailImg'"
                            :action="uploadUrl + '/venue/upload/uploadImg'"
                            :on-success="handleAvatarSuccess"
                            :on-remove="handleRemoveDetail"
                            :before-upload="beforeDetailUpload">
                            <!-- <img v-if="dataForm.detail_img" class="avatar" :src="dataForm.detail_img"> -->
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <el-dialog :visible.sync="detailImgDialogVisible">
                            <img width="100%" :src="detailImgDialogImageUrl" alt="">
                        </el-dialog>
                        <div class="color-red">建议尺寸750x360px</div>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item class="block" label="活动时间" label-width="90px" prop="time">
                        <el-date-picker
                        v-model="dataForm.time"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        @change="checkTimeValid"
                        >
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item class="block m-l-20" label="" label-width="90px">
                        <el-button type="primary" @click="goActivityList">取消</el-button>
                        <el-button type="primary" @click="valSubData">确定</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { activityAdd, activityEdit } from '@/api/permission'
import { goodsRenderList } from '../../goods-manage/config'
import { uploadUrl } from '@/config/baseUrl.js'

import { mapState } from 'vuex'
import { setTimeout } from 'timers';
import moment from 'moment'
export default {
    data() {
        return {
            detailImgDialogVisible: false,
            detailImgDialogImageUrl: '',
            dataForm: {
                name: '',
                banner_img: '',
                remark: '',
                type: '1',
                detail_img: '',
                detail_img_list: [],
                time:[],
                link: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '活动名称不能为空',
                        trigger: 'blur'
                    }
                ],
                customer_service_link: [
                    {
                        required: true,
                        message: '联系电话',
                        trigger: 'blur'
                    }
                ],
                type: [
                    {
                        required: true,
                        message: '活动类型',
                        trigger: 'change'
                    }
                ],
                link: [
                    {
                        required: false,
                        message: '图文链接',
                        trigger: 'change'
                    }
                ],
                time: [
                    {
                        required: true,
                        message: '活动时间不可为空',
                        trigger: 'change'
                    }
                ]
            },
            uploadUrl,
            imgListArr: [],
            detailImgListArr: [],
            dialogImageUrl: '',
            dialogImageVisible: false,
        }
    },
    computed: {
        ...mapState('permission', ['is_manager'])
    },
    mounted() {
        
    },
    created() {
        this.editInfo = JSON.parse(localStorage.getItem('activityInfo'))
        if(this.editInfo && Object.keys(this.editInfo).length){
            const { invalid_time_name, effective_time_name, banner_img, type, detail_img } = this.editInfo
            this.imgListArr = [{
                name:'1.png',
                url: banner_img
            }]
            this.detailImgListArr = [{
                name:'1.png',
                url: detail_img
            }]
            this.editInfo.time = [effective_time_name, invalid_time_name]
            this.editInfo.type = type.toString()
            this.dataForm = this.editInfo
        }
    },
    beforeRouteEnter(to, from, next) {
        let editInfo = JSON.parse(localStorage.getItem('activityInfo'))
        if(editInfo && Object.keys(editInfo).length){
            to.meta.name = '修改活动'
        }
        next()
    },
    beforeRouteLeave(to, from, next) {
        this.$route.meta.name = '新建活动'
        localStorage.removeItem('activityInfo')
        next()
    },
    methods: {
        async submitData(){
            try{
              const { dataForm, editInfo } = this
                dataForm.effective_time = dataForm.time.length ? dataForm.time[0] : ''
                dataForm.invalid_time = dataForm.time.length ? dataForm.time[1] : ''
                const data = await editInfo && Object.keys(editInfo).length  ? activityEdit(dataForm) : activityAdd(dataForm)
                this.$message({
                    type: 'success',
                    message: editInfo && Object.keys(editInfo).length ? '修改成功' : '添加成功'
                });     
                this.goActivityList()  
            }catch(error){
                this.$message({
                    type: 'error',
                    message: error
                });   
            }
            
        },
        valSubData(){
            const { dataForm } = this
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    if(!dataForm.banner_img || (dataForm.type == 1 && !dataForm.detail_img)){
                        this.$message({
                            type: 'error',
                            message: '图片数据不可为空'
                        });   
                        return
                    }
                    this.submitData()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getRadio(){
            const { dataForm, rules } = this
            if(dataForm.type == 2){
                this.rules['link'][0].required = true
            }else{
                this.rules['link'][0].required = false
            }
        },
        handleRemove(file, fileList) {
            this.imgListArr = fileList
            this.dataForm.banner_img = ''
        },
        handleRemoveDetail(file, fileList){
            this.dataForm.detail_img_list = []
            this.dataForm.detail_img = ''
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogImageVisible = true;
        },
        handlePictureCardPreviewDetail(file) {
            this.detailImgDialogVisible = true
            this.detailImgDialogImageUrl = file.url
        },
        getAvatarList(res, file, fileList){
            console.log({res,   file, fileList})
            // let pic = fileList.map((item)=>{
            //     let obj = item
            //     return obj.response ? obj.response.content.url : obj.url
            // }).join(',')
            this.dataForm.banner_img = res.content.url
            this.imgListArr = [res.content.url]
        },
        beforeAvatarUpload(file, fileList) {
            let suffix = this.getFileType(file.name) //获取文件后缀名
            let suffixArray = ['jpg', 'png', 'jpeg', 'gif'] //限制的文件类型，根据情况自己定义
            if (suffixArray.indexOf(suffix) === -1) {
                this.$message({
                    message: '文件格式错误',
                    type: 'error',
                    duration: 2000
                })
                return false
            }
            if (this.imgListArr.length) {
                this.$message({
                    message: '活动banner图只允许上传一张',
                    type: 'error',
                    duration: 2000
                })
                return false
            }
            return suffixArray
        },
        beforeDetailUpload(file, fileList) {
            let suffix = this.getFileType(file.name) //获取文件后缀名
            let suffixArray = ['jpg', 'png', 'jpeg', 'gif'] //限制的文件类型，根据情况自己定义
            if (suffixArray.indexOf(suffix) === -1) {
                this.$message({
                    message: '文件格式错误',
                    type: 'error',
                    duration: 2000
                })
                return false
            }
            if (this.dataForm.detail_img_list.length) {
                this.$message({
                    message: '活动详情图只允许上传一张',
                    type: 'error',
                    duration: 2000
                })
                return false
            }
            return suffixArray
        },
        getFileType(name) {
            let startIndex = name.lastIndexOf('.')
            if (startIndex !== -1) {
                return name.slice(startIndex + 1).toLowerCase()
            } else {
                return ''
            }
        },
        handleAvatarSuccess(res, file) {
            this.dataForm.detail_img = res.content.url
            this.dataForm.detail_img_list = [res.content.url]
        },
        goActivityList(){
            setTimeout(()=>{
                this.$router.push({ name: 'activityList' })
            },300)
            
        },
        checkTimeValid(){
            const { time } = this.dataForm
            const format = 'YYYY-MM-DD HH:mm:ss'
            const startTime = moment().format(format);
            const endTime = time[1]
            const diff5 = moment(endTime).diff(moment(startTime), 'seconds')
            
            if(diff5 < 0){
                this.$message({
                    message: '活动结束时间不能小于当前时间',
                    type: 'error',
                })
                this.dataForm.time = []
                return
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.search-bar{
    overflow: hidden;
}
.avatar{
    width:355px!important;
    height:120px!important;
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
    width:355px!important;
    height:120px!important;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width:355px!important;
    height:120px!important;
    display: block;
  }
  .color-red{
      color:#FE2F55;
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
.activity-add .el-upload-list--picture-card .el-upload-list__item{
    width:355px!important;
    height:120px!important;
}
.activity-add .el-upload--picture-card{
    width:355px!important;
    height:120px!important;
    line-height: 120px;
}
.activity-add .el-upload--picture-card i{
    font-size:20px;
}
.activity-add .avatar-uploader-icon{
    font-size:20px!important;
}
</style>

