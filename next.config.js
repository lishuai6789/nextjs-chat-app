// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: 'standalone',
  productionBrowserSourceMaps: false,
  experimental: {
    images: {
      allowFutureImage: true
    }
  }
}