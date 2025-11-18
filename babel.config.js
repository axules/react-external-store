module.exports = {
  plugins: [
  ],
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: '3',
      loose: true,
      forceAllTransforms: false,
      targets: 'chrome 80, safari 12.1, ios 12.1'
    }]
  ]
}
;