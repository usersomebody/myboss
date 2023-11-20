import moment from '../../utils/moment.js'
import { accDiv } from '../../utils/common.js'

Component({
    data: {
       width:'0%'
    },
    properties: {
        initialPrice: {
            type: String,
            value: ''
        },
        endPrice: {
            type: String,
            value: ''
        },
        currentPrice: {
            type: String,
            value: ''
        }
    },
    attached() {
        this.judgePriceValid()
    },
    observers: {
        'currentPrice': function(val) {
            console.log('val',val)
          this.judgePriceValid()
        }
    },
    detached(){

    },
    methods: {
        // 处理当前展示的width
        judgePriceValid(){
            const { currentPrice, endPrice } = this.properties
            if(!currentPrice || !endPrice ){
                return
            }
            let width = accDiv(currentPrice,endPrice) > 1 ? 1 : accDiv(currentPrice,endPrice)
            width = this.toPercent(width)
            this.setData({
                width,
            })
        },
        toPercent(point){
            var str=Number(point*100).toFixed(1);
            str+="%";
            return str;
        }
    }

})
