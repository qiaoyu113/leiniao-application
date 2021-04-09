const app = getApp()
const util = require('../../utils/storage.js')
// pages/hotList/hotList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carLists: [],
    carList: [
      {
        title: '福田欧曼GTL载货车福田欧曼G1111111111111111111111',
        age: '2个月',
        km: '7万公里',
        feature: [
          { name: '准新车', type: 1 },
          { name: '急租', type: 1 },
          { name: '有尾板', type: 0 },
          { name: '有通行证', type: 0 },
        ],
        recommendReason:
          '准新车，车况良好，无任何隐患，不限行，火热降价急租中,准新车，车况良好，无任何隐患，不限行，火热降价急租中',
        type: 1,
        picurl: '',
        price: 3000,
        id: 1,
        rentout: 0,
      },
      {
        title: '福田欧曼GTL载货车福田欧曼G',
        age: '2个月',
        km: '7万公里',
        feature: [
          { name: '有尾板', type: 0 },
          { name: '有通行证', type: 0 },
        ],
        recommendReason:
          '准新车，车况良好，无任何隐患，不限行，火热降价处理，市场需求度高，前景好！',
        type: 1,
        picurl: '',
        price: 4000,
        id: 2,
        rentout: 1,
      },
      {
        title: '福田欧曼GTL载货车福田欧曼G1111111111111111111111',
        age: '2个月',
        km: '7万公里',
        feature: [
          { name: '准新车', type: 1 },
          { name: '急租', type: 1 },
          { name: '有尾板', type: 0 },
          { name: '有通行证', type: 0 },
        ],
        recommendReason:
          '准新车，车况良好，无任何隐患，不限行，火热降价急租中,准新车，车况良好，无任何隐患，不限行，火热降价急租中',
        type: 1,
        picurl: '',
        price: 3000,
        id: 3,
        rentout: 0,
      },
    ],
    showCommend: true,
    rentOrSale: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.type === 'rent') {
      this.setData({
        rentOrSale: 'rent',
      })
    } else {
      this.setData({
        rentOrSale: 'sale',
      })
    }

    if (options.listid === '1') {
      this.setData({
        showCommend: true,
      })
      wx.setNavigationBarTitle({
        title: '超值爆款',
      })
      this.checkHandle(1)
    } else {
      this.setData({
        showCommend: false,
      })
      wx.setNavigationBarTitle({
        title: '今日上新',
      })
      this.checkHandle(0)
    }
  },
  //storage过期重新获取数据，不过期展示本地数据
  checkHandle(e) {
    if (!wx.getStorageSync('carlist')) {
      this.getNewList(e)
    } else {
      //如果过期重新调用接口获取列表
      if (!util.get('carlist')) {
        console.log('过期了，重新调用接口')
        this.getNewList(e)
      } else {
        let newdata = util.get('carlist')
        // this.setData({
        //   carList: newdata,
        // })
      }
    }
  },
  //storage过期调用接口获取列表数据
  getNewList(e) {
    this.getCarList(e).then((res) => {
      console.log(res)
      util.put('carlist', res, 20)
      // this.setData({
      //   carList: res,
      // })
    })
  },
  //跳转车辆详情页
  gotoCarDetail(e) {
    console.log(this)
    var carId = e.currentTarget.dataset['index']
    //判断是否租出或者售出
    var ifRendOut = this.data.carList.findIndex((item) => {
      if (item.id === carId) {
        return item.rentout
      }
    })
    if (ifRendOut !== 1) {
      //判断用户是否登录
      wx.getSetting({
        success: (res) => {
          console.log(res)
          wx.navigateTo({
            url: `/pages/carDetail/carDetail?carId=${carId}&type=${this.data.rentOrSale}`,
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '请先登录',
          })
        },
      })
    }
  },

  //加载车辆列表
  getCarList(e) {
    return new Promise((resolve, reject) => {
      if (e === 1) {
        //调用超值爆款列表接口
        resolve('我是超值爆款carlist')
      } else {
        //调用今日上新接口
        resolve('我是今日上新carlist')
      }
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
