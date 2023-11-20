const coordinates = [
    {
        posterBg:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211109/9064b6bc02458d933a7aa4d936fa0aaa.png',
        name:{
            x: 168, 
            y: 98, 
            w: 0, 
            h: 0, 
            distance: 0, 
            lineHeight: 42, 
            maxWidth: 300, 
            fontSize: 32, 
            textArr:['去约瑜伽', '', ''], 
            color:'#333333'
        },
        address:{
            x: 110, 
            y: 185, 
            w: 0, 
            h: 0, 
            distance: 24, 
            lineHeight: 42, 
            maxWidth: 420, 
            fontSize: 24, 
            textArr:['18326125668', '浙江省杭州市西湖区紫萱路丰盛九玺12栋601路', ''], 
            color:'#666666'
        },
        logo:{
            src: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210615/8e7e5291c1f86155a3c05124d4897b84.png', 
            bw: 0, 
            w: 88, 
            x: 104, 
            y: 108
        }
    },
    {
        posterBg:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211109/15be2e9ec4f337da42ef34a9c3c3e22b.png',
        name:{
            x: 76, 
            y: 250, 
            w: 0, 
            h: 0, 
            distance: 0, 
            lineHeight: 42, 
            maxWidth: 130, 
            fontSize: 32, 
            textArr:['去约瑜伽', '', ''], 
            color:'#ffffff'
        },
        address:{
            x: 330, 
            y: 164, 
            w: 0, 
            h: 0, 
            distance: 24, 
            lineHeight: 42, 
            maxWidth: 320, 
            fontSize: 24, 
            textArr:['18326125668', '浙江省杭州市西湖区紫萱路丰盛九玺12栋601路', ''], 
            color:'#ffffff'
        },
        logo:{
            src: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210615/8e7e5291c1f86155a3c05124d4897b84.png', 
            bw: 0, 
            w: 88, 
            x: 144, 
            y: 188
        }
    },
    {
        posterBg:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211109/74a9c97a610461e07eeee9bb7100850b.png',
        name:{
            x: 48, 
            y: 70, 
            w: 0, 
            h: 0, 
            distance: 0, 
            lineHeight: 42, 
            maxWidth: 300, 
            fontSize: 32, 
            textArr:['去约瑜伽', '', ''], 
            color:'#ffffff'
        },
        address:{
            x: 96, 
            y: 152, 
            w: 0, 
            h: 0, 
            distance: 24, 
            lineHeight: 42, 
            maxWidth: 320, 
            fontSize: 24, 
            textArr:['18326125668', '浙江省杭州市西湖区紫萱路丰盛九玺12栋601路', ''], 
            color:'#ffffff'
        },
        logo:{
            src: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210615/8e7e5291c1f86155a3c05124d4897b84.png', 
            bw: 0, 
            w: 88, 
            x: 592, 
            y: 272
        }
    },
    {
        posterBg:'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20211109/f566e7bb26e37d2c73162778d3a48612.png',
        name:{
            x: 282, 
            y: 143, 
            w: 0, 
            h: 0, 
            distance: 0, 
            lineHeight: 42, 
            maxWidth: 300, 
            fontSize: 32, 
            textArr:['去约瑜伽', '', ''], 
            color:'#ffffff'
        },
        address:{
            x: 96, 
            y: 216, 
            w: 0, 
            h: 0, 
            distance: 24, 
            lineHeight: 42, 
            maxWidth: 420, 
            fontSize: 24, 
            textArr:['18326125668', '浙江省杭州市西湖区紫萱路丰盛九玺12栋601路', ''], 
            color:'#ffffff'
        },
        logo:{
            src: 'https://qizhifan.oss-cn-hangzhou.aliyuncs.com/yoga/images/20210615/8e7e5291c1f86155a3c05124d4897b84.png', 
            bw: 0, 
            w: 88, 
            x: 338, 
            y: 74
        }
    }
    ]


// function posterData(type,storeName, logo, phone, address){
//     let nameTextArr = [storeName]
//     let addressTextArr = [phone,address]
//     let poster = coordinates[type]
//     poster.name.textArr = nameTextArr
//     poster.address.textArr = addressTextArr
//     poster.logo.src = logo
//     return coordinates[type]
// }
export{
    coordinates
}