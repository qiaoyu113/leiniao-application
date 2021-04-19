const net = require('../../utils/network')
const app = getApp()

Component({
  options: {
    addGlobalClass: true 
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showFastFeature: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    formData: {
      sort: '1'
    },
    isRent: false,
    pageSize: 30,
    pageIndex: 1,
    fastFeatures: [],
    vehicleList: [],
    isPageWithCustomNav: false,
    navbarHeight: 64,
    loadStatus: 0, // 0 初始化 1请求中 2请求完毕
    labels: [],
    total: 0,
    bottomText: ''
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.init()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init () {
      const app = getApp()
      const currentRoute = app.utils.getCurrentRoute()
      const isPageWithCustomNav = app.globalData.pagesWithCustomNav.indexOf(currentRoute) > -1
      const navbarHeight = app.globalData.CustomBar
      const isRent = app.utils.getEntryRoute() === 'rentedCar'
      this.setData({
        isPageWithCustomNav,
        navbarHeight,
        isRent
      })
    },
    // 获取车辆列表
    getVehicleList (append, isKeywordChanged) {
      const formData = this.data.formData
      const pageIndex = append ? this.data.pageIndex + 1 : 1
      Object.assign(formData, {
        limit: this.data.pageSize,
        page: pageIndex,
        searchCityId: (app.globalData.locationCity || {}).cityCode || '',
        searchType: this.data.isRent ? 1 : 2
      })
      formData.searchContent = formData.keyword || ''
      delete formData.keyword
      net.post('255/car_center/v1/cargo/getSearchCarList', formData, res => {
        const vehicleList = (res.data || []).map(v => {
          v.pic = (v.imageUrlList || [])[0] || ''
          return v
        })
        this.setData({
          vehicleList,
          loadStatus: 2,
          pageIndex,
          total: (res.page || {}).total || 0
        })
        isKeywordChanged && this.triggerEvent('searchfinish')
      })
    },
    onFastFeatureReady (evt) {
      const transItem = v => {
        v.label = v.dictLabel
        v.id = v.dictValue
        v.selected = false
        return v
      }
      let features = (evt.detail.car_go_label || []).map(v => {
        return {...v}
      }).map(transItem).filter(v => this.data.isRent ? !/售/.test(v.label) : !/租/.test(v.label)).slice(0, 4)
      this.data.showFastFeature && this.setData({
        fastFeatures: features
      })
    },
    // 筛选组件汇总后的参数变动
    onParamChange: function (evt) {
      this.setData({
        formData: Object.assign({}, this.data.formData, evt.detail || evt)
      }, () => {
        this.getVehicleList(false, !evt.detail)
      })
    },
    // 筛选组件筛选项变动，同步到页面
    onFeatureChange (evt) {
      const item = evt.detail
      const fastFeatures = this.data.fastFeatures.map(v => {
        v.id === item.id && (v.selected = !v.selected)
        return v
      })
      this.setData({fastFeatures})
    },
    // 页面快捷筛选项变动，同步到筛选组件
    onSelectFeature (evt) {
      // 页面本身
      const item = evt.currentTarget.dataset.info
      let fastFeatures = this.data.fastFeatures.map(v => {
        v.id === item.id && (v.selected = !v.selected)
        return v
      })
      this.setData({fastFeatures})
      // 同步到组件
      const vehicleFilter = this.selectComponent('#vehicleFilter')
      vehicleFilter && vehicleFilter.onPageSelectFeature(evt)
    },
    // 同步重置操作中的筛选项
    onFilterReset (evt) {
      if (!this.data.showFastFeature) return false
      const fastFeatures = this.data.fastFeatures.map(v => {
        v.selected = false
        return v
      })
      this.setData({fastFeatures})
    },
    // 供页面滚动至底部时调用，分页加载数据
    // const vehicleList = this.selectComponent('#vehicleList')
    // vehicleList && vehicleList.onPageReachBottom()
    onPageReachBottom () {
      if (this.data.vehicleList.length < this.data.total) { // todo
        this.getVehicleList(true)
      } else {
        this.setData({
          bottomText: '到底了亲~'
        })
      }
    },
    // 供页面搜索关键字变化时调用，重新搜索
    // const vehicleList = this.selectComponent('#vehicleList')
    // vehicleList && vehicleList.onPageKeywordChange(newVal)
    onPageKeywordChange (val) {
      this.onParamChange({keyword: val})
    }
  }
})
