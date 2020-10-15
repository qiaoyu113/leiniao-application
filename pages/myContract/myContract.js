// pages/myContract/myContract.js
var network = require("../../utils/network.js");

Page ({
  /**
   * 页面的初始数据
   */
  data: {
    listArr: [],
    mobile: '',
    showModal: false,
    itemData: null,
    id: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle ({
      title: '我的合同', //页面标题为路由参数
    });
    this.getManagerPhone ();
  },
  onMyEvent: function (e) {
    // 自定义组件触发事件时提供的detail对象
    if (e.detail.open) {
      this.setData({
        showModal: true,
        itemData: e.detail.params
      })
    }
  },
  // 请求列表接口
  getContractList() {
    var driverId = wx.getStorageSync('driverId')
    if (!driverId) {
      // return wx.showToast({
      //   title: "司机id不存在",
      //   icon: 'none'
      // })
    }
    var that = this;
    let params = {
      driverId
    }
    // 113/business_center/v2/contract/contractList
    network.requestLoading('113/business_center/v2/contract/contractList', params,
      'GET',
      '数据加载中...',
      '',
      function (res) {
        if (res.success) {
          that.setData({
            listArr: res.data
          })
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },
  // 获取客服手机号
  getManagerPhone () {
    var that = this;
    var cityName = wx.getStorageSync('cityCode')
    network.requestLoading (
      '81/driver/v2/driver/applet/getGmInfoByUserId',
      {
        cityName
      },
      'GET',
      '数据加载中...',
      '',
      function (res) {
        if (res.success) {
          if (res.data && res.data.mobile) {
            that.setData ({
              mobile: String (res.data.mobile),
            });
          }
        }
      },
      function (res) {
        wx.showToast ({
          title: '加载数据失败',
        });
      }
    );
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {},

  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  onCancel: function () {
    this.hideModal();
  },
  onConfirm: function () {
    let that = this;
    this.hideModal();
    wx.showToast({
      title: '合同正在配置中～请稍等',
      icon: 'none',
      duration: 500
    })
    setTimeout(() => {
      wx.navigateTo({
        url: `../agreement/agreement?contractName=${that.data.itemData.subject}&id=${that.data.itemData.contractId}&contract=${that.data.itemData.driverInfoBusiVO.phone}`,
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {},
      })
    }, 500)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(111);
    this.getContractList()
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
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
