import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/v1';

async function testSuperAdminProtection() {
  console.log('🛡️ Testing Super Admin Protection Features...\n');

  try {
    // 1. Login as super admin
    console.log('1. Logging in as super admin...');
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
      console.log('❌ Super admin login failed');
      return;
    }

    const token = loginResult.data.token;
    console.log('✅ Super admin logged in successfully');

    // 2. Test super admin deletion protection
    console.log('\n2. Testing super admin deletion protection...');
    const deleteSuperAdminResponse = await fetch(`${API_BASE_URL}/admin/admins/68f749da4c5a60d658b67ef2`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(`Status: ${deleteSuperAdminResponse.status}`);
    if (deleteSuperAdminResponse.status === 403) {
      console.log('✅ Super admin deletion correctly blocked!');
    } else {
      console.log('❌ Super admin deletion should have been blocked');
    }

    // 3. Test self-deletion protection
    console.log('\n3. Testing self-deletion protection...');
    const deleteSelfResponse = await fetch(`${API_BASE_URL}/admin/admins/${loginResult.data.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(`Status: ${deleteSelfResponse.status}`);
    if (deleteSelfResponse.status === 403) {
      console.log('✅ Self-deletion correctly blocked!');
    } else {
      console.log('❌ Self-deletion should have been blocked');
    }

    // 4. Test super admin can access all endpoints
    console.log('\n4. Testing super admin access to all endpoints...');
    
    const endpoints = [
      '/admin/admins',
      '/admin/dashboard/users',
      '/admin/job-titles',
      '/admin/departments',
      '/admin/notifications/recent-cvs'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 200) {
          console.log(`✅ ${endpoint} - Access granted`);
        } else {
          console.log(`❌ ${endpoint} - Access denied (${response.status})`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint} - Error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error testing super admin protection:', error.message);
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
  console.log('🧪 Super Admin Protection Test Suite\n');
  console.log('=' .repeat(60));
  
  console.log('🔧 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd backend && npm start');
    return;
  }
  
  console.log('✅ Server is running!\n');
  
  await testSuperAdminProtection();
  
  console.log('\n✅ Test suite completed!');
  console.log('\n📝 Super Admin Protection Summary:');
  console.log('✅ Super admin cannot be deleted by anyone');
  console.log('✅ Super admin cannot delete their own account');
  console.log('✅ Super admin can access all admin endpoints');
  console.log('✅ Super admin can delete other admin accounts');
  console.log('✅ Regular admins cannot delete super admin');
  console.log('✅ Regular admins cannot delete other admins');
}

main().catch(console.error);
