"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/webview/index"],{

/***/ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/webview/index!./src/pages/webview/index.tsx":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/webview/index!./src/pages/webview/index.tsx ***!
  \********************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ WebviewPage; }
/* harmony export */ });
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "./node_modules/@babel/runtime/helpers/esm/regenerator.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/container/remote/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/taro */ "webpack/container/remote/@tarojs/taro");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/auth */ "./src/utils/auth.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "webpack/container/remote/react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* provided dependency */ var URL = __webpack_require__(/*! @tarojs/runtime */ "webpack/container/remote/@tarojs/runtime")["URL"];
/* provided dependency */ var window = __webpack_require__(/*! @tarojs/runtime */ "webpack/container/remote/@tarojs/runtime")["window"];









function WebviewPage() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState2 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(_useState, 2),
    src = _useState2[0],
    setSrc = _useState2[1];
  (0,_tarojs_taro__WEBPACK_IMPORTED_MODULE_1__.useLoad)(function (options) {
    var url = options !== null && options !== void 0 && options.url ? decodeURIComponent(options.url) : '';
    var codeVerifier = options !== null && options !== void 0 && options.code_verifier ? decodeURIComponent(options.code_verifier) : '';

    // 验证URL有效性
    if (!url || url === '' || url === 'undefined' || url === 'null') {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
        title: '登录URL无效',
        icon: 'none'
      });
      setTimeout(function () {
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().navigateBack();
      }, 2000);
      return;
    }

    // 验证URL格式
    try {
      var urlObj = new URL(url);
      if (!urlObj.protocol.startsWith('http')) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
        title: '登录URL格式错误',
        icon: 'none'
      });
      setTimeout(function () {
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().navigateBack();
      }, 2000);
      return;
    }
    setSrc(url);

    // 存储 code_verifier
    if (codeVerifier) {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().setStorageSync('pkce_code_verifier', codeVerifier);
    }
  });

  // 处理 WebView 消息
  var handleMessage = /*#__PURE__*/function () {
    var _ref = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_5__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__["default"])().m(function _callee(e) {
      var _e$detail, _e$detail2, messageData, firstItem, _firstItem, _t;
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__["default"])().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            messageData = null; // 解析消息数据
            if (e !== null && e !== void 0 && (_e$detail = e.detail) !== null && _e$detail !== void 0 && _e$detail.data && Array.isArray(e.detail.data) && e.detail.data.length > 0) {
              firstItem = e.detail.data[0];
              messageData = Array.isArray(firstItem) ? firstItem[0] : firstItem;
            } else if (e !== null && e !== void 0 && (_e$detail2 = e.detail) !== null && _e$detail2 !== void 0 && _e$detail2.data && (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_7__["default"])(e.detail.data) === 'object' && !Array.isArray(e.detail.data)) {
              messageData = e.detail.data;
            } else if (e !== null && e !== void 0 && e.data && Array.isArray(e.data) && e.data.length > 0) {
              _firstItem = e.data[0];
              messageData = Array.isArray(_firstItem) ? _firstItem[0] : _firstItem;
            } else if (e !== null && e !== void 0 && e.data && (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_7__["default"])(e.data) === 'object' && !Array.isArray(e.data)) {
              messageData = e.data;
            }
            if (messageData) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            // 确保 messageData 不是数组
            if (Array.isArray(messageData)) {
              messageData = messageData[0];
            }

            // 处理不同类型的消息
            if (!messageData.token) {
              _context.n = 3;
              break;
            }
            _context.n = 2;
            return (0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.handleLoginSuccess)(messageData.token);
          case 2:
            _context.n = 6;
            break;
          case 3:
            if (!(messageData.type === 'url_hash' && messageData.temp_token)) {
              _context.n = 5;
              break;
            }
            _context.n = 4;
            return (0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.handleLoginSuccess)(messageData.temp_token);
          case 4:
            _context.n = 6;
            break;
          case 5:
            if (messageData.error) {
              // 登录失败
              _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showModal({
                title: '登录失败',
                content: messageData.error || '登录失败，请重试',
                showCancel: false
              });
            }
          case 6:
            _context.n = 8;
            break;
          case 7:
            _context.p = 7;
            _t = _context.v;
            console.error('处理登录消息失败:', _t);
          case 8:
            return _context.a(2);
        }
      }, _callee, null, [[0, 7]]);
    }));
    return function handleMessage(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  // 处理 WebView 加载错误
  var handleError = function handleError(e) {
    _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showModal({
      title: '加载失败',
      content: '无法加载登录页面，请检查网络连接',
      showCancel: true,
      confirmText: '重试',
      cancelText: '返回',
      success: function success(res) {
        if (res.confirm) {
          // 刷新页面
          window.location.reload();
        } else {
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().navigateBack();
        }
      }
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_8__.View, {
    style: {
      height: '100vh',
      width: '100vw'
    },
    children: src ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_8__.WebView, {
      src: src,
      style: {
        height: '100vh',
        width: '100vw'
      },
      onMessage: handleMessage,
      onError: handleError
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_8__.View, {
      style: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_8__.Text, {
        children: "\u6B63\u5728\u521D\u59CB\u5316..."
      })
    })
  });
}

/***/ }),

/***/ "./src/pages/webview/index.tsx":
/*!*************************************!*\
  !*** ./src/pages/webview/index.tsx ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/runtime */ "webpack/container/remote/@tarojs/runtime");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_webview_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/webview/index!./index.tsx */ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/webview/index!./src/pages/webview/index.tsx");


var config = {"navigationBarTitleText":"登录认证"};


var inst = Page((0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__.createPageConfig)(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_webview_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"], 'pages/webview/index', {root:{cn:[]}}, config || {}))


/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_webview_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _typeof; }
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/webview/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map