const net = require('../../utils/network')
const app = getApp()
const setItemUnselected = v => {
  v.selected = false
  return v
}

Component({
  options: {
    addGlobalClass: true 
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    isSale: false,
    tabs: [],
    currentTab: null,
    brandList: [],
    models: [],
    ages: [],
    prices: [],
    minPrice: '',
    maxPrice: '',
    features: [],
    miles: [],
    minMiles: '',
    maxMiles: '',
    sorts: []
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
      this.initTabs()
      this.getBrandList()
      this.getFilterDicts()
    },
    initTabs () {
      const tabs = [
        {label: '车型', id: 'model', selected: false},
        {label: '车龄', id: 'age', selected: false},
        {label: '租金', id: 'price', selected: false},
        {label: '筛选', id: 'filter', selected: false},
        {label: '', id: 'sort', selected: false}
      ]
      const app = getApp()
      const entryRoute = app.utils.getEntryRoute()
      let isSale = true
      if (/saleCar/.test(entryRoute)) {
        tabs.find(v => v.id === 'price').label = '售价'
        isSale = true
      }
      this.setData({tabs, isSale})
    },
    // 获取全部车型（品牌+车型）
    getBrandList () {
      let brandList = [{brandName: '不限品牌', brandId: '', selected: false}]
      if (!app.globalData.brandList.length) {
        net.get('255/car/v1/car/CarBrandInfo/getBrandListNoPage', res => {
          // if (res.success) {
            brandList = brandList.concat((res.data || []).map(v => {
              v.selected = false
              return v
            }))
            this.setData({brandList})
            app.globalData.brandList = brandList
          // }
        }, err => {
          console.log(err)
        })
      } else {
        brandList = app.globalData.brandList.map(v => {
          v.selected = false
          return v
        })
        this.setData({brandList})
      }
    },
    getFilterDicts () {
      const transItem = v => {
        v.label = v.dictLabel
        v.id = v.dictValue
        v.selected = false
        return v
      }
      // 排序：car_go_sort
      // 里程：car_go_mileage
      // 车龄：car_go_age
      // 售价：car_go_sale
      // 标签：car_go_label
      // 特点跟筛选分开，车辆特点：car_go_features  车辆标签：car_go_search
      net.post('25/v1/base/dict/dict/list/types', {}, res => {
        console.log(res)
        const data = res.data || {}
        const ages = (data.car_go_age || []).map(transItem)
        const prices = (data.car_go_sale || []).map(transItem)
        const features = (data.car_go_features || []).map(transItem)
        const miles = (data.car_go_mileage || []).map(transItem)
        const sorts = (data.car_go_sort || []).map(transItem)
        this.setData({
          ages,
          prices,
          features,
          miles,
          sorts
        })
        this.triggerEvent('fastfeatureready', data)
      })
    },
    // 点击tab
    onSelectTab (evt) {
      const selectedTabId = evt ? ((evt.currentTarget.dataset.info || {}).id || '') : ''
      const currenttabId = this.data.currentTab ? this.data.currentTab.id : ''
      if (this.data.currentTab && currenttabId === selectedTabId) {
        const tabs = this.data.tabs.map(setItemUnselected)
        this.setData({tabs, currentTab: null})
      } else {
        let currentTab = null
        const tabs = this.data.tabs.map((tab, i) => {
          if (tab.id === selectedTabId) {
            tab.selected = true
            currentTab = tab
          } else {
            tab.selected = false
          }
          return tab
        })
        this.setData({tabs, currentTab})
        this.moveFilterTop()
      }
    },
    // 重置
    onReset () {
      const tabs = this.data.tabs.map(setItemUnselected)
      const ages = this.data.ages.map(setItemUnselected)
      const brandList = this.data.brandList.map(setItemUnselected)
      const features = this.data.features.map(setItemUnselected)
      const miles = this.data.miles.map(setItemUnselected)
      const sorts = this.data.sorts.map((v, i) => {
        v.selected = !i
        return v
      })
      this.setData({
        tabs,
        ages,
        brandList,
        models: [],
        features,
        miles,
        sorts,
        currentTab: null,
        minPrice: '',
        maxPrice: '',
        minMiles: '',
        maxMiles: ''
      })
      this.onQuery()
      this.triggerEvent('filterreset')
    },
    // 查询
    onQuery () {
      const formData = { // todo 依文档
        brandId: (this.data.brandList.find(v => v.selected) || {}).brandId || '',
        modelId: (this.data.models.find(v => v.selected) || {}).modelId || '',
        carAgeIdList: this.data.ages.filter(v => v.selected).map(v => v.id),
        priceIdList: this.data.prices.filter(v => v.selected).map(v => v.id),
        minPrice: this.data.minPrice, // todo minRent/maxRent
        maxPrice: this.data.maxPrice,
        carLabelIdList: this.data.features.filter(v => v.selected).map(v => v.id),
        mileageIdList: this.data.miles.filter(v => v.selected).map(v => v.id).join(','),
        minMileage: this.data.minMiles,
        maxMileage: this.data.maxMiles,
        searchSortId: (this.data.sorts.find(v => v.selected) || this.data.sorts[0] || {}).id || ''
      }
      this.triggerEvent('change', formData)
      this.onSelectTab() // 触发收起filter
    },
    // 滚动页面至顶部
    moveFilterTop () {
      const query = this.createSelectorQuery()
      query.select('.vehicle-filter').boundingClientRect()    
      query.selectViewport().scrollOffset()
      const app = getApp()
      const isPageWithCustomNav = app.globalData.pagesWithCustomNav.indexOf(app.utils.getCurrentRoute()) > -1
      const barHeight = isPageWithCustomNav ? app.globalData.CustomBar : 0
      query.exec(res => {
        if (res[0] && res[1] && (res[0] || {}).top !== barHeight) {
          wx.pageScrollTo({scrollTop: res[0].top + res[1].scrollTop - barHeight})
        }
      })
    },
    // 选择品牌
    onSelectBrand (evt) {
      const brandId = evt.currentTarget.dataset.info.brandId
      const brandList = this.data.brandList.map(v => {
        v.selected = v.brandId === brandId
        return v
      })
      if (brandId) {
        let models = [{modelName: '不限车型', modelId: '', selected: false}]
        net.get('255/car/v1/leiniao/CarModelInfo/getModelListNoPage', {brandId}, res => {
          models = models.concat((res.data || []).map(v => {
            v.selected = false
            return v
          }))
          this.setData({
            brandList,
            models
          })
        }, err => {
          console.log(err)
        })
      } else {
        this.onQuery()
      }
    },
    // 选择型号
    onSelectModel (evt) {
      const modelId = evt.currentTarget.dataset.info.modelId
      const models = this.data.models.map(v => {
        v.selected = v.modelId === modelId
        return v
      })
      this.setData({models}, () => {
        this.onQuery()
      })
    },
    // 选择价格
    onSelectPrice (evt) {
      const prices = this.data.prices
      const clickedPrice = prices.find(v => v.id === evt.currentTarget.dataset.info.id)
      clickedPrice.selected = !clickedPrice.selected
      this.setData({prices, minPrice: '', maxPrice: ''})
    },
    onPriceInput (evt) {
      if ((evt.detail || {}).value) {
        const prices = this.data.prices.map(setItemUnselected)
        this.setData({prices})
      }
    },
    // 选择车龄
    onSelectAge (evt) {
      const ages = this.data.ages
      const clickedAge = ages.find(v => v.id === evt.currentTarget.dataset.info.id)
      clickedAge.selected = !clickedAge.selected
      this.setData({ages})
    },
    // 选择车辆特点
    onSelectFeature (evt, isFromPage) {
      const features = this.data.features
      const clickedFeature = features.find(v => v.id === evt.currentTarget.dataset.info.id)
      clickedFeature.selected = !clickedFeature.selected
      this.setData({features}, () => {
        if (isFromPage) {
          this.onQuery()
        } else {
          this.triggerEvent('featurechange', evt.currentTarget.dataset.info)
        }
      })
    },
    // 选择里程
    onSelectMiles (evt) {
      const miles = this.data.miles
      const clickedMiles = miles.find(v => v.id === evt.currentTarget.dataset.info.id)
      clickedMiles.selected = !clickedMiles.selected
      this.setData({miles, minMiles: '', maxMiles: ''})
    },
    onMilesInput (evt) {
      if ((evt.detail || {}).value) {
        const miles = this.data.miles.map(setItemUnselected)
        this.setData({miles})
      }
    },
    // 选择排序基准
    onSelectSort (evt) {
      const sorts = this.data.sorts.map(v => {
        v.selected = v.id === evt.currentTarget.dataset.info.id
        return v
      })
      this.setData({sorts}, () => {
        this.onQuery()
      })
    },
    // 解决滚动穿透问题
    doNothing () {
      return false
    }
  }
})
