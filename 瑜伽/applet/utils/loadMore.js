// 计算总页码
function getTotalPage(total, count) {
    return Math.ceil(total / count)
}

function isLast(page, total, count) {
  return page >= getTotalPage(total,count)
}

export{
  isLast
}