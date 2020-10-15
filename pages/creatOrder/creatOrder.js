// pages/creatOrder/creatOrder.js
const app = getApp();
var network = require("../../utils/network.js");
const db = wx.cloud.database()
const _material = db.collection('material_creatOrder')
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    nametype: false,
    price: '',
    pricetype: false,
    materialList: [],
    checkIndex: 1,
    loadModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: '创建缴费码' //页面标题为路由参数
    });
    _material.where({}).get({
      success: function(res) {
        that.setData({
          materialList: res.data
        })
      }
    })
  },

  checkBtn(e) {
    let that = this;
    that.setData({
      checkIndex: e.currentTarget.dataset.index
    })
  },

  inputName: function(e) {
    let that = this;
    let name = e.detail.value;
    let types = false;
    if (name != '') {
      types = true;
    }
    that.setData({
      name: name,
      nametype: types
    })
  },

  inputPrice: function(e) {
    let that = this;
    let value = e.detail.value;
    let types = false;
    if (value != '') {
      types = true;
    }
    that.setData({
      price: value,
      pricetype: types
    })
  },

  submitBtn() {
    let that = this;
    that.setData({
      loadModal: true
    })
    wx.navigateTo({
      url: '/pages/creatOrderQrcode/creatOrderQrcode?name=' + that.data.name + '&price=' + that.data.price + '&checkIndex=' + that.data.checkIndex
    });
    that.setData({
      loadModal: false
    })
    // network.requestLoading('api/driver/driver/clue/settledIn', {
    //     "name": that.data.name,
    //     "price": that.data.price,
    //     "checkIndex": that.data.checkIndex,
    //     "payType": '1'
    //   },
    //   'POST',
    //   '',
    //   'json',
    //   function(res) {
    //     if (res.success) {
    //       if (res.data.code == 200) {
    //         wx.navigateTo({
    //           url: '/pages/creatOrderQrcode/creatOrderQrcode?name=' + that.data.name + '&price=' + that.data.price + '&checkIndex=' + that.data.checkIndex
    //         });
    //       } else {
    //         Notify({
    //           text: res.data.msg,
    //           duration: 1000,
    //           selector: '#van-notify',
    //           backgroundColor: '#FAC844'
    //         });
    //         return false;
    //       }
    //     } else {
    //       Notify({
    //         text: res.errorMsg,
    //         duration: 1000,
    //         selector: '#van-notify',
    //         backgroundColor: '#FAC844'
    //       });
    //       return false;
    //     }
    //   },
    //   function(res) {
    //     wx.showToast({
    //       title: '加载数据失败',
    //     });
    //   });
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