// pages/myOrderSuccess/myOrderSuccess.js
var app = getApp()
var urls = app.globalData.url
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    hasCard: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.hasCards()
  },

  hasCards() {
    let that = this;
    network.requestLoading('api/driver/driver/income/checkDriverCardInformation', {
      orderId: that.data.id
    },
      'POST',
      '',
      'json',
      function (res) {
        if (res.success) {
          let data = res.data[0].cardNumber
          that.setData({
            hasCard: data
          })
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  goIndex: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  goChangeBankCard(e) {
    wx.navigateTo({
      url: '../bankCard/bankCard?id=' + this.data.id
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

  }
})