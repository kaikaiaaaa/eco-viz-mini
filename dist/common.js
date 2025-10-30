"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["common"],{

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony export config */
// 小程序环境配置
var config = {
  // API 配置 - 强制使用开发环境
  api: {
    baseUrl: 'http://192.168.199.63:3000' // 强制使用开发环境URL
  },
  // Logto 配置 - 使用新创建的小程序应用
  logto: {
    endpoint: 'https://login.eboard.apps.aigrohub.com',
    appId: 'avmoloeby2yvj8bi6mwse',
    // 使用环境变量中的 App ID
    apiResource: 'https://ynsq.eboard.apps.aigrohub.com/api',
    redirectUri: 'http://192.168.199.63:3000/api/auth/mini-callback' // 使用后端API回调
  },
  // 微信小程序配置
  weapp: {
    appId: 'wxad4bf04718ee7738'
  }
};
/* harmony default export */ __webpack_exports__["default"] = (config);

/***/ }),

/***/ "./src/utils/auth.ts":
/*!***************************!*\
  !*** ./src/utils/auth.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkLoginStatus": function() { return /* binding */ checkLoginStatus; },
/* harmony export */   "clearLoginData": function() { return /* binding */ clearLoginData; },
/* harmony export */   "handleLoginSuccess": function() { return /* binding */ handleLoginSuccess; },
/* harmony export */   "navigateToWebViewLoginSimple": function() { return /* binding */ navigateToWebViewLoginSimple; }
/* harmony export */ });
/* unused harmony export getAuthHeaders */
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "./node_modules/@babel/runtime/helpers/esm/regenerator.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/taro */ "webpack/container/remote/@tarojs/taro");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "./src/config/index.ts");






// 生成随机字符串 - 使用更安全的字符集
var generateRandomString = function generateRandomString(length) {
  var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'; // 移除 . 和 ~ 避免 URL 编码问题
  var result = '';
  for (var i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

// 小程序环境的 Base64 编码实现
var base64Encode = function base64Encode(str) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var result = '';
  var i = 0;
  while (i < str.length) {
    var a = str.charCodeAt(i++);
    var b = i < str.length ? str.charCodeAt(i++) : 0;
    var c = i < str.length ? str.charCodeAt(i++) : 0;
    var bitmap = a << 16 | b << 8 | c;
    result += chars.charAt(bitmap >> 18 & 63);
    result += chars.charAt(bitmap >> 12 & 63);
    result += i - 2 < str.length ? chars.charAt(bitmap >> 6 & 63) : '=';
    result += i - 1 < str.length ? chars.charAt(bitmap & 63) : '=';
  }
  return result;
};

// 生成 code_challenge (SHA256 + Base64URL)
var generateCodeChallenge = /*#__PURE__*/function () {
  var _ref = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee(codeVerifier) {
    var encoder, data, hash, base64, base64url, _base, _base64url, _t;
    return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          if (!(typeof crypto !== 'undefined' && crypto.subtle)) {
            _context.n = 2;
            break;
          }
          encoder = new TextEncoder();
          data = encoder.encode(codeVerifier);
          _context.n = 1;
          return crypto.subtle.digest('SHA-256', data);
        case 1:
          hash = _context.v;
          // 转换为 Base64URL
          base64 = base64Encode(String.fromCharCode.apply(String, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(new Uint8Array(hash))));
          base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); // SHA256的Base64URL编码应该是43个字符
          return _context.a(2, base64url);
        case 2:
          throw new Error('Web Crypto API not available');
        case 3:
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          console.warn('SHA256 failed, using fallback:', _t);
          // 降级方案：使用简单的 Base64 编码（仅用于测试）
          _base = base64Encode(codeVerifier);
          _base64url = _base.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
          return _context.a(2, _base64url);
        case 5:
          return _context.a(2);
      }
    }, _callee, null, [[0, 4]]);
  }));
  return function generateCodeChallenge(_x) {
    return _ref.apply(this, arguments);
  };
}();

// WebView 登录 - 使用简化的会话ID方案
var navigateToWebViewLoginSimple = /*#__PURE__*/function () {
  var _ref2 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee2() {
    var response, pkceData, encodedUrl, encodedCodeVerifier, _t2;
    return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          console.log('🚀 请求后端生成PKCE参数...');

          // 调用后端API生成PKCE参数
          _context2.n = 1;
          return _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().request({
            url: "".concat(_config__WEBPACK_IMPORTED_MODULE_1__["default"].api.baseUrl, "/api/auth/mini-pkce"),
            method: 'GET',
            header: {
              'Content-Type': 'application/json'
            }
          });
        case 1:
          response = _context2.v;
          if (!(response.statusCode === 200 && response.data.code === 0)) {
            _context2.n = 2;
            break;
          }
          pkceData = response.data.data;
          console.log('✅ PKCE参数获取成功:', pkceData.loginUrl.substring(0, 100) + '...');

          // 存储 code_verifier 用于后续的 token 交换
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('pkce_code_verifier', pkceData.codeVerifier);

          // 跳转到WebView页面
          encodedUrl = encodeURIComponent(pkceData.loginUrl);
          encodedCodeVerifier = encodeURIComponent(pkceData.codeVerifier);
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().navigateTo({
            url: "/pages/webview/index?url=".concat(encodedUrl, "&code_verifier=").concat(encodedCodeVerifier)
          });
          _context2.n = 3;
          break;
        case 2:
          throw new Error(response.data.message || 'PKCE参数生成失败');
        case 3:
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t2 = _context2.v;
          console.error('❌ WebView登录失败:', _t2);
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().showToast({
            title: '登录失败，请重试',
            icon: 'none'
          });
        case 5:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 4]]);
  }));
  return function navigateToWebViewLoginSimple() {
    return _ref2.apply(this, arguments);
  };
}();

// 登录成功后处理（服务端代理模式）
var handleLoginSuccess = /*#__PURE__*/function () {
  var _ref3 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee3(tempToken) {
    var safeBase64UrlDecodeToString, decodedStr, decoded, accessToken, expiresIn, meResp, userData, userInfo, errorMsg, _t3, _t4;
    return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          console.log('🔄 处理临时 token（本地解析）...');
          console.log('Temp token length:', tempToken ? tempToken.length : 0);

          // ========== 小程序安全的 Base64URL 解码 ==========
          safeBase64UrlDecodeToString = function safeBase64UrlDecodeToString(input) {
            // 将 Base64URL 转为标准 Base64，并补齐 '='
            var base64 = input.replace(/-/g, '+').replace(/_/g, '/');
            var padLen = (4 - base64.length % 4) % 4;
            var padded = base64 + '='.repeat(padLen);
            var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var rev = {};
            for (var i = 0; i < alphabet.length; i++) rev[alphabet[i]] = i;
            var bytes = [];
            var buffer = 0;
            var bits = 0;
            for (var _i = 0; _i < padded.length; _i++) {
              var c = padded[_i];
              if (c === '=') break;
              var val = rev[c];
              if (val === undefined) continue;
              buffer = buffer << 6 | val;
              bits += 6;
              if (bits >= 8) {
                bits -= 8;
                var byte = buffer >> bits & 0xff;
                bytes.push(byte);
                buffer = buffer & (1 << bits) - 1;
              }
            }

            // UTF-8 解码
            var out = '';
            for (var _i2 = 0; _i2 < bytes.length;) {
              var b0 = bytes[_i2++];
              if (b0 < 0x80) {
                out += String.fromCharCode(b0);
              } else if (b0 >= 0xc0 && b0 < 0xe0) {
                var b1 = bytes[_i2++];
                out += String.fromCharCode((b0 & 0x1f) << 6 | b1 & 0x3f);
              } else if (b0 >= 0xe0 && b0 < 0xf0) {
                var _b = bytes[_i2++];
                var b2 = bytes[_i2++];
                out += String.fromCharCode((b0 & 0x0f) << 12 | (_b & 0x3f) << 6 | b2 & 0x3f);
              } else {
                // 超过 BMP 的字符（4 字节），转为代理对
                var _b2 = bytes[_i2++];
                var _b3 = bytes[_i2++];
                var b3 = bytes[_i2++];
                var codePoint = (b0 & 0x07) << 18 | (_b2 & 0x3f) << 12 | (_b3 & 0x3f) << 6 | b3 & 0x3f;
                codePoint -= 0x10000;
                out += String.fromCharCode(0xd800 + (codePoint >> 10 & 0x3ff));
                out += String.fromCharCode(0xdc00 + (codePoint & 0x3ff));
              }
            }
            return out;
          }; // tempToken 为 base64URL(JSON.stringify({ access_token, expires_in, timestamp }))
          decodedStr = safeBase64UrlDecodeToString(tempToken);
          decoded = JSON.parse(decodedStr);
          if (!(!decoded || !decoded.access_token)) {
            _context3.n = 1;
            break;
          }
          throw new Error('无效的临时凭证');
        case 1:
          accessToken = decoded.access_token;
          expiresIn = decoded.expires_in || 3600; // 存储用户 access_token（与后端统一）
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('logto_token', accessToken);
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('token_expires_in', expiresIn);
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('login_timestamp', Date.now());

          // 清除临时登录状态
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('pkce_code_verifier');

          // 尝试通过后端 API 获取用户信息（而不是直接调用 Logto）
          _context3.p = 2;
          _context3.n = 3;
          return _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().request({
            url: "".concat(_config__WEBPACK_IMPORTED_MODULE_1__["default"].api.baseUrl, "/api/me/data"),
            method: 'GET',
            header: getAuthHeaders()
          });
        case 3:
          meResp = _context3.v;
          if (meResp.statusCode === 200 && meResp.data && meResp.data.code === 0) {
            userData = meResp.data.data;
            if (userData !== null && userData !== void 0 && userData.user) {
              userInfo = userData.user;
              _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('user_info', userInfo);
              // 缓存 userId 用于请求透传
              if (userInfo.id) {
                _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().setStorageSync('user_id', userInfo.id);
              }
              console.log('✅ 用户信息已获取并缓存');
            }
          }
          _context3.n = 5;
          break;
        case 4:
          _context3.p = 4;
          _t3 = _context3.v;
          console.warn('⚠️ 获取用户信息失败（可忽略，不影响登录）:', _t3);
          // 不影响登录流程，继续执行
        case 5:
          console.log('✅ 登录成功，令牌已存储');
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().showToast({
            title: '登录成功',
            icon: 'success'
          });

          // 跳转到首页
          setTimeout(function () {
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().redirectTo({
              url: '/pages/home/index',
              fail: function fail() {
                // 如果 redirectTo 失败，使用 reLaunch
                _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().reLaunch({
                  url: '/pages/home/index'
                });
              }
            });
          }, 1000);
          _context3.n = 7;
          break;
        case 6:
          _context3.p = 6;
          _t4 = _context3.v;
          console.error('❌ 处理临时 token 失败:', _t4);
          errorMsg = _t4 instanceof Error ? _t4.message : '登录验证失败';
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().showToast({
            title: errorMsg,
            icon: 'none'
          });
        case 7:
          return _context3.a(2);
      }
    }, _callee3, null, [[2, 4], [0, 6]]);
  }));
  return function handleLoginSuccess(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

// 检查登录状态
var checkLoginStatus = /*#__PURE__*/function () {
  var _ref4 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().m(function _callee4() {
    var accessToken, loginTimestamp, expiresIn, now, tokenAge, maxAge, userInfo, _t5;
    return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"])().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          // 检查 logto_token（WebView登录）
          accessToken = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('logto_token');
          loginTimestamp = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('login_timestamp');
          expiresIn = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('token_expires_in');
          if (!(!accessToken || !loginTimestamp || !expiresIn)) {
            _context4.n = 1;
            break;
          }
          console.log('❌ 登录状态检查失败：缺少必要信息');
          return _context4.a(2, {
            isLoggedIn: false
          });
        case 1:
          // 检查 token 是否过期
          now = Date.now();
          tokenAge = now - loginTimestamp;
          maxAge = expiresIn * 1000; // 转换为毫秒
          if (!(tokenAge > maxAge)) {
            _context4.n = 2;
            break;
          }
          console.log('❌ Token 已过期，清除登录状态');
          clearLoginData();
          return _context4.a(2, {
            isLoggedIn: false
          });
        case 2:
          // 验证 token 是否有效
          userInfo = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('user_info');
          if (userInfo) {
            _context4.n = 3;
            break;
          }
          console.log('❌ 缺少用户信息');
          return _context4.a(2, {
            isLoggedIn: false
          });
        case 3:
          console.log('✅ 登录状态检查成功');
          return _context4.a(2, {
            isLoggedIn: true,
            user: userInfo,
            access_token: accessToken
          });
        case 4:
          _context4.p = 4;
          _t5 = _context4.v;
          console.error('❌ 检查登录状态失败:', _t5);
          return _context4.a(2, {
            isLoggedIn: false
          });
      }
    }, _callee4, null, [[0, 4]]);
  }));
  return function checkLoginStatus() {
    return _ref4.apply(this, arguments);
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
    _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('pkce_code_verifier');
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
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  checkLoginStatus: checkLoginStatus,
  navigateToWebViewLoginSimple: navigateToWebViewLoginSimple,
  handleLoginSuccess: handleLoginSuccess,
  clearLoginData: clearLoginData,
  getAuthHeaders: getAuthHeaders
});

/***/ })

}]);
//# sourceMappingURL=common.js.map