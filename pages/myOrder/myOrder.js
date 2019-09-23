// pages/checkPayment/checkPayment.js
var app = getApp();
var network = require("../../utils/network.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkPaymentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的订单' //页面标题为路由参数
    });
    this.getLoad();
  },

  getLoad() {
    let that = this;
    network.requestLoading('api/bss/v1/magpie/order/selectListByPhone',
      {
        "limit": 100,
        "page": 1
      },
      'post',
      '',
      'json',
      function (res) {
        if (res.success) {
          let arrs = res.data
          let types = []
          for (var i = 0; i < arrs.length; i++) {
            types.push(arrs[i].orderId)
          }
          that.setData({
            checkPaymentList: arrs
          })
          network.requestLoading('api/product/product/getCooperationModeByOrderId',
            types,
            'post',
            '',
            'json',
            function (res) {
              if (res.success) {
                that.setData({
                  typeList: res.data
                })
              }
            },
            function (res) {
              wx.showToast({
                title: '加载数据失败',
              });
            });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  goChangeBankCard(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../bankCard/bankCard?id=' + id
    });
  },

  goPay(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../myOrderDetail/myOrderDetail?id=' + id + '&type=2'
    });
  },

  goRefund(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../myOrderRefund/myOrderRefund?id=' + id
    });
  },

  goRefundDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../myOrderRefundDetail/myOrderRefundDetail?id=' + id
    });
  },

  goDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../myOrderDetail/myOrderDetail?id=' + id + '&type=1'
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
    this.getLoad();
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