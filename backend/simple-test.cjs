const http = require('http');

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('\n========== API TEST SUITE ==========\n');

  try {
    // 1. REGISTER
    console.log('1️⃣  Testing REGISTER API...');
    const registerRes = await makeRequest('/api/auth/register', 'POST', {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPassword123'
    });
    console.log(`Status: ${registerRes.status}`);
    if (registerRes.status === 201) {
      console.log('✅ Register Success:', {
        id: registerRes.data.user._id,
        name: registerRes.data.user.name,
        email: registerRes.data.user.email
      });
      var accessToken = registerRes.data.accessToken;
    } else {
      console.log('Response:', registerRes.data);
    }

    // 2. LOGIN
    console.log('\n2️⃣  Testing LOGIN API...');
    const loginRes = await makeRequest('/api/auth/login', 'POST', {
      email: 'testuser@example.com',
      password: 'TestPassword123'
    });
    console.log(`Status: ${loginRes.status}`);
    if (loginRes.status === 200) {
      console.log('✅ Login Success:', {
        id: loginRes.data.user._id,
        name: loginRes.data.user.name,
        accessToken: loginRes.data.accessToken ? '✅ Provided' : '❌ Missing'
      });
      accessToken = loginRes.data.accessToken;
    } else {
      console.log('Response:', loginRes.data);
    }

    // 3. FORGOT PASSWORD
    console.log('\n3️⃣  Testing FORGOT PASSWORD API...');
    const forgotRes = await makeRequest('/api/auth/forgot-password', 'POST', {
      email: 'testuser@example.com'
    });
    console.log(`Status: ${forgotRes.status}`);
    if (forgotRes.status === 200) {
      console.log('✅ Forgot Password Success:', {
        message: forgotRes.data.message,
        resetToken: forgotRes.data.resetToken ? '✅ Token Generated' : '❌ No Token'
      });
    } else {
      console.log('Response:', forgotRes.data);
    }

    console.log('\n========== TESTS COMPLETED ✅ ==========\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTests();
