// 错误提示
function showError(title, content, callback) {
  wx.showModal({
    title: title || 'Error',
    content: content,
    showCancel: false,
    success: function () {
      if (callback && typeof callback == 'function') {
        callback()
      }
    }
  })
}
export {
  showError
}