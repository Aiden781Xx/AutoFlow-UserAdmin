import fs from 'fs';
import admin from 'firebase-admin';

// Initialize Firebase Admin if service account available
let adminApp = null;

try {
  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'backend/firebase-service-account.json';
  if (fs.existsSync(saPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    adminApp = admin;
    console.log('✅ Firebase Admin initialized');
  } else {
    console.log('ℹ️ Firebase service account not found, Google auth disabled');
  }
} catch (err) {
  console.error('❌ Failed to init Firebase Admin:', err.message);
}

export default adminApp;
