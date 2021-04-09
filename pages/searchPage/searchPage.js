// pages/searchPage/searchPage.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholder: '搜索想租的车辆',
    showCloseBtn: false,
    inputValue: '',
    searchHistoryList: [],
    ifSearchFinish: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = wx.getStorageSync('searchHistoryList')
    if (value) {
      this.setData({
        searchHistoryList: value,
      })
    } else {
      wx.setStorage({
        key: 'searchHistoryList',
        data: [],
      })
    }
    console.log('searchHistoryList', this.data.searchHistoryList)
  },

  //返回上一页
  handlerGobackClick() {
    wx.navigateBack()
  },
  //监听输入框事件
  inputEvent(e) {
    let currentValue = e.detail.value
    if (currentValue === '') {
      this.setData({
        showCloseBtn: false,
        inputValue: '',
      })
    } else {
      this.setData({
        showCloseBtn: true,
        inputValue: currentValue,
      })
    }
  },
  //软键盘回车搜索
  enterSearch(e) {
    console.log('搜索值', e.detail.value)
    if (e.detail.value) {
      this.searchEvent(e.detail.value)
      this.checkInputHistory(e.detail.value)
    }
  },
  //校验输入内容，重复时调整搜索历史数组
  checkInputHistory(value) {
    let arr = this.data.searchHistoryList
    let res = arr.find((item) => {
      if (item === value) {
        arr.unshift(
          ...arr.splice(
            arr.findIndex((i) => i === value),
            1
          )
        )
        return arr
      }
    })
    console.log('res', res)
    if (!res) {
      arr.unshift(value)
      if (arr.length >= 11) {
        arr.pop()
      }
    }
    this.setData({
      searchHistoryList: arr,
    })
    wx.setStorageSync('searchHistoryList', arr)
  },
  //清除输入框
  clearInputWordEvent() {
    console.log('inputValue', this.data.inputValue)
    this.setData({
      inputValue: '',
      showCloseBtn: false,
    })
  },

  //删除搜索历史
  deleteHistory() {
    this.setData({
      searchHistoryList: [],
    })
    wx.setStorageSync('searchHistoryList', [])
  },
  //点击搜索icon
  searchIconEvent() {
    if (this.data.inputValue) {
      this.checkInputHistory(this.data.inputValue)
      this.searchEvent(this.data.inputValue)
    }
  },
  //调用搜索接口搜索页面
  searchEvent(value) {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      console.log('搜索成功', this.data.inputValue)
      this.setData({
        ifSearchFinish: true,
      })
      wx.hideLoading()
    }, 2000)
  },
  //点击搜索历史触发事件
  historySearchEvent(e) {
    let searchValue = e.currentTarget.dataset['index']
    this.setData({
      inputValue: searchValue,
      showCloseBtn: true,
    })
    this.checkInputHistory(searchValue)
    //调用搜索接口
    this.searchEvent(searchValue)
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
