"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/index/index"],{

/***/ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ IndexPage; }
/* harmony export */ });
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "./node_modules/@babel/runtime/helpers/esm/regenerator.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/container/remote/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/taro */ "webpack/container/remote/@tarojs/taro");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/auth */ "./src/utils/auth.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "webpack/container/remote/react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);








function IndexPage() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
    _useState2 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(_useState, 2),
    hasChecked = _useState2[0],
    setHasChecked = _useState2[1];

  // 首次加载检查
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    checkLoginAndRedirect();
  }, []);
  var checkLoginAndRedirect = /*#__PURE__*/function () {
    var _ref = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_5__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__["default"])().m(function _callee() {
      var loginResult, silentLoginResult, _silentLoginResult, _t, _t2;
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__["default"])().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            setHasChecked(true);
            _context.p = 1;
            _context.n = 2;
            return (0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.checkLoginStatus)();
          case 2:
            loginResult = _context.v;
            if (!loginResult.isLoggedIn) {
              _context.n = 3;
              break;
            }
            // 已登录，跳转到首页
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().switchTab({
              url: '/pages/home/index',
              fail: function fail() {
                _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().reLaunch({
                  url: '/pages/home/index'
                });
              }
            });
            _context.n = 5;
            break;
          case 3:
            // 未登录，尝试微信静默登录
            console.log('🔄 尝试微信静默登录...');
            _context.n = 4;
            return (0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.wechatSilentLogin)();
          case 4:
            silentLoginResult = _context.v;
            if (silentLoginResult.success) {
              // 静默登录成功，跳转到首页
              console.log('✅ 微信静默登录成功');
              _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().switchTab({
                url: '/pages/home/index',
                fail: function fail() {
                  _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().reLaunch({
                    url: '/pages/home/index'
                  });
                }
              });
            } else {
              // 静默登录失败，显示错误提示
              console.error('❌ 微信静默登录失败:', silentLoginResult.error);
              _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
                title: silentLoginResult.error || '登录失败，请重试',
                icon: 'none',
                duration: 3000
              });
            }
          case 5:
            _context.n = 10;
            break;
          case 6:
            _context.p = 6;
            _t = _context.v;
            console.error('检查登录状态失败:', _t);
            // 发生错误时，尝试静默登录
            _context.p = 7;
            _context.n = 8;
            return (0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.wechatSilentLogin)();
          case 8:
            _silentLoginResult = _context.v;
            if (_silentLoginResult.success) {
              _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().switchTab({
                url: '/pages/home/index',
                fail: function fail() {
                  _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().reLaunch({
                    url: '/pages/home/index'
                  });
                }
              });
            } else {
              _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
                title: _silentLoginResult.error || '登录失败，请重试',
                icon: 'none',
                duration: 3000
              });
            }
            _context.n = 10;
            break;
          case 9:
            _context.p = 9;
            _t2 = _context.v;
            console.error('登录失败:', _t2);
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
              title: '登录失败，请重试',
              icon: 'none',
              duration: 3000
            });
          case 10:
            return _context.a(2);
        }
      }, _callee, null, [[7, 9], [1, 6]]);
    }));
    return function checkLoginAndRedirect() {
      return _ref.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_7__.View, {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_7__.Text, {
      children: "\u6B63\u5728\u521D\u59CB\u5316..."
    })
  });
}

/***/ }),

/***/ "./src/pages/index/index.tsx":
/*!***********************************!*\
  !*** ./src/pages/index/index.tsx ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/runtime */ "webpack/container/remote/@tarojs/runtime");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./index.tsx */ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx");


var config = {"navigationBarTitleText":"农业物联"};


var inst = Page((0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__.createPageConfig)(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"], 'pages/index/index', {root:{cn:[]}}, config || {}))


/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/index/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map