import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Super admin creation token (should match your environment variable)
const SUPER_ADMIN_TOKEN = 'super_admin_secure_token_2024_fildex';

// Test data for super admin creation
const superAdminData = {
  user_name: 'protected_superadmin',
  email: 'protected_superadmin@fildex.com',
  password: 'ProtectedSuperAdminPass123!'
};

async function testWithoutToken() {
  console.log('🚫 Testing Super Admin Creation WITHOUT Token (should fail)...\n');

  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth/register-super-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(superAdminData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.status === 401) {
      console.log('✅ Correctly blocked without token!');
    } else {
      console.log('❌ Should have been blocked without token');
    }

  } catch (error) {
    console.error('❌ Error testing without token:', error.message);
  }
}

async function testWithInvalidToken() {
  console.log('\n🔒 Testing Super Admin Creation WITH Invalid Token (should fail)...\n');

  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth/register-super-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-super-admin-token': 'invalid_token_123'
      },
      body: JSON.stringify(superAdminData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.status === 401) {
      console.log('✅ Correctly blocked with invalid token!');
    } else {
      console.log('❌ Should have been blocked with invalid token');
    }

  } catch (error) {
    console.error('❌ Error testing with invalid token:', error.message);
  }
}

async function testWithValidToken() {
  console.log('\n✅ Testing Super Admin Creation WITH Valid Token (should succeed)...\n');

  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth/register-super-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-super-admin-token': SUPER_ADMIN_TOKEN
      },
      body: JSON.stringify(superAdminData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Super admin created successfully with valid token!');
      
      // Test login with the created super admin
      console.log('\n🔑 Testing login with created super admin:');
      const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: superAdminData.email,
          password: superAdminData.password
        })
      });

      const loginResult = await loginResponse.json();
      console.log('Login Status:', loginResponse.status);
      console.log('Login Response:', JSON.stringify(loginResult, null, 2));

      if (loginResult.success) {
        console.log('✅ Super admin login successful!');
        return loginResult.data.token;
      }
    } else {
      console.log('❌ Super admin creation failed:', result.message);
    }

  } catch (error) {
    console.error('❌ Error testing with valid token:', error.message);
  }
}

async function testWithBearerToken() {
  console.log('\n🔐 Testing Super Admin Creation WITH Bearer Token Format...\n');

  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth/register-super-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPER_ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        user_name: 'bearer_superadmin',
        email: 'bearer_superadmin@fildex.com',
        password: 'BearerSuperAdminPass123!'
      })
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Super admin created successfully with Bearer token!');
    } else {
      console.log('❌ Super admin creation failed with Bearer token:', result.message);
    }

  } catch (error) {
    console.error('❌ Error testing with Bearer token:', error.message);
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
  console.log('🛡️ Token-Protected Super Admin Creation Test Suite\n');
  console.log('=' .repeat(70));
  
  console.log('🔧 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd backend && npm start');
    return;
  }
  
  console.log('✅ Server is running!\n');
  
  await testWithoutToken();
  await testWithInvalidToken();
  await testWithValidToken();
  await testWithBearerToken();
  
  console.log('\n✅ Test suite completed!');
  console.log('\n📝 Summary:');
  console.log('- Super admin creation now requires a special token');
  console.log('- Token can be sent via x-super-admin-token header or Authorization Bearer');
  console.log('- Default token: super_admin_secure_token_2024_fildex');
  console.log('- Set SUPER_ADMIN_CREATION_TOKEN environment variable to change token');
  console.log('\n🔑 Usage Examples:');
  console.log('curl -X POST http://localhost:5000/api/v1/admin/auth/register-super-admin \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "x-super-admin-token: super_admin_secure_token_2024_fildex" \\');
  console.log('  -d \'{"user_name": "superadmin", "email": "superadmin@fildex.com", "password": "SuperPass123!"}\'');
}

main().catch(console.error);
