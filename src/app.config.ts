export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/message/index',
    'pages/profile/index',
    'pages/webview/index',
    'pages/device-detail/index',
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: 'eco-viz',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#888',
    selectedColor: '#1B9AEE',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      { pagePath: 'pages/home/index', text: '首页', iconPath: 'assets/images/icon-home.png', selectedIconPath: 'assets/images/icon-home.png' },
      { pagePath: 'pages/message/index', text: '消息', iconPath: 'assets/images/icon-message.png', selectedIconPath: 'assets/images/icon-message.png' },
      { pagePath: 'pages/profile/index', text: '我的', iconPath: 'assets/images/icon-user.png', selectedIconPath: 'assets/images/icon-user.png' }
    ]
  },
  style: 'v2',
  lazyCodeLoading: 'requiredComponents'
});


