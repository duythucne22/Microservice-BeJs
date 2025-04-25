# Layout structure
```bash
Auth/
├── src/
│   ├── controllers/
│   │   └── authController.js       # Auth logic handlers
│   │   └── userController.js       # User profile operations
│   ├── routes/
│   │   └── authRoutes.js           # Authentication endpoints
│   │   └── userRoutes.js           # User profile endpoints
│   ├── models/
│   │   └── user.js                 # User model
│   │   └── refreshToken.js         # Token storage model
│   ├── services/
│   │   └── authService.js          # Auth business logic
│   │   └── emailService.js         # Email notifications
│   │   └── tokenService.js         # JWT handling
│   ├── middlewares/
│   │   └── authenticate.js         # Auth verification middleware
│   │   └── validate.js             # Request validation
│   │   └── rateLimiter.js          # Prevent brute force attacks
│   ├── config/
│   │   └── database.js             # Database connection & models setup
│   │   └── passport.js             # OAuth strategies
│   │   └── environment.js          # Environment configs
│   ├── utils/
│   │   └── logger.js               # Logging utility
│   │   └── errorHandler.js         # Centralized error handling
│   │   └── passwordUtils.js        # Password hashing/validation
│   ├── app.js                      # Express application setup
│   └── index.js                    # Server entry point
├── .env.example                    # Environment variable template
├── .env                            # Environment variables (gitignored)
├── package.json                    # Dependencies and scripts
├── Dockerfile                      # For containerization maybe not ??
└── README.md                       # Documentation
```
# Package required 
```js
"dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.6.5",
    "nodemailer": "^6.9.7",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "sequelize": "^6.35.2",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.0.2",
    "supertest": "^6.3.3"
  }
```

npm i bcryptjs cookie-parser cors dotenv express express-rate-limit express-validator helmet jsonwebtoken mysql2 nodemailer passport passport-google-oauth20 sequelize winston nodemon supertest


## logger.js
usage 
In your authentication service, this logger helps track:

Security Events:
```js
logger.info('User login attempt', { userId, ip });
logger.error('Authentication failed', { reason, attempts });
```

Debugging:
```js
logger.debug('Token validation', { token: '***' });
```

Error Tracking:
```js
try {
  // auth logic
} catch (error) {
  logger.error('Authentication error:', error);
}
```

Example Log Output:
```bash
2024-03-08T10:15:23.123Z INFO: User registered successfully {userId: "123"}
2024-03-08T10:15:24.456Z ERROR: Invalid token format {token: "***"}
```