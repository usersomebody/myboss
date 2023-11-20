// 点赞数 1:<1千 2:1千~5千 3:5千~1万 4:1万~5万 5:5万~10万 6:>10万
const likeList = [{
    id: -1,
    name: '不限'
}, {
    id: 1,
    name: '小于1000'
}, {
    id: 2,
    name: '1000 ~ 5000'
}, {
    id: 3,
    name: '5000 ~ 10000'
}, {
    id: 4,
    name: '10000 ~ 50000'
}, {
    id: 5,
    name: '50000 ~ 100000'
}, {
    id: 6,
    name: '大于10万'
}]
// 分享数 1:<1千 2:1千~5千 3:5千~1万 4:1万~5万 5:5万~10万 6:>10万
const shareList = [{
    id: -1,
    name: '不限'
}, {
    id: 1,
    name: '小于1000'
}, {
    id: 2,
    name: '1000 ~ 5000'
}, {
    id: 3,
    name: '5000 ~ 10000'
}, {
    id: 4,
    name: '10000 ~ 50000'
}, {
    id: 5,
    name: '50000 ~ 100000'
}, {
    id: 6,
    name: '大于10万'
}]
// 评论数 1:<1千 2:1千~5千 3:5千~1万 4:1万~5万 5:5万~10万 6:>10万
const commentList = [{
    id: -1,
    name: '不限'
}, {
    id: 1,
    name: '小于1000'
}, {
    id: 2,
    name: '1000 ~ 5000'
}, {
    id: 3,
    name: '5000 ~ 10000'
}, {
    id: 4,
    name: '10000 ~ 50000'
}, {
    id: 5,
    name: '50000 ~ 100000'
}, {
    id: 6,
    name: '大于10万'
}]
// 时长 1: <30秒 2:30秒~1分钟 3:1分钟~3分钟 4:3分钟~5分钟 5:>5分钟
const durationList = [{
    id: -1,
    name: '不限'
}, {
    id: 1,
    name: '小于30s'
}, {
    id: 2,
    name: '30s ~ 60s'
}, {
    id: 3,
    name: '60s ~ 180s'
}, {
    id: 4,
    name: '180s ~ 300s'
}, {
    id: 5,
    name: '大于300s'
}]

const topicList = [{
    id: -1,
    name: '不限'
}, {
    id: 1,
    name: '有话题'
}, {
    id: 2,
    name: '无话题'
}]

const linkList = [{
    id: -1,
    name: '不限'
}, {
    id: 1,
    name: '有挂链'
}, {
    id: 2,
    name: '无挂链'
}]

const liveList = [{
    id: -1,
    name: '不限'
}, {
    id: 1,
    name: '是'
}, {
    id: 2,
    name: '否'
}]
export {
    likeList,
    shareList,
    commentList,
    durationList,
    topicList,
    linkList,
    liveList
}
