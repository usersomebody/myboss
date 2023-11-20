
Page({
  data: {
    webViewUrl: '',
    wxAppPath: '',
    pvFrom: '',
    article: {}
  },
  onLoad(param) {
    console.log(param)
    this.setData({
      webViewUrl: decodeURIComponent(param.url),
    })
  },

})
