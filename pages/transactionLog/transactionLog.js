// pages/transactionLog/transactionLog.js
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '交易记录' //页面标题为路由参数
    });
  },

  getData() {
    let that = this;
    network.requestLoading('api/order/v1/magpie/order/paymentDetailsInquiry', {},
      'get',
      '',
      '',
      function(res) {
        if (res.success) {
          that.setData({
            list: res.data
          })
        } 
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
        that.checkPhone()
      });
  },

  goRefund(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../myOrderRefund/myOrderRefund?id=' + id + '&type=1'
    });
  },

  goRefundDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../myOrderRefundDetail/myOrderRefundDetail?id=' + id + '&type=1'
    });
  },

  goFeedBack(e) {
    wx.navigateTo({
      url: '../question/question?type=1'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})