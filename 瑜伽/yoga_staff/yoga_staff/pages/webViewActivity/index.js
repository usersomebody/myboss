import {getUrlParam} from '../../utils/util.js'

Page({
  data: {
    webViewUrl: '',
    wxAppPath: '',
    pvFrom: '',
    article: {}
  },
  onLoad(param) {
    let id = getUrlParam(decodeURIComponent(param.url), 'id')
    this.setData({
      wxAppPath: param.url,
      webViewUrl: decodeURIComponent(param.url),
      id: id
    })
  },
  //分享
  onShareAppMessage() {
    
  }
})
