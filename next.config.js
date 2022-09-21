// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: 'standalone',
  productionBrowserSourceMaps: false,
  images: {
    domains: ['litaishuai.oss-cn-hangzhou.aliyuncs.com'],
  },
}