var dtime = '_deadtime'

//设置缓存，'key','value','过期时间'
function put(k, v, t) {
  wx.setStorageSync(k, v)

  var seconds = parseInt(t)

  if (seconds > 0) {
    var timestamp = Date.parse(new Date())

    timestamp = timestamp / 1000 + seconds
    //设置过期时间的本地存储
    wx.setStorageSync(k + dtime, timestamp + '')
  } else {
    wx.removeStorageSync(k + dtime)
  }
}

//获取缓存
function get(k, def) {
  //获取过期时间
  var deadtime = parseInt(wx.getStorageSync(k + dtime))
  console.log('deadtime', deadtime, 'newdate', Date.parse(new Date()) / 1000)
  if (deadtime) {
    //当前时间大于过期时间
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      console.log('当前时间大于过期时间')
      if (def) {
        return def
      } else {
        return
      }
    }
  }

  var res = wx.getStorageSync(k)

  if (res) {
    return res
  } else {
    return def
  }
}

function remove(k) {
  wx.removeStorageSync(k)

  wx.removeStorageSync(k + dtime)
}

function clear() {
  wx.clearStorageSync()
}

module.exports = {
  put: put,

  get: get,

  remove: remove,

  clear: clear,
}
