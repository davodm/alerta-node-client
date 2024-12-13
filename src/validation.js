"use strict";
import Joi from "joi";

const schema = {
  alert: Joi.object({
    resource: Joi.string().required(),
    event: Joi.string().required(),
    environment: Joi.string().required().allow("Production", "Development"),
    severity: Joi.string().optional(),
    service: Joi.array().items(Joi.string()).required(),
    group: Joi.string(),
    value: Joi.number(),
    text: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    attributes: Joi.object(),
  }),
  alertStatus: Joi.object({
    alertId: Joi.string().required(),
    status: Joi.string()
      .required()
      .allow("open", "assign", "ack", "closed", "expired"),
    text: Joi.string().trim(),
    timeout: Joi.number().integer().greater(0),
  }),
  actionAlert: Joi.object({
    alertId: Joi.string().required(),
    action: Joi.string().required(),
    text: Joi.string().trim(),
    timeout: Joi.number().integer().greater(0),
  }),
  tags: Joi.object({
    alertId: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  }),
  attributes: Joi.object({
    alertId: Joi.string().required(),
    attributes: Joi.object().required(),
  }),
  note: Joi.object({
    alertId: Joi.string().required(),
    note: Joi.string().required(),
  }),
  search: Joi.object({
    q: Joi.string()
      .optional()
      .description(
        "query string query syntax (e.g., service:Web OR resource:web)"
      ),
    "from-date": Joi.date()
      .iso()
      .optional()
      .description("lastReceiveTime > from-date"),
    "to-date": Joi.date()
      .iso()
      .optional()
      .greater(Joi.ref("from-date"))
      .description("lastReceiveTime <= to-date (now)"),
    "sort-by": Joi.string()
      .optional()
      .description("Attribute to sort by (default: lastReceiveTime)"),
    reverse: Joi.boolean()
      .optional()
      .description("Change direction of default sort order"),
    page: Joi.number()
      .integer()
      .min(1)
      .optional()
      .description("Page number between 1 and total pages (default: 1)"),
    "page-size": Joi.number()
      .integer()
      .min(1)
      .optional()
      .description("Number of results per page (default: 1000)"),
    "show-raw-data": Joi.boolean()
      .optional()
      .description("Show raw data"),
    "show-history": Joi.boolean()
      .optional()
      .description("Show alert history"),
    status: Joi.string()
      .optional()
      .allow("open", "assign", "ack", "closed", "expired"),
    severity: Joi.string().optional(),
    resource: Joi.string().optional(),
    tags: Joi.string().optional(),
    event: Joi.string().optional(),
    group: Joi.string().optional(),
    environment: Joi.string().optional(),
    service: Joi.string().optional(),
  }),
  attrFilter: Joi.object({
    status: Joi.string()
      .optional()
      .allow("open", "assign", "ack", "closed", "expired"),
    severity: Joi.string().optional(),
    resource: Joi.string().optional(),
    tags: Joi.string().optional(),
    event: Joi.string().optional(),
    group: Joi.string().optional(),
    environment: Joi.string().optional(),
    service: Joi.string().optional(),
  }),
  top10: Joi.object({
    q: Joi.string().optional(),
    "group-by": Joi.string()
      .optional()
      .allow(
        "resource",
        "event",
        "service",
        "severity",
        "environment",
        "group"
      ),
    status: Joi.string()
      .optional()
      .allow("open", "assign", "ack", "closed", "expired"),
    severity: Joi.string().optional(),
    resource: Joi.string().optional(),
    tags: Joi.string().optional(),
    event: Joi.string().optional(),
    group: Joi.string().optional(),
    environment: Joi.string().optional(),
    service: Joi.string().optional(),
  }),
  createBlackout: Joi.object({
    environment: Joi.string().required(),
    resource: Joi.string().optional(),
    service: Joi.array().items(Joi.string()).optional(),
    event: Joi.string().optional(),
    group: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    startTime: Joi.date().iso().optional(),
    endTime: Joi.date().iso().optional(),
    duration: Joi.number().integer().optional().min(1),
  }),
  createHeartbeat: Joi.object({
    origin: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).optional(),
    createTime: Joi.date().iso().optional(),
    timeout: Joi.number().integer().optional().min(1),
    attributes: Joi.object().optional(),
  }),
  createAPIKey: Joi.object({
    user: Joi.string().required(),
    scopes: Joi.array().items(Joi.string().allow('admin','write','read')).required(),
    text: Joi.string().optional(),
    expireTime: Joi.date().iso().optional(),
  }),
  createUser: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    text: Joi.string().optional(),
  }),
  updateUser: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    status: Joi.string().optional().allow('active','inactive'),
    text: Joi.string().optional(),
    roles: Joi.array().items(Joi.string()).optional(),
    attributes: Joi.object().optional(),
    email_verified: Joi.boolean().optional(),
  }),
};

/**
 * Validate the entry data based on the schema
 * @param {String} type - The type of the schema
 * @param {Object} data - The data to validate
 * @param {Object} options - The options to validate
 * @returns {Object} The validated data
 * @throws {Error} If the data is invalid
 */
export default function validate(type, data, options = {}) {
  // Field exists
  if (!schema?.[type]) {
    throw new Error("Invalid type");
  }
  // Validate data
  const { error, value } = schema[type].validate(data);
  if (error) {
    if (error?.details?.[0]?.message) {
      throw new Error(error.details[0].message);
    }
    throw new Error(error);
  }

  if (options?.removeAlertId && value?.alertId) {
    delete value.alertId;
  }

  return value;
}
