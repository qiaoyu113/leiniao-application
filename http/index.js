const { request } = require('./request.js')

module.exports = {
  //轮播图接口
  getSwiperList: () => request('swiperList'),
}
