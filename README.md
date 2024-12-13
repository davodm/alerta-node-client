# Alerta Node.js Client

A powerful and easy-to-use Node.js client for the [Alerta.io](https://alerta.io/) API, enabling seamless integration with Alerta's monitoring and alerting system.

## Features

- Full support for Alerta API endpoints
- Customizable for different environments and user needs
- Built-in request validation using [Joi](https://joi.dev/)
- Detailed error handling and logging

## Installation

Install the package using npm:

```bash
npm install alerta-node-client
```

## Usage

### Initialize the Client

```javascript
import AlertaClient from 'alerta-node-client';

const alertaClient = new AlertaClient({
  endpoint: 'https://api.alerta.io',
  apiKey: 'your-api-key',
});
```

### Example: Create an Alert

```javascript
const alertData = {
  resource: 'web-server',
  event: 'CPU_Usage_High',
  environment: 'Production',
  severity: 'major',
  service: ['web'],
  group: 'Infrastructure',
  value: '90%',
  text: 'CPU usage exceeds threshold',
  tags: ['critical', 'server'],
  attributes: {
    ip: '192.168.1.1',
  },
};

try {
  const response = await alertaClient.createAlert(alertData);
  console.log('Alert created:', response);
} catch (error) {
  console.error('Error creating alert:', error.message);
}
```

### Example: Retrieve Alerts

```javascript
try {
  const params = { status: 'open', severity: 'major' };
  const alerts = await alertaClient.searchAlerts(params);
  console.log('Retrieved alerts:', alerts);
} catch (error) {
  console.error('Error retrieving alerts:', error.message);
}
```

### Error Handling

Errors include detailed information about the API response:

```javascript
try {
  await alertaClient.getAlert('non-existent-id');
} catch (error) {
  console.error(error.message); // Example: "API Error: 404 Not Found"
}
```

## API Methods

### Alert Management
- `createAlert(data)` - Create or update an alert
- `getAlert(alertId)` - Retrieve a specific alert
- `setAlertStatus({ alertId, status, text, timeout })` - Update an alert's status
- `deleteAlert(alertId)` - Delete an alert

### Query Alerts
- `searchAlerts(queryParams)` - Search for alerts
- `listAlertHistory(queryParams)` - Get alert history
- `getCounts(queryParams)` - Count alerts by severity and status
- `getTop10Alerts(queryParams, groupBy)` - Get top 10 alerts by grouping attribute

### Tagging
- `tagAlert(alertId, tags)` - Add tags to an alert
- `untagAlert(alertId, tags)` - Remove tags from an alert

### User Management
- `createUser(name, email, password, text)` - Create a user
- `listUsers()` - List all users
- `updateUser(userId, data)` - Update user details
- `updateUserAttributes(userId, attributes)` - Update user attributes
- `updateMeAttributes(attributes)` - Update logged-in user attributes
- `deleteUser(userId)` - Delete a user

### Heartbeats
- `sendHeartbeat(data)` - Send a heartbeat
- `getHeartbeat(heartbeatId)` - Retrieve a heartbeat
- `listHeartbeats()` - List all heartbeats
- `deleteHeartbeat(heartbeatId)` - Delete a heartbeat

### Blackouts
- `createBlackout(data)` - Create a blackout period
- `listBlackouts()` - List all blackout periods
- `deleteBlackout(blackoutId)` - Delete a blackout period

### Metrics & Health
- `getMetrics()` - Get application metrics
- `healthcheck(type)` - Perform a health check
- `getManifest()` - Retrieve build information

### Tags & Services
- `listTags(queryParams)` - List tags
- `listServices(queryParams)` - List services
- `listEnvironments(queryParams)` - List environments

## Contributing

Contributions are welcome! Submit issues or pull requests for bugs and enhancements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

