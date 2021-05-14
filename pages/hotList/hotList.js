const app = getApp()
const util = require('../../utils/storage.js')
const net = require('../../utils/network')
// pages/hotList/hotList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carList: [],
    showCommend: true,
    rentOrSale: '',
    dataList: [],
    showList: true,
    page:1,
    bottomText:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      rentOrSale: app.utils.getEntryRoute() === 'rentedCar' ? 'rent' : 'sale',
    })

    if (options.listid === '1') {
      //超值爆款
      this.setData({
        showCommend: true,
      })
    } else {
      //今日上新
      this.setData({
        showCommend: false,
      })
    }
    this.refresh()
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
  onPullDownRefresh: function () {
   this.refresh()
   wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page;
    page = page + 1;
    this.setData({
      page: page
    })
    if(this.data.carList.length < this.data.total){
      this.getList()
    }else{
      this.setData({
        bottomText: '到底了亲~'
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  //跳转车辆详情页
  gotoCarDetail(e) {
    var id = e.currentTarget.dataset['index']
    //判断是否租出或者售出
    var itemindex = this.data.carList.findIndex((item) => {
      if (item.carId === id) {
         return item
      }
    })
    var status = this.data.carList[itemindex].status
    if(status!==40&&status!==50&&status!==60){
      wx.getStorage({
        key:'phoneName',
        success:(res)=>{
          wx.navigateTo({
            url: `/pages/carDetail/carDetail?carId=${id}&type=${this.data.rentOrSale}`,
          })
        },
        fail:(res)=>{
          wx.navigateTo({
            url:  "/pages/login/login",
          })
        }
      })
    }
  },

  //返回上一页
  handlerGobackClick() {
    wx.navigateBack({
      delta: 1, // 返回上一级页面。
      success: function () {
      },
    })
  },
  //下拉刷新
  refresh() {
    let type
    this.data.rentOrSale=='rent'?type=1:type=2
    this.setData({
      page:1,
    })
    if(this.data.showCommend){
      this.getVogueList(type,1)
    }else{
      this.getNewList(type,1)
    }
  },
  //上拉加载
  getList() {
    var type
    this.data.rentOrSale=='rent'?type=1:type=2
    if(this.data.showCommend){
      //请求超值爆款接口
      this.getVogueList(type,this.data.page)
    }else{
      //请求今日上新接口
      this.getNewList(type,this.data.page)
    }
  },

  //获取超值爆款列表
  getVogueList(type){
    //请求列表接口
    net.post('api/car_center/v1/cargo/getVogueList', {
      searchType: type,
      searchCityId: app.globalData.locationCity.cityCode,
      page: this.data.page,
      limit:30
    }, (res) => {
      if (res.success) {
        let cardata = res.data
        this.setData({
          total: (res.page || {}).total || 0
        })
        this.getListHandle(cardata, this.data.page)
      }
    }, err => {
      console.log(err)
      wx.showToast({
        title: '加载数据失败',
      })
      }
    )
  },
  //获取今日上新接口
  getNewList(type){
    //请求列表接口
    net.post('api/car_center/v1/cargo/getNewestCarList', {
      searchType: type,
      searchCityId: app.globalData.locationCity.cityCode,
      page: this.data.page,
      limit:30
    }, res => {
      if (res.success) {
        let cardata = res.data
        this.setData({
          total: (res.page || {}).total || 0
        })
        this.getListHandle(cardata, this.data.page)
      }
    }, err => {
      console.log(err)
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  composeCarList(cardata, page) {
    this.setData({
      carList: page > 1 ? this.data.carList.concat(cardata) : cardata,
    })
  },
  //提取两个接口重复代码
  getListHandle(cardata, page){
    if (cardata.length) {
      const parseCarMainImg = cardata.map(v => {
        const mainImgUrl = (v.imageUrlList[0] || '').replace('http://', 'https://')
        return mainImgUrl ? wx.getImageInfo({
          src: mainImgUrl
        }) : Promise.resolve({src: ''})
      })
      Promise.all(parseCarMainImg).then(res => {
        cardata.forEach((v, i) => {
          const orientation = res[i].orientation || 'up'
          v.mainImg = {
            src: v.imageUrlList[0] || '',
            orientation,
            rotateClass: app.consts.rotateClasses[orientation] || ''
          }
        })
        this.composeCarList(cardata, page)
      }).catch(err => {
        console.log(err)
        carData.forEach(v => {
          v.mainImg = {src: v.imageUrlList[0] || ''}
        })
        this.composeCarList(cardata, page)
      })
    } else {
      this.setData({
        bottomText: '到底了亲~'
      })
      if (!this.data.carList.length) {
        this.setData({
          showList: false
        })
      }
    }
  }
})
