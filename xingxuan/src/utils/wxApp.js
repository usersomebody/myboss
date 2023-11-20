/**
 * Created by shining on 2017/11/15.
 */

const IS_Ali_APP = !!navigator.userAgent.match(/AliApp/i)
const isWxApp = function () {
    const isUaMatch = !!(navigator.userAgent && navigator.userAgent.match(/miniprogram/i))
  return window.__wxjs_environment === 'miniprogram' || isUaMatch || IS_Ali_APP; // eslint-disable-line
}

// 识别小程序环境
const appOrH5 = function (appCallback, webCallback) {
    if (isWxApp()) {
        appCallback()
    } else {
        webCallback()
    }
}

const getCurrentSDK = function () {
    if (IS_Ali_APP) {
        return window.my
    }
    return window.wx.miniProgram
}

// 跳转
const wxNavigateTo = function (path) {
    getCurrentSDK().navigateTo({
        url: path
    })
}

const wxNavigateBack = function (path) {
    getCurrentSDK().navigateBack({
        url: path
    })
}

const wxSwitchTab = function (path) {
    getCurrentSDK().switchTab({
        url: path
    })
}

const wxReLaunch = function (path) {
    getCurrentSDK().reLaunch({
        url: path
    })
}

const wxRedirectTo = function (path) {
    getCurrentSDK().redirectTo({
        url: path
    })
}

const wxAppUrl = {
    productDetail: '/pages/productDetail/index',
    theme: '/pages/themeDetail/index',
    home: '/pages/index/index',
    favor: '/pages/myFavor/index',
    activityInvite: '/pages/activityInviteFriend/index',
    pointCenter: '/pages/memberPoint/pointCenter',
    vipActivityIndex: '/pages/activity/index'
}

const goWxAppHome = function () {
    wxSwitchTab(wxAppUrl.home)
}
export {
    appOrH5,
    wxNavigateTo,
    wxNavigateBack,
    wxSwitchTab,
    wxReLaunch,
    wxRedirectTo,
    wxAppUrl,
    isWxApp,
    IS_Ali_APP,
    goWxAppHome
}
