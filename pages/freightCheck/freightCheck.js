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
    list: [],
    date: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '运费确认' //页面标题为路由参数
    });
    let date = options.date;
    this.setData({
      date: date
    })
    this.getDetail(date);

    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    // var scene = decodeURIComponent(options.scene)
    // var query = options.query.dentistId // 3736
  },

  getDetail(date) {
    let that = this;
    let stringTime = date + " 00:00:00";
    let timestamp2 = new Date(stringTime.replace(/-/g, "/")).getTime();
    network.requestLoading('api/dispatch/driver/dispatch/xcx/get_confirm_record', {
        runningDate: timestamp2
      },
      'post',
      '',
      'json',
      function(res) {
        if (res.success) {
          let arr = res.data.runningLineInfoVOList;
          arr.forEach((i) => {
            i.checked = true
          })
          that.setData({
            list: arr,
          });
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
      ['list[' + i + '].predictCost']: val,
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
          confirmedCost: 0,
          deliveryId: i.deliveryId,
          workable: false,
        })
      })
      that.submitCheckOperation(arrAdd,0)
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
        totalPrice = totalPrice + Number(i.predictCost)
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
        confirmedCost: i.predictCost,
        deliveryId: i.deliveryId,
        workable: i.checked,
      })
    })
    // if(Number(total)){
      Dialog.confirm({
        title: '请确认',
        message: that.data.date + '的运费总金额是:¥' + total,
      }).then(() => {
        that.submitCheckOperation(arrAdd,1)
      }).catch(() => {
        // on cancel
      });
    // } else {
    //   Notify({
    //     text: '确认运费金额不能小于0',
    //     duration: 1000,
    //     selector: '#van-notify',
    //     background: '#fac844'
    //   });
    // }
  },

  // 提价出车
  submitCheckOperation(arrAdd,type){
    let that = this;
    network.requestLoading('api/dispatch/driver/dispatch/xcx/confirm_record', 
    arrAdd,
      'post',
      '',
      'json',
      function(res) {
        if (res.data) {
          if(type){
            Notify({ type: 'success', text: that.data.date + '的运费已提交' });
            setTimeout(() => {
              wx.navigateBack({ changed: true });
            },1000)
          } else {
            Notify({ type: 'success', text: '今日运费已提交' });
            setTimeout(() => {
              wx.navigateBack({ changed: true });
            },1000)
          }
        } else {
          Notify({ type: 'danger', text: res.errorMsg });
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