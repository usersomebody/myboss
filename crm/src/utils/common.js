export function getExcel() {
    // response.data.forEach((item) => {
    //     var excleObj = {
    //         head_name: item.head_name,
    //         get_install_people: item.get_install_people,
    //         area: item.area,
    //         serial_number: item.serial_number,
    //         place_where: item.place_where,
    //         address: item.address,
    //         user_name: item.user_name,
    //         mobile: item.mobile,
    //         fans: item.fans,
    //         get_day_average: item.get_day_average,
    //         status: item.status,
    //         rent: item.rent,
    //         expiration_at: item.expiration_at
    //     }
    //     this.jsonData.push(excleObj)
    // })
    // // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
    // let str = `负责人,安装人,地址,设备编号,场地方,详细地址,场地方联系人,场地方联系电话,累计使用人数,日均使用人数,设备状态,租金,到期时间\n`;
    // //增加\t为了不让表格显示科学计数法或者其他格式
    // for (let i = 0; i < this.jsonData.length; i++) {
    //     for (let item in this.jsonData[i]) {
    //         str += `${this.jsonData[i][item] + '\t'},`;
    //     }
    //     str += '\n';
    // }
    // //encodeURIComponent解决中文乱码
    // let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    // //通过创建a标签实现
    // var link = document.createElement("a");
    // link.href = uri;
    // //对下载的文件命名
    // link.download = "设备到期列表.xls";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // this.jsonData = []

}

/*
                                 _
                              _ooOoo_
                             o8888888o
                             88" . "88
                             (| -_- |)
                             O\  =  /O
                          ____/`---'\____
                        .'  \\|     |//  `.
                       /  \\|||  :  |||//  \
                      /  _||||| -:- |||||_  \
                      |   | \\\  -  /'| |   |
                      | \_|  `\`---'//  |_/ |
                      \  .-\__ `-. -'__/-.  /
                    ___`. .'  /--.--\  `. .'___
                 ."" '<  `.___\_<|>_/___.' _> \"".
                | | :  `- \`. ;`. _/; .'/ /  .' ; |    林
                \  \ `-.   \_\_`. _.'_/_/  -' _.' /
  ================-.`___`-.__\ \___  /__.-'_.'_.-'================
                              `=--=-'                  小健

                   佛祖保佑    永无BUG    永不宕机
————————————————

*/
// 两个浮点数求和
function accAdd(num1, num2) {
    var r1, r2, m
    try {
        r1 = num1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = num2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m
}

// 两个浮点数相减
function accSub(num1, num2) {
    var r1, r2, m, n
    try {
        r1 = num1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = num2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    n = (r1 >= r2) ? r1 : r2
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n)
}

// 两数相除
function accDiv(num1, num2) {
    var t1, t2, r1, r2
    try {
        t1 = num1.toString().split('.')[1].length
    } catch (e) {
        t1 = 0
    }
    try {
        t2 = num2.toString().split('.')[1].length
    } catch (e) {
        t2 = 0
    }
    r1 = Number(num1.toString().replace('.', ''))
    r2 = Number(num2.toString().replace('.', ''))
    return (r1 / r2) * Math.pow(10, t2 - t1)
}

// 两数相乘
function accMul(num1, num2) {
    let m = 0, s1 = num1.toString(), s2 = num2.toString()
    try {
        m += s1.split('.')[1].length
    } catch (e) {

    };
    try {
        m += s2.split('.')[1].length
    } catch (e) {

    };
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

// 对象重复对比
function isObjectValueEqual(a, b) {
    // 判断两个对象是否指向同一内存，指向同一内存返回true
    if (a === b) return true
    // 获取两个对象键值数组
    let aProps = Object.getOwnPropertyNames(a)
    let bProps = Object.getOwnPropertyNames(b)
    // 判断两个对象键值数组长度是否一致，不一致返回false
    if (aProps.length !== bProps.length) return false
    // 遍历对象的键值
    for (let prop in a) {
        // 判断a的键值，在b中是否存在，不存在，返回false
        if (b.hasOwnProperty(prop)) {
            // 判断a的键值是否为对象，是则递归，不是对象直接判断键值是否相等，不相等返回false
            if (typeof a[prop] === 'object') {
                if (!isObjectValueEqual(a[prop], b[prop])) return false
            } else if (a[prop] !== b[prop]) {
                return false
            }
        } else {
            return false
        }
    }
    return true
}

// 格式化参数
function formatParam(param) {
    let arr = []
    for (let i in param) {
        arr.push(i + '=' + param[i])
    }
    return arr.join('&')
}

// 比较小程序版本库
function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (var i = 0; i < len; i++) {
        var num1 = parseInt(v1[i])
        var num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

// 身份证号正则规则校验
function isIdentityCodeValid(code = '') {
    // 摘自 https://blog.csdn.net/zjslqshqz/article/details/73571736
    const city = {
        11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 '
    }
    if (!code || !city[code.substr(0, 2)]) {
        return false
    }
    if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        return false
    }
    // 18位身份证需要验证最后一位校验位
    if (code.length === 18) {
        code = code.split(''); // eslint-disable-line
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        // 校验位
        const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
        let sum = 0
        let ai = 0
        let wi = 0
        for (let i = 0; i < 17; i += 1) {
            ai = code[i]
            wi = factor[i]
            sum += ai * wi
        }
        if (`${parity[sum % 11]}` !== code[17]) {
            return false
        }
    }
    return true
}

// 数据大小比较
// 摘自：https://www.jianshu.com/p/54c1714aa0b2
function getMilliseconds(timeStr) {
    const dateArr = timeStr.split(/[- :/]/)
    if (dateArr[3] === undefined) {
        return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]).getTime()
    }
    return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]).getTime()
}

// 大于
function isTimeBigger(timeStr1, timeStr2) {
    return getMilliseconds(timeStr1) > getMilliseconds(timeStr2)
}

// 相等
function isTimeEqual(timeStr1, timeStr2) {
    return getMilliseconds(timeStr1) === getMilliseconds(timeStr2)
}

// 大于等于
function isTimeGte(timeStr1, timeStr2) {
    return isTimeEqual(timeStr1, timeStr2) || isTimeBigger(timeStr1, timeStr2)
}

// 小于等于
function isTimeLte(timeStr1, timeStr2) {
    return !isTimeBigger(timeStr1, timeStr2)
}

// 两位小数
function fixTwo(num) {
    return `0${num}`.slice(-2)
}

// 地图经纬度坐标点转化
// 百度转腾讯
function BdmapEncryptToMapabc(bd_lat, bd_lon) {
    const x_pi = 3.14159265358979324 * 3000.0 / 180.0
    const x = new Number(bd_lon - 0.0065)
    const y = new Number(bd_lat - 0.006)
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
    const Mars_lon = z * Math.cos(theta)
    const Mars_lat = z * Math.sin(theta)
    return {
        longitude: Mars_lon,
        latitude: Mars_lat
    }
}

// 数组转对象 便于数据处理 减少二次遍历 注意数据结构！！！
function pipeDate(month) {
    const monthInfo = {}
    month.forEach(d => {
        monthInfo[d.date] = d
    })
    return monthInfo
}

// filterEOF
function filterEOF(data) {
    return data
        .replace(/\u2028/g, '')
        .replace(/\u2029/g, '')
}

function formatParagraph(str) {
    if (!str) return []
    let strArr = str.split('\n')
    return strArr
}
// 手机号
function telReg(num) {
    return /^1[3-9]\d{9}$/.test(num)
}

// 递归循环filter 数组
// 过滤合法路由数据
function filterVlaue(validRoute = ['1', '3', '7'], asyncRoutes = []) {
    const routeMap = asyncRoutes
    const accessedRouters = routeMap.filter(v => {
        if (getMenu(validRoute, v.link)) {
            if (v.children && v.children.length > 0) {
                v.children = v.children.filter(child => {
                    if (getMenu(validRoute, child.link)) {
                        return child
                    }
                    return false
                })
                return v
            } else {
                return v
            }
        }
        return false
    })
    return accessedRouters
}

// 根据路由link获取菜单
function getMenu(menus, link) {
    if (menus.indexOf(link) > -1) {
        return true
    }
    return false
}

// 获取时间的日期
function getToDay(times) {
    let current = times || new Date()
    let year = current.getFullYear()
    let month = current.getMonth() + 1
    let day = current.getDate()
    let hours = current.getHours() // 获取当前小时数(0-23)
    let minutes = current.getMinutes() // 获取当前分钟数(0-59)
    let seconds = current.getSeconds() // 获取当前秒数(0-59)
    let dayNums = new Date(year, month, 0).getDate() // 获取目标月有多少天

    let timesObj = {
        current,
        year,
        month,
        day,
        hours,
        minutes,
        seconds,
        dayNums
    }
    return timesObj
}

// 星座处理
function getAstro(month, day) {
    var s = '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'
    var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22]
    return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2)
}

export {
    accAdd,
    accSub,
    accDiv,
    accMul,
    isObjectValueEqual,
    formatParam,
    isIdentityCodeValid,
    isTimeBigger,
    isTimeEqual,
    isTimeGte,
    isTimeLte,
    fixTwo,
    BdmapEncryptToMapabc,
    pipeDate,
    telReg,
    compareVersion,
    filterEOF,
    formatParagraph,
    getToDay,
    filterVlaue,
    getAstro
}
