// pages/carDetail/carDetail.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    carData: {
      tips: ['准新车', '急租'],
      title: '福田欧马可S3超级卡车福田欧马可S3超级卡车福田欧马可S3超级卡车',
      price: '3000',
      type: ['宽体', '有尾板', '有通行证'],
      md: {
        age: 2,
        km: 7,
        width: 2.3,
        photo_address: '北京',
        watch_address: '北京',
        type: '营运',
      },
      detail:
        '车主转业，车辆刚刚闲置，车况良好，现车主降价出手，车辆八成新，无任何隐患;车主专业，车辆刚刚闲置，车况良好，现车主降价出手，车辆八成新，无任何隐患。',
    },
    showPriceIntroduce: false,
    showHotIntroduce: true,
    askPrice: false,
    nameReg: false,
    phoneReg: false,
    nameValue: '',
    phoneValue: '',
    introduceData: '季租、半年租、年租的月租不同，详情咨询车辆顾问。',
    hotDetail:
      '准新车，车况良好，无任何安全隐患，不限行，火热降价处理，市场需求度高，前景好！',
    carId: '',
    rentOrSale: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('option', options)
    this.setData({
      carId: options.carId,
      rentOrSale: options.type,
    })
  },

  //返回上一页
  gobackEvent() {
    let page = getCurrentPages()
    console.log('page', page)

    console.log('返回上一页')
    wx.navigateBack()
  },

  //点击说明按钮，弹出说明框
  showIntroduceEvent() {
    this.setData({
      showPriceIntroduce: true,
    })
  },
  //关闭弹出层事件
  onClose() {
    this.setData({
      showPriceIntroduce: false,
      askPrice: false,
    })
  },

  //查看全部车辆档案
  viewAllEvent() {
    wx.navigateTo({
      url: `/pages/carFiles/carFiles?carId=${this.data.carId}`,
    })
  },
  //询底价
  askPriceEvent() {
    this.setData({
      askPrice: true,
    })
  },
  //询底价校验名字
  checknameEvent(e) {
    if (
      !/^[\u4e00-\u9fa5]{1,20}$|^[\dA-Za-z_]{1,20}$/.test(e.detail.value) &&
      e.detail.value
    ) {
      this.setData({
        nameReg: true,
      })
    } else {
      this.setData({
        nameReg: false,
      })
    }
  },
  //询底价校验手机号
  checkphoneEvent(e) {
    if (
      !/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(
        e.detail.value
      ) &&
      e.detail.value
    ) {
      this.setData({
        phoneReg: true,
      })
    } else {
      this.setData({
        phoneReg: false,
      })
    }
  },
  //双向绑定输入框
  inputEvent(e) {
    let inputType = e.currentTarget.dataset['index']
    let value = e.detail.value
    console.log('inputType', inputType)
    if (inputType === 'phone') {
      this.setData({
        phoneValue: value,
      })
    } else {
      this.setData({
        nameValue: value,
      })
    }
  },
  //获取底价
  getLowPriceEvent() {
    let { nameReg, phoneReg, phoneValue, nameValue } = this.data
    //未填写称呼时
    if (!nameReg && !phoneReg) {
      console.log('phoneValue', phoneValue)
      if (phoneValue) {
        //调用获取底价接口
        console.log('校验通过，获取底价')
      } else {
        wx.showModal({
          title: '请正确填写电话',
        })
      }
    } else {
      if (nameReg) {
        wx.showModal({
          title: '请正确填写姓名',
        })
      } else {
        wx.showModal({
          title: '请正确填写电话',
        })
      }
    }
  },
  //分享好友
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log('来自页面内转发按钮')
      console.log(res.target)
    } else {
      console.log('来自右上角转发菜单')
    }
    return {
      title: '福田欧马可',
      path: '/pages/carDetail/carDetail',
      imageUrl: '/lib/image/rentcarimg/car.png',
      success: (res) => {
        console.log('转发成功', res)
      },
      fail: (res) => {
        console.log('转发失败', res)
      },
    }
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
