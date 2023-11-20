let formList = [
    {
        name:'会员卡名称',
        placeholder:'请选择会员卡',
        key:'card_id',
        selectId:'',
        value:'',
        isHandle:true,
        inputBox:false,
        typeArr:[3,4,5,6,8,9]
    },{
        name:'设置停卡结束日期',
        placeholder:'必填',
        key:'stop_end_time',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:false,
        isSwitch:true,
        typeArr:[6]
    },{
        name:'有效日期',
        placeholder:'年月日-年月日',
        key:'valid_time',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:false,
        isSwitch:false,
        typeArr:[3,4,5,8]
    },{
        name:'当前剩余',
        placeholder:'剩余内容',
        key:'remain_content',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:false,
        isSwitch:false,
        typeArr:[3,5,8]
        
    },{
        name:'赠送',
        placeholder:'必填',
        key:'giving',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:true,
        isSwitch:false,
        typeArr:[3,5,8]
    },{
        name:'赠后剩余',
        placeholder:'必填',
        key:'giving_remain',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:false,
        isSwitch:false,
        typeArr:[3,5,8]
    },{
        name:'延期天数',
        placeholder:'必填',
        key:'postpone_day',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:true,
        isSwitch:false,
        typeArr:[4]
    },{
        name:'延后有效期',
        placeholder:'必填',
        key:'postpone_validity',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:false,
        isSwitch:false,
        typeArr:[4]
    },{ 
        name:'开始日期',
        placeholder:'必填',
        key:'leave_start_time',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:false,
        isPicker:true,
        index:'',
        typeArr:[6,9]
    },{
        name:'结束日期',
        placeholder:'必填',
        key:'leave_end_time',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:false,
        isPicker:true,
        index:'',
        typeArr:[6,9]
    },{
        name:'支付方式',
        placeholder:'请选择支付方式',
        key:'payment_type',
        selectId:'',
        value:'',
        isHandle:true,
        inputBox:false,
        typeArr:[6,9,4,3]
        
    },{
        name:'请假费用',
        placeholder:'请输入费用',
        key:'money',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:true,
        typeArr:[6,9,4,3]
    },{
        name:'是否延卡',
        placeholder:'必填',
        key:'is_delay',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:false,
        isSwitch:true,
        typeArr:[6]
        
    },{
        name:'请假数据清零',
        placeholder:'必填',
        key:'leave_clear',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:false,
        isSwitch:true,
        typeArr:[3]
    },{
        name:'备注',
        placeholder:'请输入备注',
        key:'memo',
        selectId:'',
        value:'',
        isHandle:false,
        inputBox:false,
        typeArr:[3,4,5,6,8,9]
    }
]
function formatShowList(type){
    let showName = {
        3:{
            name:'新增内容',
            update:'续后剩余',
            moneyName:"续卡费用"
        },
        4:{
            moneyName:"延卡费用"
        },
        5:{
            name:'赠送',
            update:'赠后剩余'
        },
        6:{
            moneyName:"停卡费用"
            
        },
        8:{
            name:'本次扣除',
            update:'扣后剩余'
        },
        9:{
            name:'本次扣除',
            update:'扣后剩余',
            moneyName:"请假费用"
        }
    }
    let updateKey = [3,5,8]
    let moneyKey = [3,4,6,9]
    console.log('formList',formList)
    let showList = formList.map((item)=>{
        let obj = item
        obj.value = ''
        obj.selectId = ''
        obj.disable = false
        obj.isShow = false
       if(updateKey.indexOf(type) > -1 && (item.key == 'giving' || item.key == 'giving_remain')){
            obj.name = item.key == 'giving' ? showName[type].name : item.key == 'giving_remain' ? showName[type].update : item.name
        }else if(moneyKey.indexOf(type) > -1 && item.key == 'money' ){
            obj.name = showName[type].moneyName
        }
        
        
        return item.typeArr.indexOf(type) > -1 ? obj : ''
    })
    let validList = showList.filter((item)=>{
        return item
    })
    console.log('validList',validList)
    
    return validList
}
export {
    formatShowList
}