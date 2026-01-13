"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["common"],{

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony export config */
// 小程序环境配置
var ENV = 'dev';
var apiBaseUrls = {
  dev: 'http://192.168.199.187:3000',
  prod: 'https://ynsq.eboard.apps.aigrohub.com'
};
var config = {
  env: ENV,
  // API 配置
  api: {
    baseUrl: apiBaseUrls[ENV]
  },
  // 微信小程序配置
  // App ID 通过 Taro 的 defineConstants 在构建时注入
  weapp: {
    appId: "wxad0bc6972754b77c" || 0
  }
};
/* harmony default export */ __webpack_exports__["default"] = (config);

/***/ }),

/***/ "./src/utils/api.ts":
/*!**************************!*\
  !*** ./src/utils/api.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony export api */
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/taro */ "webpack/container/remote/@tarojs/taro");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "./src/config/index.ts");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth */ "./src/utils/auth.ts");
/* provided dependency */ var URLSearchParams = __webpack_require__(/*! @tarojs/runtime */ "webpack/container/remote/@tarojs/runtime")["URLSearchParams"];





// 请求拦截器
var request = function request(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var token = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('logto_token');
  return new Promise(function (resolve, reject) {
    _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().request({
      url: "".concat(_config__WEBPACK_IMPORTED_MODULE_1__["default"].api.baseUrl).concat(url),
      method: options.method || 'GET',
      header: (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_3__["default"])({
        'Content-Type': 'application/json'
      }, token && {
        'Authorization': "Bearer ".concat(token)
      }), options.headers),
      data: options.body ? JSON.parse(options.body) : undefined,
      success: function success(res) {
        if (res.statusCode === 401) {
          // Token 过期，清除本地存储并重新静默登录
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('logto_token');
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('user_info');
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('user_id');
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('token_expires_in');
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('login_timestamp');
          // 尝试重新静默登录
          (0,_auth__WEBPACK_IMPORTED_MODULE_2__.wechatSilentLogin)().catch(function () {
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().showToast({
              title: '登录已过期，请重新打开小程序',
              icon: 'none'
            });
          });
          reject(new Error('登录已过期'));
          return;
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error("\u8BF7\u6C42\u5931\u8D25: ".concat(res.statusCode)));
        }
      },
      fail: function fail(error) {
        reject(error);
      }
    });
  });
};

// API 方法封装
var api = {
  // 获取用户信息（小程序专用接口）
  getUserInfo: function getUserInfo() {
    return request('/api/mini/my-account');
  },
  // 更新个人信息
  updateProfile: function updateProfile(data) {
    return request('/api/mini/my-account/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  // 修改密码
  changePassword: function changePassword(data) {
    return request('/api/mini/my-account/change-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  // 小程序：获取分组（当前用户可见）
  getMiniGroups: function getMiniGroups() {
    return request('/api/mini/groups');
  },
  // 小程序：获取设备列表（分页）
  getMiniDevices: function getMiniDevices(params) {
    var query = new URLSearchParams();
    if (params.groupId !== undefined) query.set('groupId', String(params.groupId));
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.pageSize !== undefined) query.set('pageSize', String(params.pageSize));
    // search 参数优先级更高，与后台保持一致
    if (params.search) {
      query.set('search', params.search);
    } else if (params.keyword) {
      query.set('keyword', params.keyword);
    }
    if (params.devicetype) {
      query.set('devicetype', params.devicetype);
    }
    var qs = query.toString() ? "?".concat(query.toString()) : '';
    return request("/api/mini/devices".concat(qs));
  },
  // 获取设备详情（保留原有 Web 端接口，如后续需要）
  getDeviceDetail: function getDeviceDetail(id) {
    return request("/api/devices/".concat(id));
  },
  // 获取设备参数
  getDeviceParameters: function getDeviceParameters(id) {
    return request("/api/devices/".concat(id, "/parameters"));
  },
  // 根据参数名称列表获取参数详情
  getParametersInfo: function getParametersInfo(parameterNames) {
    var params = new URLSearchParams();
    params.set('parameters', parameterNames.join(','));
    return request("/api/parameters?".concat(params.toString()));
  },
  // 获取设备历史数据
  getDeviceHistoryData: function getDeviceHistoryData(id, params) {
    var query = new URLSearchParams();
    query.set('parameters', params.parameters);
    query.set('startDate', params.startDate);
    query.set('endDate', params.endDate);
    return request("/api/devices/".concat(id, "/history-data?").concat(query.toString()));
  },
  // 获取设备数据
  getDeviceData: function getDeviceData(id, params) {
    var queryString = params ? "?".concat(new URLSearchParams(params).toString()) : '';
    return request("/api/devices/".concat(id, "/et-data").concat(queryString));
  },
  // 小程序：获取设备阈值配置
  getDeviceThresholds: function getDeviceThresholds(deviceSn) {
    return request("/api/mini/devices/".concat(encodeURIComponent(deviceSn), "/thresholds"));
  },
  // 小程序：创建或更新设备阈值配置
  saveDeviceThreshold: function saveDeviceThreshold(deviceSn, data) {
    return request("/api/mini/devices/".concat(encodeURIComponent(deviceSn), "/thresholds"), {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  // 小程序：删除设备阈值配置
  deleteDeviceThreshold: function deleteDeviceThreshold(deviceSn, thresholdId) {
    var query = new URLSearchParams();
    query.set('id', String(thresholdId));
    return request("/api/mini/devices/".concat(encodeURIComponent(deviceSn), "/thresholds?").concat(query.toString()), {
      method: 'DELETE'
    });
  },
  // 小程序：获取消息列表
  getMessages: function getMessages(params) {
    var query = new URLSearchParams();
    if (params !== null && params !== void 0 && params.page) query.set('page', String(params.page));
    if (params !== null && params !== void 0 && params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params !== null && params !== void 0 && params.isRead) query.set('isRead', params.isRead);
    var qs = query.toString() ? "?".concat(query.toString()) : '';
    return request("/api/mini/messages".concat(qs));
  },
  // 小程序：标记消息为已读
  markMessageRead: function markMessageRead(messageId) {
    return request("/api/mini/messages/".concat(messageId, "/read"), {
      method: 'PUT'
    });
  },
  // 小程序：删除消息
  deleteMessage: function deleteMessage(messageId) {
    return request("/api/mini/messages/".concat(messageId), {
      method: 'DELETE'
    });
  },
  // 小程序：一键标记所有消息为已读
  markAllMessagesRead: function markAllMessagesRead() {
    return request('/api/mini/messages/read-all', {
      method: 'PUT'
    });
  },
  // 获取墒情设备指标数据（最新分析）
  getMoistureIndicators: function getMoistureIndicators(deviceId, parameters) {
    var params = new URLSearchParams();
    params.set('parameters', parameters.join(','));
    return request("/api/devices/".concat(deviceId, "/moisture-indicators?").concat(params.toString()));
  },
  // 获取气象设备指标数据（最新分析）
  getWeatherIndicators: function getWeatherIndicators(deviceId, parameters) {
    var params = new URLSearchParams();
    params.set('parameters', parameters.join(','));
    return request("/api/devices/".concat(deviceId, "/analysis?type=weather&").concat(params.toString()));
  }
};
/* harmony default export */ __webpack_exports__["default"] = (api);

/***/ }),

/***/ "./src/utils/auth.ts":
/*!***************************!*\
  !*** ./src/utils/auth.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkLoginStatus": function() { return /* binding */ checkLoginStatus; },
/* harmony export */   "clearLoginData": function() { return /* binding */ clearLoginData; },
/* harmony export */   "getAuthHeaders": function() { return /* binding */ getAuthHeaders; },
/* harmony export */   "wechatSilentLogin": function() { return /* binding */ wechatSilentLogin; }
/* harmony export */ });
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "./node_modules/@babel/runtime/helpers/esm/regenerator.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/taro */ "webpack/container/remote/@tarojs/taro");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "./src/config/index.ts");





// 检查登录状态
var checkLoginStatus = /*#__PURE__*/function () {
  var _ref = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee() {
    var accessToken, loginTimestamp, expiresIn, now, tokenAge, maxAge, userInfo, _t;
    return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          // 检查 logto_token
          accessToken = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('logto_token');
          loginTimestamp = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('login_timestamp');
          expiresIn = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('token_expires_in');
          if (!(!accessToken || !loginTimestamp || !expiresIn)) {
            _context.n = 1;
            break;
          }
          console.log('❌ 登录状态检查失败：缺少必要信息');
          return _context.a(2, {
            isLoggedIn: false
          });
        case 1:
          // 检查 token 是否过期
          now = Date.now();
          tokenAge = now - loginTimestamp;
          maxAge = expiresIn * 1000; // 转换为毫秒
          if (!(tokenAge > maxAge)) {
            _context.n = 2;
            break;
          }
          console.log('❌ Token 已过期，清除登录状态');
          clearLoginData();
          return _context.a(2, {
            isLoggedIn: false
          });
        case 2:
          // 验证 token 是否有效
          userInfo = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('user_info');
          if (userInfo) {
            _context.n = 3;
            break;
          }
          console.log('❌ 缺少用户信息');
          return _context.a(2, {
            isLoggedIn: false
          });
        case 3:
          console.log('✅ 登录状态检查成功');
          return _context.a(2, {
            isLoggedIn: true,
            user: userInfo,
            access_token: accessToken
          });
        case 4:
          _context.p = 4;
          _t = _context.v;
          console.error('❌ 检查登录状态失败:', _t);
          return _context.a(2, {
            isLoggedIn: false
          });
      }
    }, _callee, null, [[0, 4]]);
  }));
  return function checkLoginStatus() {
    return _ref.apply(this, arguments);
  };
}();

// 清除登录数据
var clearLoginData = function clearLoginData() {
  try {
    // 清除所有登录相关的存储
    _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('logto_token');
    _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('user_info');
    _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('user_id');
    _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('token_expires_in');
    _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('login_timestamp');
    console.log('✅ 登录数据已清除');
  } catch (error) {
    console.error('❌ 清除登录数据失败:', error);
  }
};

// 获取带认证头的请求配置
var getAuthHeaders = function getAuthHeaders() {
  // 仅使用用户 access_token（logto_token）
  var accessToken = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('logto_token');
  return {
    'Authorization': "Bearer ".concat(accessToken),
    'Content-Type': 'application/json'
  };
};

// 全局登录锁，防止并发调用
var isLoggingIn = false;
var loginPromise = null;

// 微信静默登录
var wechatSilentLogin = /*#__PURE__*/function () {
  var _ref2 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee3() {
    var existingToken, loginTimestamp, expiresIn, now, tokenAge, maxAge, userInfo;
    return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          if (!(isLoggingIn && loginPromise)) {
            _context3.n = 1;
            break;
          }
          console.log('⏳ 登录正在进行中，等待结果...');
          return _context3.a(2, loginPromise);
        case 1:
          // 检查是否已经登录
          existingToken = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('logto_token');
          loginTimestamp = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('login_timestamp');
          expiresIn = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('token_expires_in');
          if (!(existingToken && loginTimestamp && expiresIn)) {
            _context3.n = 2;
            break;
          }
          now = Date.now();
          tokenAge = now - loginTimestamp;
          maxAge = expiresIn * 1000; // 如果token未过期，直接返回成功
          if (!(tokenAge <= maxAge)) {
            _context3.n = 2;
            break;
          }
          userInfo = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('user_info');
          if (!userInfo) {
            _context3.n = 2;
            break;
          }
          console.log('✅ 用户已登录，跳过登录流程');
          return _context3.a(2, {
            success: true,
            user: userInfo
          });
        case 2:
          // 设置登录锁
          isLoggingIn = true;

          // 创建登录Promise
          loginPromise = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee2() {
            var loginRes, response, _response$data$data, access_token, expires_in, user, errorMsg, _t2;
            return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context2) {
              while (1) switch (_context2.p = _context2.n) {
                case 0:
                  _context2.p = 0;
                  console.log('🚀 开始微信静默登录...');

                  // 1. 获取微信登录code
                  _context2.n = 1;
                  return _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().login();
                case 1:
                  loginRes = _context2.v;
                  if (loginRes.code) {
                    _context2.n = 2;
                    break;
                  }
                  throw new Error('获取微信登录凭证失败');
                case 2:
                  console.log('✅ 获取微信code成功');

                  // 2. 调用后端API进行登录
                  _context2.n = 3;
                  return _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().request({
                    url: "".concat(_config__WEBPACK_IMPORTED_MODULE_1__["default"].api.baseUrl, "/api/auth/mini-wechat-login"),
                    method: 'POST',
                    data: {
                      code: loginRes.code
                    },
                    header: {
                      'Content-Type': 'application/json'
                    }
                  });
                case 3:
                  response = _context2.v;
                  if (!(response.statusCode !== 200 || response.data.code !== 0)) {
                    _context2.n = 4;
                    break;
                  }
                  throw new Error(response.data.message || '登录失败');
                case 4:
                  _response$data$data = response.data.data, access_token = _response$data$data.access_token, expires_in = _response$data$data.expires_in, user = _response$data$data.user;
                  if (access_token) {
                    _context2.n = 5;
                    break;
                  }
                  throw new Error('获取登录凭证失败');
                case 5:
                  // 3. 存储token和用户信息
                  _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('logto_token', access_token);
                  _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('token_expires_in', expires_in);
                  _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('login_timestamp', Date.now());
                  if (user) {
                    _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('user_info', user);
                    if (user.id) {
                      _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('user_id', user.id);
                    }
                  }
                  console.log('✅ 微信静默登录成功');
                  return _context2.a(2, {
                    success: true,
                    user: user
                  });
                case 6:
                  _context2.p = 6;
                  _t2 = _context2.v;
                  console.error('❌ 微信静默登录失败:', _t2);
                  errorMsg = _t2 instanceof Error ? _t2.message : '登录失败';
                  return _context2.a(2, {
                    success: false,
                    error: errorMsg
                  });
                case 7:
                  _context2.p = 7;
                  // 清除登录锁
                  isLoggingIn = false;
                  loginPromise = null;
                  return _context2.f(7);
                case 8:
                  return _context2.a(2);
              }
            }, _callee2, null, [[0, 6, 7, 8]]);
          }))();
          return _context3.a(2, loginPromise);
      }
    }, _callee3);
  }));
  return function wechatSilentLogin() {
    return _ref2.apply(this, arguments);
  };
}();
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  checkLoginStatus: checkLoginStatus,
  clearLoginData: clearLoginData,
  getAuthHeaders: getAuthHeaders,
  wechatSilentLogin: wechatSilentLogin
});

/***/ })

}]);
//# sourceMappingURL=common.js.map