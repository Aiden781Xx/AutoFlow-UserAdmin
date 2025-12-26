# 🧪 AutoFlow API Testing Report

## 📋 Pre-Requisite Status

### ✅ Project Setup Completed:
- [x] Backend structure created
- [x] Frontend (Vite) created
- [x] Authentication system implemented
- [x] Token generation & refresh logic
- [x] Auth middleware for protected routes
- [x] Password reset with email
- [x] Google OAuth integration
- [x] Axios interceptor with auto-refresh
- [x] Protected route component
- [x] Environment files configured

### ⚠️ Blocker: MongoDB Atlas IP Whitelist

**Current Status:** Server cannot connect to MongoDB because your IP is not whitelisted

**Why?**
- MongoDB Atlas cluster requires IP addresses to be explicitly whitelisted for security
- Your current IP is not in the cluster's allowlist

**Quick Fix (1-2 minutes):**

```
1. Visit: https://www.mongodb.com/cloud/atlas
2. Login with your credentials
3. Select "cluster0"
4. Click "Network Access" in the left sidebar
5. Click "+ Add IP Address"
6. Select "Allow Access from Anywhere" (for dev)
7. Click "Confirm"
8. Wait 1-2 minutes for propagation
9. Restart backend: npm run dev
```

---

## 🧬 API Architecture Overview

```
REQUEST FLOW:
Frontend (React/Vite)
    ↓
Axios Instance (api.js)
    ↓
Request Interceptor
(Adds Authorization: Bearer {token})
    ↓
Express Server (backend)
    ↓
Routes (auth.routes, user.routes)
    ↓
Controllers (auth.controller, user.controller)
    ↓
Services (auth.service)
    ↓
MongoDB + Mongoose Models
    ↓
Response Interceptor
(Catches 401 → Refreshes token → Retries)
    ↓
Frontend Components
```

---

## 📡 API Endpoints Implemented

### 1️⃣ **Authentication Endpoints**

#### `POST /api/auth/register`
**Purpose:** Create new user account  
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error Responses:**
- `400` → Missing required fields
- `409` → Email already registered
- `500` → Server error

**Security Features:**
- ✅ Password hashed with bcryptjs (10 rounds)
- ✅ Email uniqueness validated
- ✅ Password not stored in response
- ✅ Provider set to 'local'

---

#### `POST /api/auth/login`
**Purpose:** Authenticate user  
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `401` → Invalid email/password
- `401` → Use Google login (for Google-linked accounts)
- `400` → Missing fields

**Security Features:**
- ✅ Password compared with bcrypt.compare()
- ✅ Access token valid for 15 minutes
- ✅ Refresh token valid for 7 days (stored in DB)
- ✅ Tokens signed with JWT secrets

---

#### `POST /api/auth/refresh-token`
**Purpose:** Get new access token using refresh token  
**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401` → Invalid or expired refresh token
- `401` → Token not found in database

**Security Features:**
- ✅ Refresh token verified against JWT secret
- ✅ Refresh token compared with stored value in DB
- ✅ Prevents token reuse attacks
- ✅ Returns only new access token (no refresh token)

---

#### `POST /api/auth/logout`
**Purpose:** Invalidate refresh token  
**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**
- `400` → Refresh token required

**Security Features:**
- ✅ Removes refresh token from database
- ✅ Access token invalid after this (expires in 15 min)
- ✅ User cannot use refresh token anymore

---

#### `POST /api/auth/forgot-password`
**Purpose:** Generate password reset token  
**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "If email exists, reset link will be sent"
}
```

**Email Content:**
```
Subject: Password reset for your account

Body:
You requested a password reset. Use this link (valid for 15 minutes):
http://localhost:5173/reset-password?token=abc123def456...
```

**What Happens:**
- ✅ Crypto random token generated
- ✅ Token saved to DB with 15-min expiry
- ✅ Email sent via Gmail SMTP
- ✅ If email fails, reset link printed to console

**Security Features:**
- ✅ Silent success (no user enumeration)
- ✅ Token is random 64 hex chars
- ✅ Token expires in 15 minutes
- ✅ One-time use only

---

#### `POST /api/auth/reset-password`
**Purpose:** Reset password using token  
**Request Body:**
```json
{
  "token": "abc123def456...",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

**Error Responses:**
- `400` → Invalid or expired token
- `400` → Missing token or password

**Security Features:**
- ✅ Token verified against stored value
- ✅ Token expiry checked (15 min window)
- ✅ New password hashed with bcrypt
- ✅ Reset token invalidated after use
- ✅ User can login with new password

---

#### `POST /api/auth/google`
**Purpose:** Login/Register with Google  
**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  }
}
```

**Error Responses:**
- `400` → ID token required
- `401` → Invalid Google ID token
- `400` → Email not found in token
- `400` → Email already registered with password
- `501` → Google auth not configured on server

**Security Features:**
- ✅ ID token verified with Firebase Admin SDK
- ✅ Prevents token spoofing
- ✅ Email extracted from verified token
- ✅ Profile picture stored as avatar
- ✅ Prevents mixing of auth methods
- ✅ User created automatically if new

**When it Works:**
- Firebase service account JSON must be at `backend/firebase-service-account.json`
- OR `FIREBASE_SERVICE_ACCOUNT_PATH` environment variable set

---

### 2️⃣ **User Endpoints**

#### `GET /api/user/me`
**Purpose:** Get current authenticated user  
**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "provider": "local",
  "avatar": "",
  "createdAt": "2025-12-26T10:30:00.000Z",
  "updatedAt": "2025-12-26T10:30:00.000Z"
}
```

**Error Responses:**
- `401` → No token provided
- `401` → Invalid token
- `404` → User not found

**Security Features:**
- ✅ Requires valid access token
- ✅ Token verified with JWT secret
- ✅ Returns only current user's data
- ✅ Password field excluded from response

---

### 3️⃣ **Health & Monitoring**

#### `GET /health`
**Purpose:** Check server status  
**Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

## 🔐 Security Implementation Details

### Password Security
```
User Input: "SecurePass123!"
    ↓
Bcryptjs Hashing (10 salt rounds)
    ↓
Stored: $2a$10$N9qo8uLOickgx2ZMRZoMye...
    ↓
On Login: bcrypt.compare(input, hashed)
    ↓
Match: ✅ Login successful
```

### Token Security
```
Access Token:
- Signed with JWT_ACCESS_SECRET
- Expires in 15 minutes
- Sent in Authorization header
- Cannot be refreshed

Refresh Token:
- Signed with JWT_REFRESH_SECRET
- Expires in 7 days
- Stored in MongoDB
- Can only be used to get new access token
- Invalidated on logout
- Server validates on each refresh
```

### Reset Token Security
```
Reset Request
    ↓
Generate: crypto.randomBytes(32).toString('hex')
    ↓
Expiry: Date.now() + 15 * 60 * 1000 (15 min)
    ↓
Store: { resetToken, resetTokenExpiry }
    ↓
Email: Contains reset link with token
    ↓
User clicks link
    ↓
Verify: token exists AND not expired
    ↓
Update: Password hashed, token cleared
```

---

## 🎯 Frontend Integration

### Axios Interceptor Flow

```
REQUEST:
axios.get('/api/user/me')
    ↓
Request Interceptor
    ├─ Add Authorization header
    └─ Send: Authorization: Bearer {accessToken}
    ↓
Response Interceptor (if 401)
    ├─ Queue remaining requests
    ├─ Call refresh endpoint
    ├─ Get new accessToken
    ├─ Retry original request
    └─ Send queued requests
```

### Token Storage
- **localStorage** → accessToken & refreshToken
- **Memory** → Never stored server-side (stateless)
- **Cleared on logout** → localStorage cleared + backend invalidates

### Protected Routes
```
ProtectedRoute checks:
├─ Token in localStorage?
├─ NO → Redirect to /login
└─ YES → Load protected component
```

---

## 📊 Comprehensive Test Scenarios

### Scenario 1: Happy Path (Register → Login → Use → Logout)
```
1. POST /auth/register
   Input: { name, email, password }
   Expected: 201, { id, name, email }
   
2. POST /auth/login
   Input: { email, password }
   Expected: 200, { accessToken, refreshToken, user }
   
3. GET /user/me
   Header: Authorization: Bearer {accessToken}
   Expected: 200, { user data }
   
4. POST /auth/logout
   Input: { refreshToken }
   Expected: 200, { message }
   
5. GET /user/me (after logout)
   Expected: 401 Unauthorized
```

### Scenario 2: Token Refresh
```
1. Login → Get accessToken (15 min) & refreshToken (7 days)
   
2. Wait 16+ minutes
   
3. GET /user/me with old accessToken
   Expected: 401 Unauthorized
   
4. Frontend auto-calls:
   POST /auth/refresh-token { refreshToken }
   Expected: 200, { new accessToken }
   
5. GET /user/me with new accessToken
   Expected: 200, { user data }
```

### Scenario 3: Password Reset Flow
```
1. POST /auth/forgot-password
   Input: { email }
   Expected: 200 (silent)
   
2. Check email for reset link
   Expected: Email with link containing token
   
3. User clicks link → Goes to reset page
   
4. POST /auth/reset-password
   Input: { token, newPassword }
   Expected: 200, { message }
   
5. OLD PASSWORD NO LONGER WORKS
   POST /auth/login { old password }
   Expected: 401 Unauthorized
   
6. NEW PASSWORD WORKS
   POST /auth/login { new password }
   Expected: 200, { tokens, user }
```

### Scenario 4: Google Login
```
1. Frontend: initiate Firebase signInWithPopup
   Expected: Google consent screen
   
2. User selects Google account
   Expected: Firebase returns idToken
   
3. Frontend: POST /auth/google { idToken }
   Expected: 200, { accessToken, refreshToken, user }
   
4. User created if new, logged in if existing
   
5. User marked as provider: "google"
```

### Scenario 5: Error Handling
```
Invalid Credentials:
POST /auth/login { wrong password }
Expected: 401 Unauthorized

Email Already Exists:
POST /auth/register { existing email }
Expected: 409 Conflict

Expired Reset Token:
POST /auth/reset-password { old token, new password }
Expected: 400 Bad Request

Missing Authorization:
GET /user/me (no header)
Expected: 401 Unauthorized

Invalid Token:
GET /user/me { Authorization: Bearer invalid }
Expected: 401 Unauthorized
```

---

## 📈 Testing Coverage Matrix

| Feature | Implemented | Tested | Status |
|---------|------------|--------|--------|
| Register | ✅ | Blocked by MongoDB | Blocked |
| Login | ✅ | Blocked by MongoDB | Blocked |
| Access Token | ✅ | Blocked by MongoDB | Blocked |
| Refresh Token | ✅ | Blocked by MongoDB | Blocked |
| Logout | ✅ | Blocked by MongoDB | Blocked |
| Forgot Password | ✅ | Blocked by MongoDB | Blocked |
| Reset Password | ✅ | Blocked by MongoDB | Blocked |
| Google OAuth | ✅ | Blocked by MongoDB | Blocked |
| Protected Routes | ✅ | Blocked by MongoDB | Blocked |
| Auth Middleware | ✅ | Blocked by MongoDB | Blocked |
| Error Handling | ✅ | Blocked by MongoDB | Blocked |
| Email Sending | ✅ | Ready (nodemailer) | Ready |
| Password Hashing | ✅ | Ready (bcryptjs) | Ready |
| CORS | ✅ | N/A | ✅ |
| Validation | ✅ | Blocked by MongoDB | Blocked |

---

## 🚀 Next Steps to Enable Testing

### Step 1: Fix MongoDB Whitelist (1-2 minutes)
```
Visit: https://www.mongodb.com/cloud/atlas
→ Network Access
→ + Add IP Address
→ Allow Anywhere (or your IP)
→ Wait 1-2 minutes
```

### Step 2: Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
✅ Mailer configured
✅ MongoDB connected
🚀 Server running on port 5000
```

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE ready in 123ms
➜ Local: http://localhost:5173/
```

### Step 4: Test APIs via Postman
```
Import: AutoFlow_API_Collection.postman_collection.json
Environment: baseUrl = http://localhost:5000
Test flow: Register → Login → User → Refresh → Logout
```

### Step 5: Test Frontend UI
```
Open: http://localhost:5173
→ Register page
→ Login page
→ Dashboard (protected)
→ Logout
```

---

## ✨ Summary

**What's Implemented:**
- ✅ Complete authentication system
- ✅ Secure token management
- ✅ Password reset with email
- ✅ Google OAuth integration
- ✅ Protected routes
- ✅ Auto-refresh interceptor
- ✅ Error handling
- ✅ Input validation

**Current Blocker:**
- ⚠️ MongoDB Atlas IP whitelist

**Time to Unblock:**
- ⏱️ 1-2 minutes (MongoDB whitelist)
- ⏱️ ~30 seconds (restart server)

**Then you can:**
- Test all 9 API endpoints
- Test all 5 frontend flows
- Verify email sending
- Confirm token lifecycle
- Validate security features

---

**Everything is ready! Just whitelist your IP and start testing.** 🎉
