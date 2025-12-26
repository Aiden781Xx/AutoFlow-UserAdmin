# 🚀 AutoFlow Full Project Setup & Testing Guide

## ⚠️ Current Issue: MongoDB Atlas IP Whitelist

Your MongoDB Atlas cluster is rejecting connections because your IP address is not whitelisted.

### Quick Fix (2 minutes):

1. **Go to MongoDB Atlas Dashboard:**
   - Visit https://www.mongodb.com/cloud/atlas
   - Log in to your account
   - Select your cluster "cluster0"

2. **Add Your IP to Whitelist:**
   - Click **Network Access** in the left sidebar
   - Click **+ Add IP Address**
   - Select **Allow Access from Anywhere** (for development)
   - Click **Confirm**
   - Wait 1-2 minutes for the change to propagate

3. **Restart Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `✅ MongoDB connected`

---

## 📋 Project Structure

```
AutoFlow Assignment/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   ├── db.js
│   │   │   ├── firebase.js
│   │   │   └── mailer.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── models/
│   │   │   └── User.model.js
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.js
│   │   │   │   ├── auth.controller.js
│   │   │   │   └── auth.routes.js
│   │   │   └── user/
│   │   │       ├── user.controller.js
│   │   │       └── user.routes.js
│   │   └── utils/
│   │       └── token.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── config/
│   │   │   ├── api.js
│   │   │   └── firebaseClient.js
│   │   ├── modules/
│   │   │   └── auth/
│   │   │       ├── auth.routes.jsx
│   │   │       ├── pages/
│   │   │       │   ├── Login.jsx
│   │   │       │   ├── Register.jsx
│   │   │       │   ├── ForgotPassword.jsx
│   │   │       │   └── ResetPassword.jsx
│   │   │       └── services/
│   │   │           └── auth.api.js
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   └── shared/
│   │       └── components/
│   │           └── ProtectedRoute.jsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── AutoFlow_API_Collection.postman_collection.json
└── API_TEST_GUIDE.md
```

---

## 🔧 Prerequisites

Make sure you have installed:
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Postman** (for API testing) - optional

Verify installation:
```bash
node --version
npm --version
```

---

## 📦 Installation Steps

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Variables Setup

### Backend (.env)
File: `backend/.env`

```dotenv
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://AutoFlowLOGINSYSTEM:AutoFlow@cluster0.wv2fv4m.mongodb.net/
EMAIL_USER=shivam9720408099@gmail.com
EMAIL_PASS=fjvkkxborzebpayw
JWT_ACCESS_SECRET=your_access_token_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_token_secret_key_change_in_production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

✅ **Already configured** - just need MongoDB whitelisting

### Frontend (.env)
File: `frontend/.env`

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PORT=5173
```

✅ **Already configured**

### Firebase (Optional - for Google Login)
If you have Firebase service account JSON:
1. Place it at `backend/firebase-service-account.json`
2. Or set `FIREBASE_SERVICE_ACCOUNT_PATH` env var

---

## 🚀 Running the Project

### Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```

Expected output:
```
✅ Mailer configured
✅ MongoDB connected
🚀 Server running on port 5000
🔗 Health check: http://localhost:5000/health
```

### Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 Testing All API Endpoints

### Option 1: Using Postman (Recommended)

1. **Import Collection:**
   - Open Postman
   - Click **Import** → **File**
   - Select `AutoFlow_API_Collection.postman_collection.json`

2. **Set Environment Variables:**
   - Click **Environments** → **Create New**
   - Add variables:
     - `baseUrl`: `http://localhost:5000`
     - `accessToken`: (will be filled after login)
     - `refreshToken`: (will be filled after login)
     - `resetToken`: (will be filled from forgot password)

3. **Test Flow:**
   - ✅ **Health Check** → Should return 200
   - ✅ **Register** → Create new user
   - ✅ **Login** → Get tokens
   - ✅ **Get User (Me)** → Retrieve current user
   - ✅ **Refresh Token** → Get new access token
   - ✅ **Forgot Password** → Trigger email
   - ✅ **Reset Password** → Reset with token
   - ✅ **Logout** → Clear session
   - ✅ **Google Login** → Sign with Google (if configured)

---

### Option 2: Using cURL Commands

#### 1. **Health Check**
```bash
curl -X GET http://localhost:5000/health
```

#### 2. **Register New User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### 3. **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

*Copy `accessToken` and `refreshToken` from response*

#### 4. **Get Current User (Protected)**
```bash
curl -X GET http://localhost:5000/api/user/me \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

#### 5. **Refresh Access Token**
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<YOUR_REFRESH_TOKEN>"
  }'
```

#### 6. **Forgot Password**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

*Check your email for reset link*

#### 7. **Reset Password**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<RESET_TOKEN_FROM_EMAIL>",
    "newPassword": "NewSecurePass456!"
  }'
```

#### 8. **Logout**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<YOUR_REFRESH_TOKEN>"
  }'
```

---

## 🎯 Frontend Testing (Browser)

1. **Open browser:** http://localhost:5173

2. **Test Register Page:**
   - Go to `/register`
   - Fill in name, email, password
   - Click Register
   - Should redirect to login

3. **Test Login Page:**
   - Go to `/login`
   - Enter credentials
   - Click Login
   - Should redirect to dashboard
   - Tokens saved in localStorage

4. **Test Google Login:**
   - Click "Sign in with Google"
   - Select account
   - Should create/login user

5. **Test Dashboard:**
   - View user info
   - Click Logout
   - Should redirect to login

6. **Test Protected Routes:**
   - Try accessing `/dashboard` without login
   - Should redirect to `/login`

7. **Test Forgot/Reset:**
   - Go to `/login` → Forgot Password link
   - Enter email
   - Check email for reset link
   - Click link → Reset page
   - Enter new password
   - Login with new password

---

## ✅ Testing Checklist

### Backend APIs:
- [ ] Health check endpoint
- [ ] User registration (with validation)
- [ ] User login (with bcrypt verification)
- [ ] Access token generation
- [ ] Refresh token generation & storage
- [ ] Token refresh endpoint
- [ ] Logout & refresh token cleanup
- [ ] Forgot password (email sending)
- [ ] Password reset with token validation
- [ ] Google login (if service account configured)
- [ ] Get current user (protected route)
- [ ] Auth middleware validation

### Frontend:
- [ ] Register page loads
- [ ] Login page loads
- [ ] Token interceptor works
- [ ] Automatic token refresh on 401
- [ ] Protected routes redirect
- [ ] Dashboard loads with user data
- [ ] Logout clears tokens
- [ ] Google login button
- [ ] Forgot password email flow
- [ ] Password reset page

### Security:
- [ ] Passwords hashed with bcryptjs
- [ ] Password not returned in responses
- [ ] Refresh tokens stored in DB
- [ ] Refresh tokens invalidated on logout
- [ ] Reset tokens expire in 15 mins
- [ ] Access tokens expire in 15 mins
- [ ] CORS enabled (if needed)
- [ ] No secrets in .env tracked

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **MongoDB won't connect** | Whitelist IP in Atlas Network Access |
| **Email not sending** | Check EMAIL_USER/EMAIL_PASS in .env |
| **401 Unauthorized** | Token expired - use refresh endpoint |
| **CORS error** | Check frontend baseUrl matches backend |
| **Port 5000 already in use** | Change PORT in .env or kill process |
| **Google login returns 501** | Configure Firebase service account |
| **Reset link expires** | Token valid for 15 mins only |

---

## 📊 API Response Examples

### ✅ Success Responses:

**Register / Login:**
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

**Get User:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "provider": "local",
  "createdAt": "2025-12-26T10:30:00.000Z",
  "updatedAt": "2025-12-26T10:30:00.000Z"
}
```

### ❌ Error Responses:

**401 Unauthorized:**
```json
{
  "error": "Invalid credentials"
}
```

**409 Conflict:**
```json
{
  "error": "Email already in use"
}
```

---

## 🔐 Security Features Implemented

✅ **Authentication:**
- Email/password registration
- Bcrypt password hashing (10 salt rounds)
- JWT access tokens (15 min expiry)
- JWT refresh tokens (7 days, stored in DB)
- Google OAuth login (Firebase verified)

✅ **Authorization:**
- Auth middleware verifies tokens
- Protected routes require valid token
- Refresh tokens invalidated on logout
- Reset tokens expire in 15 minutes

✅ **Data Protection:**
- Passwords never returned in API responses
- Reset tokens are random crypto strings
- Email sending via secure Gmail SMTP

---

## 📝 Notes

- **Database:** MongoDB Atlas (Cloud)
- **ORM:** Mongoose
- **Password Hashing:** bcryptjs
- **Tokens:** JWT (jsonwebtoken)
- **Email:** Nodemailer (Gmail)
- **Frontend Framework:** React + Vite
- **HTTP Client:** Axios (with interceptors)
- **Styling:** Tailwind CSS

---

## 🎓 Learning Resources

- [MongoDB Atlas Setup](https://docs.mongodb.com/manual/reference/connection-string/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [Express.js Guide](https://expressjs.com/)
- [React Router](https://reactrouter.com/)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

---

**Happy Testing! 🚀**
