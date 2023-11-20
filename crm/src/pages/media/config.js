const customerTypeList = [{
    id: 1,
    name: '我负责的客服'
}]

const scheduleTableRenderList = [{
    name: '排期主题',
    prop: 'name',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '投放客户',
    prop: 'customer_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '所有人',
    prop: 'user_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '创建时间',
    prop: 'create_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '修改时间',
    prop: 'update_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '投放时间',
    prop: 'throw_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '排期状态', //排期状态1待提交 2审批中 3审批通过 4审批拒绝 5撤销  6已废弃
    prop: 'type',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '待提交',
        2: '审批中',
        3: '审批通过',
        4: '审批拒绝',
        5: '撤销',
        6: '已废弃',
        7: '已投放'
    }
}, {
    name: '投放位置',
    prop: 'throw_location', //投放位置 1头条 2次条 3第三条 4第四条 5第五条 6第六条 7第七条 8第八条
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '头条',
        2: '次条',
        3: '第三条',
        4: '第四条',
        5: '第五条',
        6: '第六条',
        7: '第七条',
        8: '第八条',
        9: '头条合集',
        10: '次条合集'
    }
}, {
    name: '媒体成本价',
    prop: 'media_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '客户报价',
    prop: 'customer_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '最终利润',
    prop: 'final_profit',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '利润比例',
    prop: 'final_profit_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '客户是否回款',
    prop: 'receive_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '是',
        2: '否'
    }
}, {
    name: '客户是否需要合同',
    prop: 'contract_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '需要',
        2: '不需要'
    }
}, {
    name: '客户是否需要发票',
    prop: 'invoice_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '需要',
        2: '不需要'
    }
}, {
    name: '客户发票是否已开',
    prop: 'invoice_get_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '是',
        2: '否'
    }
}, {
    name: '发票税点', //发票税点（客户） 0不开发票 1普1 2普3 3普6 4专1 5专3 6专6
    prop: 'invoice_tax_point',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        0: '不开发票',
        1: '普1',
        2: '普3',
        3: '普6',
        4: '专1',
        5: '专3',
        6: '专6'
    }
}, {
    name: '渠道发票是否已开',
    prop: 'channel_invoice_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '是',
        2: '否'
    }
}, {
    name: '渠道是否含有税款',
    prop: 'channel_tax_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '是',
        2: '否'
    }
}, {
    name: '渠道税点',
    prop: 'channel_tax_point',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        0: '不开发票',
        1: '普1',
        2: '普3',
        3: '普6',
        4: '专1',
        5: '专3',
        6: '专6'
    }
}, {
    name: '备注',
    prop: 'description',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '主体公司名称',
    prop: 'company_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '发票信息',
    prop: 'invoice_title',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '渠道付款情况',
    prop: 'channel_payment_status', //渠道付款情况 1已付全款 2已付定金 3未付款
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '已付全款',
        2: '已付定金',
        3: '未付款'
    }
}, {
    name: '回款日期',
    prop: 'invoice_receive_time_name',
    width: '',
    fixed: false,
    isInput: false
}]

const mediaResourceRenderData = [{
    name: '媒体名称',
    prop: 'name',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '资源类型', //媒体类型 1公众号 2小红书 3B站 4微博 5抖音 6视频号
    prop: 'type',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '公众号',
        2: '小红书',
        3: 'B站',
        4: '微博',
        5: '抖音',
        6: '视频号'
    }
}, {
    name: '所有人',
    prop: 'user_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '创建日期',
    prop: 'create_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '公司名称',
    prop: 'company',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '备注',
    prop: 'description',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '修改人',
    prop: 'update_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '修改时间',
    prop: 'update_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '粉丝数量',
    prop: 'fans_num',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '点赞收藏数',
    prop: 'link_num',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '抖音是否带橱窗',
    prop: 'is_shopwindow',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        0: '',
        1: '是',
        2: '否'
    }
}, {
    name: '15s抖音价',
    prop: 'first_short_video_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '60s抖音价',
    prop: 'two_short_video_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '视频植入价',
    prop: 'video_implant_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '视频定制价',
    prop: 'video_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '视频号类型',
    prop: 'video_type',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '性别',
    prop: 'video_sex',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        0: '',
        1: '男',
        2: '女'
    }
}, {
    name: '首条刊例价',
    prop: 'direct_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '第二条刊例价',
    prop: 'transmit_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '尾刊例价',
    prop: 'last_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '女性占比',
    prop: 'girl_radio',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '税点',
    prop: 'tax_point',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        0: '不开发票',
        1: '普1',
        2: '普3',
        3: '普6',
        4: '专1',
        5: '专3',
        6: '专6'
    }
}, {
    name: '媒体属性',
    prop: 'attribute',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '服务号',
        2: '教育培训',
        3: 'KOL',
        4: '美妆种草',
        5: '情感心理',
        6: '文学阅读',
        7: '金融理财',
        8: '汽车'
    }
}]

// 不同资源号对应的数据模板组
/**
 *
 * @param  {string} template 模板渲染的类型
 * <selcet>:选择框
 * <input>:input输入框
 * <info>:人物名片
 * <slotInput>:复合型输入框
 * <textarea>:文本域
 * <inputSelect>:跳转+选择输入框
 */

// {
//     name: '媒体资源',
//     require: true,
//     template: 'select',
//     tips: false,
//     key: 'a',
//     disable: true,
//     list: [{
//         id: 1,
//         name: '公众号资源'
//     }, {
//         id: 2,
//         name: '小红书资源'
//     }, {
//         id: 3,
//         name: 'B站资源'
//     }, {
//         id: 4,
//         name: '微博资源'
//     }, {
//         id: 5,
//         name: '抖音资源'
//     }, {
//         id: 6,
//         name: '微信视频号资源'
//     }],
//     rule: {
//         a: [
//             {
//                 required: true,
//                 message: '请选择资源类型',
//                 trigger: 'change'
//             }
//         ]
//     }
// }
const mediaCommonData = [{
    name: '媒体资源',
    require: true,
    template: 'select',
    tips: false,
    key: 'type',
    disable: true,
    list: [{
        id: 1,
        name: '公众号资源'
    }, {
        id: 2,
        name: '小红书资源'
    }, {
        id: 3,
        name: 'B站资源'
    }, {
        id: 4,
        name: '微博资源'
    }, {
        id: 5,
        name: '抖音资源'
    }, {
        id: 6,
        name: '微信视频号资源'
    }],
    rule: {
        type: [
            {
                required: true,
                message: '请选择资源类型',
                trigger: 'change'
            }
        ]
    }
}, {
    name: '媒体名称',
    require: true,
    template: 'input',
    tips: false,
    key: 'name',
    disable: false,
    rule: {
        name: [
            {
                required: true,
                message: '请输入媒体名称',
                trigger: 'blur'
            }
        ]
    }
}, {
    name: 'ID',
    require: true,
    template: 'input',
    tips: false,
    key: 'media_url_id',
    disable: false,
    rule: {
        media_url_id: [
            {
                required: true,
                message: '请输入ID',
                trigger: 'blur'
            }
        ]
    }
}, {
    name: '公司名称',
    require: true,
    template: 'input',
    tips: false,
    key: 'company',
    disable: false
    // rule: {
    //     company: [
    //         {
    //             required: true,
    //             message: '请输入公司名称',
    //             trigger: 'blur'
    //         }
    //     ]
    // }
}, {
    name: '所有人',
    require: false,
    template: 'info',
    tips: false,
    key: 'belong_userid',
    disable: false
}, {
    name: '粉丝数',
    require: true,
    template: 'input',
    tips: true,
    key: 'fans_num',
    disable: false,
    rule: {
        fans_num: [
            {
                required: true,
                message: '请输入粉丝数',
                trigger: 'blur'
            }
        ]
    }
}, {
    name: '备注',
    require: false,
    template: 'textarea',
    slotText: '',
    tips: true,
    key: 'description',
    disable: false
}, {
    name: '税点',
    require: true,
    template: 'select',
    slotText: '',
    tips: true,
    key: 'tax_point',
    disable: false,
    list: [{
        id: 0,
        name: '不开发票'
    }, {
        id: 1,
        name: '普1'
    }, {
        id: 2,
        name: '普3'
    }, {
        id: 3,
        name: '普6'
    }, {
        id: 4,
        name: '专1'
    }, {
        id: 5,
        name: '专3'
    }, {
        id: 6,
        name: '专6'
    }],
    rule: {
        tax_point: [
            {
                required: true,
                message: '请选择税点',
                trigger: 'change'
            }
        ]
    }
}, {
    name: '属性',
    require: true,
    template: 'select',
    slotText: '',
    tips: true,
    key: 'attribute',
    disable: false,
    list: [{
        id: 1,
        name: '服务号'
    }, {
        id: 2,
        name: '教育培训'
    }, {
        id: 3,
        name: 'KOL'
    }, {
        id: 4,
        name: '美妆种草'
    }, {
        id: 5,
        name: '情感心理'
    }, {
        id: 6,
        name: '文学阅读'
    }, {
        id: 7,
        name: '金融理财'
    }, {
        id: 8,
        name: '汽车'
    }],
    rule: {
        attribute: [
            {
                required: true,
                message: '请输入属性',
                trigger: 'change'
            }
        ]
    }
}]
// , {
//     name: '所属部门',
//     require: true,
//     template: 'inputSelect',
//     slotText: '',
//     tips: true,
//     key: 'department_name',
//     disable: false,
//     rule: {
//         department_id: [
//             {
//                 required: true,
//                 message: '部门不可以为空',
//                 trigger: 'blur'
//             }
//         ]
//     }
// }
// 公众号
const officialAccount = [{
    name: '首条刊例价',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'direct_money',
    disable: false
}, {
    name: '2条刊例价',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'transmit_money',
    disable: false
}, {
    name: '头条集合',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'three_money',
    disable: false
}, {
    name: '尾条刊例价',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'last_money',
    disable: false
}, {
    name: '女性比列%',
    require: false,
    template: 'slotInput',
    slotText: '%',
    tips: true,
    key: 'girl_radio',
    disable: false
}]

// 小红书资源
const redBook = [{
    name: '小红书点赞与收藏',
    require: true,
    template: 'input',
    tips: true,
    key: 'link_num',
    disable: false,
    rule: {
        link_num: [
            {
                required: true,
                message: '请输入点赞与收藏',
                trigger: 'blur'
            }
        ]
    }
}, {
    name: '小红书原创直发价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'direct_money',
    disable: false
}, {
    name: '小红书视频定制价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'transmit_money',
    disable: false
}]

// B站资源
const bilibili = [{
    name: 'B站植入短视频价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'video_implant_money',
    disable: false
}, {
    name: 'B站定制短视频价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'video_money',
    disable: false
}]

// 微博资源
const microBlog = [{
    name: '微博直发价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'direct_money',
    disable: false
}, {
    name: '微博转发价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'transmit_money',
    disable: false
}]

// 抖音资源
const tiktok = [{
    name: '抖音点赞数',
    require: true,
    template: 'input',
    tips: true,
    key: 'link_num',
    disable: false,
    rule: {
        link_num: [
            {
                required: true,
                message: '请输入点赞',
                trigger: 'blur'
            }
        ]
    }
}, {
    name: '抖音是否带橱窗',
    require: true,
    template: 'select',
    tips: false,
    key: 'is_shopwindow',
    disable: false,
    list: [{
        id: 1,
        name: '是'
    }, {
        id: 2,
        name: '否'
    }],
    rule: {
        is_shopwindow: [
            {
                required: true,
                message: '请选择资源类型',
                trigger: 'change'
            }
        ]
    }
}, {
    name: '抖音15s短视频价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'first_short_video_money',
    disable: false
}, {
    name: '抖音60s短视频价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'two_short_video_money',
    disable: false
}, {
    name: '星图发布价',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'direct_money',
    disable: false
}]

// 微信视频号资源
const wechartVideo = [{
    name: '视频号类型',
    require: false,
    template: 'select',
    tips: false,
    key: 'a',
    disable: false,
    list: [{
        id: 1,
        name: '个人号'
    }, {
        id: 2,
        name: '营销号'
    }, {
        id: 3,
        name: '官方号'
    }]
}, {
    name: '性别',
    require: false,
    template: 'select',
    tips: false,
    key: 'video_sex',
    disable: false,
    list: [{
        id: 1,
        name: '男'
    }, {
        id: 2,
        name: '女'
    }]
}, {
    name: '视频直发',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'direct_money',
    disable: false
}, {
    name: '视频号外链费',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'transmit_money',
    disable: false
}]

const addMediaType = [{
    id: 1,
    name: '公众号资源',
    renderData: formatShowData(officialAccount, 1)
}, {
    id: 2,
    name: '小红书资源',
    renderData: formatShowData(redBook, 2)
}, {
    id: 3,
    name: 'B站资源',
    renderData: formatShowData(bilibili, 3)
}, {
    id: 4,
    name: '微博资源',
    renderData: formatShowData(microBlog, 4)
}, {
    id: 5,
    name: '抖音资源',
    renderData: formatShowData(tiktok, 5)
}, {
    id: 6,
    name: '微信视频号资源',
    renderData: formatShowData(wechartVideo, 6)
}]

function formatShowData(data, id) {
    let copyData = [...mediaCommonData.map(aInfo => {
        return Object.assign({}, aInfo)
    })]
    let showText = {
        1: {
            2: 'ID',
            5: '粉丝数'
        },
        2: {
            2: '小红书ID链接',
            5: '小红书粉丝数(万)'
        },
        3: {
            2: 'B站ID链接',
            5: 'B站粉丝数(万)'
        },
        4: {
            2: '微博链接',
            5: '微博粉丝数(万)'
        },
        5: {
            2: '',
            5: '抖音粉丝数（万）'
        },
        6: {
            2: '视频号ID',
            5: '视频号粉丝数'
        }

    }
    copyData.forEach((item, index) => {
        item.name = showText[id][index] ? showText[id][index] : item.name
        item.hidden = (item.key === 'm' && (id === 3 || id === 4)) || (item.key === 'l' && id === 6) || (item.key === 'c' && id === 5) ? '1' : false
    })
    data.forEach((item, index) => {
        copyData.splice(6 + index, 0, item)
    })
    return copyData
}

const mediaResourceType = [{
    id: 1,
    name: '公众号'
}, {
    id: 2,
    name: '小红书'
}, {
    id: 3,
    name: 'B站'
}, {
    id: 4,
    name: '微博'
}, {
    id: 5,
    name: '抖音'
}, {
    id: 6,
    name: '视频号'
}]

const customerSortList = [{
    id: 1,
    name: '创建时间降序'
}, {
    id: 2,
    name: '创建时间升序'
}]

const mediaLevelDefaultData = [{
    id: 1,
    name: '我负责的资源'
}, {
    id: 2,
    name: '我下属负责的资源'
}, {
    id: 3,
    name: '全部的资源'
}]

const scheduleLevelDefaultData = [{
    id: 1,
    name: '我负责的媒体排期'
}, {
    id: 2,
    name: '我下属负责的媒体排期'
}, {
    id: 3,
    name: '全部的媒体排期'
}]

const paymentLevelDefaultData = [{
    id: 1,
    name: '我负责的渠道付款申请'
}, {
    id: 2,
    name: '我下属负责的渠道付款申请'
}, {
    id: 3,
    name: '全部的渠道付款申请'
}]

const isReceive = [{
    id: 1,
    name: '是'
}, {
    id: 2,
    name: '否'
}]

const isInvoice = [{
    id: 1,
    name: '需要'
}, {
    id: 2,
    name: '不需要'
}]

const scheduleSort = [{
    id: 1,
    name: '创建日期降序（默认'
}, {
    id: 2,
    name: '创建日期升序'
}, {
    id: 3,
    name: '投放时间降序'
}, {
    id: 4,
    name: '投放时间升序'
}, {
    id: 5,
    name: '最终核算利润降序'
}, {
    id: 6,
    name: '最终核算利润升序'
}, {
    id: 7,
    name: '成本价降序'
}, {
    id: 8,
    name: '成本价升序'
}, {
    id: 9,
    name: '报价降序'
}, {
    id: 10,
    name: '报价升序'
}]

const scheduleStatus = [{
    id: 1,
    name: '待提交',
    status: [1, 6]
}, {
    id: 2,
    name: '审批中',
    status: [2]
}, {
    id: 3,
    name: '审批通过',
    status: [3, 6, 7]
}, {
    id: 4,
    name: '审批拒绝',
    status: [1, 4, 6]
}, {
    id: 5,
    name: '撤销',
    status: [1, 2, 3, 4, 5, 6, 7]
}, {
    id: 6,
    name: '已废弃',
    status: [1, 6]
}, {
    id: 7,
    name: '已投放',
    status: [7]
}]

// 审批通过 可修改 状态值为 审批通过 已投放 已废弃 
// 审批拒绝 可修改 状态值为 审批拒绝 已废弃

const schedulePosition = [{
    id: 1,
    name: '头条'
}, {
    id: 9,
    name: '头条合集'
}, {
    id: 2,
    name: '次条'
}, {
    id: 10,
    name: '次条合集'
}, {
    id: 3,
    name: '第三条'
}, {
    id: 4,
    name: '第四条'
}, {
    id: 5,
    name: '第五条'
}, {
    id: 6,
    name: '第六条'
}, {
    id: 7,
    name: '第七条'
}, {
    id: 8,
    name: '第八条'
}]

const invoiceTax = [{
    id: 0,
    name: '不开发票'
}, {
    id: 1,
    name: '普1'
}, {
    id: 2,
    name: '普3'
}, {
    id: 3,
    name: '普6'
}, {
    id: 4,
    name: '专1'
}, {
    id: 5,
    name: '专3'
}, {
    id: 6,
    name: '专6'
}]

const channelPayment = [{
    id: 1,
    name: '已付全款'
}, {
    id: 2,
    name: '已付定金'
}, {
    id: 3,
    name: '未付款'
}]
// {
//     name: '媒体资源',
//     prop: 'media_names',
//     width: '',
//     fixed: false,
//     isInput: false
// },
const paymentApplyRenderData = [{
    name: '渠道付款名称',
    prop: 'name',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '媒体排期',
    prop: 'schedule_names',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '审批提交人',
    prop: 'user_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '付款金额',
    prop: 'pay_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '审批状态', //1待提交 2审批中 3审批通过 4审批拒绝 5撤销  6已废弃
    prop: 'type',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '待提交',
        2: '审批中',
        3: '审批通过',
        4: '审批拒绝',
        5: '撤销',
        6: '已废弃',
        7: '已投放'
    }
}, {
    name: '渠道收款账号名称',
    prop: 'channel_account_name',
    sProp: 'name',
    width: '',
    fixed: false,
    isInput: false,
    isSecond: true
}, {
    name: '收款账号',
    prop: 'channel_account_name',
    sProp: 'account_name',
    width: '',
    fixed: false,
    isInput: false,
    isSecond: true
}, {
    name: '付款时间',
    prop: 'pay_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '是否收到发票',
    prop: 'invoice_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '是',
        2: '否'
    }
}, {
    name: '我司打款账号',
    prop: 'pay_company_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '付款类型', //付款类型 1定金 2尾款 3全款
    prop: 'pay_type',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '定金',
        2: '尾款',
        3: '全款'
    }
}, {
    name: '备注',
    prop: 'description',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '创建时间',
    prop: 'user_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '收款开户行',
    prop: 'channel_account_name',
    sProp: 'account_bank',
    width: '',
    fixed: false,
    isInput: false,
    isSecond: true
}, {
    name: '支行',
    prop: 'channel_account_name',
    sProp: 'account_branch',
    width: '',
    fixed: false,
    isInput: false,
    isSecond: true
}, {
    name: '渠道收款账号性质',
    prop: 'channel_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '对公',
        2: '对私银行卡',
        3: '对私支付宝',
        4: '第三方银行卡',
        5: '第三方支付宝'
    }
}, {
    name: '对私收款人身份证',
    prop: 'channel_account_name',
    sProp: 'id_card',
    width: '',
    fixed: false,
    isInput: false,
    isSecond: true
}, {
    name: '手机号',
    prop: 'channel_account_name',
    sProp: 'phone',
    width: '',
    fixed: false,
    isInput: false,
    isSecond: true
}]
// {
//     name: '转账类型',
//     prop: 'pay_status',
//     width: '',
//     fixed: false,
//     isInput: false,
//     isJudge: true,
//     judge: {
//         1: '对公',
//         2: '对私'
//     }
// },
const paymentApprove = [{
    id: 1,
    name: '待提交'
}, {
    id: 2,
    name: '审批中'
}, {
    id: 3,
    name: '审批通过'
}, {
    id: 4,
    name: '审批拒绝'
}, {
    id: 5,
    name: '撤销'
}, {
    id: 6,
    name: '已废弃'
}]

const paymentSort = [{
    id: 1,
    name: '创建日期降序'
}, {
    id: 2,
    name: '创建日期升序'
}, {
    id: 3,
    name: '付款日期降序'
}, {
    id: 4,
    name: '付款日期升序'
}]

const paymentAccountRenderData = [{
    name: '渠道收款账号名称',
    prop: 'name',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '媒体资源',
    prop: 'media_names',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '所有人',
    prop: 'user_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '创建时间',
    prop: 'user_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '渠道收款账号性质', //渠道收款账号性质 1对公 2对私
    prop: 'channel_status',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '对公',
        2: '对私银行卡',
        3: '对私支付宝',
        4: '第三方银行卡',
        5: '第三方支付宝'
    }
}, {
    name: '收款账号状态',
    prop: 'account_status', //收款账号状态 1常用 2备用 3作废
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '常用',
        2: '备用',
        3: '作废'
    }
}, {
    name: '收款开户行',
    prop: 'account_bank',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '收款账号',
    prop: 'account_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '备注',
    prop: 'description',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '修改人',
    prop: 'update_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '状态',
    prop: 'type',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '创建时间',
    prop: 'create_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '修改时间',
    prop: 'update_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '支行',
    prop: 'account_branch',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '对私收款人身份证',
    prop: 'id_card',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '手机号',
    prop: 'phone',
    width: '',
    fixed: false,
    isInput: false
}]

const carryOver = [{
    id: 1,
    name: '对公'
}, {
    id: 2,
    name: '对私银行卡'
}, {
    id: 3,
    name: '对私支付宝'
}, {
    id: 4,
    name: '第三方银行卡'
}, {
    id: 5,
    name: '第三方支付宝'
}]

const transferCarryOver= [{
    id: 1,
    name: '对公'
}, {
    id: 2,
    name: '对私银行卡'
}, {
    id: 3,
    name: '对私支付宝'
}]

const payType = [{
    id: 1,
    name: '定金'
}, {
    id: 2,
    name: '尾款'
}, {
    id: 3,
    name: '全款'
}]

const paymentAccountLevelDefaultData = [{
    id: 1,
    name: '我负责的渠道账号'
}, {
    id: 2,
    name: '我下属负责的渠道账号'
}, {
    id: 3,
    name: '全部的渠道账号'
}]

const paymentAccountSort = [{
    id: 1,
    name: '创建日期降序'
}, {
    id: 2,
    name: '创建日期升序'
}]

const paymentAccountStatus = [{
    id: 1,
    name: '常用'
}, {
    id: 2,
    name: '备用'
}, {
    id: 3,
    name: '作废'
}]

const paymentAccountStatusObj = {
    1: '常用',
    2: '备用',
    3: '作废'
}
const invoiceSort = [{
    id: 1,
    name: '创建时间降序'
}, {
    id: 2,
    name: '创建时间升序'
}, {
    id: 3,
    name: '申请开票金额降序'
}, {
    id: 4,
    name: '申请开票金额升序'
}, {
    id: 5,
    name: '财务开票时间降序'
}, {
    id: 6,
    name: '财务开票时间升序'
}]

const invoiceStatus = [{
    id: 1,
    name: '待提交'
}, {
    id: 2,
    name: '审批中'
}, {
    id: 3,
    name: '审批通过'
}, {
    id: 4,
    name: '审批拒绝'
}, {
    id: 5,
    name: '撤销'
}, {
    id: 6,
    name: '已废弃'
}]

const invoiceType = [{
    id: 1,
    name: '普1'
}, {
    id: 2,
    name: '普3'
}, {
    id: 3,
    name: '普6'
}, {
    id: 4,
    name: '专1'
}, {
    id: 5,
    name: '专3'
}, {
    id: 6,
    name: '专6'
}]

const invoiceLevelDefaultData = [{
    id: 1,
    name: '我负责的排期开票'
}, {
    id: 2,
    name: '我下属负责的排期开票'
}, {
    id: 3,
    name: '全部的排期开票'
}]

const invoiceRenderData = [{
    name: '开票抬头',
    prop: 'name',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '审批状态', //1待提交 2审批中 3审批通过 4审批拒绝 5撤销6已废弃
    prop: 'type',
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '待提交',
        2: '审批中',
        3: '审批通过',
        4: '审批拒绝',
        5: '撤销',
        6: '已废弃',
        7: '已投放'
    }
}, {
    name: '我司开票公司',
    prop: 'company_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '媒体排期',
    prop: 'schedule_names',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开票项目',
    prop: 'invoice_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开票类型',
    prop: 'invoice_status', //开票类型 1普1 2普3 3普6 4专1 5专3 6专6
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        0: '不开发票',
        1: '普1',
        2: '普3',
        3: '普6',
        4: '专1',
        5: '专3',
        6: '专6'
    }
}, {
    name: '开票税号',
    prop: 'tax_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '申请开票金额',
    prop: 'invoice_money',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '普票邮箱',
    prop: 'email',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开票银行',
    prop: 'invoice_bank',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开票地址',
    prop: 'invoice_address',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '开票电话',
    prop: 'invoice_phone',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '排期明细已哪个为准',
    prop: 'schedule_status', //排期明细已哪个为准 1系统填写 2手动上传
    width: '',
    fixed: false,
    isInput: false,
    isJudge: true,
    judge: {
        1: '系统填写',
        2: '手动上传'
    }
}, {
    name: '创建时间',
    prop: 'create_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '修改时间',
    prop: 'update_time_name',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '财务开票时间',
    prop: 'invoice_time_name',
    width: '',
    fixed: false,
    isInput: false
}]

const channelInvoiceRenderData = [
    // {
    //     name: '媒体资源',
    //     prop: 'media_name',
    //     width: '',
    //     fixed: true,
    //     isInput: false
    // },
    {
        name: '公司名称',
        prop: 'company_name',
        width: '',
        fixed: false,
        isInput: false
    },
    {
        name: '开票金额',
        prop: 'invoice_money',
        width: '',
        fixed: false,
        isInput: false
    },
    {
        name: '审批状态',
        prop: 'type',
        width: '',
        fixed: false,
        isInput: false,
        isJudge: true,
        judge: {
            1: '待提交',
            2: '审批中',
            3: '审批通过',
            4: '审批拒绝',
            5: '撤销',
            6: '已废弃',
            7: '已投放'
        }
    }, {
        name: '媒体排期',
        prop: 'schedule_names',
        width: '',
        fixed: false,
        isInput: false
    }
]

const channelInvoiceLevelDefaultData = [{
    id: 1,
    name: '我负责的渠道开票'
}, {
    id: 2,
    name: '我下属负责的渠道开票'
}, {
    id: 3,
    name: '全部的渠道开票'
}]
export {
    channelInvoiceLevelDefaultData,
    channelInvoiceRenderData,
    paymentAccountStatus,
    customerTypeList,
    scheduleTableRenderList,
    mediaResourceRenderData,
    addMediaType,
    mediaResourceType,
    customerSortList,
    mediaLevelDefaultData,
    scheduleLevelDefaultData,
    paymentLevelDefaultData,
    isReceive,
    isInvoice,
    scheduleSort,
    scheduleStatus,
    schedulePosition,
    invoiceTax,
    channelPayment,
    paymentApplyRenderData,
    paymentApprove,
    paymentSort,
    paymentAccountRenderData,
    carryOver,
    payType,
    paymentAccountLevelDefaultData,
    paymentAccountSort,
    invoiceSort,
    invoiceStatus,
    invoiceType,
    invoiceLevelDefaultData,
    invoiceRenderData,
    paymentAccountStatusObj,
    transferCarryOver
}
