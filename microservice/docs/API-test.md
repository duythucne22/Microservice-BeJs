# API test case 
## Auth API Endpoints test 
xoa 7, 8, 9 , 10
### 1. User Registration

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/users/register
    
- Headers:
    
    - Content-Type: application/json
        
- Body (raw JSON):
```json
{
  "userName": "testuser",
  "passWord": "password123",
  "fullName": "Test User",
  "birth": "1990-01-01",
  "phoneNumber": "1234567890",
  "address": "123 Test Street, Test City",
  "email": "testuser@example.com"
}
```

### 2. Owner Registration

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/owners/register
    
- Headers:
    
    - Content-Type: application/json
        
- Body (raw JSON):
```json
{
  "userName": "testowner",
  "passWord": "password123",
  "phoneNumber": "9876543210",
  "email": "testowner@example.com"
}
```

### 3. User Login

should add email instead of role  

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/auth/login
    
- Headers:
    
    - Content-Type: application/json
        
- Body (raw JSON):
```json
{
  "userName": "testuser",
  "passWord": "password123",
  "role": "customer"
  //notice remove role
}
```

### 4. Owner Login

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/auth/login
    
- Headers:
    
    - Content-Type: application/json
        
- Body (raw JSON):
```json
{
  "userName": "testowner",
  "passWord": "password123",
  "role": "owner"
}
```

### 5. Verify Token

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/auth/verify-token
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{accessToken}}
        
- Body: (empty)

### 6. Refresh Token

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/auth/refresh-token
    
- Headers:
    
    - Content-Type: application/json
        
- Body (raw JSON):
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

### 7. Get User Profile

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/users/profile
    
- Headers:
    
    - Authorization: Bearer {{accessToken}}

### 8. Get User By ID

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/users/{{userId}}
    
- Headers:
    
    - Authorization: Bearer {{accessToken}}

### 9. Update User

**Request:**

- Method: PUT
    
- URL: {{baseUrl}}/api/users/{{userId}}
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{accessToken}}
        
- Body (raw JSON):
```json
{
  "fullName": "Updated Test User",
  "phoneNumber": "5555555555"
}
```

### 10. Update Password

**Request:**

- Method: PATCH
    
- URL: {{baseUrl}}/api/users/{{userId}}/password
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{accessToken}}
        
- Body (raw JSON):
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

### 11. Login with New Password

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/auth/login
    
- Headers:
    
    - Content-Type: application/json
        
- Body (raw JSON):
```json
{
  "userName": "testuser",
  "passWord": "newpassword123",
  "role": "customer"
}
```

### 12. Logout

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/auth/logout
    
- Headers:
    
    - Content-Type: application/json
        
- Body (raw JSON):
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

### 13. Verify Token After Logout (Should Fail)

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/auth/verify-token
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{accessToken}}
        
- Body: (empty)

### 14. Error Handling - Invalid Login

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/auth/login
    
- Headers:
    
    - Content-Type: application/json
        
- Body (raw JSON):

```json
{
  "userName": "testuser",
  "passWord": "wrongpassword",
  "role": "customer"
}
```

### 15. Error Handling - Invalid Registration

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/users/register
    
- Headers:
    
    - Content-Type: application/json
        
- Body (raw JSON):
```json
{
  "userName": "testuser",
  "passWord": "short",
  "fullName": "Test User",
  "birth": "invalid-date",
  "phoneNumber": "123",
  "address": "123 Test Street",
  "email": "invalid-email"
}
```

## User API Endpoints test
6, 7, 8 currently don't work

### 1. Get Current User Profile

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/users/profile
    
- Headers:
    
    - Authorization: Bearer {{accessToken}}

### 2. Get User By ID

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/users/{{userId}}
    
- Headers:
    
    - Authorization: Bearer {{accessToken}}

### 3. Get User By Username

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/users/username/testuser
    
- Headers:
    
    - Authorization: Bearer {{accessToken}}

### 4. Update User Profile

**Request:**

- Method: PUT
    
- URL: {{baseUrl}}/api/users/{{userId}}
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{accessToken}}
        
- Body (raw JSON):
```json
{
  "fullName": "Updated Test User",
  "phoneNumber": "5555555555",
  "address": "456 New Street, Test City"
}
```

### 5. Update User Address Only

**Request:**

- Method: PATCH
    
- URL: {{baseUrl}}/api/users/{{userId}}/address
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{accessToken}}
        
- Body (raw JSON):

```json
{
  "address": "789 Newest Street, Another City"
}
```

### 6.  Search  Users (Admin Only)

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/users/search?query=test
    
- Headers:
    
    - Authorization: Bearer {{accessToken}} (admin token required)


### 7. Get User Statistics (Admin Only)

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/users/statistics
    
- Headers:
    
    - Authorization: Bearer {{accessToken}} (admin token required)

### 8. Error Handling - Get Non-Existent User

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/users/9999 (assuming this ID doesn't exist)
    
- Headers:
    
    - Authorization: Bearer {{accessToken}}

### 9. Error Handling - Invalid Update Data

**Request:**

- Method: PUT
    
- URL: {{baseUrl}}/api/users/{{userId}}
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{accessToken}}
        
- Body (raw JSON):

```json
{
  "email": "invalid-email"
}
```

## Event Service API endpoints test

### 1. Get All Events (Public)

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/events
    
- Headers: None (public endpoint)

### 2. Create Event (Owner Only)

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/events
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{ownerAccessToken}}
        
- Body (raw JSON):

```json
{
  "name": "Summer Music Festival",
  "date": "2025-07-15",
  "owner": "Music Promotions Inc."
}
```


### 3. Get Event By ID (Public)

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/events/{{eventId}}
    
- Headers: None (public endpoint)

### 4. Update Event (Owner Only)

**Request:**

- Method: PUT
    
- URL: {{baseUrl}}/api/events/{{eventId}}
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{ownerAccessToken}}
        
- Body (raw JSON):
```json
{
  "name": "Summer Music Festival 2025",
  "date": "2025-07-20",
  "owner": "Music Promotions Inc."
}
```

### 5. Create Event Schedule (Owner Only)

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/schedules
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{ownerAccessToken}}
        
- Body (raw JSON):
```json
{
  "stadiumID": {{stadiumId}},
  "eventID": {{eventId}},
  "date": "2025-07-20",
  "timeStart": "18:00:00",
  "timeEnd": "23:00:00"
}
```

### 6. Get All Schedules (Public)

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/schedules
    
- Headers: None (public endpoint)

### 7. Get Schedule By ID (Public)

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/schedules/{{scheduleId}}
    
- Headers: None (public endpoint)

### 8. Get Schedules By Event ID (Public)

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/schedules/event/{{eventId}}
    
- Headers: None (public endpoint)

### 9. Create Event Zone (Owner Only)

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/zones
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{ownerAccessToken}}
        
- Body (raw JSON):
```json
{
  "name": "A Section",
  "size": 200,
  "eventScheduleID": {{scheduleId}},
  "price": 150.00,
  "status": "available"
}
```

### 10. Get All Zones (Public)

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/zones
    
- Headers: None (public endpoint)

### 11. Get Zone By ID (Public)

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/zones/{{zoneId}}
    
- Headers: None (public endpoint)

### 12. Get Zones By Schedule ID (Public)

**Request:**

- Method: GET
    
- URL: {{baseUrl}}/api/zones/schedule/{{scheduleId}}
    
- Headers: None (public endpoint)

### 13. Update Zone Status (Owner Only)

**Request:**

- Method: PATCH
    
- URL: {{baseUrl}}/api/zones/{{zoneId}}/status
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{ownerAccessToken}}
        
- Body (raw JSON):
```json
{
  "status": "sold_out"
}
```

### 14. Update Zone (Owner Only)

**Request:**

- Method: PUT
    
- URL: {{baseUrl}}/api/zones/{{zoneId}}
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{ownerAccessToken}}
        
- Body (raw JSON):
```json
{
  "name": "D Section",
  "size": 150,
  "eventScheduleID": {{scheduleId}},
  "price": 50.00,
  "status": "available"
}
```

### 15. Update Schedule (Owner Only)

**Request:**

- Method: PUT
    
- URL: {{baseUrl}}/api/schedules/{{scheduleId}}
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{ownerAccessToken}}
        
- Body (raw JSON):
```json
{
  "stadiumID": {{stadiumId}},
  "eventID": {{eventId}},
  "date": "2025-07-21",
  "timeStart": "19:00:00",
  "timeEnd": "23:30:00"
}
```

### 16. Error Handling - Create Event Without Authentication

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/events
    
- Headers:
    
    - Content-Type: application/json
        
- Body (raw JSON):
```json
{
  "name": "Unauthorized Event",
  "date": "2025-08-01",
  "owner": "Hacker"
}
```

### 17. Error Handling - Create Event With Customer Role (Not Owner)

**Request:**

- Method: POST
    
- URL: {{baseUrl}}/api/events
    
- Headers:
    
    - Content-Type: application/json
        
    - Authorization: Bearer {{accessToken}} (use customer token, not owner)
        
- Body (raw JSON):
```json
{
  "name": "Unauthorized Event",
  "date": "2025-08-01",
  "owner": "Regular Customer"
}
```

### 18. Delete Zone (Owner Only)

**Request:**

- Method: DELETE
    
- URL: {{baseUrl}}/api/zones/{{zoneId}}
    
- Headers:
    
    - Authorization: Bearer {{ownerAccessToken}}

### 19. Delete Schedule (Owner Only)

**Request:**

- Method: DELETE
    
- URL: {{baseUrl}}/api/schedules/{{scheduleId}}
    
- Headers:
    
    - Authorization: Bearer {{ownerAccessToken}}

### 20. Delete Event (Owner Only)

**Request:**

- Method: DELETE
    
- URL: {{baseUrl}}/api/events/{{eventId}}
    
- Headers:
    
    - Authorization: Bearer {{ownerAccessToken}}

