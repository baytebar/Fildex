import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/v1';

async function testAllEndpoints() {
  console.log('🧪 Comprehensive API Test Suite\n');
  console.log('=' .repeat(60));

  try {
    // 1. Test admin login
    console.log('1. Testing Admin Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'superadmin@fildex.com',
        password: 'SuperAdminPass123!'
      })
    });

    const loginResult = await loginResponse.json();
    if (!loginResult.success) {
      console.log('❌ Admin login failed');
      return;
    }

    const token = loginResult.data.token;
    console.log('✅ Admin login successful');

    // 2. Test all admin endpoints
    console.log('\n2. Testing Admin Endpoints...');
    
    const endpoints = [
      { name: 'Get All Admins', url: '/admin/admins', method: 'GET' },
      { name: 'Get Dashboard Users', url: '/admin/dashboard/users', method: 'GET' },
      { name: 'Get Departments', url: '/admin/departments', method: 'GET' },
      { name: 'Get Job Titles', url: '/admin/job-titles', method: 'GET' },
      { name: 'Get Job Postings', url: '/job-posting', method: 'GET' },
      { name: 'Get Resumes', url: '/resume', method: 'GET' },
      { name: 'Get Notifications', url: '/admin/notifications/recent-cvs', method: 'GET' }
    ];

    const results = [];
    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
          method: endpoint.method,
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const endTime = Date.now();
        
        const result = await response.json();
        
        results.push({
          name: endpoint.name,
          status: response.status,
          time: endTime - startTime,
          success: response.status === 200,
          message: result.message || 'No message'
        });
        
        if (response.status === 200) {
          console.log(`✅ ${endpoint.name}: ${response.status} (${endTime - startTime}ms) - ${result.message}`);
        } else {
          console.log(`❌ ${endpoint.name}: ${response.status} (${endTime - startTime}ms) - ${result.message}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
        results.push({
          name: endpoint.name,
          status: 'error',
          time: 0,
          success: false,
          message: error.message
        });
      }
    }

    // 3. Test public endpoints (no authentication)
    console.log('\n3. Testing Public Endpoints...');
    
    const publicEndpoints = [
      { name: 'Public Job Titles', url: '/public/job-titles', method: 'GET' },
      { name: 'Public Job Postings', url: '/public/job-postings', method: 'GET' }
    ];

    for (const endpoint of publicEndpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
          method: endpoint.method
        });
        const endTime = Date.now();
        
        const result = await response.json();
        
        if (response.status === 200) {
          console.log(`✅ ${endpoint.name}: ${response.status} (${endTime - startTime}ms) - ${result.message || 'Success'}`);
        } else {
          console.log(`❌ ${endpoint.name}: ${response.status} (${endTime - startTime}ms) - ${result.message || 'Error'}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
      }
    }

    // 4. Summary
    console.log('\n4. Test Summary:');
    const successful = results.filter(r => r.success).length;
    const total = results.length;
    console.log(`✅ Successful: ${successful}/${total}`);
    console.log(`⏱️  Average Response Time: ${Math.round(results.reduce((sum, r) => sum + r.time, 0) / total)}ms`);
    
    // 5. Check for specific issues
    console.log('\n5. Issue Analysis:');
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      console.log('❌ Failed Endpoints:');
      failed.forEach(f => {
        console.log(`   - ${f.name}: ${f.message}`);
      });
    } else {
      console.log('✅ All endpoints working correctly!');
    }

    // 6. Performance check
    const slowEndpoints = results.filter(r => r.time > 1000);
    if (slowEndpoints.length > 0) {
      console.log('\n⚠️  Slow Endpoints (>1s):');
      slowEndpoints.forEach(s => {
        console.log(`   - ${s.name}: ${s.time}ms`);
      });
    }

  } catch (error) {
    console.error('❌ Error running API tests:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'test', password: 'test' })
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔧 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd backend && npm start');
    return;
  }
  
  console.log('✅ Server is running!\n');
  
  await testAllEndpoints();
  
  console.log('\n✅ API test suite completed!');
  console.log('\n📝 If you\'re experiencing API issues:');
  console.log('1. Check browser console for CORS errors');
  console.log('2. Verify frontend is making correct API calls');
  console.log('3. Check network tab in browser dev tools');
  console.log('4. Ensure frontend is running on allowed CORS origins');
}

main().catch(console.error);
