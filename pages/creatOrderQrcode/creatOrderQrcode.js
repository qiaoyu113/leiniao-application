var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    price: '',
    checkName: '',
    checkType: '',
    qrcode: '',
    loadText: '正在生成二维码',
    loadModal: false,
    name_first: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '加盟付款码' //页面标题为路由参数
    });
    let that = this;
    let checkName = ''
    if (options.checkIndex == '1') {
      checkName = '意向金'
    }
    else if (options.checkIndex == '2') {
      checkName = '全款'
    }
    that.setData({
      name: options.name,
      name_first: options.name.substr(0, 1),
      price: options.price,
      checkType: options.checkIndex,
      checkName: checkName,
    })
    that.creatQrcode()
  },

  creatQrcode() {
    let that = this;
    let COpenId = wx.getStorageSync('openId')
    if (that.data.name && that.data.price && that.data.checkType && COpenId) {
      network.requestLoading('25/core/v2/core/wx/createWxAQrCode', {
        "path": 'pages/scanOrder/scanOrder?name=' + that.data.name + '&price=' + that.data.price + '&checkType=' + that.data.checkType + '&COpenId=' + COpenId,
          "width": 430
        },
        'get',
        '',
        '',
        function(res) {
          if (res.success) {
            let qrcode = res.data
            wx.getImageInfo({
              src: qrcode,
              success: function(sres) {
                that.setData({
                  qrcode: sres.path
                })
              }
            })
          }
        })
    } else {
      that.setData({
        loadText: '生成失败，请重新创建订单'
      })
    }
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