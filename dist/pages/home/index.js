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














// 导入设备图标

var iconSq = __webpack_require__(/*! ../../assets/images/icon-sq.png */ "./src/assets/images/icon-sq.png");
var iconQx = __webpack_require__(/*! ../../assets/images/icon-qx.png */ "./src/assets/images/icon-qx.png");
var iconZhishang = __webpack_require__(/*! ../../assets/images/icon-zhishang.png */ "./src/assets/images/icon-zhishang.png");
var iconTianqiqxz = __webpack_require__(/*! ../../assets/images/icon-tianqiqxz.png */ "./src/assets/images/icon-tianqiqxz.png");
// 导入搜索图标
var iconSearch = __webpack_require__(/*! ../../assets/images/icon-search.png */ "./src/assets/images/icon-search.png");
var iconDown = __webpack_require__(/*! ../../assets/images/icon-down.png */ "./src/assets/images/icon-down.png");

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
var deviceStatusList = [{
  label: '在线',
  value: 'Online',
  color: '#52c41a'
}, {
  label: '离线',
  value: 'Offline',
  color: '#F1AE55'
}];

// 获取设备图标
var getDeviceIcon = function getDeviceIcon(connectorIdentifier, deviceType) {
  var icon = deviceIconList.find(function (item) {
    return item.connectorIdentifier === connectorIdentifier && item.deviceType === deviceType;
  });
  return icon ? icon.icon : null;
};
var getDeviceStatusInfo = function getDeviceStatusInfo(statusCode) {
  if (!statusCode) {
    return null;
  }
  var status = deviceStatusList.find(function (item) {
    return item.value === statusCode;
  });
  return status || {
    label: '未知',
    color: '#fa607e'
  };
};
var appendSuffix = function appendSuffix(value, suffix) {
  if (!value) {
    return value;
  }
  return value.endsWith(suffix) ? value : "".concat(value).concat(suffix);
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
  var segments = [];
  if (item.province) {
    segments.push(appendSuffix(item.province, '省'));
  }
  if (item.city) {
    segments.push(appendSuffix(item.city, '市'));
  }
  if (item.district) {
    segments.push(item.district);
  }
  if (segments.length > 0) {
    return segments.join('');
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
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true),
    _useState6 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState5, 2),
    groupsLoading = _useState6[0],
    setGroupsLoading = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
    _useState8 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState7, 2),
    groups = _useState8[0],
    setGroups = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState0 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState9, 2),
    tabIdx = _useState0[0],
    setTabIdx = _useState0[1];
  var _useState1 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
    _useState10 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState1, 2),
    listsByGroup = _useState10[0],
    setListsByGroup = _useState10[1];
  var _useState11 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState12 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState11, 2),
    searchValue = _useState12[0],
    setSearchValue = _useState12[1];
  var _useState13 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),
    _useState14 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState13, 2),
    searchKeyword = _useState14[0],
    setSearchKeyword = _useState14[1]; // 实际用于搜索的关键词
  var _useState15 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('all'),
    _useState16 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState15, 2),
    deviceTypeFilter = _useState16[0],
    setDeviceTypeFilter = _useState16[1]; // 设备类型筛选：all, 1, 2
  var _useState17 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
    _useState18 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState17, 2),
    headerHeight = _useState18[0],
    setHeaderHeight = _useState18[1];
  var deviceTypeOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return [{
      label: '全部设备',
      value: 'all'
    }, {
      label: '墒情设备',
      value: '1'
    }, {
      label: '气象设备',
      value: '2'
    }];
  }, []);

  // 使用ref来避免闭包陷阱，存储最新的状态值
  var searchKeywordRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)('');
  var deviceTypeFilterRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)('all');
  var listsByGroupRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({});
  var initGroupsCalledRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  var searchReloadingRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false); // 防止搜索重新加载的重复触发
  var prevSearchKeywordRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(''); // 跟踪上一次的搜索关键词
  var prevDeviceTypeFilterRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)('all'); // 跟踪上一次的设备类型筛选
  var redirectingToLoginRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  var updateTabBarBadge = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (count) {
    try {
      if (count > 0) {
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().setTabBarBadge({
          index: 1,
          text: count > 99 ? '99+' : String(count)
        });
      } else {
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().removeTabBarBadge({
          index: 1
        });
      }
    } catch (error) {
      console.warn('更新消息角标失败:', error);
    }
  }, []);
  var refreshUnreadMessageBadge = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee() {
    var accessToken, resp, _resp$data$total, _resp$data, total, _t;
    return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          // 先检查是否有token，没有token就不调用接口
          accessToken = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('logto_token');
          if (accessToken) {
            _context.n = 1;
            break;
          }
          console.log('⏭️ 未登录，跳过刷新消息角标');
          return _context.a(2);
        case 1:
          _context.p = 1;
          _context.n = 2;
          return _utils_api__WEBPACK_IMPORTED_MODULE_3__["default"].getMessages({
            page: 1,
            pageSize: 1,
            isRead: 'false'
          });
        case 2:
          resp = _context.v;
          if ((resp === null || resp === void 0 ? void 0 : resp.code) === 0) {
            total = (_resp$data$total = (_resp$data = resp.data) === null || _resp$data === void 0 ? void 0 : _resp$data.total) !== null && _resp$data$total !== void 0 ? _resp$data$total : 0;
            updateTabBarBadge(total);
          }
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
          console.warn('获取未读消息数量失败:', _t);
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[1, 3]]);
  })), [updateTabBarBadge]);

  // 同步ref和state
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    searchKeywordRef.current = searchKeyword;
  }, [searchKeyword]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    deviceTypeFilterRef.current = deviceTypeFilter;
  }, [deviceTypeFilter]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    listsByGroupRef.current = listsByGroup;
  }, [listsByGroup]);

  // 只在首次加载时检查登录状态
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    loadUserInfo();
  }, []);

  // 登录完成后，刷新消息角标
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!loading) {
      refreshUnreadMessageBadge();
    }
  }, [loading, refreshUnreadMessageBadge]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!loading) {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().nextTick(function () {
        var query = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().createSelectorQuery();
        query.select('.home-fixed-header').boundingClientRect(function (rect) {
          var resolvedRect = Array.isArray(rect) ? rect === null || rect === void 0 ? void 0 : rect[0] : rect;
          if (resolvedRect && resolvedRect.height) {
            setHeaderHeight(resolvedRect.height);
          }
        }).exec();
      });
    }
  }, [loading]);

  // 页面显示时只刷新消息角标，不重新检查登录（避免重复调用）
  _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().useDidShow(function () {
    refreshUnreadMessageBadge();
    // 移除 loadUserInfo() 调用，避免重复登录检查
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    // 确保登录完成（loading为false）后再初始化分组和设备列表
    if (!loading && !initGroupsCalledRef.current) {
      // 再次确认有token
      var accessToken = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('logto_token');
      if (accessToken) {
        initGroupsCalledRef.current = true;
        initGroupsAndFirstPage();
      }
    }
  }, [loading]);
  var loadUserInfo = /*#__PURE__*/function () {
    var _ref2 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee2() {
      var accessToken, loginTimestamp, expiresIn, result, now, tokenAge, maxAge, _result, finalToken, cachedUser, finalUser, meResp, data, _t2, _t3;
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            accessToken = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('logto_token');
            loginTimestamp = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('login_timestamp');
            expiresIn = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('token_expires_in');
            if (!(!accessToken || !loginTimestamp || !expiresIn)) {
              _context2.n = 5;
              break;
            }
            if (redirectingToLoginRef.current) {
              _context2.n = 3;
              break;
            }
            redirectingToLoginRef.current = true;
            _context2.n = 1;
            return (0,_utils_auth__WEBPACK_IMPORTED_MODULE_4__.wechatSilentLogin)();
          case 1:
            result = _context2.v;
            if (result.success) {
              _context2.n = 2;
              break;
            }
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().showToast({
              title: '登录失败，请重试',
              icon: 'none'
            });
            setLoading(false);
            return _context2.a(2);
          case 2:
            // 登录成功后，重置redirectingToLoginRef，继续后续流程
            redirectingToLoginRef.current = false;
            _context2.n = 4;
            break;
          case 3:
            return _context2.a(2);
          case 4:
            _context2.n = 9;
            break;
          case 5:
            now = Date.now();
            tokenAge = now - loginTimestamp;
            maxAge = expiresIn * 1000;
            if (!(tokenAge > maxAge)) {
              _context2.n = 9;
              break;
            }
            if (redirectingToLoginRef.current) {
              _context2.n = 8;
              break;
            }
            redirectingToLoginRef.current = true;
            _context2.n = 6;
            return (0,_utils_auth__WEBPACK_IMPORTED_MODULE_4__.wechatSilentLogin)();
          case 6:
            _result = _context2.v;
            if (_result.success) {
              _context2.n = 7;
              break;
            }
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().showToast({
              title: '登录已过期，请重试',
              icon: 'none'
            });
            setLoading(false);
            return _context2.a(2);
          case 7:
            // 登录成功后，重置redirectingToLoginRef，继续后续流程
            redirectingToLoginRef.current = false;
            _context2.n = 9;
            break;
          case 8:
            return _context2.a(2);
          case 9:
            // 确保有有效的token后再继续
            finalToken = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('logto_token');
            if (finalToken) {
              _context2.n = 10;
              break;
            }
            setLoading(false);
            return _context2.a(2);
          case 10:
            redirectingToLoginRef.current = false;
            cachedUser = _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().getStorageSync('user_info');
            finalUser = cachedUser;
            if (!cachedUser) {
              _context2.n = 11;
              break;
            }
            setUserInfo(cachedUser);
            _context2.n = 14;
            break;
          case 11:
            _context2.p = 11;
            _context2.n = 12;
            return _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().request({
              url: "".concat(process.env.TARO_APP_BASE_API || '', "/api/me/data"),
              method: 'GET',
              header: (0,_utils_auth__WEBPACK_IMPORTED_MODULE_4__.getAuthHeaders)()
            });
          case 12:
            meResp = _context2.v;
            if (meResp.statusCode === 200 && meResp.data && meResp.data.code === 0) {
              data = meResp.data.data;
              if (data !== null && data !== void 0 && data.user) {
                _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().setStorageSync('user_info', data.user);
                setUserInfo(data.user);
                finalUser = data.user;
              }
            }
            _context2.n = 14;
            break;
          case 13:
            _context2.p = 13;
            _t2 = _context2.v;
          case 14:
            setLoading(false);
            _context2.n = 16;
            break;
          case 15:
            _context2.p = 15;
            _t3 = _context2.v;
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().atMessage({
              message: '登录信息获取失败',
              type: 'error'
            });
            setLoading(false);
          case 16:
            return _context2.a(2);
        }
      }, _callee2, null, [[11, 13], [0, 15]]);
    }));
    return function loadUserInfo() {
      return _ref2.apply(this, arguments);
    };
  }();
  var initGroupsAndFirstPage = /*#__PURE__*/function () {
    var _ref3 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee3() {
      var resp, _resp$data2, list, _t4;
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            setGroupsLoading(true);
            console.log('[Home] 开始加载分组...');
            _context3.n = 1;
            return _utils_api__WEBPACK_IMPORTED_MODULE_3__["default"].getMiniGroups();
          case 1:
            resp = _context3.v;
            console.log('[Home] 分组API响应:', resp);
            if (!((resp === null || resp === void 0 ? void 0 : resp.code) === 0)) {
              _context3.n = 4;
              break;
            }
            list = ((_resp$data2 = resp.data) === null || _resp$data2 === void 0 ? void 0 : _resp$data2.groups) || [];
            console.log('[Home] 分组列表:', list);
            // 设置分组列表
            setGroups(list);
            if (!(list.length > 0)) {
              _context3.n = 3;
              break;
            }
            setTabIdx(0);
            console.log('[Home] 开始加载第一个分组的设备...', list[0].id);
            // 直接加载第一个分组的数据，不检查缓存（首次加载应该总是刷新）
            _context3.n = 2;
            return loadDevices(list[0].id, true);
          case 2:
            console.log('[Home] 第一个分组设备加载完成');
          case 3:
            _context3.n = 5;
            break;
          case 4:
            console.warn('[Home] 分组API返回错误:', resp);
            setGroups([]);
          case 5:
            _context3.n = 7;
            break;
          case 6:
            _context3.p = 6;
            _t4 = _context3.v;
            console.error('[Home] 初始化分组失败:', _t4);
            setGroups([]);
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().atMessage({
              message: '加载分组失败',
              type: 'error'
            });
          case 7:
            _context3.p = 7;
            setGroupsLoading(false);
            return _context3.f(7);
          case 8:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 6, 7, 8]]);
    }));
    return function initGroupsAndFirstPage() {
      return _ref3.apply(this, arguments);
    };
  }();
  var ensureGroupState = function ensureGroupState(gid) {
    var key = String(gid);
    var currentLists = listsByGroupRef.current;
    if (!currentLists[key]) {
      var newState = {
        list: [],
        page: 0,
        hasMore: true,
        loading: false
      };
      // 先更新ref，再更新state，确保同步
      listsByGroupRef.current = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, currentLists), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, newState));
      setListsByGroup(function (prev) {
        return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, newState));
      });
    }
  };
  var loadDevices = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/function () {
    var _ref4 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee4(gid) {
      var refresh,
        key,
        currentLists,
        cur,
        nextPage,
        params,
        currentSearchKeyword,
        currentDeviceTypeFilter,
        resp,
        data,
        merged,
        _args4 = arguments,
        _t5;
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            refresh = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : false;
            key = String(gid);
            console.log("[Home] loadDevices \u8C03\u7528: groupId=".concat(gid, ", refresh=").concat(refresh));
            ensureGroupState(gid);

            // 使用ref获取最新状态，避免闭包陷阱
            currentLists = listsByGroupRef.current;
            cur = currentLists[key] || {
              list: [],
              page: 0,
              hasMore: true,
              loading: false
            }; // 防止重复加载
            if (!(!refresh && (cur.loading || !cur.hasMore))) {
              _context4.n = 1;
              break;
            }
            console.log("[Home] \u8DF3\u8FC7\u52A0\u8F7D: loading=".concat(cur.loading, ", hasMore=").concat(cur.hasMore));
            return _context4.a(2, Promise.resolve());
          case 1:
            nextPage = refresh ? 1 : cur.page + 1;
            console.log("[Home] \u5F00\u59CB\u8BF7\u6C42\u8BBE\u5907\u5217\u8868: page=".concat(nextPage));

            // 更新loading状态
            setListsByGroup(function (prev) {
              var updated = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, cur), {}, {
                loading: true
              })));
              listsByGroupRef.current = updated;
              return updated;
            });
            _context4.p = 2;
            params = {
              groupId: gid,
              page: nextPage,
              pageSize: 20
            }; // 使用ref获取最新的搜索关键词和设备类型筛选
            currentSearchKeyword = searchKeywordRef.current.trim();
            currentDeviceTypeFilter = deviceTypeFilterRef.current;
            if (currentSearchKeyword) {
              params.search = currentSearchKeyword;
            }
            if (currentDeviceTypeFilter !== 'all') {
              params.devicetype = currentDeviceTypeFilter;
            }
            _context4.n = 3;
            return _utils_api__WEBPACK_IMPORTED_MODULE_3__["default"].getMiniDevices(params);
          case 3:
            resp = _context4.v;
            console.log("[Home] \u8BBE\u5907\u5217\u8868API\u54CD\u5E94:", resp);
            if ((resp === null || resp === void 0 ? void 0 : resp.code) === 0) {
              data = resp.data;
              merged = refresh ? data.list : cur.list.concat(data.list);
              console.log("[Home] \u8BBE\u5907\u5217\u8868\u52A0\u8F7D\u6210\u529F: \u603B\u6570=".concat(merged.length, ", \u5F53\u524D\u9875=").concat(data.page, ", \u662F\u5426\u6709\u66F4\u591A=").concat(data.hasMore));
              setListsByGroup(function (prev) {
                var updated = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, {
                  list: merged,
                  page: data.page,
                  hasMore: data.hasMore,
                  loading: false
                }));
                listsByGroupRef.current = updated;
                return updated;
              });
            } else {
              console.warn("[Home] \u8BBE\u5907\u5217\u8868API\u8FD4\u56DE\u9519\u8BEF:", resp);
              setListsByGroup(function (prev) {
                var updated = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, cur), {}, {
                  loading: false
                })));
                listsByGroupRef.current = updated;
                return updated;
              });
            }
            _context4.n = 5;
            break;
          case 4:
            _context4.p = 4;
            _t5 = _context4.v;
            console.error("[Home] \u52A0\u8F7D\u8BBE\u5907\u5217\u8868\u5931\u8D25:", _t5);
            setListsByGroup(function (prev) {
              var updated = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev), {}, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, key, (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, cur), {}, {
                loading: false
              })));
              listsByGroupRef.current = updated;
              return updated;
            });
          case 5:
            return _context4.a(2);
        }
      }, _callee4, null, [[2, 4]]);
    }));
    return function (_x) {
      return _ref4.apply(this, arguments);
    };
  }(), []);

  // 搜索防抖处理
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var timer = setTimeout(function () {
      setSearchKeyword(searchValue);
    }, 500); // 500ms 防抖
    return function () {
      return clearTimeout(timer);
    };
  }, [searchValue]);

  // 搜索关键词变化时重新加载（只在搜索关键词或筛选条件变化时触发）
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    // 检查是否真的发生了变化（避免初始化时触发）
    var searchChanged = searchKeyword !== prevSearchKeywordRef.current;
    var filterChanged = deviceTypeFilter !== prevDeviceTypeFilterRef.current;
    if (!searchChanged && !filterChanged) {
      // 没有变化，不执行
      return;
    }

    // 更新prevRef
    prevSearchKeywordRef.current = searchKeyword;
    prevDeviceTypeFilterRef.current = deviceTypeFilter;

    // 防止在groups或tabIdx变化时触发（这些变化由其他逻辑处理）
    // 需要等待loading完成且groups已初始化
    if (!loading && groups.length > 0 && tabIdx >= 0 && groups[tabIdx] && !searchReloadingRef.current) {
      searchReloadingRef.current = true;
      var currentGroupId = groups[tabIdx].id;

      // 重置当前分组的状态并重新加载
      var key = String(currentGroupId);
      setListsByGroup(function (prev) {
        var updated = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, prev);
        delete updated[key];
        listsByGroupRef.current = updated;
        return updated;
      });

      // 直接调用loadDevices，ensureGroupState会处理状态初始化
      loadDevices(currentGroupId, true).then(function () {
        searchReloadingRef.current = false;
      }).catch(function () {
        searchReloadingRef.current = false;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, deviceTypeFilter]); // 只依赖搜索相关的状态
  var onTabChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/function () {
    var _ref5 = (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee5(idx) {
      var gid;
      return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            setTabIdx(idx);
            // 直接使用groups，因为useCallback会在groups变化时重新创建
            if (!groups[idx]) {
              _context5.n = 1;
              break;
            }
            gid = groups[idx].id; // 切换tab时总是重新加载，确保应用当前的筛选条件（搜索关键词和设备类型）
            _context5.n = 1;
            return loadDevices(gid, true);
          case 1:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return function (_x2) {
      return _ref5.apply(this, arguments);
    };
  }(), [groups, loadDevices]);
  var onPullDownRefresh = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee6() {
    var currentGroups, currentTabIdx;
    return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          currentGroups = groups;
          currentTabIdx = tabIdx;
          if (!currentGroups[currentTabIdx]) {
            _context6.n = 1;
            break;
          }
          _context6.n = 1;
          return loadDevices(currentGroups[currentTabIdx].id, true);
        case 1:
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().stopPullDownRefresh();
        case 2:
          return _context6.a(2);
      }
    }, _callee6);
  })), [groups, tabIdx, loadDevices]);
  var onReachBottom = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee7() {
    var currentGroups, currentTabIdx;
    return (0,_Users_insentek_WorkSpace_insentek_web_eco_viz_mini_program_eco_viz_mini_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          currentGroups = groups;
          currentTabIdx = tabIdx;
          if (!currentGroups[currentTabIdx]) {
            _context7.n = 1;
            break;
          }
          _context7.n = 1;
          return loadDevices(currentGroups[currentTabIdx].id, false);
        case 1:
          return _context7.a(2);
      }
    }, _callee7);
  })), [groups, tabIdx, loadDevices]);

  // 注册下拉刷新和上拉加载（Taro hooks需要在组件顶层调用）
  // 使用useCallback确保回调函数稳定，避免重复注册导致的问题
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
    // 不需要手动重置，useEffect会自动处理
  };
  var handleDeviceTypePickerChange = function handleDeviceTypePickerChange(event) {
    var _event$detail$value, _event$detail, _deviceTypeOptions$in;
    var index = Number((_event$detail$value = event === null || event === void 0 || (_event$detail = event.detail) === null || _event$detail === void 0 ? void 0 : _event$detail.value) !== null && _event$detail$value !== void 0 ? _event$detail$value : 0);
    var selected = ((_deviceTypeOptions$in = deviceTypeOptions[index]) === null || _deviceTypeOptions$in === void 0 ? void 0 : _deviceTypeOptions$in.value) || 'all';
    handleDeviceTypeChange(selected);
  };
  var currentDeviceTypeLabel = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    var found = deviceTypeOptions.find(function (option) {
      return option.value === deviceTypeFilter;
    });
    return found ? found.label : '全部设备';
  }, [deviceTypeFilter, deviceTypeOptions]);

  // 使用useMemo缓存tabList，避免每次渲染都重新计算（必须在条件返回之前）
  var tabList = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return groups.map(function (g) {
      return {
        title: "".concat(g.name).concat(g.count !== undefined ? '(' + g.count + ')' : '')
      };
    });
  }, [groups]);
  var tabsCustomStyle = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      '--home-tabs-offset': "".concat(headerHeight, "px")
    };
  }, [headerHeight]);
  if (loading || groupsLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
      className: "home-loading",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtActivityIndicator, {
        mode: "normal",
        size: 40,
        content: "\u52A0\u8F7D\u4E2D...",
        color: "#1B9AEE"
      })
    });
  }
  if (groups.length === 0) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
      className: "home-empty-groups",
      children: "\u6682\u65E0\u5206\u7EC4\u6570\u636E"
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
    className: "home-page",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtMessage, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
      className: "home-fixed-header",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
        className: "home-search-row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
          className: "home-search-bar",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Image, {
            src: iconSearch,
            className: "home-search-icon",
            mode: "aspectFit"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Input, {
            type: "text",
            value: searchValue,
            onInput: function onInput(e) {
              return handleSearchChange(e.detail.value);
            },
            placeholder: "\u641C\u7D22\u8BBE\u5907\u540D\u79F0\u6216\u7F16\u53F7",
            placeholderStyle: "color:#999",
            className: "home-search-input"
          }), searchValue && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
            onClick: handleSearchClear,
            className: "home-search-clear",
            children: "\u2715"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Picker, {
          mode: "selector",
          range: deviceTypeOptions.map(function (option) {
            return option.label;
          }),
          value: deviceTypeFilter === 'all' ? 0 : deviceTypeFilter === '1' ? 1 : 2,
          onChange: handleDeviceTypePickerChange,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
            className: "home-filter-select",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
              className: "home-filter-select-label",
              children: currentDeviceTypeLabel
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Image, {
              src: iconDown,
              className: "home-filter-select-arrow",
              mode: "aspectFit"
            })]
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
      className: "home-tabs-wrapper",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtTabs, {
        className: "home-tabs",
        current: tabIdx,
        tabList: tabList,
        onClick: onTabChange,
        height: "44",
        swipeable: true,
        animated: true,
        tabDirection: "horizontal",
        customStyle: tabsCustomStyle,
        children: groups.map(function (group, idx) {
          var paneKey = String(group.id);
          var paneState = listsByGroup[paneKey] || {
            list: [],
            loading: false,
            hasMore: true,
            page: 0
          };
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtTabsPane, {
            current: tabIdx,
            index: idx,
            customStyle: {
              padding: 0
            },
            children: [paneState.loading && paneState.list.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
              className: "home-pane-loading",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtActivityIndicator, {
                mode: "normal",
                size: 40,
                content: "\u52A0\u8F7D\u8BBE\u5907\u5217\u8868...",
                color: "#1B9AEE"
              })
            }) : paneState.list.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
              className: "empty",
              children: ["\u6682\u65E0 ", group.name, " \u8BBE\u5907"]
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtList, {
              hasBorder: false,
              children: paneState.list.map(function (item) {
                var deviceIcon = getDeviceIcon(item.connectorIdentifier || '', item.deviceType || '');
                var location = formatLocation(item);
                var lastUpdateTime = formatRelativeTime(item.lastUpdate);
                var statusInfo = getDeviceStatusInfo(item.status);
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
                  onClick: function onClick() {
                    _tarojs_taro__WEBPACK_IMPORTED_MODULE_2___default().navigateTo({
                      url: "/pages/device-detail/index?id=".concat(item.id)
                    });
                  },
                  className: "home-device-item",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
                    className: "home-device-icon-wrapper",
                    children: [deviceIcon && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Image, {
                      src: deviceIcon,
                      className: "home-device-icon",
                      mode: "aspectFit"
                    }), statusInfo && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                      className: "home-device-status-badge",
                      style: {
                        backgroundColor: statusInfo.color
                      },
                      children: statusInfo.label
                    })]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
                    className: "home-device-info",
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                        className: "home-device-name",
                        children: item.name || item.sn
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                        className: "home-device-sn",
                        children: ["No.", item.sn]
                      })]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                      className: "home-device-location",
                      children: location
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                      className: "home-device-update",
                      children: lastUpdateTime ? "".concat(lastUpdateTime, "\u4E0A\u62A5") : '从未上报'
                    })]
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.Text, {
                    className: "home-device-arrow",
                    children: "\u203A"
                  })]
                }, item.id);
              })
            }), paneState.loading && paneState.list.length !== 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
              className: "home-load-more",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(taro_ui__WEBPACK_IMPORTED_MODULE_1__.AtActivityIndicator, {
                content: "\u52A0\u8F7D\u66F4\u591A...",
                size: 26,
                color: "#3192ff"
              })
            }), !paneState.hasMore && paneState.list.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_12__.View, {
              className: "home-no-more",
              children: "\u6CA1\u6709\u66F4\u591A\u4E86"
            })]
          }, group.id);
        })
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


var config = {"navigationBarTitleText":"首页","enablePullDownRefresh":true,"backgroundTextStyle":"dark"};


var inst = Page((0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__.createPageConfig)(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_home_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"], 'pages/home/index', {root:{cn:[]}}, config || {}))


/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_home_index_index_tsx__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ }),

/***/ "./src/assets/images/icon-down.png":
/*!*****************************************!*\
  !*** ./src/assets/images/icon-down.png ***!
  \*****************************************/
/***/ (function(module) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB2AAAAdgB+lymcgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFCSURBVHic7daxTsJQGMXxP5rg4OIj4C5x0IcwTQQfgsTEJ+EZmJgZeBcXHZ19AWnjgEP5EqiUlnJvS2/PL+lE2u+e0/YWEBEREREREREREemQyxPOfQCmwAvwBXw7WVF5t8AbcAd8Ar91Dn8EEmC9ORJgXOP8CPjZmv8OXNc4n/nW8LpLiIB4z/zXKhe7cLcu+sACGDm8ZlYELIGrPb/deJz7zz27r0D2SfBRQt6dX5O+DgMPMysvKCHdHF15AlYHZj07nHWUohJc7AlnG974LOHswxsfJbQmvHFZQuvCm6ISynwdWhvenFJC68ObKiUEE94cU0Jw4U2ZEoINb8bk/22OyS8oJi0wCIeehGDvfFbZEoIMb4pKCDq8ySuhE+FNdmNc0dCG12ti6MYQmJAWMAM+GlyLiIiIiIiIiIiISDf8AZGZ/GzE9tlKAAAAAElFTkSuQmCC";

/***/ }),

/***/ "./src/assets/images/icon-qx.png":
/*!***************************************!*\
  !*** ./src/assets/images/icon-qx.png ***!
  \***************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/icon-qx.png";

/***/ }),

/***/ "./src/assets/images/icon-search.png":
/*!*******************************************!*\
  !*** ./src/assets/images/icon-search.png ***!
  \*******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/icon-search.png";

/***/ }),

/***/ "./src/assets/images/icon-sq.png":
/*!***************************************!*\
  !*** ./src/assets/images/icon-sq.png ***!
  \***************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/icon-sq.png";

/***/ }),

/***/ "./src/assets/images/icon-tianqiqxz.png":
/*!**********************************************!*\
  !*** ./src/assets/images/icon-tianqiqxz.png ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/icon-tianqiqxz.png";

/***/ }),

/***/ "./src/assets/images/icon-zhishang.png":
/*!*********************************************!*\
  !*** ./src/assets/images/icon-zhishang.png ***!
  \*********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/icon-zhishang.png";

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/home/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map