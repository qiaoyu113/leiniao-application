// pages/carDetail/carDetail.js
const app = getApp()
const { get } = require('../../utils/network')
const net = require('../../utils/network')
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
    swiperId:0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      carId: options.carId,
      rentOrSale: options.type
    })
    if(options.isshare){
      this.setData({
        isshare:'1'
      })
      wx.getStorage({
        key:'phoneName',
        success:(res)=>{
          console.log('成功res')
        },
        fail:(res)=>{
          console.log('失败res')
          wx.navigateTo({
            url:  "/pages/login/login?isshare=1",
          })
        }
      })
    }
  },
  //调用接口，获取车辆详情
  getCarInfo() {
    var that = this
    const params = {
      carId:this.data.carId,
      searchType:this.data.rentOrSale==='rent'?1:2
    }
    net.post('api/car_center/v1/cargo/getCarInfoByCarId', params, res => {
      if (res.success) {
        let carInfo = res.data
        carInfo.carDescribe = carInfo.carDescribe.trim()
        carInfo.imageList = []
        const getAllImageInfo = carInfo.imageUrlList.map(v => wx.getImageInfo({src: v.replace('http://', 'https://')}))
        Promise.all(getAllImageInfo).then(resList => {
          carInfo.imageList = resList.map((v, i) => {
            const orientation = v.orientation || 'up'
            const img = {
              src: carInfo.imageUrlList[i],
              orientation,
              rotateClass: app.consts.rotateClasses[orientation] || ''
            }
            return img
          })
          that.setData({
            carData:carInfo,
            showHotIntroduce: !!carInfo.isVogue
          })
        }).catch(err => {
          console.log(err)
          carInfo.imageList = carInfo.imageUrlList.map(v => {
            return {
              src: v
            }
          })
          that.setData({
            carData: carInfo,
            showHotIntroduce: !!carInfo.isVogue
          })
        })
      }
    }, err => {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  //返回上一页
  gobackEvent() {
    let page = getCurrentPages()
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
      if (phoneValue) {
        //调用获取底价接口
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
    net.post('api/car/v1/car/cargo/carInquiry', info, res => {
      if (res.success) {
        that.setData({
          nameValue:''
        })
        setTimeout(()=>{
          wx.showToast({
            title: '询价成功',
          })
        },500)
      }else{
        wx.showModal({
          title: res.errorMsg,
        })
      }
      that.onClose()
    }, err => {
      console.log(err)
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  //收藏
  collectCarEvent(e) {
    let collectid = e.currentTarget.dataset['index']
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
    net.post('api/car/v1/car/cargo/addFavorite', {
      carId:this.data.carId,
      rentOrSale:this.data.rentOrSale==='rent'?1:2
    }, res => {
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
    }, err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  cancelFavorite(){
    var that = this
    net.post('api/car/v1/car/cargo/cancelFavorite', {
      carId:this.data.carId,
      rentOrSale:this.data.rentOrSale==='rent'?1:2
    }, res => {
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
    }, err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  //切换轮播图事件
  changeSwiperEvent(e) {
    this.setData({
      swiperId: e.detail.current,
    })
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
    wx.previewMedia({
      sources:urlList,
      current:this.data.swiperId
    })
  },

   //按钮分享
onShareAppMessage() {
  let {brandName,modelName,horsepower} = this.data.carData
  return {
    title: `${brandName}  ${modelName?modelName:''}  ${horsepower?horsepower+'匹':''}`,
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
    this.getCarInfo()
    this.getPhoneNumber()
    wx.getStorage({
      key:'phoneName',
      success:(res)=>{
        console.log('成功res')
      },
      fail:(res)=>{
        if(this.data.isshare=='1'){
        wx.navigateTo({
          url:  "/pages/login/login?isshare=1",
        })
      }
      }
    })
  },
  goLoginOnShow (hasPhone) {
    if(this.data.isshare=='1' && hasPhone){
      wx.navigateTo({
        url:  "/pages/login/login?isshare=1",
      })
    }
  },
  getPhoneNumber(callback){
      wx.getStorage({
        key:'phone',
        success:(res)=>{
          this.setData({
            phoneValue:res.data
          }, () => {
            callback && callback(true)
          })
        },
        fail:(res)=>{
          callback && callback(false)
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
