import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test data for admin registration
const testAdminData = {
  user_name: 'testadmin',
  email: 'testadmin@fildex.com',
  password: 'TestPass123!'
};

// Test data for login (to get auth token)
const loginData = {
  identifier: 'testadmin@fildex.com', // or 'testadmin'
  password: 'TestPass123!'
};

async function testAdminRegistration() {
  console.log('🚀 Testing Admin Registration API...\n');

  try {
    // First, let's try to register without authentication (this should fail)
    console.log('1. Testing registration without authentication (should fail):');
    const response1 = await fetch(`${API_BASE_URL}/admin/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testAdminData)
    });

    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(result1, null, 2));
    console.log('');

    // For the first admin, you might need to create it directly in the database
    // or modify the route to allow first admin creation without authentication
    console.log('2. Note: Admin registration requires authentication.');
    console.log('   You need to be logged in as an existing admin to create new admins.');
    console.log('   The first admin might need to be created directly in the database.\n');

    // Test login functionality
    console.log('3. Testing admin login:');
    const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', JSON.stringify(loginResult, null, 2));

    if (loginResult.success && loginResult.data?.token) {
      console.log('\n4. Testing registration with authentication:');
      const authResponse = await fetch(`${API_BASE_URL}/admin/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginResult.data.token}`
        },
        body: JSON.stringify({
          user_name: 'newadmin',
          email: 'newadmin@fildex.com',
          password: 'NewPass123!'
        })
      });

      const authResult = await authResponse.json();
      console.log('Registration Status:', authResponse.status);
      console.log('Registration Response:', JSON.stringify(authResult, null, 2));
    }

  } catch (error) {
    console.error('❌ Error testing admin registration:', error.message);
  }
}

async function testGetAllAdmins() {
  console.log('\n🔍 Testing Get All Admins API...\n');

  try {
    // First login to get token
    const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json();
    
    if (loginResult.success && loginResult.data?.token) {
      console.log('1. Testing get all admins:');
      const response = await fetch(`${API_BASE_URL}/admin/admins`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginResult.data.token}`
        }
      });

      const result = await response.json();
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Could not get authentication token');
    }

  } catch (error) {
    console.error('❌ Error testing get all admins:', error.message);
  }
}

// Run the tests
async function runTests() {
  console.log('🧪 Admin Registration API Test Suite\n');
  console.log('=' .repeat(50));
  
  await testAdminRegistration();
  
  console.log('\n' + '=' .repeat(50));
  await testGetAllAdmins();
  
  console.log('\n✅ Test suite completed!');
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
  await runTests();
}

main().catch(console.error);
