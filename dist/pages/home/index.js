"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/home/index"],{

/***/ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/home/index!./src/pages/home/index.tsx":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/home/index!./src/pages/home/index.tsx ***!
  \**************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ HomePage; }
/* harmony export */ });
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "./node_modules/@babel/runtime/helpers/esm/regenerator.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/container/remote/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var taro_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! taro-ui */ "webpack/container/remote/taro-ui");
/* harmony import */ var taro_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(taro_ui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/taro */ "webpack/container/remote/@tarojs/taro");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/api */ "./src/utils/api.ts");
/* harmony import */ var _utils_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/auth */ "./src/utils/auth.ts");
/* harmony import */ var taro_ui_dist_style_index_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! taro-ui/dist/style/index.scss */ "./node_modules/taro-ui/dist/style/index.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "webpack/container/remote/react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);














var redirectingToLogin = false;

// 导入设备图标
var iconSq = __webpack_require__(/*! ../../assets/images/icon-sq.png */ "./src/assets/images/icon-sq.png");
var iconQx = __webpack_require__(/*! ../../assets/images/icon-qx.png */ "./src/assets/images/icon-qx.png");
var iconZhishang = __webpack_require__(/*! ../../assets/images/icon-zhishang.png */ "./src/assets/images/icon-zhishang.png");
var iconTianqiqxz = __webpack_require__(/*! ../../assets/images/icon-tianqiqxz.png */ "./src/assets/images/icon-tianqiqxz.png");
// 导入搜索图标
var iconSearch = __webpack_require__(/*! ../../assets/images/icon-search.png */ "./src/assets/images/icon-search.png");

// 设备图标列表
var deviceIconList = [{
  connectorIdentifier: 'huayi',
  deviceType: '1',
  icon: iconSq
}, {
  connectorIdentifier: 'huayi',
  deviceType: '2',
  icon: iconQx
}, {
  connectorIdentifier: 'ecois',
  deviceType: '1',
  icon: iconZhishang
}, {
  connectorIdentifier: 'ecois',
  deviceType: '2',
  icon: iconTianqiqxz
}];

// 获取设备图标
var getDeviceIcon = function getDeviceIcon(connectorIdentifier, deviceType) {
  var icon = deviceIconList.find(function (item) {
    return item.connectorIdentifier === connectorIdentifier && item.deviceType === deviceType;
  });
  return icon ? icon.icon : null;
};

// 格式化相对时间
var formatRelativeTime = function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return '从未上报';
  }
  try {
    var deviceLastUpdate = new Date(timestamp);
    var now = new Date();
    var diffMinutes = Math.floor((now.getTime() - deviceLastUpdate.getTime()) / 1000 / 60);
    if (diffMinutes < 1) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return "".concat(diffMinutes, "\u5206\u949F\u524D");
    } else if (diffMinutes < 1440) {
      // 24小时
      var diffHours = Math.floor(diffMinutes / 60);
      return "".concat(diffHours, "\u5C0F\u65F6\u524D");
    } else {
      var diffDays = Math.floor(diffMinutes / 1440);
      return "".concat(diffDays, "\u5929\u524D");
    }
  } catch (error) {
    return '从未上报';
  }
};

// 格式化地理位置
var formatLocation = function formatLocation(item) {
  if (item.province && item.city && item.district) {
    return "".concat(item.province, "\u7701").concat(item.city, "\u5E02").concat(item.district, "\u533A");
  } else if (item.country && item.province && item.city) {
    return "".concat(item.country).concat(item.province, "\u7701").concat(item.city, "\u5E02");
  }
  return item.location || '--';
};
function HomePage() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
    _useState2 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState, 2),
    userInfo = _useState2[0],
    setUserInfo = _useState2[1];
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true),
    _useState4 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState6 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState5, 2),
    groups = _useState6[0],
    setGroups = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState8 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState7, 2),
    tabIdx = _useState8[0],
    setTabIdx = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState0 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState9, 2),
    listsByGroup = _useState0[0],
    setListsByGroup = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState10 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState1, 2),
    searchValue = _useState10[0],
    setSearchValue = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState12 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState11, 2),
    searchKeyword = _useState12[0],
    setSearchKeyword = _useState12[1]; // 实际用于搜索的关键词
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('all'),
    _useState14 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState13, 2),
    deviceTypeFilter = _useState14[0],
    setDeviceTypeFilter = _useState14[1]; // 设备类型筛选：all, 1, 2

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    loadUserInfo();
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!loading) {
      initGroupsAndFirstPage();
    }
  }, [loading]);
  var loadUserInfo = /*#__PURE__*/function () {
    var _ref = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee() {
      var accessToken, loginTimestamp, expiresIn, now, tokenAge, maxAge, cachedUser, meResp, data, _t, _t2;
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            accessToken = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('logto_token');
            loginTimestamp = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('login_timestamp');
            expiresIn = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('token_expires_in');
            if (!(!accessToken || !loginTimestamp || !expiresIn)) {
              _context.n = 2;
              break;
            }
            if (redirectingToLogin) {
              _context.n = 1;
              break;
            }
            redirectingToLogin = true;
            _context.n = 1;
            return (0,_utils_auth__WEBPACK_IMPORTED_MODULE_4__.navigateToWebViewLoginSimple)();
          case 1:
            return _context.a(2);
          case 2:
            now = Date.now();
            tokenAge = now - loginTimestamp;
            maxAge = expiresIn * 1000;
            if (!(tokenAge > maxAge)) {
              _context.n = 4;
              break;
            }
            if (redirectingToLogin) {
              _context.n = 3;
              break;
            }
            redirectingToLogin = true;
            _context.n = 3;
            return (0,_utils_auth__WEBPACK_IMPORTED_MODULE_4__.navigateToWebViewLoginSimple)();
          case 3:
            return _context.a(2);
          case 4:
            redirectingToLogin = false;
            cachedUser = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('user_info');
            if (cachedUser) setUserInfo(cachedUser);
            setLoading(false);
            if (cachedUser) {
              _context.n = 8;
              break;
            }
            _context.p = 5;
            _context.n = 6;
            return _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().request({
              url: "".concat(process.env.TARO_APP_BASE_API || '', "/api/me/data"),
              method: 'GET',
              header: (0,_utils_auth__WEBPACK_IMPORTED_MODULE_4__.getAuthHeaders)()
            });
          case 6:
            meResp = _context.v;
            if (meResp.statusCode === 200 && meResp.data && meResp.data.code === 0) {
              data = meResp.data.data;
              if (data !== null && data !== void 0 && data.user) {
                _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().setStorageSync('user_info', data.user);
                setUserInfo(data.user);
              }
            }
            _context.n = 8;
            break;
          case 7:
            _context.p = 7;
            _t = _context.v;
          case 8:
            _context.n = 10;
            break;
          case 9:
            _context.p = 9;
            _t2 = _context.v;
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().atMessage({
              message: '登录信息获取失败',
              type: 'error'
            });
            setLoading(false);
          case 10:
            return _context.a(2);
        }
      }, _callee, null, [[5, 7], [0, 9]]);
    }));
    return function loadUserInfo() {
      return _ref.apply(this, arguments);
    };
  }();
  var initGroupsAndFirstPage = /*#__PURE__*/function () {
    var _ref2 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee2() {
      var resp, _resp$data, list, _t3;
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            _context2.n = 1;
            return _utils_api__WEBPACK_IMPORTED_MODULE_3__["default"].getMiniGroups();
          case 1:
            resp = _context2.v;
            if (!((resp === null || resp === void 0 ? void 0 : resp.code) === 0)) {
              _context2.n = 2;
              break;
            }
            list = ((_resp$data = resp.data) === null || _resp$data === void 0 ? void 0 : _resp$data.groups) || []; // 去掉"全部"选项
            setGroups(list);
            if (!(list.length > 0 && !listsByGroup[String(list[0].id)])) {
              _context2.n = 2;
              break;
            }
            setTabIdx(0);
            _context2.n = 2;
            return loadDevices(list[0].id, true);
          case 2:
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t3 = _context2.v;
            setGroups([]);
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 3]]);
    }));
    return function initGroupsAndFirstPage() {
      return _ref2.apply(this, arguments);
    };
  }();
  var ensureGroupState = function ensureGroupState(gid) {
    var key = String(gid);
    if (!listsByGroup[key]) {
      setListsByGroup(function (prev) {
        return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, {
          list: [],
          page: 0,
          hasMore: true,
          loading: false
        }));
      });
    }
  };
  var loadDevices = /*#__PURE__*/function () {
    var _ref3 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee3(gid) {
      var refresh,
        key,
        cur,
        nextPage,
        params,
        resp,
        data,
        merged,
        _args3 = arguments,
        _t4;
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            refresh = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : false;
            key = String(gid);
            ensureGroupState(gid);
            cur = listsByGroup[key] || {
              list: [],
              page: 0,
              hasMore: true,
              loading: false
            };
            if (!(!refresh && (cur.loading || !cur.hasMore))) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            nextPage = refresh ? 1 : cur.page + 1;
            setListsByGroup(function (prev) {
              return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, cur), {}, {
                loading: true
              })));
            });
            _context3.p = 2;
            params = {
              groupId: gid,
              page: nextPage,
              pageSize: 20
            };
            if (searchKeyword.trim()) {
              params.search = searchKeyword.trim();
            }
            if (deviceTypeFilter !== 'all') {
              params.devicetype = deviceTypeFilter;
            }
            _context3.n = 3;
            return _utils_api__WEBPACK_IMPORTED_MODULE_3__["default"].getMiniDevices(params);
          case 3:
            resp = _context3.v;
            if ((resp === null || resp === void 0 ? void 0 : resp.code) === 0) {
              data = resp.data;
              merged = refresh ? data.list : cur.list.concat(data.list);
              setListsByGroup(function (prev) {
                return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, {
                  list: merged,
                  page: data.page,
                  hasMore: data.hasMore,
                  loading: false
                }));
              });
            } else {
              setListsByGroup(function (prev) {
                return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, cur), {}, {
                  loading: false
                })));
              });
            }
            _context3.n = 5;
            break;
          case 4:
            _context3.p = 4;
            _t4 = _context3.v;
            setListsByGroup(function (prev) {
              return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, cur), {}, {
                loading: false
              })));
            });
          case 5:
            return _context3.a(2);
        }
      }, _callee3, null, [[2, 4]]);
    }));
    return function loadDevices(_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  // 搜索防抖处理
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var timer = setTimeout(function () {
      setSearchKeyword(searchValue);
    }, 500); // 500ms 防抖
    return function () {
      return clearTimeout(timer);
    };
  }, [searchValue]);

  // 搜索关键词变化时重新加载
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!loading && groups.length > 0 && tabIdx >= 0) {
      var _groups$tabIdx;
      // 重置所有分组的状态并重新加载当前分组
      setListsByGroup({});
      var currentGroupId = (_groups$tabIdx = groups[tabIdx]) === null || _groups$tabIdx === void 0 ? void 0 : _groups$tabIdx.id;
      if (currentGroupId) {
        loadDevices(currentGroupId, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, deviceTypeFilter]);
  var onTabChange = /*#__PURE__*/function () {
    var _ref4 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee4(idx) {
      var gid, key;
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            setTabIdx(idx);
            gid = groups[idx].id;
            key = String(gid);
            if (!(!listsByGroup[key] || listsByGroup[key].list.length === 0)) {
              _context4.n = 1;
              break;
            }
            _context4.n = 1;
            return loadDevices(gid, true);
          case 1:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return function onTabChange(_x2) {
      return _ref4.apply(this, arguments);
    };
  }();
  var onPullDownRefresh = /*#__PURE__*/function () {
    var _ref5 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee5() {
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
            return loadDevices(groups[tabIdx].id, true);
          case 1:
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().stopPullDownRefresh();
          case 2:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return function onPullDownRefresh() {
      return _ref5.apply(this, arguments);
    };
  }();
  var onReachBottom = /*#__PURE__*/function () {
    var _ref6 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee6() {
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.n = 1;
            return loadDevices(groups[tabIdx].id, false);
          case 1:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return function onReachBottom() {
      return _ref6.apply(this, arguments);
    };
  }();
  // @ts-ignore
  _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().usePullDownRefresh(onPullDownRefresh);
  // @ts-ignore
  _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().useReachBottom(onReachBottom);
  var handleSearchChange = function handleSearchChange(value) {
    setSearchValue(value);
  };
  var handleSearchClear = function handleSearchClear() {
    setSearchValue('');
    setSearchKeyword('');
  };
  var handleDeviceTypeChange = function handleDeviceTypeChange(value) {
    setDeviceTypeFilter(value);
    setListsByGroup({});
  };
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
      style: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        fontSize: '18px'
      },
      children: "\u52A0\u8F7D\u4E2D..."
    });
  }
  if (groups.length === 0) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
      style: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        fontSize: '18px',
        color: '#999'
      },
      children: "\u6682\u65E0\u5206\u7EC4\u6570\u636E"
    });
  }
  var curKey = groups[tabIdx] ? String(groups[tabIdx].id) : '';
  var curState = listsByGroup[curKey] || {
    list: [],
    loading: false,
    hasMore: true,
    page: 0
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
    className: "home-page",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtMessage, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
      style: {
        padding: '16px 18px',
        background: '#fff',
        borderBottom: '1px solid #ededed'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
        style: {
          background: '#f5f5f5',
          borderRadius: '8px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Image, {
          src: iconSearch,
          style: {
            width: '16px',
            height: '16px',
            marginRight: '8px'
          },
          mode: "aspectFit"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Input, {
          type: "text",
          value: searchValue,
          onInput: function onInput(e) {
            return handleSearchChange(e.detail.value);
          },
          placeholder: "\u641C\u7D22\u8BBE\u5907\u540D\u79F0\u6216\u7F16\u53F7",
          placeholderStyle: "color:#999",
          style: {
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontSize: '14px',
            outline: 'none'
          }
        }), searchValue && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
          onClick: handleSearchClear,
          style: {
            color: '#999',
            fontSize: '14px',
            padding: '0 4px',
            cursor: 'pointer'
          },
          children: "\u2715"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
        style: {
          marginTop: '12px'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtSegmentedControl, {
          values: ['全部设备', '墒情设备', '气象设备'],
          current: deviceTypeFilter === 'all' ? 0 : deviceTypeFilter === '1' ? 1 : 2,
          onClick: function onClick(index) {
            var value = index === 0 ? 'all' : index === 1 ? '1' : '2';
            handleDeviceTypeChange(value);
          },
          selectedColor: "#1B9AEE"
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtTabs, {
      current: tabIdx,
      tabList: groups.map(function (g) {
        return {
          title: "".concat(g.name).concat(g.count !== undefined ? '(' + g.count + ')' : '')
        };
      }),
      onClick: onTabChange,
      height: "44",
      swipeable: true,
      animated: true,
      tabDirection: "horizontal",
      customStyle: {
        background: '#fff',
        fontSize: '18px'
      },
      children: groups.map(function (group, idx) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtTabsPane, {
          current: tabIdx,
          index: idx,
          customStyle: {
            background: '#f8fafe',
            padding: 0
          },
          children: [curState.loading && curState.list.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px'
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtActivityIndicator, {
              mode: "normal",
              size: 40,
              content: "\u52A0\u8F7D\u8BBE\u5907\u5217\u8868...",
              color: "#1B9AEE"
            })
          }) : curState.list.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
            className: "empty",
            style: {
              fontSize: '17px',
              padding: '36px 0',
              color: '#bbb'
            },
            children: ["\u6682\u65E0 ", group.name, " \u8BBE\u5907"]
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtList, {
            hasBorder: false,
            children: curState.list.map(function (item) {
              var deviceIcon = getDeviceIcon(item.connectorIdentifier || '', item.deviceType || '');
              var location = formatLocation(item);
              var lastUpdateTime = formatRelativeTime(item.lastUpdate);
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
                onClick: function onClick() {
                  _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().navigateTo({
                    url: "/pages/device-detail/index?id=".concat(item.id)
                  });
                },
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 18px',
                  margin: '0 12px',
                  borderBottom: '1px solid #f0f0f0',
                  background: '#fff',
                  cursor: 'pointer'
                },
                children: [deviceIcon && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Image, {
                  src: deviceIcon,
                  style: {
                    width: '60px',
                    height: '75px',
                    objectFit: 'contain',
                    marginRight: '12px'
                  },
                  mode: "aspectFit"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
                  style: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  },
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                      style: {
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#222',
                        display: 'block',
                        marginBottom: '4px'
                      },
                      children: item.name || item.sn
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                      style: {
                        fontSize: '13px',
                        color: '#999',
                        display: 'block',
                        marginBottom: '6px'
                      },
                      children: ["No.", item.sn]
                    })]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                    style: {
                      fontSize: '12px',
                      color: '#999',
                      display: 'block',
                      marginBottom: '4px'
                    },
                    children: location
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                    style: {
                      fontSize: '12px',
                      color: '#999'
                    },
                    children: lastUpdateTime ? "".concat(lastUpdateTime, "\u4E0A\u62A5") : '从未上报'
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                  style: {
                    color: '#ddd',
                    fontSize: '18px',
                    marginLeft: '8px'
                  },
                  children: "\u203A"
                })]
              }, item.id);
            })
          }), curState.loading && curState.list.length !== 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtActivityIndicator, {
            content: "\u52A0\u8F7D\u66F4\u591A...",
            size: 26,
            color: "#3192ff"
          }), !curState.hasMore && curState.list.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
            style: {
              textAlign: 'center',
              fontSize: '15px',
              color: '#aaa',
              margin: '20px 0 8px 0'
            },
            children: "\u6CA1\u6709\u66F4\u591A\u4E86"
          })]
        }, group.id);
      })
    })]
  });
}

/***/ }),

/***/ "./src/pages/home/index.tsx":
/*!**********************************!*\
  !*** ./src/pages/home/index.tsx ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/runtime */ "webpack/container/remote/@tarojs/runtime");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_home_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/home/index!./index.tsx */ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/home/index!./src/pages/home/index.tsx");


var config = {};


var inst = Page((0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__.createPageConfig)(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_home_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"], 'pages/home/index', {root:{cn:[]}}, config || {}))


/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_home_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ }),

/***/ "./src/assets/images/icon-search.png":
/*!*******************************************!*\
  !*** ./src/assets/images/icon-search.png ***!
  \*******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/icon-search.png";

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/home/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map