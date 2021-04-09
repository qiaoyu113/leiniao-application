// pages/mapList/mapList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cityList: {
      B: [
        {
          name: '北京市',
          key: 'B',
          id: 1,
        },
        {
          name: '包头市',
          key: 'B',
          id: 2,
        },
      ],
      C: [
        {
          name: '重庆市',
          key: 'C',
          id: 3,
        },
        {
          name: '成都市',
          key: 'C',
          id: 4,
        },
        {
          name: '长沙市',
          key: 'C',
          id: 5,
        },
      ],
      D: [
        {
          name: '大连市',
          key: 'D',
          id: 6,
        },
      ],
      E: [
        {
          name: '鄂尔多斯市',
          key: 'E',
          id: 7,
        },
      ],
      G: [
        {
          name: '广州市',
          key: 'G',
          id: 8,
        },
      ],
      H: [
        {
          name: '杭州市',
          key: 'H',
          id: 9,
        },
      ],
      N: [
        {
          name: '南京市',
          key: 'N',
          id: 10,
        },
      ],
      S: [
        {
          name: '上海市',
          key: 'S',
          id: 11,
        },
      ],
      W: [
        {
          name: '武汉市',
          key: 'W',
          id: 12,
        },
      ],
      Z: [
        {
          name: '郑州市',
          key: 'Z',
          id: 13,
        },
      ],
    },
    alphabet: [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ],
    newList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleList()
  },

  //整合字母表和城市池数据
  handleList() {
    let newarr = []
    let { alphabet, cityList } = this.data
    alphabet.forEach((item) => {
      for (let key in cityList) {
        if (key === item) {
          newarr.push({ key: item, list: cityList[key] })
        }
      }
    })
    console.log('newarr', newarr)
    this.setData({
      newList: newarr,
    })
  },

  //点击城市返回首页
  slectCityGoIndex(e) {
    let cityData = e.currentTarget.dataset['index']
    console.log(cityData)

    let pages = getCurrentPages() //获取当前页面pages里的所有信息。
    let prevPage = pages[pages.length - 2] //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({
      // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      cityinfo: cityData,
    })
    //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。

    //最后就是返回上一个页面。
    wx.navigateBack({
      delta: 1, // 返回上一级页面。
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