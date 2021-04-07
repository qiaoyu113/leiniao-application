// pages/carFiles/carFiles.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carData: {
      baseData: {
        carNumber: 'CL202012121356',
        carBrand: '福田',
        carType: '4.2米箱货',
        carModel: '油车',
        carProperty: '营运',
        carAge: '2年',
        carKm: '3万公里',
        carWidth: '2.2米',
        carPassCard: true,
        carBoard: true,
        carWatchPlace: '北京',
      },
      plateData: {
        carFirstDate: '2020-12-12',
        carPlatePlace: '北京',
      },
      engineData: {
        engineId: 'BJ5073XXYEV1',
        horsePower: '300匹',
      },
      insuranceData: {
        number: '50万',
      },
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('carId', options.carId)
    //调用车辆档案接口
    this.getCarFilesInfo(options.carId)
  },

  getCarFilesInfo(idnum) {},

  //复制
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
            })
          },
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
})
