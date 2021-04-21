// pages/carDetail/carDetail.js
const app = getApp()
const { requestLoading } = require('../../utils/network')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    carData: {},
    showPriceIntroduce: false,
    showHotIntroduce: true,
    askPrice: false,
    nameReg: false,
    phoneReg: false,
    nameValue: '',
    phoneValue: '',
    hotDetail:
      '准新车，车况良好，无任何安全隐患，不限行，火热降价处理，市场需求度高，前景好！',
    carId: '',
    rentOrSale: '',
    swiperList: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      carId: options.carId,
      rentOrSale: options.type
    })
    console.log('options',options)
    if(options.isshare){
      this.setData({
        isshare:'1'
      })
    }
  },
  //调用接口，获取车辆详情
  getCarInfo() {
    var that = this
    requestLoading(
      'api/car_center/v1/cargo/getCarInfoByCarId',
      {carId:this.data.carId,
        searchType:this.data.rentOrSale==='rent'?1:2
      },
      'POST',
      '',
      'json',
      function (res) {
        console.log('请求接口res', res)
        if (res.success) {
          let carInfo = res.data
          carInfo.carDescribe = carInfo.carDescribe.trim()
        if(carInfo.isVogue){
          that.setData({
            carData:carInfo,
            showHotIntroduce:true
          })
        }else{
          that.setData({
            carData:carInfo,
            showHotIntroduce:false
          })
        }
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )
  },
  //返回上一页
  gobackEvent() {
    let page = getCurrentPages()
    console.log('page', page)

    console.log('返回上一页')
    if(this.data.isshare){
      wx.switchTab({
        url: '/pages/rentedCar/rentedCar'
      })
    }else{
      wx.navigateBack()
    }
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
      url: `/pages/carFiles/carFiles?carId=${this.data.carId}&rentorsale=${this.data.rentOrSale}`,
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
      !/^[1][3-9][0-9]{9}$/.test(
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
        let info = {
          carId:this.data.carId,
          inquiryName:nameValue,
          inquiryPhone:phoneValue,
          searchCityId:app.globalData.locationCity.cityCode,
          searchType:this.data.rentOrSale==='rent'?1:2
        }
        this.carInquiry(info)
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
  //调用询底价接口
  carInquiry(info){
    var that = this
    requestLoading(
      'api/car/v1/car/cargo/carInquiry',
      info,
      'POST',
      '',
      'json',
      function (res) {
        console.log('请求询价接口res', res)
        if (res.success) {
          that.setData({
            nameValue:''
          })
        }else{
          wx.showModal({
            title: res.errorMsg,
          })
        }
        wx.showToast({
          title: '询价成功',
        })
        that.onClose()
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )
  },
  //收藏
  collectCarEvent(e) {
    let collectid = e.currentTarget.dataset['index']
    console.log(collectid)
    if (collectid == 0) {
      wx.showLoading({
        title: '加载中',
      })
      this.favorite()
      //调用收藏接口
    } else {
      wx.showLoading({
        title: '加载中',
      })
      //调用取消收藏接口
      this.cancelFavorite()
    }
  },
  favorite(){
    var that = this
    requestLoading(
      'api/car/v1/car/cargo/addFavorite',
      {carId:this.data.carId,
      rentOrSale:this.data.rentOrSale==='rent'?1:2
      },
      'POST',
      '',
      'json',
      function (res) {
        console.log('请求接口res', res)
        if (res.success) {
          that.setData({
            'carData.isFavorite': 1,
          })
          wx.hideLoading()
          wx.showToast({
            title:'收藏成功'
          })
        }else{
          wx.hideLoading()
          wx.showModal({
            title: res.errorMsg,
          })
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )
  },
  cancelFavorite(){
    var that = this
    requestLoading(
      'api/car/v1/car/cargo/cancelFavorite',
      {carId:this.data.carId,
      rentOrSale:this.data.rentOrSale==='rent'?1:2
      },
      'POST',
      '',
      'json',
      function (res) {
        console.log('请求接口res', res)
        if (res.success) {
          that.setData({
            'carData.isFavorite': 2,
          })
          wx.hideLoading()
          wx.showToast({
            title:'已取消收藏'
          })
        }else{
          wx.hideLoading()
          wx.showModal({
            title: res.errorMsg,
          })
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )
  },
  //切换轮播图事件
  changeSwiperEvent(e) {
    this.setData({
      swiperId: e.detail.current,
    })
    console.log('e', e)
  },
  //放大预览轮播图图片
  handlePreviewImg(e){
    let swiperList = []
    swiperList = this.data.carData.imageUrlList
    const urls = swiperList
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      urls,
      current
    })

  },
  handlePreviewVideo(e){
    let swiperList = this.data.carData.videoUrlList

    let imageList = this.data.carData.imageUrlList
    let urlList = []
    swiperList.forEach(item=>{
      urlList.push({
        url:item,
        type:'video'
      })
    })
    imageList.forEach(item=>{
      urlList.push({
        url:item,
        type:'image'
      })
    })
    console.log('urls',urlList)
    wx.previewMedia({
      sources:urlList,
    })
  },

   //按钮分享
onShareAppMessage() {
  console.log('onShareAppMessage')
  return {
    title: this.data.carData.brandName,
    path: `/pages/carDetail/carDetail?type=${this.data.rentOrSale}&carId=${this.data.carId}&isshare=1`
  }
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log('onshow',options)
    this.getCarInfo()
    this.getPhoneNumber()
  },
  getPhoneNumber(){
      wx.getStorage({
        key:'phone',
        success:(res)=>{
          this.setData({
            phoneValue:res.data
          })
        },
        fail:(res)=>{
        }
    })
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

}
)
