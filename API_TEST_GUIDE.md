# AutoFlow API Testing Guide

## Server Status
⚠️ **MongoDB Connection Issue**: Your current IP is not whitelisted on MongoDB Atlas cluster.

### To Fix MongoDB Connection:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Navigate to **Network Access** in your cluster settings
3. Click **+ Add IP Address**
4. Select **Allow Access from Anywhere** (or add your specific IP)
5. Confirm the change

---

## API Endpoints to Test

### **1. Health Check**
```bash
GET http://localhost:5000/health
```

**Expected Response:**
```json
{"status":"ok"}
```

---

### **2. User Registration**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response:**
```json
{
  "id": "...",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### **3. User Login**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### **4. Get Current User**
```bash
GET http://localhost:5000/api/user/me
Authorization: Bearer <accessToken>
```

**Expected Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "provider": "local",
  "createdAt": "..."
}
```

---

### **5. Refresh Access Token**
```bash
POST http://localhost:5000/api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<refreshToken>"
}
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc..."
}
```

---

### **6. Logout (Clear Refresh Token)**
```bash
POST http://localhost:5000/api/auth/logout
Content-Type: application/json

{
  "refreshToken": "<refreshToken>"
}
```

**Expected Response:**
```json
{"message":"Logged out successfully"}
```

---

### **7. Forgot Password (Send Reset Email)**
```bash
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Expected Response:**
```json
{"message":"Reset email sent to john@example.com"}
```

**What Happens:**
- Email is sent to the provided address with reset link
- Console shows: `✅ Reset email sent to john@example.com`
- If mailer not configured, falls back to console log with reset link

---

### **8. Reset Password (Using Token from Email)**
```bash
POST http://localhost:5000/api/auth/reset-password
Content-Type: application/json

{
  "token": "<resetToken>",
  "newPassword": "NewSecurePass456!"
}
```

**Expected Response:**
```json
{"message":"Password reset successfully"}
```

---

### **9. Google Login (Firebase)**
```bash
POST http://localhost:5000/api/auth/google
Content-Type: application/json

{
  "idToken": "<Firebase ID Token from client>"
}
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "User Name",
    "email": "user@gmail.com",
    "avatar": "..."
  }
}
```

---

## Testing with Postman

### Create Environment Variables:
```json
{
  "baseUrl": "http://localhost:5000",
  "accessToken": "",
  "refreshToken": "",
  "resetToken": ""
}
```

### Pre-request Script (for endpoints with Auth):
```javascript
pm.request.headers.add({
  key: "Authorization",
  value: "Bearer " + pm.environment.get("accessToken")
});
```

### Post-response Script (to save tokens):
```javascript
let responseBody = pm.response.json();
if (responseBody.accessToken) {
  pm.environment.set("accessToken", responseBody.accessToken);
}
if (responseBody.refreshToken) {
  pm.environment.set("refreshToken", responseBody.refreshToken);
}
```

---

## Test Flow (Step-by-Step)

1. **Register** → Get user ID
2. **Login** → Get accessToken & refreshToken
3. **Get User (/api/user/me)** → Use accessToken header
4. **Refresh Token** → Get new accessToken
5. **Logout** → Clear refreshToken from DB
6. **Forgot Password** → Check email for reset link
7. **Reset Password** → Use token from email to set new password

---

## Environment Configuration

### .env Requirements:
```dotenv
NODE_ENV=development
PORT=5000
MONGODB_URI=<your-atlas-connection-string>
EMAIL_USER=shivam9720408099@gmail.com
EMAIL_PASS=fjvkkxborzebpayw
JWT_ACCESS_SECRET=your_access_token_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_token_secret_key_change_in_production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Firebase Service Account (Optional):
Place `backend/firebase-service-account.json` for server-side Google token verification.

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| MongoDB connection timeout | Whitelist your IP in Atlas Network Access |
| Email not sending | Check EMAIL_USER/EMAIL_PASS in .env |
| Invalid accessToken | Use /refresh-token endpoint to get new one |
| Google auth returns 501 | Set FIREBASE_SERVICE_ACCOUNT_PATH or place JSON file |

---

## Notes

- **Access tokens expire in 15 minutes**
- **Refresh tokens expire in 7 days**
- **Reset tokens expire in 15 minutes**
- Passwords are hashed with bcryptjs (10 salt rounds)
- Refresh tokens stored in DB for server-side invalidation
