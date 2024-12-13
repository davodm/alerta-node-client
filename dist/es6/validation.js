"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = validate;
var _joi = _interopRequireDefault(require("joi"));
var schema = {
  alert: _joi["default"].object({
    resource: _joi["default"].string().required(),
    event: _joi["default"].string().required(),
    environment: _joi["default"].string().required().allow("Production", "Development"),
    severity: _joi["default"].string().optional(),
    service: _joi["default"].array().items(_joi["default"].string()).required(),
    group: _joi["default"].string(),
    value: _joi["default"].number(),
    text: _joi["default"].string(),
    tags: _joi["default"].array().items(_joi["default"].string()),
    attributes: _joi["default"].object()
  }),
  alertStatus: _joi["default"].object({
    alertId: _joi["default"].string().required(),
    status: _joi["default"].string().required().allow("open", "assign", "ack", "closed", "expired"),
    text: _joi["default"].string().trim(),
    timeout: _joi["default"].number().integer().greater(0)
  }),
  actionAlert: _joi["default"].object({
    alertId: _joi["default"].string().required(),
    action: _joi["default"].string().required(),
    text: _joi["default"].string().trim(),
    timeout: _joi["default"].number().integer().greater(0)
  }),
  tags: _joi["default"].object({
    alertId: _joi["default"].string().required(),
    tags: _joi["default"].array().items(_joi["default"].string()).required()
  }),
  attributes: _joi["default"].object({
    alertId: _joi["default"].string().required(),
    attributes: _joi["default"].object().required()
  }),
  note: _joi["default"].object({
    alertId: _joi["default"].string().required(),
    note: _joi["default"].string().required()
  }),
  search: _joi["default"].object({
    q: _joi["default"].string().optional().description("query string query syntax (e.g., service:Web OR resource:web)"),
    "from-date": _joi["default"].date().iso().optional().description("lastReceiveTime > from-date"),
    "to-date": _joi["default"].date().iso().optional().greater(_joi["default"].ref("from-date")).description("lastReceiveTime <= to-date (now)"),
    "sort-by": _joi["default"].string().optional().description("Attribute to sort by (default: lastReceiveTime)"),
    reverse: _joi["default"]["boolean"]().optional().description("Change direction of default sort order"),
    page: _joi["default"].number().integer().min(1).optional().description("Page number between 1 and total pages (default: 1)"),
    "page-size": _joi["default"].number().integer().min(1).optional().description("Number of results per page (default: 1000)"),
    "show-raw-data": _joi["default"]["boolean"]().optional().description("Show raw data"),
    "show-history": _joi["default"]["boolean"]().optional().description("Show alert history"),
    status: _joi["default"].string().optional().allow("open", "assign", "ack", "closed", "expired"),
    severity: _joi["default"].string().optional(),
    resource: _joi["default"].string().optional(),
    tags: _joi["default"].string().optional(),
    event: _joi["default"].string().optional(),
    group: _joi["default"].string().optional(),
    environment: _joi["default"].string().optional(),
    service: _joi["default"].string().optional()
  }),
  attrFilter: _joi["default"].object({
    status: _joi["default"].string().optional().allow("open", "assign", "ack", "closed", "expired"),
    severity: _joi["default"].string().optional(),
    resource: _joi["default"].string().optional(),
    tags: _joi["default"].string().optional(),
    event: _joi["default"].string().optional(),
    group: _joi["default"].string().optional(),
    environment: _joi["default"].string().optional(),
    service: _joi["default"].string().optional()
  }),
  top10: _joi["default"].object({
    q: _joi["default"].string().optional(),
    "group-by": _joi["default"].string().optional().allow("resource", "event", "service", "severity", "environment", "group"),
    status: _joi["default"].string().optional().allow("open", "assign", "ack", "closed", "expired"),
    severity: _joi["default"].string().optional(),
    resource: _joi["default"].string().optional(),
    tags: _joi["default"].string().optional(),
    event: _joi["default"].string().optional(),
    group: _joi["default"].string().optional(),
    environment: _joi["default"].string().optional(),
    service: _joi["default"].string().optional()
  }),
  createBlackout: _joi["default"].object({
    environment: _joi["default"].string().required(),
    resource: _joi["default"].string().optional(),
    service: _joi["default"].array().items(_joi["default"].string()).optional(),
    event: _joi["default"].string().optional(),
    group: _joi["default"].string().optional(),
    tags: _joi["default"].array().items(_joi["default"].string()).optional(),
    startTime: _joi["default"].date().iso().optional(),
    endTime: _joi["default"].date().iso().optional(),
    duration: _joi["default"].number().integer().optional().min(1)
  }),
  createHeartbeat: _joi["default"].object({
    origin: _joi["default"].string().required(),
    tags: _joi["default"].array().items(_joi["default"].string()).optional(),
    createTime: _joi["default"].date().iso().optional(),
    timeout: _joi["default"].number().integer().optional().min(1),
    attributes: _joi["default"].object().optional()
  }),
  createAPIKey: _joi["default"].object({
    user: _joi["default"].string().required(),
    scopes: _joi["default"].array().items(_joi["default"].string().allow('admin', 'write', 'read')).required(),
    text: _joi["default"].string().optional(),
    expireTime: _joi["default"].date().iso().optional()
  }),
  createUser: _joi["default"].object({
    name: _joi["default"].string().required(),
    email: _joi["default"].string().email().required(),
    password: _joi["default"].string().required(),
    text: _joi["default"].string().optional()
  }),
  updateUser: _joi["default"].object({
    name: _joi["default"].string().optional(),
    email: _joi["default"].string().email().optional(),
    password: _joi["default"].string().optional(),
    status: _joi["default"].string().optional().allow('active', 'inactive'),
    text: _joi["default"].string().optional(),
    roles: _joi["default"].array().items(_joi["default"].string()).optional(),
    attributes: _joi["default"].object().optional(),
    email_verified: _joi["default"]["boolean"]().optional()
  })
};

/**
 * Validate the entry data based on the schema
 * @param {String} type - The type of the schema
 * @param {Object} data - The data to validate
 * @param {Object} options - The options to validate
 * @returns {Object} The validated data
 * @throws {Error} If the data is invalid
 */
function validate(type, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Field exists
  if (!(schema !== null && schema !== void 0 && schema[type])) {
    throw new Error("Invalid type");
  }
  // Validate data
  var _schema$type$validate = schema[type].validate(data),
    error = _schema$type$validate.error,
    value = _schema$type$validate.value;
  if (error) {
    var _error$details;
    if (error !== null && error !== void 0 && (_error$details = error.details) !== null && _error$details !== void 0 && (_error$details = _error$details[0]) !== null && _error$details !== void 0 && _error$details.message) {
      throw new Error(error.details[0].message);
    }
    throw new Error(error);
  }
  if (options !== null && options !== void 0 && options.removeAlertId && value !== null && value !== void 0 && value.alertId) {
    delete value.alertId;
  }
  return value;
}