// pages/freightCheck/freightCheck.js
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
var common = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2020-03-10',
    totalPrice: 0,
    checked: true,
    list: [{
        checked: true,
        lineName: '阿斯顿飞机哦奥神队飞机哦i啊就是东方i家傲娇阿斯顿发阿斯顿发阿斯顿发',
        id: 1,
        price: 100
      },
      {
        checked: false,
        lineName: '阿斯顿飞机哦奥神队飞机哦i啊就是东方i家傲娇阿斯顿发而为 阿斯顿发阿斯顿发',
        id: 2,
        price: 200
      }
    ],
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '运费确认' //页面标题为路由参数
    });
    let id = options.id;
    this.setData({
      id: id
    })
    this.getDetail(id);
  },

  getDetail(id) {
    let that = this;
    network.requestLoading('api/base/base/dict/qryDictByType', {
        dictType: 'online_city'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          // let arr = res.data.list;
          // that.setData({
          //   orderList: arr,
          // });
          that.totalCalcPrice();
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  // 输入金额
  inputName: function (e) {
    let that = this;
    let val = e.detail.value;
    let i = e.currentTarget.dataset.i;
    that.setData({
      ['list[' + i + '].price']: val,
    });
    that.totalCalcPrice()
  },

  /**
   * 切换开关
   */
  onChange({
    detail
  }) {
    // 需要手动对 checked 状态进行更新
    let that = this;
    that.setData({
      ['list[' + detail.index + '].checked']: detail.value,
    });
    that.totalCalcPrice()
  },

  // 无出车
  noFreight() {
    let that = this;
    Dialog.confirm({
      title: '提示',
      message: '确定全部线路未出车吗？',
    }).then(() => {
      let arr = that.data.list;
      let arrAdd = []
      arr.forEach((i) => {
        arrAdd.push({
          price: i.price,
          id: i.id
        })
      })
      console.log(arrAdd)
    }).catch(() => {
      // on cancel
    });
  },

  totalCalcPrice() {
    let that = this;
    let arr = that.data.list;
    let totalPrice = 0;
    arr.forEach((i) => {
      if (i.checked) {
        totalPrice = totalPrice + Number(i.price)
      }
    })
    that.setData({
      totalPrice: totalPrice
    });
  },

  yesFreight(){
    let that = this;
    let arr = that.data.list;
    let total = that.data.totalPrice;
    let arrAdd = []
    arr.forEach((i) => {
      arrAdd.push({
        price: i.price,
        id: i.id
      })
    })
    if(Number(total)){
      Dialog.confirm({
        title: '提示',
        message: '确定:' + that.data.date + '的运费金额是:¥' + total,
      }).then(() => {
        Notify({ type: 'success', text: that.data.date + '的运费已提交' });
        wx.navigateBack({ changed: true });
      }).catch(() => {
        // on cancel
      });
    } else {
      Notify({
        text: '确认运费金额不能小于0',
        duration: 1000,
        selector: '#van-notify',
        background: '#fac844'
      });
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