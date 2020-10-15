// pages/persenolInfo/persenolInfo.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人信息' //页面标题为路由参数
    });
    let that = this;
    network.requestLoading('81/driver/v2/driver/applet/clue/getSettledInInfo', {},
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          // res.data.buyCarFollow = res.data.buyCarFollow.replace(',', '')
          let detail = res.data;
          for (let key in detail) {
            if (detail[key] === null) {
              detail[key] = ''
            }
          }
          that.setData({
            detail: detail
          })
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
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
    let userId = wx.getStorageSync('userId')
    return {
      title: '货源稳定，线路优质，随时上岗，保收入10万+/年',
      path: '/pages/index/index?puserId=' + userId + '&source=2',
      imageUrl: '../../lib/image/shareImg.jpg',
      success: function (res) {
        // 转发成功
      },
    }
  }
})