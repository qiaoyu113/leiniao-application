// pages/payDeposit/payDeposit.js
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    driverId: '',
    icon: 'icon-round',
    trigger: true,
    money: 4000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '梧桐会员' //页面标题为路由参数
    });
    this.data.driverId = wx.getStorageSync('driverId') || '';
  },
  // 切换class
  triggerIcon(){
    let icon = this.data.icon;
    if(icon === 'icon-roundcheck'){
      icon = 'icon-round'
    }else{
      icon = 'icon-roundcheck'
    }
    this.setData({
      icon: icon
    })
  },
  // 切换选中状态
  triggerClass(){
    this.setData({
      trigger: !this.data.trigger
    })
  },
  goAgreement(){
    wx.navigateTo({
      url: '../contractText/contractText'
    });
  },
  goVip(){
    wx.navigateTo({
      url: `../vipExplain/vipExplain?driverId=${this.data.driverId}`
    })
  },
  payOrder(){
    const {icon, trigger} = this.data;
    if(!trigger){
      Notify({
        text: '请选择商品',
        duration: 2000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return;
    }
    if(icon !== 'icon-roundcheck'){
      // 需要勾选
      Notify({
        text: '请勾选协议',
        duration: 2000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return;
    }
    let that = this;
    wx.showLoading({
      title: '加载数据...',
    });
    network.requestLoading('api/business_center/v1/order/xcxCreateNewOrder', 
      {
        // busiType：这个是业务类型（0：专车，1：共享），目前默认是共享，传：1
        // capacityQuota：这个是运力配额（默认是1），传：1
        // rake：这个是抽佣比例，默认是7%，传：7
        // cooperationModel：这个是合作模式，默认带车。传：3
        // cooperationTime：合作期限，默认3个月，传3
        "busiType": 1,
        "capacityQuota": 1,
        "cooperationModel": 3,
        "cooperationTime": 3,
        "goodsAmount": this.data.money,
        "rake": 7
      },
      'post',
      '',
      'json',
      function (res) {
        wx.hideLoading();
        if (res.success) {
          let respond = res.data;
          // 如果没有司机Id 则获取司机Id(创建订单成功后会自动生成driverId)
          if(!that.data.driverId){
            that.getDriverId();
          }else{
            wx.navigateTo({
              url: '../myOrderList/myOrderList'
            })
          }
        }else{
          Notify({
            text: res.errorMsg || '加载数据失败',
            duration: 2000,
            selector: '#van-notify',
            backgroundColor: '#FAC844'
          });
        }
      },
      function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },
  getDriverId:function() {
    let that = this;
    //获取driverId
    network.requestLoading('api/business_center/v1/order/getDriverId', {
    },
    'GET',
    '',
    '',
    function(res) {
      if (res.success) {
        that.data.driverId = res.data;
        wx.setStorageSync('driverId', res.data);
        wx.navigateTo({
          url: '../myOrderList/myOrderList'
        });
      }
    },
    function(res) {
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