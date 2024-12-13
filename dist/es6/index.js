"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _axios = _interopRequireDefault(require("axios"));
var _validation = _interopRequireDefault(require("./validation.js"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var AlertaClient = exports["default"] = /*#__PURE__*/function () {
  function AlertaClient(_ref) {
    var endpoint = _ref.endpoint,
      apiKey = _ref.apiKey;
    (0, _classCallCheck2["default"])(this, AlertaClient);
    if (!apiKey || apiKey === "" || typeof apiKey !== "string") {
      throw new Error("API key is required to be a non-empty string");
    }
    // Ensure the endpoint is valid only if provided (not when the API key is missing)
    if (endpoint && (typeof endpoint !== "string" || !endpoint.match(/^(http|https):\/\/[^ "]+$/))) {
      throw new Error("Invalid API endpoint");
    }
    this.endpoint = endpoint.replace(/\/+$/, ""); // Remove trailing slashes
    this.apiKey = apiKey;
    this.headers = {
      Authorization: "Key ".concat(this.apiKey),
      "Content-Type": "application/json"
    };
  }

  /**
   * Make a request to the Alerta API
   * @param {string} method - HTTP method
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} params - Query parameters
   * @returns {Promise<object>} - Response data
   * @throws {Error} - API error
   * @private
   */
  return (0, _createClass2["default"])(AlertaClient, [{
    key: "request",
    value: (function () {
      var _request = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(method, url) {
        var data,
          params,
          response,
          _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              data = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
              params = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
              _context.prev = 2;
              // Filter data to remove undefined or empty values
              data = this._cleanData(data);
              params = this._cleanData(params);
              // Send request
              _context.next = 7;
              return (0, _axios["default"])({
                method: method,
                url: "".concat(this.endpoint).concat(url),
                headers: this.headers,
                data: data,
                params: params
              });
            case 7:
              response = _context.sent;
              return _context.abrupt("return", response.data);
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](2);
              this._handleError(_context.t0);
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[2, 11]]);
      }));
      function request(_x, _x2) {
        return _request.apply(this, arguments);
      }
      return request;
    }()
    /**
     * Creates a new alert, or updates an existing alert if the environment- resource-event combination already exists.
     * @param {object} data - Alert data
     * @param {string} data.resource - Resource name
     * @param {string} data.event - Event name
     * @param {string} data.environment - Environment name
     * @param {string} data.severity - Severity level
     * @param {string[]} data.service - Service names
     * @param {string} data.group - Group name
     * @param {number} data.value - Value
     * @param {string} data.text - Alert text
     * @param {string[]} data.tags - Alert tags
     * @param {object} data.attributes - Additional attributes
     * @returns {Promise<object>} - Response data
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "createAlert",
    value: (function () {
      var _createAlert = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
        var resource, event, environment, severity, service, group, value, text, tags, attributes, data;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              resource = _ref2.resource, event = _ref2.event, environment = _ref2.environment, severity = _ref2.severity, service = _ref2.service, group = _ref2.group, value = _ref2.value, text = _ref2.text, tags = _ref2.tags, attributes = _ref2.attributes;
              data = {
                resource: resource,
                event: event,
                environment: environment,
                severity: severity,
                service: service,
                group: group,
                value: value,
                text: text,
                tags: tags,
                attributes: attributes
              }; // Validate data
              (0, _validation["default"])("alert", data);
              // Send request
              _context2.next = 5;
              return this.request("post", "/alert", data);
            case 5:
              return _context2.abrupt("return", _context2.sent);
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function createAlert(_x3) {
        return _createAlert.apply(this, arguments);
      }
      return createAlert;
    }()
    /**
     * Retrieves an alert with the given alert ID.
     * @param {string} alertId - Alert ID
     * @returns {Promise<object>} - Alert data
     * @throws {Error} - API error
     */
    )
  }, {
    key: "getAlert",
    value: (function () {
      var _getAlert = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(alertId) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.request("get", "/alert/".concat(alertId));
            case 2:
              return _context3.abrupt("return", _context3.sent);
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getAlert(_x4) {
        return _getAlert.apply(this, arguments);
      }
      return getAlert;
    }()
    /**
     * Sets the status of an alert, and logs the status change to the alert history.
     * @param {object} data - Alert status data
     * @param {string} data.alertId - Alert ID
     * @param {string} data.status - Alert status
     * @param {string} data.text - Alert status message
     * @param {number} data.timeout - Alert timeout in seconds
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "setAlertStatus",
    value: (function () {
      var _setAlertStatus = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref3) {
        var alertId, status, text, timeout, data, result;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              alertId = _ref3.alertId, status = _ref3.status, text = _ref3.text, timeout = _ref3.timeout;
              // Validate data
              data = (0, _validation["default"])("alertStatus", {
                alertId: alertId,
                status: status,
                text: text,
                timeout: timeout
              }, {
                removeAlertId: true
              }); // Send request
              _context4.next = 4;
              return this.request("put", "/alert/".concat(alertId, "/status"), data);
            case 4:
              result = _context4.sent;
              return _context4.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function setAlertStatus(_x5) {
        return _setAlertStatus.apply(this, arguments);
      }
      return setAlertStatus;
    }()
    /**
     * Takes an action against an alert which can change the status or severity of the alert and logs the action to the alert history.
     * @param {object} data - Alert action data
     * @param {string} data.alertId - Alert ID
     * @param {string} data.action - Action name
     * @param {string} data.text - Action message
     * @param {number} data.timeout - Action timeout in seconds
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "actionAlert",
    value: (function () {
      var _actionAlert = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref4) {
        var alertId, action, text, timeout, data, result;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              alertId = _ref4.alertId, action = _ref4.action, text = _ref4.text, timeout = _ref4.timeout;
              // Validate data
              data = (0, _validation["default"])("actionAlert", {
                alertId: alertId,
                action: action,
                text: text,
                timeout: timeout
              }, {
                removeAlertId: true
              }); // Send request
              _context5.next = 4;
              return this.request("put", "/alert/".concat(alertId, "/action"), data);
            case 4:
              result = _context5.sent;
              return _context5.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 6:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function actionAlert(_x6) {
        return _actionAlert.apply(this, arguments);
      }
      return actionAlert;
    }()
    /**
     * Adds tag values from the set of tags for an alert.
     * @param {string} alertId - Alert ID
     * @param {string[]} tags - Tag values
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "tagAlert",
    value: (function () {
      var _tagAlert = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(alertId, tags) {
        var data, result;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              // Validation
              data = (0, _validation["default"])("tags", {
                alertId: alertId,
                tags: tags
              }, {
                removeAlertId: true
              }); // Send request
              _context6.next = 3;
              return this.request("put", "/alert/".concat(alertId, "/tag"), data);
            case 3:
              result = _context6.sent;
              return _context6.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 5:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function tagAlert(_x7, _x8) {
        return _tagAlert.apply(this, arguments);
      }
      return tagAlert;
    }()
    /**
     * Remove tag values from the set of tags for an alert.
     * @param {string} alertId - Alert ID
     * @param {string[]} tags - Tag values
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "untagAlert",
    value: (function () {
      var _untagAlert = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(alertId, tags) {
        var data, result;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              // Validation
              data = (0, _validation["default"])("tags", {
                alertId: alertId,
                tags: tags
              }, {
                removeAlertId: true
              }); // Send Request
              _context7.next = 3;
              return this.request("put", "/alert/".concat(alertId, "/untag"), data);
            case 3:
              result = _context7.sent;
              return _context7.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 5:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function untagAlert(_x9, _x10) {
        return _untagAlert.apply(this, arguments);
      }
      return untagAlert;
    }()
    /**
     * Adds, deletes or modifies alert attributes. To delete an attribute assign “null” to the attribute.
     * @param {string} alertId - Alert ID
     * @param {object} attributes - Alert attributes
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "updateAlertAttributes",
    value: (function () {
      var _updateAlertAttributes = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(alertId, attributes) {
        var data, result;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              // Validation
              data = (0, _validation["default"])("attributes", {
                alertId: alertId,
                attributes: attributes
              }, {
                removeAlertId: true
              }); // Send Request
              _context8.next = 3;
              return this.request("put", "/alert/".concat(alertId, "/attributes"), data);
            case 3:
              result = _context8.sent;
              return _context8.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 5:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function updateAlertAttributes(_x11, _x12) {
        return _updateAlertAttributes.apply(this, arguments);
      }
      return updateAlertAttributes;
    }()
    /**
     * Adds a note to an alert.
     * @param {string} alertId - Alert ID
     * @param {string} note - Note message
     * @returns {Promise<object>} - Response data
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "addAlertNote",
    value: (function () {
      var _addAlertNote = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(alertId, note) {
        var data;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              // Validation
              data = (0, _validation["default"])("note", {
                alertId: alertId,
                note: note
              }, {
                removeAlertId: true
              }); // Send Request
              _context9.next = 3;
              return this.request("put", "/alert/".concat(alertId, "/note"), data);
            case 3:
              return _context9.abrupt("return", _context9.sent);
            case 4:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function addAlertNote(_x13, _x14) {
        return _addAlertNote.apply(this, arguments);
      }
      return addAlertNote;
    }()
    /**
     * Delete an alert.
     * @param {string} alertId - Alert ID
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - API error
     */
    )
  }, {
    key: "deleteAlert",
    value: (function () {
      var _deleteAlert = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(alertId) {
        var result;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return this.request("delete", "/alert/".concat(alertId));
            case 2:
              result = _context10.sent;
              return _context10.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 4:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this);
      }));
      function deleteAlert(_x15) {
        return _deleteAlert.apply(this, arguments);
      }
      return deleteAlert;
    }()
    /**
     * Find alerts using various alert attributes or a mongo-type query parameter to filter results.
     * @param {object} queryParams - Query parameters
     * @param {string} queryParams.q - Query string
     * @param {string} queryParams.status - Alert status
     * @param {string} queryParams.severity - Alert severity
     * @param {string} queryParams.resource - Resource name
     * @param {string} queryParams.environment - Environment name
     * @param {string} queryParams.service - Service name
     * @param {string} queryParams["from-date"] - From date
     * @param {string} queryParams["to-date"] - To date
     * @param {string} queryParams["sort-by"] - Sort by attribute
     * @param {boolean} queryParams.reverse - Reverse sort order
     * @param {number} queryParams.page - Page number
     * @param {number} queryParams["page-size"] - Page size
     * @param {boolean} queryParams["show-raw-data"] - Show raw data
     * @returns {Promise<object>} - The alerts list
     * @throws {Error}
     */
    )
  }, {
    key: "searchAlerts",
    value: (function () {
      var _searchAlerts = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11() {
        var queryParams,
          data,
          _args11 = arguments;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              queryParams = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : {};
              // Validate parameters
              data = (0, _validation["default"])("search", queryParams);
              _context11.next = 4;
              return this.request("get", "/alerts", {}, data);
            case 4:
              return _context11.abrupt("return", _context11.sent);
            case 5:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this);
      }));
      function searchAlerts() {
        return _searchAlerts.apply(this, arguments);
      }
      return searchAlerts;
    }()
    /**
     * Returns a list of alert severity and status changes.
     * @param {object} queryParams - Query parameters
     * @param {string} queryParams.status - Alert status
     * @param {string} queryParams.severity - Alert severity
     * @param {string} queryParams.resource - Resource name
     * @param {string} queryParams.environment - Environment name
     * @param {string} queryParams.service - Service name
     * @param {string} queryParams.tags - Alert tags
     * @param {string} queryParams.event - Event name
     * @param {string} queryParams.group - Group name
     * @returns {Promise<object>} - The alerts history list
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "listAlertHistory",
    value: (function () {
      var _listAlertHistory = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12() {
        var queryParams,
          data,
          _args12 = arguments;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              queryParams = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : {};
              // Validate parameters
              data = (0, _validation["default"])("attrFilter", queryParams);
              _context12.next = 4;
              return this.request("get", "/alerts/history", {}, data);
            case 4:
              return _context12.abrupt("return", _context12.sent);
            case 5:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this);
      }));
      function listAlertHistory() {
        return _listAlertHistory.apply(this, arguments);
      }
      return listAlertHistory;
    }()
    /**
     * Returns a count of alerts grouped by severity and status
     * @param {object} queryParams - Query parameters
     * @param {string} queryParams.status - Alert status
     * @param {string} queryParams.severity - Alert severity
     * @param {string} queryParams.resource - Resource name
     * @param {string} queryParams.environment - Environment name
     * @param {string} queryParams.service - Service name
     * @param {string} queryParams.tags - Alert tags
     * @param {string} queryParams.event - Event name
     * @param {string} queryParams.group - Group name
     * @returns {Promise<object>} - The alerts count
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "getCounts",
    value: (function () {
      var _getCounts = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13() {
        var queryParams,
          data,
          _args13 = arguments;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              queryParams = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : {};
              // Validate parameters
              data = (0, _validation["default"])("attrFilter", queryParams);
              _context13.next = 4;
              return this.request("get", "/alerts/count", {}, data);
            case 4:
              return _context13.abrupt("return", _context13.sent);
            case 5:
            case "end":
              return _context13.stop();
          }
        }, _callee13, this);
      }));
      function getCounts() {
        return _getCounts.apply(this, arguments);
      }
      return getCounts;
    }()
    /**
     * Returns a count of alerts grouped by severity and status
     * @param {object} queryParams - Query parameters
     * @param {string} queryParams.q - Query string
     * @param {string} queryParams.status - Alert status
     * @param {string} queryParams.severity - Alert severity
     * @param {string} queryParams.resource - Resource name
     * @param {string} queryParams.environment - Environment name
     * @param {string} queryParams.service - Service name
     * @param {string} queryParams.tags - Alert tags
     * @param {string} queryParams.event - Event name
     * @param {string} queryParams.group - Group name
     * @param {string} groupBy - Group by attribute
     * @returns {Promise<object>} - The alerts count
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "getTop10Alerts",
    value: (function () {
      var _getTop10Alerts = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14() {
        var queryParams,
          groupBy,
          data,
          _args14 = arguments;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              queryParams = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : {};
              groupBy = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : null;
              // Validate parameters
              data = (0, _validation["default"])("top10", _objectSpread(_objectSpread({}, queryParams), {}, {
                "group-by": groupBy
              }));
              _context14.next = 5;
              return this.request("get", "/alerts/top10", {}, data);
            case 5:
              return _context14.abrupt("return", _context14.sent);
            case 6:
            case "end":
              return _context14.stop();
          }
        }, _callee14, this);
      }));
      function getTop10Alerts() {
        return _getTop10Alerts.apply(this, arguments);
      }
      return getTop10Alerts;
    }()
    /**
     * Returns a list of environments and an alert count for each
     * @param {object} queryParams - Query parameters
     * @param {string} queryParams.status - Alert status
     * @param {string} queryParams.severity - Alert severity
     * @param {string} queryParams.resource - Resource name
     * @returns {Promise<object>} - The environments list
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "listEnvironments",
    value: (function () {
      var _listEnvironments = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15() {
        var queryParams,
          data,
          _args15 = arguments;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              queryParams = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : {};
              // Validate parameters
              data = (0, _validation["default"])("attrFilter", queryParams);
              _context15.next = 4;
              return this.request("get", "/environments", {}, data);
            case 4:
              return _context15.abrupt("return", _context15.sent);
            case 5:
            case "end":
              return _context15.stop();
          }
        }, _callee15, this);
      }));
      function listEnvironments() {
        return _listEnvironments.apply(this, arguments);
      }
      return listEnvironments;
    }()
    /**
     * Returns a list of services grouped by environment and an alert count for each
     * @param {object} queryParams - Query parameters
     * @param {string} queryParams.status - Alert status
     * @param {string} queryParams.severity - Alert severity
     * @param {string} queryParams.resource - Resource name
     * @param {string} queryParams.environment - Environment name
     * @returns {Promise<object>} - The services list
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "listServices",
    value: (function () {
      var _listServices = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16() {
        var queryParams,
          data,
          _args16 = arguments;
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              queryParams = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : {};
              // Validate parameters
              data = (0, _validation["default"])("attrFilter", queryParams);
              _context16.next = 4;
              return this.request("get", "/services", {}, data);
            case 4:
              return _context16.abrupt("return", _context16.sent);
            case 5:
            case "end":
              return _context16.stop();
          }
        }, _callee16, this);
      }));
      function listServices() {
        return _listServices.apply(this, arguments);
      }
      return listServices;
    }()
    /**
     * Returns a list of services grouped by environment and an alert count for each
     * @param {object} queryParams - Query parameters
     * @param {string} queryParams.status - Alert status
     * @param {string} queryParams.severity - Alert severity
     * @param {string} queryParams.resource - Resource name
     * @param {string} queryParams.environment - Environment name
     * @returns {Promise<object>} - The services list
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "listTags",
    value: (function () {
      var _listTags = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee17() {
        var queryParams,
          data,
          _args17 = arguments;
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              queryParams = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : {};
              // Validate parameters
              data = (0, _validation["default"])("attrFilter", queryParams);
              _context17.next = 4;
              return this.request("get", "/alerts/tags", {}, data);
            case 4:
              return _context17.abrupt("return", _context17.sent);
            case 5:
            case "end":
              return _context17.stop();
          }
        }, _callee17, this);
      }));
      function listTags() {
        return _listTags.apply(this, arguments);
      }
      return listTags;
    }()
    /**
     * Create a new blackout period for alert suppression.
     * @param {object} data - Blackout data
     * @param {string} data.environment - Environment name
     * @param {string} data.resource - Resource name
     * @param {string[]} data.service - Service names
     * @param {string} data.event - Event name
     * @param {string} data.group - Group name
     * @param {string[]} data.tags - Blackout tags
     * @param {string} data.startTime - Start time
     * @param {string} data.endTime - End time
     * @param {number} data.duration - Duration in seconds
     * @returns {Promise<object>} - Response data
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "createBlackout",
    value: (function () {
      var _createBlackout = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee18(_ref5) {
        var environment, resource, service, event, group, tags, startTime, endTime, duration, data;
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              environment = _ref5.environment, resource = _ref5.resource, service = _ref5.service, event = _ref5.event, group = _ref5.group, tags = _ref5.tags, startTime = _ref5.startTime, endTime = _ref5.endTime, duration = _ref5.duration;
              // Validate data
              data = (0, _validation["default"])("createBlackout", {
                environment: environment,
                resource: resource,
                service: service,
                event: event,
                group: group,
                tags: tags,
                startTime: startTime,
                endTime: endTime,
                duration: duration
              });
              _context18.next = 4;
              return this.request("post", "/blackout", data);
            case 4:
              return _context18.abrupt("return", _context18.sent);
            case 5:
            case "end":
              return _context18.stop();
          }
        }, _callee18, this);
      }));
      function createBlackout(_x16) {
        return _createBlackout.apply(this, arguments);
      }
      return createBlackout;
    }()
    /**
     * Returns a list of blackout periods, including expired blackouts.
     * @returns {Promise<object>} - The blackouts list
     * @throws {Error} - API error
     */
    )
  }, {
    key: "listBlackouts",
    value: (function () {
      var _listBlackouts = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee19() {
        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return this.request("get", "/blackouts");
            case 2:
              return _context19.abrupt("return", _context19.sent);
            case 3:
            case "end":
              return _context19.stop();
          }
        }, _callee19, this);
      }));
      function listBlackouts() {
        return _listBlackouts.apply(this, arguments);
      }
      return listBlackouts;
    }()
    /**
     * Permanently deletes a blackout period. It cannot be undone.
     * @param {string} blackoutId - Blackout ID
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - API error
     */
    )
  }, {
    key: "deleteBlackout",
    value: (function () {
      var _deleteBlackout = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee20(blackoutId) {
        var result;
        return _regenerator["default"].wrap(function _callee20$(_context20) {
          while (1) switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return this.request("delete", "/blackout/".concat(blackoutId));
            case 2:
              result = _context20.sent;
              return _context20.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 4:
            case "end":
              return _context20.stop();
          }
        }, _callee20, this);
      }));
      function deleteBlackout(_x17) {
        return _deleteBlackout.apply(this, arguments);
      }
      return deleteBlackout;
    }()
    /**
     * Creates a new heartbeat, or updates an existing heartbeat if a heartbeat from the origin already exists.
     * @param {object} data - Heartbeat data
     * @param {string} data.origin - Origin name
     * @param {string[]} data.tags - Heartbeat tags
     * @param {string} data.createTime - Create time
     * @param {number} data.timeout - Timeout in seconds
     * @param {object} data.attributes - Additional attributes
     * @returns {Promise<object>} - Response data
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "sendHeartbeat",
    value: (function () {
      var _sendHeartbeat = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee21(_ref6) {
        var origin, tags, createTime, timeout, attributes, data;
        return _regenerator["default"].wrap(function _callee21$(_context21) {
          while (1) switch (_context21.prev = _context21.next) {
            case 0:
              origin = _ref6.origin, tags = _ref6.tags, createTime = _ref6.createTime, timeout = _ref6.timeout, attributes = _ref6.attributes;
              // Validate data
              data = (0, _validation["default"])("createHeartbeat", {
                origin: origin,
                tags: tags,
                createTime: createTime,
                timeout: timeout,
                attributes: attributes
              });
              _context21.next = 4;
              return this.request("post", "/heartbeat", data);
            case 4:
              return _context21.abrupt("return", _context21.sent);
            case 5:
            case "end":
              return _context21.stop();
          }
        }, _callee21, this);
      }));
      function sendHeartbeat(_x18) {
        return _sendHeartbeat.apply(this, arguments);
      }
      return sendHeartbeat;
    }()
    /**
     * Retrieves a heartbeat based on the heartbeat ID.
     * @param {string} heartbeatId - Heartbeat ID
     * @returns {Promise<object>} - Heartbeat data
     * @throws {Error} - API error
     */
    )
  }, {
    key: "getHeartbeat",
    value: (function () {
      var _getHeartbeat = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee22(heartbeatId) {
        return _regenerator["default"].wrap(function _callee22$(_context22) {
          while (1) switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return this.request("get", "/heartbeat/".concat(heartbeatId));
            case 2:
              return _context22.abrupt("return", _context22.sent);
            case 3:
            case "end":
              return _context22.stop();
          }
        }, _callee22, this);
      }));
      function getHeartbeat(_x19) {
        return _getHeartbeat.apply(this, arguments);
      }
      return getHeartbeat;
    }()
    /**
     * Returns a list of all heartbeats.
     * @returns {Promise<object>} - The heartbeats list
     * @throws {Error} - API error
     */
    )
  }, {
    key: "listHeartbeats",
    value: (function () {
      var _listHeartbeats = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee23() {
        return _regenerator["default"].wrap(function _callee23$(_context23) {
          while (1) switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return this.request("get", "/heartbeats");
            case 2:
              return _context23.abrupt("return", _context23.sent);
            case 3:
            case "end":
              return _context23.stop();
          }
        }, _callee23, this);
      }));
      function listHeartbeats() {
        return _listHeartbeats.apply(this, arguments);
      }
      return listHeartbeats;
    }()
    /**
     * Permanently deletes a heartbeat. It cannot be undone.
     * @param {string} heartbeatId - Heartbeat ID
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - API error
     */
    )
  }, {
    key: "deleteHeartbeat",
    value: (function () {
      var _deleteHeartbeat = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee24(heartbeatId) {
        var result;
        return _regenerator["default"].wrap(function _callee24$(_context24) {
          while (1) switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return this.request("delete", "/heartbeat/".concat(heartbeatId));
            case 2:
              result = _context24.sent;
              return _context24.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 4:
            case "end":
              return _context24.stop();
          }
        }, _callee24, this);
      }));
      function deleteHeartbeat(_x20) {
        return _deleteHeartbeat.apply(this, arguments);
      }
      return deleteHeartbeat;
    }()
    /**
     * Creates a new API key.
     * @param {string} user - User name
     * @param {string[]} scopes - Scopes
     * @param {string} text - API key text description
     * @param {string} expireTime - Expiry time
     * @returns {Promise<object>} - Response data
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "createApiKey",
    value: (function () {
      var _createApiKey = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee25(user, scopes) {
        var text,
          expireTime,
          data,
          _args25 = arguments;
        return _regenerator["default"].wrap(function _callee25$(_context25) {
          while (1) switch (_context25.prev = _context25.next) {
            case 0:
              text = _args25.length > 2 && _args25[2] !== undefined ? _args25[2] : null;
              expireTime = _args25.length > 3 && _args25[3] !== undefined ? _args25[3] : null;
              // Validate Data
              data = (0, _validation["default"])("createAPIKey", {
                user: user,
                scopes: scopes,
                text: text,
                expireTime: expireTime
              });
              _context25.next = 5;
              return this.request("post", "/key", data);
            case 5:
              return _context25.abrupt("return", _context25.sent);
            case 6:
            case "end":
              return _context25.stop();
          }
        }, _callee25, this);
      }));
      function createApiKey(_x21, _x22) {
        return _createApiKey.apply(this, arguments);
      }
      return createApiKey;
    }()
    /**
     * Returns a list of API keys.
     * @returns {Promise<object>} - The API keys list
     * @throws {Error} - API error
     */
    )
  }, {
    key: "listApiKeys",
    value: (function () {
      var _listApiKeys = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee26() {
        return _regenerator["default"].wrap(function _callee26$(_context26) {
          while (1) switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return this.request("get", "/keys");
            case 2:
              return _context26.abrupt("return", _context26.sent);
            case 3:
            case "end":
              return _context26.stop();
          }
        }, _callee26, this);
      }));
      function listApiKeys() {
        return _listApiKeys.apply(this, arguments);
      }
      return listApiKeys;
    }()
    /**
     * Permanently deletes an API key. It cannot be undone.
     * @param {string} key - API key
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - API error
     */
    )
  }, {
    key: "deleteApiKey",
    value: (function () {
      var _deleteApiKey = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee27(key) {
        var result;
        return _regenerator["default"].wrap(function _callee27$(_context27) {
          while (1) switch (_context27.prev = _context27.next) {
            case 0:
              result = this.request("delete", "/key/".concat(key));
              return _context27.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 2:
            case "end":
              return _context27.stop();
          }
        }, _callee27, this);
      }));
      function deleteApiKey(_x23) {
        return _deleteApiKey.apply(this, arguments);
      }
      return deleteApiKey;
    }()
    /**
     * Creates a new Basic Auth user.
     * @param {*} userData
     * @returns
     */
    )
  }, {
    key: "createUser",
    value: (function () {
      var _createUser = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee28(name, email, password) {
        var text,
          data,
          _args28 = arguments;
        return _regenerator["default"].wrap(function _callee28$(_context28) {
          while (1) switch (_context28.prev = _context28.next) {
            case 0:
              text = _args28.length > 3 && _args28[3] !== undefined ? _args28[3] : undefined;
              // Validate data
              data = (0, _validation["default"])("createUser", {
                name: name,
                email: email,
                password: password,
                text: text
              });
              _context28.next = 4;
              return this.request("post", "/user", data);
            case 4:
              return _context28.abrupt("return", _context28.sent);
            case 5:
            case "end":
              return _context28.stop();
          }
        }, _callee28, this);
      }));
      function createUser(_x24, _x25, _x26) {
        return _createUser.apply(this, arguments);
      }
      return createUser;
    }()
    /**
     * Updates the specified user by setting the values of the parameters passed. Any parameters not provided will be left unchanged.
     * @param {string} userId - User ID
     * @param {object} data - User data
     * @param {string} data.name - User name
     * @param {string} data.email - User email
     * @param {string} data.password - User password
     * @param {string} data.status - User status
     * @param {string[]} data.roles - User roles
     * @param {object} data.attributes - User attributes
     * @param {string} data.text - User text
     * @param {boolean} data.email_verified - User email verified
     * @returns {Promise<object>} - Response data
     * @throws {Error} - Validation error or API error
     */
    )
  }, {
    key: "updateUser",
    value: (function () {
      var _updateUser = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee29(userId, _ref7) {
        var _ref7$name, name, _ref7$email, email, _ref7$password, password, _ref7$status, status, _ref7$roles, roles, _ref7$attributes, attributes, _ref7$text, text, _ref7$email_verified, email_verified, data;
        return _regenerator["default"].wrap(function _callee29$(_context29) {
          while (1) switch (_context29.prev = _context29.next) {
            case 0:
              _ref7$name = _ref7.name, name = _ref7$name === void 0 ? undefined : _ref7$name, _ref7$email = _ref7.email, email = _ref7$email === void 0 ? undefined : _ref7$email, _ref7$password = _ref7.password, password = _ref7$password === void 0 ? undefined : _ref7$password, _ref7$status = _ref7.status, status = _ref7$status === void 0 ? undefined : _ref7$status, _ref7$roles = _ref7.roles, roles = _ref7$roles === void 0 ? undefined : _ref7$roles, _ref7$attributes = _ref7.attributes, attributes = _ref7$attributes === void 0 ? undefined : _ref7$attributes, _ref7$text = _ref7.text, text = _ref7$text === void 0 ? undefined : _ref7$text, _ref7$email_verified = _ref7.email_verified, email_verified = _ref7$email_verified === void 0 ? undefined : _ref7$email_verified;
              // Validate data
              data = (0, _validation["default"])("updateUser", {
                name: name,
                email: email,
                password: password,
                status: status,
                roles: roles,
                attributes: attributes,
                text: text,
                email_verified: email_verified
              });
              _context29.next = 4;
              return this.request("put", "/user/".concat(userId), data);
            case 4:
              return _context29.abrupt("return", _context29.sent);
            case 5:
            case "end":
              return _context29.stop();
          }
        }, _callee29, this);
      }));
      function updateUser(_x27, _x28) {
        return _updateUser.apply(this, arguments);
      }
      return updateUser;
    }()
    /**
     * Updates the specified user attributes.
     * @param {string} userId - User ID
     * @param {object} attributes - User attributes
     * @returns {Promise<object>} - Response data
     * @throws {Error} - API error
     */
    )
  }, {
    key: "updateUserAttributes",
    value: (function () {
      var _updateUserAttributes = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee30(userId, attributes) {
        return _regenerator["default"].wrap(function _callee30$(_context30) {
          while (1) switch (_context30.prev = _context30.next) {
            case 0:
              _context30.next = 2;
              return this.request("put", "/user/".concat(userId, "/attributes"), attributes);
            case 2:
              return _context30.abrupt("return", _context30.sent);
            case 3:
            case "end":
              return _context30.stop();
          }
        }, _callee30, this);
      }));
      function updateUserAttributes(_x29, _x30) {
        return _updateUserAttributes.apply(this, arguments);
      }
      return updateUserAttributes;
    }()
    /**
     * Updates the logged in user attributes.
     * @param {object} attributes - User attributes
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - API error
     */
    )
  }, {
    key: "updateMeAttributes",
    value: (function () {
      var _updateMeAttributes = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee31(attributes) {
        var result;
        return _regenerator["default"].wrap(function _callee31$(_context31) {
          while (1) switch (_context31.prev = _context31.next) {
            case 0:
              _context31.next = 2;
              return this.request("put", "/user/me/attributes", attributes);
            case 2:
              result = _context31.sent;
              return _context31.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 4:
            case "end":
              return _context31.stop();
          }
        }, _callee31, this);
      }));
      function updateMeAttributes(_x31) {
        return _updateMeAttributes.apply(this, arguments);
      }
      return updateMeAttributes;
    }()
    /**
     * List users.
     * @returns {Promise<object>} - Response data
     * @throws {Error} - API error
     */
    )
  }, {
    key: "listUsers",
    value: (function () {
      var _listUsers = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee32() {
        return _regenerator["default"].wrap(function _callee32$(_context32) {
          while (1) switch (_context32.prev = _context32.next) {
            case 0:
              _context32.next = 2;
              return this.request("get", "/users");
            case 2:
              return _context32.abrupt("return", _context32.sent);
            case 3:
            case "end":
              return _context32.stop();
          }
        }, _callee32, this);
      }));
      function listUsers() {
        return _listUsers.apply(this, arguments);
      }
      return listUsers;
    }()
    /**
     * Permanently deletes a user. It cannot be undone.
     * @param {string} userId - User ID
     * @returns {Promise<boolean>} - True if successful
     * @throws {Error} - API error
     */
    )
  }, {
    key: "deleteUser",
    value: (function () {
      var _deleteUser = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee33(userId) {
        var result;
        return _regenerator["default"].wrap(function _callee33$(_context33) {
          while (1) switch (_context33.prev = _context33.next) {
            case 0:
              _context33.next = 2;
              return this.request("delete", "/user/".concat(userId));
            case 2:
              result = _context33.sent;
              return _context33.abrupt("return", (result === null || result === void 0 ? void 0 : result.status) === "ok");
            case 4:
            case "end":
              return _context33.stop();
          }
        }, _callee33, this);
      }));
      function deleteUser(_x32) {
        return _deleteUser.apply(this, arguments);
      }
      return deleteUser;
    }() // Management
    /**
     * Get build info, including build date, release number and git commit sha.
     * @returns {Promise<object>} - Response data
     * @throws {Error} - API error
     */
    )
  }, {
    key: "getManifest",
    value: function () {
      var _getManifest = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee34() {
        return _regenerator["default"].wrap(function _callee34$(_context34) {
          while (1) switch (_context34.prev = _context34.next) {
            case 0:
              _context34.next = 2;
              return this.request("get", "/management/manifest");
            case 2:
              return _context34.abrupt("return", _context34.sent);
            case 3:
            case "end":
              return _context34.stop();
          }
        }, _callee34, this);
      }));
      function getManifest() {
        return _getManifest.apply(this, arguments);
      }
      return getManifest;
    }()
    /**
     * Get the server status.
     * @param {string} type - Healthcheck type (light, good-to-go, deep)
     * @returns {Promise<object>} - Response data
     * @throws {Error} - API error
     */
  }, {
    key: "healthcheck",
    value: (function () {
      var _healthcheck = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee35() {
        var type,
          endpoint,
          _args35 = arguments;
        return _regenerator["default"].wrap(function _callee35$(_context35) {
          while (1) switch (_context35.prev = _context35.next) {
            case 0:
              type = _args35.length > 0 && _args35[0] !== undefined ? _args35[0] : "light";
              _context35.t0 = type;
              _context35.next = _context35.t0 === "good-to-go" ? 4 : _context35.t0 === "good" ? 4 : _context35.t0 === "gtg" ? 4 : _context35.t0 === "deep" ? 6 : _context35.t0 === "deep-check" ? 6 : 8;
              break;
            case 4:
              endpoint = "management/gtg";
              return _context35.abrupt("break", 9);
            case 6:
              endpoint = "management/healthcheck";
              return _context35.abrupt("break", 9);
            case 8:
              endpoint = "_";
            case 9:
              _context35.prev = 9;
              _context35.next = 12;
              return this.request("get", endpoint);
            case 12:
              return _context35.abrupt("return", true);
            case 15:
              _context35.prev = 15;
              _context35.t1 = _context35["catch"](9);
              return _context35.abrupt("return", false);
            case 18:
            case "end":
              return _context35.stop();
          }
        }, _callee35, this, [[9, 15]]);
      }));
      function healthcheck() {
        return _healthcheck.apply(this, arguments);
      }
      return healthcheck;
    }()
    /**
     * Get application metrics in JSON format.
     * @returns {Promise<object>} - Response data
     * @throws {Error} - API error
     */
    )
  }, {
    key: "getMetrics",
    value: (function () {
      var _getMetrics = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee36() {
        return _regenerator["default"].wrap(function _callee36$(_context36) {
          while (1) switch (_context36.prev = _context36.next) {
            case 0:
              _context36.next = 2;
              return this.request("get", "/management/status");
            case 2:
              return _context36.abrupt("return", _context36.sent);
            case 3:
            case "end":
              return _context36.stop();
          }
        }, _callee36, this);
      }));
      function getMetrics() {
        return _getMetrics.apply(this, arguments);
      }
      return getMetrics;
    }() // Error Handling
    )
  }, {
    key: "_handleError",
    value: function _handleError(error) {
      var _error$response;
      // Log the error to the console for debugging
      console.error("API Error:", ((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data) || error.message);
      if (error !== null && error !== void 0 && error.response) {
        var _error$response2 = error.response,
          status = _error$response2.status,
          data = _error$response2.data;

        // Fallback to a default error message if no message is in data
        var message = (data === null || data === void 0 ? void 0 : data.message) || 'No status text available';
        throw new Error("API Error: ".concat(status, " ").concat(message, " - ").concat(JSON.stringify(data)));
      } else if (error !== null && error !== void 0 && error.request) {
        throw new Error("No response received from API");
      } else {
        throw new Error("Error: ".concat(error.message));
      }
    }

    // Params and data cleanup
  }, {
    key: "_cleanData",
    value: function _cleanData(data) {
      return Object.fromEntries(Object.entries(data).filter(function (_ref8) {
        var _ref9 = (0, _slicedToArray2["default"])(_ref8, 2),
          _ = _ref9[0],
          v = _ref9[1];
        return v !== undefined && v !== "" && v !== null;
      }));
    }
  }]);
}();