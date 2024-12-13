const AlertaClient = require("../src/index.js").default;
const axios = require("axios");
const sinon = require("sinon");

// Mock the axios module
jest.mock("axios");

const DEFAULT_ENDPOINT = "https://alerta-api.fly.dev";
const DEFAULT_API_KEY = "test-api-key";

describe("AlertaClient", () => {
  let alertaClient;

  beforeEach(() => {
    // Initialize a new instance of AlertaClient before each test
    alertaClient = new AlertaClient({
      endpoint: DEFAULT_ENDPOINT,
      apiKey: DEFAULT_API_KEY,
    });
  });

  afterEach(() => {
    // Clean up any active mocks or spies after each test
    jest.clearAllMocks();
  });

  describe("Constructor", () => {
    it("should throw error if API key is not provided", () => {
      expect(() => new AlertaClient({ apiKey: "" })).toThrow(
        "API key is required to be a non-empty string"
      );
    });

    it("should throw error if API key is not a string", () => {
      expect(() => new AlertaClient({ apiKey: 123 })).toThrow(
        "API key is required to be a non-empty string"
      );
    });

    it("should throw error if endpoint is invalid", () => {
      expect(
        () =>
          new AlertaClient({ apiKey: "test-api-key", endpoint: "invalid-url" })
      ).toThrow("Invalid API endpoint");
    });

    it("should initialize with provided endpoint", () => {
      const client = new AlertaClient({
        apiKey: "test-api-key",
        endpoint: "https://custom-api.com",
      });
      expect(client.endpoint).toBe("https://custom-api.com");
    });
  });

  describe("Request method", () => {
    it("should make a successful API request", async () => {
      const mockResponse = { data: { id: "123", status: "created" } };
      axios.mockResolvedValue(mockResponse);

      const response = await alertaClient.request("post", "/alert", {
        resource: "test",
      });

      expect(response).toEqual(mockResponse.data);
      expect(axios).toHaveBeenCalledWith({
        method: "post",
        url: "https://alerta-api.fly.dev/alert",
        headers: expect.objectContaining({
          Authorization: `Key ${DEFAULT_API_KEY}`,
        }),
        data: { resource: "test" },
        params: {},
      });
    });

    it("should handle API error response", async () => {
      axios.mockRejectedValueOnce({
        response: { status: 500, data: { message: "Internal Server Error" } },
      });

      await expect(
        alertaClient.request("post", "/alert", { resource: "test" })
      ).rejects.toThrow(
        'API Error: 500 Internal Server Error - {"message":"Internal Server Error"}'
      );
    });

    it("should handle no response error", async () => {
      axios.mockRejectedValueOnce({ request: {} });

      await expect(
        alertaClient.request("post", "/alert", { resource: "test" })
      ).rejects.toThrow("No response received from API");
    });

    it("should handle general errors", async () => {
      axios.mockRejectedValueOnce(new Error("Test error"));

      await expect(
        alertaClient.request("post", "/alert", { resource: "test" })
      ).rejects.toThrow("Error: Test error");
    });
  });

  describe("createAlert", () => {
    it("should successfully create an alert", async () => {
      const mockResponse = { data: { id: "123", status: "created" } };
      // Mock axios to resolve with mockResponse
      axios.mockResolvedValue(mockResponse);

      // Prepare the data to send with the request
      const data = {
        resource: "resource1",
        event: "event1",
        environment: "prod",
        severity: "critical",
        service: ["service1"],
        group: "group1",
        value: 1,
        text: "Test alert",
        tags: ["tag1"],
        attributes: {},
      };

      // Call the createAlert method
      const response = await alertaClient.createAlert(data);

      // Assert that the response is as expected
      expect(response).toEqual(mockResponse.data);

      // Assert axios call
      expect(axios).toHaveBeenCalledWith({
        method: "post",
        url: `${DEFAULT_ENDPOINT}/alert`,
        headers: expect.objectContaining({
          Authorization: `Key ${DEFAULT_API_KEY}`,
          "Content-Type": "application/json",
        }),
        data,
        params: {},
      });
    });

    it("should throw validation error if data is invalid", async () => {
      const invalidData = {
        resource: "",
        event: "",
        environment: "",
        severity: "",
        service: [],
        group: "",
        value: 0,
        text: "",
        tags: [],
        attributes: {},
      };
      await expect(alertaClient.createAlert(invalidData)).rejects.toThrow(
        '"resource" is not allowed to be empty'
      );
    });
  });

  describe("setAlertStatus", () => {
    it("should successfully set alert status", async () => {
      const mockResponse = { data: { status: "ok" } };
      axios.mockResolvedValue(mockResponse);
      const alertId = "123";
      const data = {
        status: "closed",
        text: "Alert closed",
        timeout: 30,
      };
      const response = await alertaClient.setAlertStatus({ ...data, alertId });

      expect(response).toEqual(true);

      expect(axios).toHaveBeenCalledWith({
        method: "put",
        url: `${DEFAULT_ENDPOINT}/alert/${alertId}/status`,
        headers: expect.objectContaining({
          Authorization: `Key ${DEFAULT_API_KEY}`,
          "Content-Type": "application/json",
        }),
        data,
        params: {},
      });
    });

    it("should throw validation error for invalid status data", async () => {
      const data = { alertId: "", status: "", text: "", timeout: 0 };
      await expect(alertaClient.setAlertStatus(data)).rejects.toThrow(
        '"alertId" is not allowed to be empty'
      );
    });
  });

  describe("actionAlert", () => {
    it("should successfully perform an action on an alert", async () => {
      const mockResponse = { data: { status: "ok" } };
      axios.mockResolvedValue(mockResponse);

      const alertId = "123";
      const data = {
        action: "acknowledge",
        text: "Alert acknowledged",
        timeout: 60,
      };
      const response = await alertaClient.actionAlert({ ...data, alertId });

      expect(response).toEqual(true);

      expect(axios).toHaveBeenCalledWith({
        method: "put",
        url: `${DEFAULT_ENDPOINT}/alert/${alertId}/action`,
        headers: expect.objectContaining({
          Authorization: `Key ${DEFAULT_API_KEY}`,
          "Content-Type": "application/json",
        }),
        data,
        params: {},
      });
    });
  });

  describe("tagAlert", () => {
    it("should successfully tag an alert", async () => {
      const mockResponse = { data: { status: "ok" } };
      axios.mockResolvedValue(mockResponse);

      const tags = ["tag1", "tag2"];
      const alertId = "123";
      const response = await alertaClient.tagAlert(alertId, tags);

      expect(response).toEqual(true);

      expect(axios).toHaveBeenCalledWith({
        method: "put",
        url: `${DEFAULT_ENDPOINT}/alert/${alertId}/tag`,
        headers: expect.objectContaining({
          Authorization: `Key ${DEFAULT_API_KEY}`,
          "Content-Type": "application/json",
        }),
        data: { tags },
        params: {},
      });
    });
  });

  describe("untagAlert", () => {
    it("should successfully untag an alert", async () => {
      const mockResponse = { data: { status: "ok" } };
      axios.mockResolvedValue(mockResponse);
      const alertId = "123";
      const tags = ["tag1"];
      const response = await alertaClient.untagAlert(alertId, tags);

      expect(response).toEqual(true);

      expect(axios).toHaveBeenCalledWith({
        method: "put",
        url: `${DEFAULT_ENDPOINT}/alert/${alertId}/untag`,
        headers: expect.objectContaining({
          Authorization: `Key ${DEFAULT_API_KEY}`,
          "Content-Type": "application/json",
        }),
        data: { tags },
        params: {},
      });
    });
  });

  describe("searchAlerts", () => {
    it("should retrieve a list of alerts", async () => {
      const mockResponse = {
        data: {
          alerts: [
            {
              attributes: {
                ip: "46.199.53.53",
                key: "foo",
                x: "X",
              },
              correlate: ["test", "Low"],
              createTime: "2024-08-06T04:39:18.420Z",
              customer: null,
              duplicateCount: 0,
              environment: "Development",
              event: "Low",
              group: "Web",
              history: [],
              href: "http://alerta-api.fly.dev/alert/b59abce1-84f7-4966-aad6-1562d9813f7f",
              id: "b59abce1-84f7-4966-aad6-1562d9813f7f",
              lastReceiveId: "b59abce1-84f7-4966-aad6-1562d9813f7f",
              lastReceiveTime: "2024-08-06T04:39:18.428Z",
              origin:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
              previousSeverity: "indeterminate",
              rawData: null,
              receiveTime: "2024-08-06T04:39:18.428Z",
              repeat: false,
              resource: "test",
              service: ["Website"],
              severity: "normal",
              status: "open",
              tags: ["cyprus", "tag1"],
              text: "Web server is down, something wrong!",
              timeout: 7200,
              trendIndication: "lessSevere",
              type: "browserAlert",
              updateTime: "2024-12-13T11:31:36.467Z",
              value: "12",
            },
          ],
          autoRefresh: true,
          lastTime: "2024-08-06T04:39:18.428Z",
          more: false,
          page: 1,
          pageSize: 50,
          pages: 1,
          severityCounts: {
            normal: 1,
          },
          status: "ok",
          statusCounts: {
            open: 1,
          },
          total: 1,
        },
      };

      axios.mockResolvedValue(mockResponse);

      const params = { status: "open" };
      const response = await alertaClient.searchAlerts(params);

      expect(response).toEqual(mockResponse.data);

      expect(axios).toHaveBeenCalledWith({
        method: "get",
        url: `${DEFAULT_ENDPOINT}/alerts`,
        headers: expect.objectContaining({
          Authorization: `Key ${DEFAULT_API_KEY}`,
          "Content-Type": "application/json",
        }),
        params,
        data: {}
      });
    });
  });

  describe("deleteAlert", () => {
    it("should successfully delete an alert", async () => {
      const mockResponse = { data: { status: "ok" } };
      axios.mockResolvedValue(mockResponse);

      const alertId = "123";
      const response = await alertaClient.deleteAlert(alertId);

      expect(response).toEqual(true);

      expect(axios).toHaveBeenCalledWith({
        method: "delete",
        url: `${DEFAULT_ENDPOINT}/alert/${alertId}`,
        headers: expect.objectContaining({
          Authorization: `Key ${DEFAULT_API_KEY}`,
          "Content-Type": "application/json",
        }),
        data: {},
        params: {},
      });
    });
  });

  describe("healthcheck", () => {
    it("should return true for a successful healthcheck", async () => {
      axios.mockResolvedValue({ data: "OK" });

      const result = await alertaClient.healthcheck();
      expect(result).toBe(true);
    });

    it("should return false for a failed healthcheck", async () => {
      axios.mockRejectedValue(new Error("Healthcheck failed"));

      const result = await alertaClient.healthcheck();
      expect(result).toBe(false);
    });
  });
});
