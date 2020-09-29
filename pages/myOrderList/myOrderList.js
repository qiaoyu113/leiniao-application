// pages/myOrderList/myOrderList.js
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page ({
  /**
   * 页面的初始数据
   */
  data: {
    driverId: '',
    lineLeft: 0,
    active: '2',
    tabIndex: 0,
    tabList: [
      {
        tabTit: '待支付',
        value: '2'
      },
      {
        tabTit: '已完成',
        value: '3'
      },
      {
        tabTit: '退款/售后',
        value: '4'
      },
      {
        tabTit: '已取消',
        value: '1'
      }
    ],
    list: [],
    stateList: {
      '5': {
        name: '待支付',
        color: 'color1'
      },
      '10': {
        name: '已取消',
        color: 'color3'
      },
      '15': {
        name: '待成交',
        color: 'color1'
      },
      '20': {
        name: '待成交',
        color: 'color1'
      },
      '25': {
        name: '待成交',
        color: 'color1'
      },
      '30': {
        name: '已成交',
        color: 'color2'
      },
      '35': {
        name: '待退款',
        color: 'color1'
      },
      '40': {
        name: '已退款',
        color: 'color3'
      }
    }
  },
  /**
   * tab 切换
   */
  onChange (event) {
    const {val, index} = event.target.dataset;
    if (this.data.active !== val) {
      this.setData ({
        active: val,
        tabIndex: index
      });
      this.setLineLeft();
      this.getList();
    }
  },
  /**
   * 动态设置line 位置
   */
  setLineLeft () {
    var elWidth = 0;
    var query = wx.createSelectorQuery ();
    var windowWidth = wx.getSystemInfoSync ().windowWidth; // 屏幕宽度
    //选择id
    query.select ('.tabLine').boundingClientRect ();
    query.exec (res => {
      //取高度
      elWidth = res[0].width;
      // 设置line距离
      const itemWidth = windowWidth / this.data.tabList.length;
      const tabIndex = this.data.tabIndex;
      const left = itemWidth * tabIndex + (itemWidth - elWidth) / 2
      this.setData ({
        lineLeft: left + 'px',
      });
    });
  },
  /**
   * 获取订单列表
   */
  getList(){
    const operateFlag = this.data.active;
    const that = this;
    wx.showLoading({
      title: '加载数据...',
    });
    network.requestLoading('api/business_center/v1/order/xcxGetOrderList', 
      {
        driverId: this.data.driverId,
        operateFlag
      },
      'GET',
      '',
      '',
      function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.success) {
          const list = res.data;
          that.setData({
            list
          });
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
        wx.stopPullDownRefresh();
        wx.hideLoading();
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },
  /**
   * 获取客服电话
   */
  getPhone(){
    network.requestLoading('81/v2/driver/getGmInfoByUserId', 
      {},
      'GET',
      '',
      '',
      function (result) {
        if (result.success) {
          wx.showModal({
            title: '',
            content: '订单已完成，联系工作人员完善合同信息吧！',
            confirmText: '客服电话', //	string	'取消'	否	取消按钮的文字，最多 4 个字符
            confirmColor: '#FDB82D',
            cancelText: '不用了', //	string	'确定'	否	确认按钮的文字，最多 4 个字符
            cancelColor: '#aaa',
            success(res) {
              if (res.confirm) {
                if(result.data && result.data.mobile){
                  wx.makePhoneCall({
                    phoneNumber: result.data.mobile,
                  })
                }
              } else if (res.cancel) {
              }
            }
          })
        }else{
          Notify({
            text: result.errorMsg || '加载数据失败',
            duration: 2000,
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
  /**
   * 支付
   */
  payOrder(event){
    wx.showLoading({
      title: '加载数据...',
    });
    const that = this;
    const {pay, item, parindex, childindex} = event.target.dataset;
    const openId = wx.getStorageSync('openId')
    network.requestLoading('api/bill/v1/wechat/pay/assemblyPayParam', 
      {
        body: "购买梧桐云雀会员",
        busiType: item.busiType,
        openId,
        outTradeNo: pay.outTradeNo,
        orderId: item.orderId,
        // payMoney: 0.01
        payMoney: pay.money
      },
      'POST',
      '',
      'json',
      function (res) {
        wx.hideLoading();
        if (res.success) {
          let respond = res.data;
          wx.requestPayment({
            'timeStamp': respond.timeStamp,
            'nonceStr': respond.nonceStr,
            'package': respond.packageValue,
            'signType': respond.signType,
            'paySign': respond.paySign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功',
              });
              // 设置状态为支付成功
              const key = `list[`+parindex+`].orderPayRecordInfoVOList[`+childindex+`].status`
              that.setData({
                [key]: 3
              }, ()=>{
                // 判断是否全部已经支付完成
                const orderPayList = that.data.list[parindex].orderPayRecordInfoVOList;
                let flag = orderPayList.every(items=>{
                  return items.status === 3
                })
                if(flag){
                  that.setData ({
                    active: '3',
                    tabIndex: 1
                  });
                  that.setLineLeft();
                  that.getList();
                  that.getPhone();
                }
              })
            },
            'fail': function (res) {
              wx.showToast({
                title: '支付失败',
              });
            },
            'complete': function (res) { }
          })
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
  /**
   * 再次购买
   */
  goPay(){
    wx.navigateTo({
      url: '../payDeposit/payDeposit'
    });
  },
  /**
   * 电子合同
   */
  goContract(event){
    const { id, status } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../contractList/contractList?id=${id}&status=${status}`
    });
  },
  /**
   * 订单详情
   */
  goDetail(event){
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../orderDetail/orderDetail?orderId=${id}`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的订单' //页面标题为路由参数
    });
    this.data.driverId = wx.getStorageSync('driverId') || '';
    this.setLineLeft();
    // this.getList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
