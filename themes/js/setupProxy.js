const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    'api',
    proxy({
      target: 'https://www.suyanblog.eu.org', // 你要访问的地址
      changeOrigin: true
    })
  )
}
