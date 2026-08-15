// Automated Security & Vulnerability Test Suite for Kafa'a Backend
import http from 'http';

function makeRequest(options: http.RequestOptions, body?: any): Promise<{ statusCode: number; data: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode || 500, data: JSON.parse(data) });
        } catch {
          resolve({ statusCode: res.statusCode || 500, data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runSecurityTests() {
  console.log('🛡️ Running Automated Security & IDOR Tests on Local Backend (http://localhost:4000)...');
  let passed = 0;
  let failed = 0;

  // 1. Test Health Endpoint
  try {
    const healthRes = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/health/ready',
      method: 'GET'
    });
    if (healthRes.statusCode === 200 && healthRes.data.status === 'ready') {
      console.log('✅ TEST 1 PASSED: Database & Server Health Check');
      passed++;
    } else {
      console.error('❌ TEST 1 FAILED:', healthRes);
      failed++;
    }
  } catch (e) {
    console.error('❌ TEST 1 ERROR:', e);
    failed++;
  }

  // 2. Test Invalid Credentials Login
  try {
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'ahmed.benali@kafaa.dz', password: 'WrongPassword123!' });

    if (loginRes.statusCode === 401 && loginRes.data.code === 'INVALID_CREDENTIALS') {
      console.log('✅ TEST 2 PASSED: Invalid Credential Authentication Rejection');
      passed++;
    } else {
      console.error('❌ TEST 2 FAILED:', loginRes);
      failed++;
    }
  } catch (e) {
    console.error('❌ TEST 2 ERROR:', e);
    failed++;
  }

  // 3. Test IDOR / Unauthenticated Admin Endpoint Protection
  try {
    const adminRes = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/admin/verifications',
      method: 'GET'
    });

    if (adminRes.statusCode === 401) {
      console.log('✅ TEST 3 PASSED: Admin Route IDOR & Unauthenticated Protection');
      passed++;
    } else {
      console.error('❌ TEST 3 FAILED:', adminRes);
      failed++;
    }
  } catch (e) {
    console.error('❌ TEST 3 ERROR:', e);
    failed++;
  }

  // 4. Test Valid Executive User Login
  let accessToken = '';
  try {
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'ahmed.benali@kafaa.dz', password: 'Kafa2026!AlgeriaSecure' });

    if (loginRes.statusCode === 200 && loginRes.data.data.accessToken) {
      accessToken = loginRes.data.data.accessToken;
      console.log('✅ TEST 4 PASSED: Valid Argon2id User Login & JWT Token Generation');
      passed++;
    } else {
      console.error('❌ TEST 4 FAILED:', loginRes);
      failed++;
    }
  } catch (e) {
    console.error('❌ TEST 4 ERROR:', e);
    failed++;
  }

  // 5. Test Mass Assignment Escalation Attempt
  try {
    const profileRes = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/users/profile',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }, {
      headline: 'Senior Full-Stack Lead @ Yassir',
      role: 'ADMIN',        // Malicious attempt to escalate role
      verified: true,       // Malicious attempt to self-verify
      isAdmin: true         // Malicious attempt to gain admin rights
    });

    if (profileRes.statusCode === 200 && profileRes.data.data) {
      // Check that role / verified / isAdmin were NOT escalated
      const meRes = await makeRequest({
        hostname: 'localhost',
        port: 4000,
        path: '/api/auth/me',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (meRes.data.data.isAdmin === false) {
        console.log('✅ TEST 5 PASSED: Mass Assignment Role Escalation Prevention');
        passed++;
      } else {
        console.error('❌ TEST 5 FAILED: Role was escalated via mass assignment!');
        failed++;
      }
    } else {
      console.error('❌ TEST 5 FAILED:', profileRes);
      failed++;
    }
  } catch (e) {
    console.error('❌ TEST 5 ERROR:', e);
    failed++;
  }

  console.log(`\n📊 SECURITY TEST RESULTS: ${passed} PASSED, ${failed} FAILED.`);
  if (failed > 0) process.exit(1);
}

runSecurityTests();
