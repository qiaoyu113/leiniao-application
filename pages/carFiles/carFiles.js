// pages/carFiles/carFiles.js
const { requestLoading } = require('../../utils/network')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carData: {},
    carPassCard:true,
    carBoard:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用车辆档案接口
    this.getCarFilesInfo(options.carId,options.rentorsale)
  },

  getCarFilesInfo(idnum,type) {
    var that = this
    requestLoading(
      'api/car_center/v1/cargo/getCarInfoByCarId',
      {carId:idnum,
        searchType:type==='rent'?1:2
      },
      'POST',
      '',
      'json',
      function (res) {
        console.log('请求接口res', res)
        if (res.success) {
        }
        let carInfo = res.data
        //过滤整理车辆信息
        //that.carInfofilter(carInfo)
        that.setData({
          carData:carInfo,
        })
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )

    // this.setData({
    //   carData: {
    //     baseData: {
    //       carNumber: 'CL202012121356',
    //       carBrand: '福田',
    //       carType: '4.2米箱货',
    //       carModel: '油车',
    //       carProperty: '营运',
    //       carAge: '2年',
    //       carKm: '3万公里',
    //       carWidth: '2.2米',
    //       carPassCard: true,
    //       carBoard: true,
    //       carWatchPlace: '北京',
    //     },
    //     plateData: {
    //       carFirstDate: '2020-12-12',
    //       carPlatePlace: '北京',
    //     },
    //     engineData: {
    //       engineId: 'BJ5073XXYEV1',
    //       horsePower: '300匹',
    //     },
    //     insuranceData: {
    //       number: '50万',
    //     },
    //   },
    // })
  },

  //复制
  copyText: function (e) {
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
  //过滤器
  // carInfofilter(carInfo){
  //   console.log('carInfo',carInfo)
  //   if(carInfo.carLabelSet.includes('尾板')){
  //     this.setData({
  //       carPassCard:true
  //     })
  //   }else{
  //     this.setData({
  //       carPassCard:false
  //     })
  //   }
  //   if(carInfo.carLabelSet.includes('通行证')){
  //     this.setData({
  //       carBoard:true
  //     })
  //   }else{
  //     this.setData({
  //       carBoard:false
  //     })
  //     }
  // },
   //返回上一页
   handlerGobackClick() {
    wx.navigateBack()
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
