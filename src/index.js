"use strict";

import axios from "axios";
import validate from "./validation.js";

export default class AlertaClient {
  constructor({ endpoint, apiKey }) {
    if (!apiKey || apiKey === "" || typeof apiKey !== "string") {
      throw new Error("API key is required to be a non-empty string");
    }
    // Ensure the endpoint is valid only if provided (not when the API key is missing)
    if (
      endpoint &&
      (typeof endpoint !== "string" ||
        !endpoint.match(/^(http|https):\/\/[^ "]+$/))
    ) {
      throw new Error("Invalid API endpoint");
    }

    this.endpoint = endpoint.replace(/\/+$/, ""); // Remove trailing slashes
    this.apiKey = apiKey;
    this.headers = {
      Authorization: `Key ${this.apiKey}`,
      "Content-Type": "application/json",
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
  async request(method, url, data = {}, params = {}) {
    try {
      // Filter data to remove undefined or empty values
      data = this._cleanData(data);
      params = this._cleanData(params);
      // Send request
      const response = await axios({
        method,
        url: `${this.endpoint}${url}`,
        headers: this.headers,
        data,
        params,
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

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
  async createAlert({
    resource,
    event,
    environment,
    severity,
    service,
    group,
    value,
    text,
    tags,
    attributes,
  }) {
    const data = {
      resource,
      event,
      environment,
      severity,
      service,
      group,
      value,
      text,
      tags,
      attributes,
    };

    // Validate data
    validate("alert", data);
    // Send request
    return await this.request("post", "/alert", data);
  }

  /**
   * Retrieves an alert with the given alert ID.
   * @param {string} alertId - Alert ID
   * @returns {Promise<object>} - Alert data
   * @throws {Error} - API error
   */
  async getAlert(alertId) {
    return await this.request("get", `/alert/${alertId}`);
  }

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
  async setAlertStatus({ alertId, status, text, timeout }) {
    // Validate data
    const data = validate(
      "alertStatus",
      { alertId, status, text, timeout },
      { removeAlertId: true }
    );
    // Send request
    const result = await this.request("put", `/alert/${alertId}/status`, data);
    return result?.status === "ok";
  }

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
  async actionAlert({ alertId, action, text, timeout }) {
    // Validate data
    const data = validate(
      "actionAlert",
      { alertId, action, text, timeout },
      { removeAlertId: true }
    );
    // Send request
    const result = await this.request("put", `/alert/${alertId}/action`, data);
    return result?.status === "ok";
  }

  /**
   * Adds tag values from the set of tags for an alert.
   * @param {string} alertId - Alert ID
   * @param {string[]} tags - Tag values
   * @returns {Promise<boolean>} - True if successful
   * @throws {Error} - Validation error or API error
   */
  async tagAlert(alertId, tags) {
    // Validation
    const data = validate("tags", { alertId, tags }, { removeAlertId: true });
    // Send request
    const result = await this.request("put", `/alert/${alertId}/tag`, data);
    return result?.status === "ok";
  }

  /**
   * Remove tag values from the set of tags for an alert.
   * @param {string} alertId - Alert ID
   * @param {string[]} tags - Tag values
   * @returns {Promise<boolean>} - True if successful
   * @throws {Error} - Validation error or API error
   */
  async untagAlert(alertId, tags) {
    // Validation
    const data = validate("tags", { alertId, tags }, { removeAlertId: true });
    // Send Request
    const result = await this.request("put", `/alert/${alertId}/untag`, data);
    return result?.status === "ok";
  }

  /**
   * Adds, deletes or modifies alert attributes. To delete an attribute assign “null” to the attribute.
   * @param {string} alertId - Alert ID
   * @param {object} attributes - Alert attributes
   * @returns {Promise<boolean>} - True if successful
   * @throws {Error} - Validation error or API error
   */
  async updateAlertAttributes(alertId, attributes) {
    // Validation
    const data = validate(
      "attributes",
      { alertId, attributes },
      { removeAlertId: true }
    );
    // Send Request
    const result = await this.request("put", `/alert/${alertId}/attributes`, data);
    return result?.status === "ok";
  }

  /**
   * Adds a note to an alert.
   * @param {string} alertId - Alert ID
   * @param {string} note - Note message
   * @returns {Promise<object>} - Response data
   * @throws {Error} - Validation error or API error
   */
  async addAlertNote(alertId, note) {
    // Validation
    const data = validate("note", { alertId, note }, { removeAlertId: true });
    // Send Request
    return await this.request("put", `/alert/${alertId}/note`, data);
  }

  /**
   * Delete an alert.
   * @param {string} alertId - Alert ID
   * @returns {Promise<boolean>} - True if successful
   * @throws {Error} - API error
   */
  async deleteAlert(alertId) {
    const result= await this.request("delete", `/alert/${alertId}`);
    return result?.status === "ok";
  }

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
  async searchAlerts(queryParams = {}) {
    // Validate parameters
    const data = validate("search", queryParams);
    return await this.request("get", "/alerts", {}, data);
  }

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
  async listAlertHistory(queryParams = {}) {
    // Validate parameters
    const data = validate("attrFilter", queryParams);
    return await this.request("get", "/alerts/history", {}, data);
  }

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
  async getCounts(queryParams = {}) {
    // Validate parameters
    const data = validate("attrFilter", queryParams);
    return await this.request("get", "/alerts/count", {}, data);
  }

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
  async getTop10Alerts(queryParams = {}, groupBy = null) {
    // Validate parameters
    const data = validate("top10", {
      ...queryParams,
      "group-by": groupBy,
    });
    return await this.request("get", "/alerts/top10", {}, data);
  }

  /**
   * Returns a list of environments and an alert count for each
   * @param {object} queryParams - Query parameters
   * @param {string} queryParams.status - Alert status
   * @param {string} queryParams.severity - Alert severity
   * @param {string} queryParams.resource - Resource name
   * @returns {Promise<object>} - The environments list
   * @throws {Error} - Validation error or API error
   */
  async listEnvironments(queryParams = {}) {
    // Validate parameters
    const data = validate("attrFilter", queryParams);
    return await this.request("get", "/environments", {}, data);
  }

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
  async listServices(queryParams = {}) {
    // Validate parameters
    const data = validate("attrFilter", queryParams);
    return await this.request("get", "/services", {}, data);
  }

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
  async listTags(queryParams = {}) {
    // Validate parameters
    const data = validate("attrFilter", queryParams);
    return await this.request("get", "/alerts/tags", {}, data);
  }

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
  async createBlackout({
    environment,
    resource,
    service,
    event,
    group,
    tags,
    startTime,
    endTime,
    duration,
  }) {
    // Validate data
    const data = validate("createBlackout", {
      environment,
      resource,
      service,
      event,
      group,
      tags,
      startTime,
      endTime,
      duration,
    });
    return await this.request("post", "/blackout", data);
  }

  /**
   * Returns a list of blackout periods, including expired blackouts.
   * @returns {Promise<object>} - The blackouts list
   * @throws {Error} - API error
   */
  async listBlackouts() {
    return await this.request("get", "/blackouts");
  }

  /**
   * Permanently deletes a blackout period. It cannot be undone.
   * @param {string} blackoutId - Blackout ID
   * @returns {Promise<boolean>} - True if successful
   * @throws {Error} - API error
   */
  async deleteBlackout(blackoutId) {
    const result = await this.request("delete", `/blackout/${blackoutId}`);
    return result?.status === "ok";
  }

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
  async sendHeartbeat({ origin, tags, createTime, timeout, attributes }) {
    // Validate data
    const data = validate("createHeartbeat", {
      origin,
      tags,
      createTime,
      timeout,
      attributes,
    });
    return await this.request("post", "/heartbeat", data);
  }

  /**
   * Retrieves a heartbeat based on the heartbeat ID.
   * @param {string} heartbeatId - Heartbeat ID
   * @returns {Promise<object>} - Heartbeat data
   * @throws {Error} - API error
   */
  async getHeartbeat(heartbeatId) {
    return await this.request("get", `/heartbeat/${heartbeatId}`);
  }

  /**
   * Returns a list of all heartbeats.
   * @returns {Promise<object>} - The heartbeats list
   * @throws {Error} - API error
   */
  async listHeartbeats() {
    return await this.request("get", "/heartbeats");
  }

  /**
   * Permanently deletes a heartbeat. It cannot be undone.
   * @param {string} heartbeatId - Heartbeat ID
   * @returns {Promise<boolean>} - True if successful
   * @throws {Error} - API error
   */
  async deleteHeartbeat(heartbeatId) {
    const result = await this.request("delete", `/heartbeat/${heartbeatId}`);
    return result?.status === "ok";
  }

  /**
   * Creates a new API key.
   * @param {string} user - User name
   * @param {string[]} scopes - Scopes
   * @param {string} text - API key text description
   * @param {string} expireTime - Expiry time
   * @returns {Promise<object>} - Response data
   * @throws {Error} - Validation error or API error
   */
  async createApiKey(user, scopes, text = null, expireTime = null) {
    // Validate Data
    const data = validate("createAPIKey", { user, scopes, text, expireTime });
    return await this.request("post", "/key", data);
  }

  /**
   * Returns a list of API keys.
   * @returns {Promise<object>} - The API keys list
   * @throws {Error} - API error
   */
  async listApiKeys() {
    return await this.request("get", "/keys");
  }

  /**
   * Permanently deletes an API key. It cannot be undone.
   * @param {string} key - API key
   * @returns {Promise<boolean>} - True if successful
   * @throws {Error} - API error
   */
  async deleteApiKey(key) {
    const result = this.request("delete", `/key/${key}`);
    return result?.status === "ok";
  }

  /**
   * Creates a new Basic Auth user.
   * @param {*} userData
   * @returns
   */
  async createUser(name, email, password, text = undefined) {
    // Validate data
    const data = validate("createUser", { name, email, password, text });
    return await this.request("post", "/user", data);
  }

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
  async updateUser(
    userId,
    {
      name = undefined,
      email = undefined,
      password = undefined,
      status = undefined,
      roles = undefined,
      attributes = undefined,
      text = undefined,
      email_verified = undefined,
    }
  ) {
    // Validate data
    const data = validate("updateUser", {
      name,
      email,
      password,
      status,
      roles,
      attributes,
      text,
      email_verified,
    });
    return await this.request("put", `/user/${userId}`, data);
  }

  /**
   * Updates the specified user attributes.
   * @param {string} userId - User ID
   * @param {object} attributes - User attributes
   * @returns {Promise<object>} - Response data
   * @throws {Error} - API error
   */
  async updateUserAttributes(userId, attributes) {
    return await this.request("put", `/user/${userId}/attributes`, attributes);
  }

  /**
   * Updates the logged in user attributes.
   * @param {object} attributes - User attributes
   * @returns {Promise<boolean>} - True if successful
   * @throws {Error} - API error
   */
  async updateMeAttributes(attributes) {
    const result = await this.request("put", "/user/me/attributes", attributes);
    return result?.status === "ok";
  }

  /**
   * List users.
   * @returns {Promise<object>} - Response data
   * @throws {Error} - API error
   */
  async listUsers() {
    return await this.request("get", "/users");
  }

  /**
   * Permanently deletes a user. It cannot be undone.
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - True if successful
   * @throws {Error} - API error
   */
  async deleteUser(userId) {
    const result = await this.request("delete", `/user/${userId}`);
    return result?.status === "ok";
  }

  // Management

  /**
   * Get build info, including build date, release number and git commit sha.
   * @returns {Promise<object>} - Response data
   * @throws {Error} - API error
   */
  async getManifest() {
    return await this.request("get", "/management/manifest");
  }

  /**
   * Get the server status.
   * @param {string} type - Healthcheck type (light, good-to-go, deep)
   * @returns {Promise<object>} - Response data
   * @throws {Error} - API error
   */
  async healthcheck(type = "light") {
    let endpoint;
    switch (type) {
      // The “good-to-go” healthcheck checks the database is alive and returns HTTP status codes 200 or 503.
      case "good-to-go":
      case "good":
      case "gtg":
        endpoint = "management/gtg";
        break;
      // This healthcheck checks that all reported heartbeats are not more than 4 times their timeout value and reports HTTP status codes 200 or 503. It implicitly checks the database is up also.
      case "deep":
      case "deep-check":
        endpoint = "management/healthcheck";
        break;
      // The “underscore” healthcheck simply returns HTTP status code 200 OK if the application is up. It does not query the database.
      default:
        endpoint = "_";
    }
    try {
      await this.request("get", endpoint);
      // If no error is thrown, the healthcheck is successful with a 200 status code
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get application metrics in JSON format.
   * @returns {Promise<object>} - Response data
   * @throws {Error} - API error
   */
  async getMetrics() {
    return await this.request("get", "/management/status");
  }

  // Error Handling
  _handleError(error) {
    // Log the error to the console for debugging
    console.error("API Error:", error.response?.data || error.message);
  
    if (error?.response) {
      const { status, data } = error.response;
  
      // Fallback to a default error message if no message is in data
      const message = data?.message || 'No status text available';
  
      throw new Error(
        `API Error: ${status} ${message} - ${JSON.stringify(data)}`
      );
    } else if (error?.request) {
      throw new Error("No response received from API");
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }

  // Params and data cleanup
  _cleanData(data) {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([, v]) => v !== undefined && v !== "" && v !== null
      )
    );
  }
}
