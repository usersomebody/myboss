const customerTypeList = [{
    id: 1,
    name: '我负责的客服'
}]

const customerRenderData = [{
    name: '停用/启用',
    prop: 'a',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '登录名',
    prop: 'b',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '真实姓名',
    prop: 'c',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '联系电话',
    prop: 'd',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '权限',
    prop: 'e',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '联系地址',
    prop: 'f',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '电子邮箱',
    prop: 'g',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '最后登录时间',
    prop: 'h',
    width: '',
    fixed: false,
    isInput: false
}]

const mediaResourceRenderData = [{
    name: '媒体名称',
    prop: 'a',
    width: '',
    isInput: false,
    fixed: true
}, {
    name: '资源类型',
    prop: 'b',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '所有人',
    prop: 'c',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '创建日期',
    prop: 'd',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '公司名称',
    prop: 'e',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '创建人',
    prop: 'f',
    width: '',
    fixed: false,
    isInput: false
}, {
    name: '备注',
    prop: 'g',
    width: '',
    fixed: false,
    isInput: false
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
const mediaCommonData = [{
    name: '媒体资源',
    require: true,
    template: 'select',
    tips: false,
    key: 'a',
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
        a: [
            {
                required: true,
                message: '请选择资源类型',
                trigger: 'blur'
            }
        ]
    }
}, {
    name: '媒体名称',
    require: true,
    template: 'input',
    tips: false,
    key: 'b',
    disable: false,
    rule: {
        b: [
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
    key: 'c',
    disable: false,
    rule: {
        c: [
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
    key: 'd',
    disable: false,
    rule: {
        d: [
            {
                required: true,
                message: '请输入公司名称',
                trigger: 'blur'
            }
        ]
    }
}, {
    name: '所有人',
    require: false,
    template: 'info',
    tips: false,
    key: 'e',
    disable: false
}, {
    name: '粉丝数',
    require: true,
    template: 'input',
    tips: true,
    key: 'f',
    disable: false,
    rule: {
        f: [
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
    key: 'q',
    disable: false
}, {
    name: '税点',
    require: true,
    template: 'input',
    slotText: '',
    tips: true,
    key: 'l',
    disable: false,
    rule: {
        l: [
            {
                required: true,
                message: '请输入税点',
                trigger: 'blur'
            }
        ]
    }
}, {
    name: '属性',
    require: true,
    template: 'select',
    slotText: '',
    tips: true,
    key: 'm',
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
        m: [
            {
                required: true,
                message: '请输入属性',
                trigger: 'blur'
            }
        ]
    }
}, {
    name: '所属部门',
    require: true,
    template: 'inputSelect',
    slotText: '',
    tips: true,
    key: 'o',
    disable: false,
    rule: {
        o: [
            {
                required: true,
                message: '部门不可以为空',
                trigger: 'blur'
            }
        ]
    }
}]
// 公众号
const officialAccount = [{
    name: '首条刊例价',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'g',
    disable: false
}, {
    name: '2条刊例价',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'h',
    disable: false
}, {
    name: '3-N条刊例价',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'i',
    disable: false
}, {
    name: '尾条刊例价',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'j',
    disable: false
}, {
    name: '女性比列%',
    require: false,
    template: 'slotInput',
    slotText: '%',
    tips: true,
    key: 'k',
    disable: false
}]

// 小红书资源
const redBook = [{
    name: '小红书点赞与收藏',
    require: true,
    template: 'input',
    tips: true,
    key: 'f',
    disable: false,
    rule: {
        f: [
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
    key: 'i',
    disable: false
}, {
    name: '小红书视频定制价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'j',
    disable: false
}]

// B站资源
const bilibili = [{
    name: 'B站植入短视频价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'i',
    disable: false
}, {
    name: 'B站定制短视频价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'j',
    disable: false
}]

// 微博资源
const microBlog = [{
    name: '微博直发价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'i',
    disable: false
}, {
    name: '微博转发价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'j',
    disable: false
}]

// 抖音资源
const tiktok = [{
    name: '抖音点赞数',
    require: true,
    template: 'input',
    tips: true,
    key: 'f',
    disable: false,
    rule: {
        f: [
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
    key: 'a',
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
        a: [
            {
                required: true,
                message: '请选择资源类型',
                trigger: 'blur'
            }
        ]
    }
}, {
    name: '抖音15s短视频价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'i',
    disable: false
}, {
    name: '抖音60s短视频价格',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'j',
    disable: false
}, {
    name: '星图发布价',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'j',
    disable: false
}]

// 微信视频号资源
const wechartVideo = [{
    name: '视频号类型',
    require: false,
    template: 'select',
    tips: false,
    key: 'a',
    disable: true,
    list: [{
        id: 1,
        name: '公众号资源'
    }, {
        id: 2,
        name: '小红书资源'
    }]
}, {
    name: '性别',
    require: false,
    template: 'select',
    tips: false,
    key: 'a',
    disable: true,
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
    key: 'i',
    disable: false
}, {
    name: '视频号外链费',
    require: false,
    template: 'slotInput',
    slotText: '元',
    tips: false,
    key: 'j',
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

export {
    customerTypeList,
    customerRenderData,
    mediaResourceRenderData,
    addMediaType
}
