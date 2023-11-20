<template lang="html">
<div>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:100%;">
                <el-form-item label="排期主题" class="">
                    <el-input v-model="searchData.name" placeholder="请输入" @keyup.enter.native="onSearch(1)"></el-input>
                </el-form-item>
                <el-form-item label="投放客户" class="m-l-10">
                    <el-input v-model="searchData.customer_name" placeholder="请输入">
                        <i
                            class="el-icon-plus el-input__icon"
                            slot="suffix"
                            @click="goGetData('getCustomerList', 'customer_id', 'search')">
                        </i>
                    </el-input>
                </el-form-item>
                <el-form-item label="排期所有人" class="m-l-10">
                    <el-select v-model="searchData.belong_userid" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in userListData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否回款" class="m-l-10">
                    <el-select v-model="searchData.receive_status" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in isReceive"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否需要发票" class="m-l-10">
                    <el-select v-model="searchData.invoice_status" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in isInvoice"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="block" label="创建日期">
                    <el-date-picker
                    v-model="searchData.createTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="search_fincerecord">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="block m-l-10" label="投放日期">
                    <el-date-picker
                    v-model="searchData.throwTime"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="search_fincerecord">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="排序方式" class="m-l-10">
                    <el-select v-model="searchData.sort" clearable @change="search_fincerecord">
                        <el-option
                        v-for="item in scheduleSort"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="" @click="onSearch">
                <el-button type="primary">查询</el-button>
            </div>
        </div>
    </el-card>
    <el-card class="box-card">
        <div v-if="!selectCheckData.length" class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" style="width:82%;">
                <el-form-item label="">
                    <commonSearchLevel
                    :default-data="levelDefaultData"
                    @levelList="getLevelValue"/>
                </el-form-item>
                <!-- <el-form-item label="" class="search-input">
                    <el-input v-model="searchData.keyWord" placeholder="搜索此列表" suffix-icon="el-icon-search"></el-input>
                </el-form-item> -->
            </el-form>
            <div class="tools-bar">
                <!-- <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
                <el-button type="primary" icon="el-icon-plus"  @click="addDialogData">新建媒体排期</el-button>
            </div>
        </div>
        <div v-else class="flex m-b-20">
            <div>已选<span class="m-l-r-20 color-409">{{selectCheckData.length}}</span>项</div>
            <div class="vertical-line"></div>
            <div class="" slot="reference" @click="isRemoveData"><i class="el-icon-delete"></i>删除</div>
        </div>
    <div>
    <!-- 公共可操作列表 -->
      <commonTable
        :table-data="tableData"
        :table-render-list="scheduleTableRenderList"
        :list-dialog-title="listDialogTitle"
        :is-can-set="false"
        :table-type="'multipleTable'"
        :edit-api="editApi"
        @updateList="search_fincerecord"
        @seeDetail="seeDetail"
        @checkItem="checkData"/>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="searchData.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="140px">
        <el-collapse v-model="activeNames" @change="handleCollapseChange">
            <el-collapse-item title="基本信息" name="1" class="bg-f5">
                <div class="flex">
                    <el-form-item label="排期主题" prop="name"  style="width:25%;">
                        <el-input v-model.trim="dataForm.name" :disabled="isCanEdit" placeholder="请输入客户+媒体+时间"></el-input>
                    </el-form-item>
                    <el-form-item label="排期状态" prop="type"  style="width:25%;" class="m-l-40">
                        <el-select v-model="dataForm.type" placeholder="请选择" :disabled="dialogTitle != '修改媒体排期'  || isCanStaEdit" >
                            <el-option
                            v-for="item in scheduleStatus"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="投放客户" prop="customer_name"  style="width:25%;" class="m-l-40">
                        <el-input v-model="dataForm.customer_name" @focus="goGetData('getCustomerList', 'customer_id', 'submit')" placeholder="请输入投放客户">
                            <i
                                class="el-icon-plus el-input__icon color-409"
                                slot="suffix"
                               @click="goGetData('getCustomerList', 'customer_id', 'submit')">
                            </i>
                        </el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="对应媒体资源" prop="media_name"  style="width:25%;">
                        <el-input v-model="dataForm.media_name" @focus="goGetData('getMediaList', 'media_id', 'submit')" placeholder="请输入对应媒体资源">
                            <i
                                class="el-icon-plus el-input__icon color-409"
                                slot="suffix"
                               @click="goGetData('getMediaList', 'media_id', 'submit')">
                            </i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="投放时间" prop="throw_time" style="width:25%;" class="throw_time m-l-40">
                        <el-date-picker
                        v-model="dataForm.throw_time"
                        :disabled="isCanEdit"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="投放位置" prop="throw_location"  style="width:25%;" class="m-l-40">
                        <el-select v-model="dataForm.throw_location" :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in schedulePosition"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="报价" prop="customer_money" style="width:25%;">
                        <el-input v-model.trim="dataForm.customer_money" :disabled="isCanDefaultEdit" placeholder="请输入">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="成本价" prop="media_money" style="width:25%;" class="m-l-40">
                        <el-input v-model.trim="dataForm.media_money" :disabled="isCanDefaultEdit" placeholder="请输入">
                            <template slot="append"><span>元</span></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="对接媒介" prop="medium_name" style="width:25%;" class="m-l-40">
                        <!-- <el-select v-model="dataForm.medium_id" disabled placeholder="请选择">
                            <el-option
                            v-for="item in mediaUserList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select> -->
                        <el-input v-model.trim="dataForm.medium_name" :disabled="defaultDisable" placeholder="请输入对接媒介"></el-input>
                        
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="客户是否回款" prop="receive_status" style="width:25%;">
                        <el-select v-model="dataForm.receive_status" :disabled="defaultDisable" placeholder="请选择">
                            <el-option
                            v-for="item in isReceive"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户是否需要合同" prop="contract_status" style="width:25%;" class="m-l-40">
                        <el-select v-model="dataForm.contract_status" :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in isInvoice"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item><el-form-item label="客户是否需要发票" prop="invoice_status" style="width:25%;" class="m-l-40">
                        <el-select v-model="dataForm.invoice_status" :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in isInvoice"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="客户发票是否已开" prop="invoice_get_status" style="width:25%;">
                        <el-select v-model="dataForm.invoice_get_status" :disabled="defaultDisable" placeholder="请选择">
                            <el-option
                            v-for="item in isReceive"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发票税点" prop="invoice_tax_point" style="width:25%;" class="m-l-40">
                        <el-select v-model="dataForm.invoice_tax_point" :disabled="isCanDefaultEdit" placeholder="请选择">
                            <el-option
                            v-for="item in invoiceTax"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道发票是否已开" prop="channel_invoice_status" style="width:25%;" class="m-l-40">
                        <el-select v-model="dataForm.channel_invoice_status" :disabled="defaultDisable" placeholder="请选择">
                            <el-option
                            v-for="item in isReceive"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="flex">
                    <!-- <el-form-item label="渠道是否含有税款" prop="channel_tax_status" style="width:25%;">
                        <el-select v-model="dataForm.channel_tax_status" :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in isReceive"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="渠道税点" prop="channel_tax_point" style="width:25%;" >
                        <el-select v-model="dataForm.channel_tax_point" :disabled="isCanDefaultEdit" placeholder="请选择">
                            <el-option
                            v-for="item in invoiceTax"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="备注" prop="description" style="width: 50%;">
                        <el-input type="textarea" :rows="4" v-model="dataForm.description" :disabled="isCanEdit" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="排期所有人" prop="accountOwner" style="width:25%;" label-width="140px">
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
                    <!-- <el-form-item label="业务类型" prop="invoice" style="width:25%;" class="m-l-40">
                        <el-select v-model="dataForm.wechart" placeholder="请选择">
                            <el-option
                            v-for="item in qqOrWechart"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="所属部门" prop="department"  style="width:25%;"  class="m-l-40">
                        <el-input v-model="dataForm.department" placeholder="请选择">
                            <i
                                class=""
                                slot="suffix"
                                >
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
                                :data="departmentData"
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
                            </i>
                        </el-input>
                    </el-form-item> -->
                </div>
                <div class="flex">
                    <el-form-item label="主题公司签单" prop="company_id" style="width:25%;">
                        <el-select v-model="dataForm.company_id" :disabled="isCanEdit" placeholder="请选择">
                            <el-option
                            v-for="item in companySignOrder"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item label="发票信息" prop="invoice_title"  style="width:25%;">
                        <el-input v-model="dataForm.invoice_title" :disabled="isCanEdit" placeholder="请输入发票信息"></el-input>
                    </el-form-item>
                    <el-form-item label="发票回款日期" prop="invoice_receive_time_name" style="width:25%;">
                        <el-date-picker
                        v-model="dataForm.invoice_receive_time_name"
                        :disabled="defaultDisable"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="渠道付款情况" prop="channel_payment_status" style="width:25%;" class="m-l-40">
                        <el-select v-model="dataForm.channel_payment_status" :disabled="defaultDisable" placeholder="请选择渠道付款情况">
                            <el-option
                            v-for="item in channelPayment"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2, 1)" v-if="dialogTitle=='修改媒体排期'">保存</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1, 1)" v-else>立即创建</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 2, 2)" :disabled="dataForm.type == 6 || dataForm.type == 7" v-if="dialogTitle=='修改媒体排期'">保存并审核</el-button>
        <el-button type="primary" @click="onDialogSubmit('dataForm', 1, 2)" v-else>创建并审核</el-button>
      </div>
    </el-dialog>
    <el-dialog
        width="70%"
        :title="dialogSelectTitle"
        :visible.sync="innerVisible">
        <div>
            <!-- 公共可操作列表 -->
            <commonDialogTable
                v-if="dialofapi"
                :table-data-api="dialofapi"
                :table-render-list="tableRenderList"
                :list-dialog-title="listDialogTitle"
                :select-radio="selectRadio"
                :is-can-set="false"
                :dialofapi-type="dialofapiType"
                :table-type="'singleTable'"
                @updateList="search_fincerecord"
                @checkItemRadio="checkRadioData"
                @hiddenTable="hiddenTable"/>
        </div>
        </el-dialog>
  </el-card>
  </div>
</template>
<script>
import { userList, allPerson, scheduleList, scheduleAdd, scheduleEdit, scheduleDel, getMediaList, getCustomerList, selectConfigType } from '@/api/permission'
import { 
    customerTypeList, 
    scheduleTableRenderList, 
    scheduleLevelDefaultData, 
    isInvoice, 
    isReceive, 
    scheduleSort, 
    mediaResourceRenderData, 
    scheduleStatus, 
    schedulePosition, 
    invoiceTax, 
    channelPayment } from '../config.js'
import { customerRenderData } from '../../customer/config.js'
import { permissionBtn } from '@/utils/permissionBtn.js'
import commonTable from '@/components/common-table'
import commonDialogTable from '@/components/common-dialog-table'
import commonSearchLevel from '@/components/common-search-level'

import moment from 'moment'
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            dialogSelectTitle: '媒体资源',
            editApi: scheduleEdit,
            channelPayment,
            invoiceTax,
            schedulePosition,
            scheduleStatus,
            scheduleSort,
            isInvoice,
            isReceive,
            levelDefaultData: scheduleLevelDefaultData,
            dialofapi: '',
            dialofapiType: 'customer_id',
            totalRecord: 0,
            dialogVisible: false,
            innerVisible: false,
            dialogTitle: '新增用户',

            listDialogTitle: '更改列表显示数据',
            qqOrWechart: [
                {
                    id: 1,
                    name: '微信'
                },
                {
                    id: 2,
                    name: 'QQ'
                }
            ],
            rules: {
                name: [
                    {
                        required: true,
                        message: '排期主题不能为空',
                        trigger: 'blur'
                    }
                ],
                type: [
                    {
                        required: true,
                        message: '排期状态不能为空',
                        trigger: 'change'
                    }
                ],
                customer_name: [
                    {
                        required: true,
                        message: '投放客户不可为空',
                        trigger: 'change'
                    }
                ],
                media_name: [
                    {
                        required: true,
                        message: '媒体不可为空',
                        trigger: 'change'
                    }
                ],
                throw_time: [
                    {
                        required: true,
                        // type: 'date',
                        message: '投放时间不可为空',
                        trigger: 'change'
                    }
                ],
                throw_location: [
                    {
                        required: true,
                        message: '投放位置不可为空',
                        trigger: 'change'
                    }
                ],
                customer_money: [
                    {
                        required: true,
                        message: '报价不可为空',
                        trigger: 'blur'
                    }
                ],
                media_money: [
                    {
                        required: true,
                        message: '成本价不可为空',
                        trigger: 'blur'
                    }
                ],
                medium_id: [
                    {
                        required: true,
                        message: '对接媒介不可为空',
                        trigger: 'change'
                    }
                ],
                contract_status: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                invoice_status: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                taxPoint: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                isPassInvoice: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                invoice_tax_point: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                invoice_get_status: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                channel_tax_point: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                channelTaxes: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                channelPoint: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                department: [
                    {
                        required: true,
                        message: '部门不可为空',
                        trigger: 'blur'
                    }
                ],
                company_id: [
                    {
                        required: true,
                        message: '主题公司不可为空',
                        trigger: 'change'
                    }
                ],
                mobile: [
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
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱地址',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur, change'
                    }
                ]
            },
            searchData: {
                keyWord: '',
                page: 1,
                limit: 10,
                createTime: '',
                level_type: 1,
                throwTime: ''
            },
            dataForm: {
                type: 1,
                throw_time: '',
                invoice_receive_time: '',
                invoice_receive_time_name: '',
                invoice_title: '',
                company_id: '',
                description: '',
                channel_tax_point: '', 
                channel_tax_status: '',
                invoice_tax_point: '',
                invoice_get_status: '',
                invoice_status: '',
                contract_status: '',
                medium_id: '',
                medium_name: '',
                media_money: '',
                customer_money: '',
                throw_location: '',
                media_name: '',
                customer_name: '',
                name: '',
                invoice_get_status: 2,
                channel_payment_status: 3,
                channel_invoice_status: 2,
                receive_status: 2
            },
            tableData: [],

            customerTypeList,
            scheduleTableRenderList,
            tableRenderList:customerRenderData,
            activeNames:['1'],

            selectCheckData: [],

            filterText: '',
            departmentData: [{
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

            userListData: {},

            mediaUserList: [],

            userData: {},

            isCanEdit: false,

            btn_permission: {},
            companySignOrder: [],
            selectRadio: '',
            defaultDisable: false,
            isCanDefaultEdit: false

        }
    },
    components:{
        commonTable,
        commonDialogTable,
        commonSearchLevel
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
        this.btn_permission = permissionBtn(this.$route.name)
        this.userData = this.$store.state.permission.userData
        this.defaultDisable = this.userData.role_id != 1 ? true : false
        console.log('this.userData', this.userData)
        this.initList()
        this.getAllPerson()
        this.getMediaUserList()
        this.getCompanySignOrder()
    },
    methods: {
        async initList() {
            const { searchData } = this
            searchData.start_time = searchData.createTime.length ? searchData.createTime[0] : ''
            searchData.end_time = searchData.createTime.length ? searchData.createTime[1] : ''
            searchData.throw_time_start = searchData.throwTime.length ? searchData.throwTime[0] : ''
            searchData.throw_time_end = searchData.throwTime.length ? searchData.throwTime[1] : ''
            const data = await scheduleList(searchData)
            this.tableData = data.list
            this.totalRecord = data.total
        },
        async getAllPerson(){
            let param = {
                path: this.$route.name,
                level: this.searchData.level_type
            }
            const data = await allPerson(param)
            this.userListData = data
        },
        async getMediaUserList(){
            let param = {
                limit:20,
                page:1,
                role_id: 4
            }
            const data = await userList(param)
            this.mediaUserList = data.list
        },
        async submitData(type, submit){
            const { dataForm, userData, companySignOrder } = this
            let companyData = companySignOrder.filter((item)=>{
                return item.id == dataForm.company_id
            })
            dataForm.company_name = companyData[0].name
            dataForm.belong_userid = type === 2 ? '' : userData.id
            dataForm.department_id = type === 2 ? '' : userData.department_id
            dataForm.throw_time = moment(dataForm.throw_time).format('YYYY-MM-DD')
            dataForm.invoice_receive_time = dataForm.invoice_receive_time_name ? moment(dataForm.invoice_receive_time_name).format('YYYY-MM-DD') : ''
            
            dataForm.submit = submit
            let { id, ...subData } = dataForm
            if(type == 1){
                subData.receive_status = 2
                subData.invoice_get_status = 2 
                subData.channel_invoice_status = 2 
                subData.channel_payment_status = 3
            }
            const data = type === 1 ? await scheduleAdd(subData) : await scheduleEdit(dataForm)
            this.$message({
                type: 'success',
                message: type === 1 ? '创建成功!' : '修改成功!'
            });
            this.$refs['dataForm'].resetFields();
            this.onSearch(1)
            this.dialogVisible = false
            
        },
        //删除数据
        async removeData(){
            const { selectCheckData, btn_permission } = this
            if(!btn_permission.del.isHas){
                this.$message.error('无权操作')
                return 
            }
            let id = selectCheckData.map((item)=>{
                return item.id
            })
            console.log('selectCheckData', selectCheckData)
            let isCanDel = selectCheckData.some((item)=>{
                return item.type == 2 || item.type == 7
            })
            if(isCanDel){
                this.$message({
                    type: 'error',
                    message: '存在审批中或已投放的数据，不可以删除!'
                });
                return
            }
            const data = await scheduleDel({id:id})
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            this.onSearch(1)
            this.selectCheckData = []
        },
        // 我司主题签单
        async getCompanySignOrder(){
            let param = {
                type_id: 2
            }
            const data = await selectConfigType(param)
            this.companySignOrder = data
        },
        isRemoveData(){
               this.$confirm('确认删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.removeData()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });    
            });
        },
        onDialogClose() {
            this.dataForm.tempRoleIds = []
            this.$refs.dataForm.resetFields()
        },
        handleSizeChange(val) {
            this.searchData.limit= val
            this.onSearch(1)
        },
        handleCurrentChange(val) {
            this.searchData.page = val
            this.onSearch()
        },
        onSearch(type) {
            const { searchData } = this
            if(type == 1){
                for(let key in searchData){
                    searchData[key] = key == 'page' ? 1 : key == 'limit' ? 10 : key == 'level_type' ? searchData[key] : ''
                }
                this.searchData = searchData
            }
            // this.searchData.page = 1
            this.initList()
        },
        onDialogSubmit(formName, type, submit) {
            console.log('dataForm', this.dataForm)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitData(type, submit)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //hidden
        hiddenTable(key){
            this.innerVisible = false
        },
        // 单选
        checkRadioData(data) {
            if(data.currentRowRadio == 'customer_id'){
                this.searchData.customer_id = data.id
                this.searchData.customer_name = data.name
                this.dataForm.customer_id = data.id
                this.dataForm.customer_name = data.name
            }else{
                this.dataForm.media_id = data.id
                this.dataForm.media_name = data.name
                this.dataForm.medium_id = data.belong_userid
                this.dataForm.medium_name = data.user_name
            }
        },
        submitRadioData() {
            // 上级客户数据
            this.innerVisible = false
        },
        //复选
        checkData(data) {
            this.selectCheckData = data
        },
        // 数据导出
        exportData(){
            return
            var fileName = "抽奖活动用户参与表.xls"; //生成Blob对象，通过创建的a标签点击下载
            var objectUrl = URL.createObjectURL(new Blob([response.data]));
            var link = document.createElement("a");
            link.download = decodeURIComponent(fileName);
            link.href = objectUrl;
            link.click();
        },

        //搜索
        search_fincerecord() {
            const { tableRenderList } = this
            this.searchData.page = 1
            let list = tableRenderList.map((item)=>{
                let obj = item
                obj.isInput = false
                return obj
            })
            this.tableRenderList = list
            // this.getList()
        },

        handleCollapseChange(val){
            console.log('val',val)
        },

        goGetData(api, key, type){
            if(type == 'submit'){
                this.selectRadio = this.dataForm[key]
                console.log('this.selectRadio', this.selectRadio)
            }
            if(api == 'getMediaList'){
                this.tableRenderList = mediaResourceRenderData
                this.dialofapi = getMediaList
                this.dialofapiType = 'media_id'
                this.dialogSelectTitle = '媒体资源'
            }else{
                this.tableRenderList = customerRenderData
                this.dialofapi = getCustomerList
                this.dialofapiType = 'customer_id'
                this.dialogSelectTitle = '投放客户'
            }
            this.innerVisible = true
        },
        seeDetail(data){
            let notEdit = [2, 3]
            let staNotEdit = [2]
            const { btn_permission } = this
            if(!btn_permission.edit.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dataForm = Object.assign({},data)
            this.dialogVisible = true;
            this.dialogTitle = '修改媒体排期'
            this.isCanEdit = notEdit.indexOf(this.dataForm.type) > -1 && this.userData.role_id != 1 > -1 ? true : false
            this.isCanDefaultEdit = notEdit.indexOf(this.dataForm.type) > -1 ? true : false
            this.isCanStaEdit = staNotEdit.indexOf(this.dataForm.type) > -1 ? true : false
            let statusDataId = scheduleStatus.filter((item)=>{
                return item.id == this.dataForm.type
            })
            let statusData = scheduleStatus.filter((item)=>{
                return statusDataId[0].status.indexOf(item.id) > -1
            })
            this.scheduleStatus = statusData
        },
        getLevelValue(type){
            this.searchData.level_type = type
            this.getAllPerson()
            this.initList()
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        getCurrentKey(checkedNodes,checkedKeys){
            console.log('keys',checkedNodes,checkedKeys)
        },
        addDialogData(){
            const { btn_permission } = this
            if(!btn_permission.add.isHas){
                this.$message.error('无权操作')
                return 
            }
            this.dialogVisible = true;
            this.dialogTitle = '新建媒体排期'
            this.isCanEdit = false
            this.isCanDefaultEdit = false
            // this.$refs['dataForm'].resetFields()
            this.restDataFormValue()
            
        },
        restDataFormValue(){
            const { dataForm } = this
            for(let key in dataForm){
                dataForm[key] = ''
            }
            this.scheduleStatus = scheduleStatus
            dataForm.type = 1
            dataForm.invoice_get_status = 2
            dataForm.channel_payment_status = 3
            dataForm.channel_invoice_status = 2
            dataForm.receive_status = 2
            this.dataForm = dataForm
            console.log('dataForm', this.dataForm)
        }
    }
}
</script>

<style lang="scss">
.fr{
    float:right;
}
.fl{
    float:left;
}
.search-bar{
    overflow: hidden;
}
.box-card:first-child{
    margin-bottom:15px;
}
.tools-bar{
  margin-bottom:20px;
  float:right;
}
.search-input{
    float: right;
}
.flex{
    display: flex;
}
.m-l-40{
    margin-left:40px;
}
.m-l-20{
    margin-left: 20px;
}
.m-l-10{
    margin-left: 10px;
}
.m-l-r-20{
    margin:0 10px;
}
.m-b-20{
    margin-bottom:20px;
}
.pagination-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top:20px;
}
.v-c-center{
    display: flex;
    // justify-content: center;
    justify-content: flex-start;
    align-items: center;    
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
<style>
.el-collapse-item__header{
    background: #f5f5f5;
    padding-left: 20px;
    color: rgb(1, 153, 255)!important;
    margin-bottom: 30px;
}
.el-select{
    display: flex!important;
}
.el-form-item__label{
    font-size:12px;
}
.fl .el-input .el-input__inner, .fl .el-select .el-input__inner{
    width: 200px!important;
}
.throw_time .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:100%;
}
</style>