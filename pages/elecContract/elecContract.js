// pages/elecContract/elecContract.js
var app = getApp()
var urls = app.globalData.url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '电子合同' //页面标题为路由参数
    });
    let newUrl = 'https://firmiana-bss.yunniao.cn'
    if (urls == 'https://firmiana-bss-api-m1.yunniao.cn/') {
      newUrl = 'https://firmiana-bss-m1.yunniao.cn/'
    }
    this.setData({
      linkUrl: newUrl + 'qiyuesuo_js_sdk/?id=' + options.id + '&&contact=' + options.phone
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})