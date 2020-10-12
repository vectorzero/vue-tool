module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: '一个工具',
        win: { icon: 'public/icon/icon256.ico' },
        publish: [
          // {
          //   provider: 'generic',
          //   url: 'https://xxxx/download/'
          // }
        ]
      }
    }
  }
}
