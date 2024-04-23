module.exports = {
  plugins: [
  ],
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: '3.37',
      loose: true,
      forceAllTransforms: false,
      targets: 'chrome 80'
    }]
  ]
}
;