// pages/agreement/agreement.js
var app = getApp()
var urls = app.globalData.url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.contractName  //页面标题为路由参数
    });
    let newUrl = 'https://szjw-bss-api.yunniao.cn/'
    if (urls.includes('m1')) {
      newUrl = 'https://szjw-bss-api-m1.yunniao.cn/'
    }
    let contractId = options.id;
    let contract = options.contract;
    this.setData({
      linkUrl: newUrl + 'qiyuesuo_js_sdk/?id=' + contractId + '&&contact=' + contract
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