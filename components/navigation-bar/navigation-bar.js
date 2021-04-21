const app = getApp()
const net = require('../../utils/network')

Component({
  options: {
    addGlobalClass: true 
  },
  properties: {
    // defaultData（父页面传递的数据）
    defaultData: {
      type: Object,
      value: {
        title: '',
        cityName: '',
        showSearchBar: true
      },
      observer: function (newVal, oldVal) {},
    },
  },
  data: {
    navHeight: '',
    swiperList: [],
    placeholderTitle: '',
    rentOrBuy: ''
  },
  attached: function () {
    const isRent = app.utils.getEntryRoute() === 'rentedCar'
    this.setData({
      placeholderTitle: `搜索想${isRent ? '租' : '买'}的车辆`,
      rentOrBuy: isRent ? 'rent' : 'buy'
    })
    this.getBanners()
  },
  methods: {
    getBanners () {
      const banner = 'car_go_banner'
      net.post('api/base_center/open/v1/dict/list/types', [banner], res => {
        if (res.success) {
          this.setData({
            swiperList: (res.data[banner] || []).map(v => {
              return {
                type: 'image',
                url: v.dictLabel
              }
            })
          }, () => {
            console.log(this.data.swiperList)
          })
        }
      })
    },
    selectLocationEvent() {
      wx.navigateTo({
        url: '/pages/mapList/mapList',
      })
    },
    gotoSearchEvent() {
      wx.navigateTo({
        url: `/pages/searchPage/searchPage`,
      })
    },
    handlerGetNavHeight(e) {
      this.setData({
        navHeight: e.detail.navHeight,
      })
    },
  },
})
