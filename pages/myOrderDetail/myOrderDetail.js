// pages/myOrderDetail/myOrderDetail.js
var app = getApp();
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    id: '',
    detail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type,
      id: options.id
    })
    wx.setNavigationBarTitle({
      title: '订单详情' //页面标题为路由参数
    });
    this.getDetail()
  },

  getDetail() {
    let that = this;
    network.requestLoading('api/order/v1/magpie/order/orderDetail', {
        orderId: that.data.id
      },
      'get',
      '',
      '',
      function(res) {
        if (res.success) {
          that.setData({
            detail: res.data
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  goRefund: function() {
    let id = this.data.id;
    wx.navigateTo({
      url: '../myOrderRefund/myOrderRefund?id=' + id
    });
  },

  payOrder() {
    let id = this.data.id;
    let that = this;
    network.requestLoading('api/order/v1/magpie/order/wxPayUnifiedOrder', {
      orderId: that.data.id,
      payMoney: that.data.detail.managementFeeFirst
    },
      'post',
      '',
      'json',
      function (res) {
        if (res.success) {
          let respond = res.data
          wx.requestPayment(
            {
              'timeStamp': respond.timeStamp,
              'nonceStr': respond.nonceStr,
              'package': respond.packageValue,
              'signType': respond.signType,
              'paySign': respond.paySign,
              'success': function (res) {
                that.upData(true,'') 
              },
              'fail': function (res) {
                that.upData(false, res.errMsg) 
               },
              'complete': function (res) { }
            })
        } else {
          Notify({
            text: '请填写完整信息',
            duration: 1000,
            selector: '#van-notify',
            backgroundColor: '#FAC844'
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  upData(type,msg) {
    let that = this;
    network.requestLoading('api/order/v1/magpie/order/updateOrderPayStatus', {
      "failMsg": msg,
      "flag": type,
      "orderId": that.data.id,
      "payType": 2
    },
      'post',
      '',
      'json',
      function (res) {
        if (res.success) {
          if(type){
            wx.navigateTo({
              url: '../myOrderSuccess/myOrderSuccess?id=' + that.data.id
            });
          }
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getDetail()
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