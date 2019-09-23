// pages/myOrderRefundDetail/myOrderRefundDetail.js
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
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    wx.setNavigationBarTitle({
      title: '退款详情' //页面标题为路由参数
    });
    this.getDetail()
  },

  getDetail() {
    let that = this;
    network.requestLoading('api/order/v1/magpie/order/orderRefundProgress', {
      orderId: that.data.id
    },
      'get',
      '',
      '',
      function (res) {
        if (res.success) {
          let data = res.data
          that.setData({
            detail: data
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

  }
})