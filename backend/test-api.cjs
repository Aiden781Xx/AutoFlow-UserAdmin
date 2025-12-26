const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
});

async function testAPIs() {
  try {
    console.log('\n========== API TEST SUITE ==========\n');

    // 1. REGISTER TEST
    console.log('1️⃣  Testing REGISTER API...');
    const registerRes = await api.post('/api/auth/register', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPassword123'
    });
    console.log('✅ Register Success:', {
      id: registerRes.data.user._id,
      name: registerRes.data.user.name,
      email: registerRes.data.user.email,
      accessToken: registerRes.data.accessToken ? '✅ Provided' : '❌ Missing'
    });
    const { accessToken, refreshToken } = registerRes.data;

    // 2. LOGIN TEST
    console.log('\n2️⃣  Testing LOGIN API...');
    const loginRes = await api.post('/api/auth/login', {
      email: 'testuser@example.com',
      password: 'TestPassword123'
    });
    console.log('✅ Login Success:', {
      id: loginRes.data.user._id,
      name: loginRes.data.user.name,
      accessToken: loginRes.data.accessToken ? '✅ Provided' : '❌ Missing',
      refreshToken: loginRes.data.refreshToken ? '✅ Provided' : '❌ Missing'
    });

    // 3. FORGOT PASSWORD TEST
    console.log('\n3️⃣  Testing FORGOT PASSWORD API...');
    const forgotRes = await api.post('/api/auth/forgot-password', {
      email: 'testuser@example.com'
    });
    console.log('✅ Forgot Password Success:', {
      message: forgotRes.data.message,
      resetToken: forgotRes.data.resetToken ? '✅ Token Generated' : '❌ No Token'
    });

    // 4. GET PROFILE TEST
    console.log('\n4️⃣  Testing GET PROFILE API...');
    const profileRes = await api.get('/api/user/me', {
      headers: { Authorization: `Bearer ${loginRes.data.accessToken}` }
    });
    console.log('✅ Get Profile Success:', {
      id: profileRes.data._id,
      name: profileRes.data.name,
      email: profileRes.data.email,
      avatar: profileRes.data.avatar || 'Not set'
    });

    // 5. UPDATE PROFILE TEST
    console.log('\n5️⃣  Testing UPDATE PROFILE API...');
    const updateRes = await api.put('/api/user/me', 
      {
        name: 'Updated Test User',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      {
        headers: { Authorization: `Bearer ${loginRes.data.accessToken}` }
      }
    );
    console.log('✅ Update Profile Success:', {
      id: updateRes.data._id,
      name: updateRes.data.name,
      avatar: updateRes.data.avatar,
      updatedAt: updateRes.data.updatedAt
    });

    console.log('\n========== ALL TESTS PASSED ✅ ==========\n');

  } catch (error) {
    console.error('\n❌ Error Details:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error);
    }
    if (error.response?.status === 409) {
      console.log('💡 Hint: User already exists. Try with a different email or delete from MongoDB.');
    }
  }
}

testAPIs();
