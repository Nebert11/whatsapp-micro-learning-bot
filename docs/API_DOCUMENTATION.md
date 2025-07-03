# API Documentation

Complete API reference for the WhatsApp Microlearning Bot backend.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### POST /auth/login

Login with admin credentials.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin",
    "username": "admin",
    "role": "admin"
  }
}
```

## User Management

### GET /users

Get all registered users.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Response:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "phoneNumber": "+1234567890",
    "name": "John Doe",
    "preferredTopics": [...],
    "isActive": true,
    "isPaused": false,
    "registrationDate": "2024-01-15T10:30:00.000Z",
    "lastActive": "2024-01-20T09:15:00.000Z",
    "streak": 15,
    "totalScore": 450
  }
]
```

### GET /users/stats

Get user statistics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "totalUsers": 156,
  "activeUsers": 134,
  "pausedUsers": 22,
  "newUsersToday": 8
}
```

### GET /users/:phoneNumber

Get specific user by phone number.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "phoneNumber": "+1234567890",
  "name": "John Doe",
  "preferredTopics": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "JavaScript Basics",
      "icon": "💻"
    }
  ],
  "progress": [
    {
      "topicId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "completedLessons": [...],
      "currentLessonIndex": 5,
      "totalLessonsCompleted": 5
    }
  ]
}
```

### PUT /users/:phoneNumber

Update user information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "isPaused": true,
  "preferredTopics": ["topicId1", "topicId2"]
}
```

### DELETE /users/:phoneNumber

Delete a user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Content Management

### GET /content

Get all content/lessons.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `topic` (optional): Filter by topic ID
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "content": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "title": "Introduction to Variables",
      "content": "Variables are containers for storing data...",
      "topicId": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "JavaScript Basics",
        "icon": "💻"
      },
      "lessonNumber": 1,
      "type": "text",
      "difficulty": "beginner",
      "estimatedReadTime": 3,
      "viewCount": 45,
      "completionCount": 38,
      "isActive": true
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 89
}
```

### GET /content/:id

Get specific content by ID.

**Headers:** `Authorization: Bearer <token>`

### POST /content

Create new content.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Understanding Functions",
  "content": "Functions are blocks of code designed to perform particular tasks...",
  "topicId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "lessonNumber": 2,
  "type": "text",
  "difficulty": "beginner",
  "estimatedReadTime": 4,
  "tags": ["functions", "javascript", "basics"]
}
```

### PUT /content/:id

Update existing content.

**Headers:** `Authorization: Bearer <token>`

### DELETE /content/:id

Delete content.

**Headers:** `Authorization: Bearer <token>`

## Topic Management

### GET /content/topics/all

Get all available topics.

**Response:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "JavaScript Basics",
    "description": "Learn fundamental JavaScript concepts",
    "category": "coding",
    "difficulty": "beginner",
    "icon": "💻",
    "totalLessons": 25,
    "subscriberCount": 45,
    "isActive": true
  }
]
```

### POST /content/topics

Create new topic.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Python Fundamentals",
  "description": "Learn Python programming basics",
  "category": "coding",
  "difficulty": "beginner",
  "icon": "🐍",
  "tags": ["python", "programming", "basics"]
}
```

## Bot Operations

### GET /bot/stats

Get bot performance statistics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "totalUsers": 156,
  "activeUsers": 134,
  "pausedUsers": 22,
  "newUsersToday": 8,
  "activeThisWeek": 89,
  "engagementRate": "64.2"
}
```

### POST /bot/send-message

Send a test message to a specific user.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "message": "This is a test message from the admin dashboard."
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "SM1234567890abcdef",
  "demo": false
}
```

### POST /bot/broadcast

Broadcast message to multiple users.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "Important announcement for all users!",
  "targetGroup": "active"
}
```

**Target Groups:**
- `all`: All registered users
- `active`: Active, non-paused users
- `paused`: Paused users
- `new`: Users registered in last 24 hours

**Response:**
```json
{
  "message": "Broadcast initiated",
  "targetCount": 134,
  "results": [
    {
      "phoneNumber": "+1234567890",
      "success": true,
      "messageId": "SM123..."
    }
  ]
}
```

### POST /bot/webhook

WhatsApp webhook endpoint (called by Twilio).

**Request Body:**
```json
{
  "Body": "HELP",
  "From": "whatsapp:+1234567890",
  "To": "whatsapp:+14155238886"
}
```

### GET /bot/webhook

Webhook verification endpoint (called by Twilio).

**Query Parameters:**
- `hub.verify_token`: Verification token
- `hub.challenge`: Challenge string

## Health Check

### GET /health

Check API health status.

**Response:**
```json
{
  "status": "OK",
  "message": "WhatsApp Microlearning Bot is running",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (valid token but insufficient permissions)
- `404` - Not found
- `429` - Too many requests (rate limited)
- `500` - Internal server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **User management**: 100 requests per minute
- **Content operations**: 200 requests per minute
- **Bot operations**: 50 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642675200
```

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (starts at 1)
- `limit`: Items per page (max 100)

**Response includes:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Webhooks

### WhatsApp Message Events

When users send messages, Twilio calls your webhook:

```json
{
  "AccountSid": "ACxxxxx",
  "MessageSid": "SMxxxxx",
  "Body": "User message content",
  "From": "whatsapp:+1234567890",
  "To": "whatsapp:+14155238886",
  "NumMedia": "0"
}
```

The bot automatically processes these messages and responds appropriately.

## SDKs and Libraries

### JavaScript/Node.js

```javascript
const api = axios.create({
  baseURL: 'https://your-domain.com/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get users
const users = await api.get('/users');

// Send message
const result = await api.post('/bot/send-message', {
  phoneNumber: '+1234567890',
  message: 'Hello from the bot!'
});
```

### cURL Examples

```bash
# Login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get users
curl -H "Authorization: Bearer $TOKEN" \
  https://your-domain.com/api/users

# Create content
curl -X POST https://your-domain.com/api/content \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Lesson","content":"Lesson content..."}'
```

---

For more examples and advanced usage, see the [Setup Guide](SETUP_GUIDE.md) and [README](../README.md).