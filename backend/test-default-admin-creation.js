import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test data for default admin creation
const defaultAdminData = {
  user_name: 'admin',
  email: 'admin@fildex.com',
  password: 'AdminPass123!'
};

async function testDefaultAdminCreation() {
  console.log('🚀 Testing Default Admin Creation API...\n');

  try {
    console.log('1. Testing default admin creation (no authentication required):');
    const response = await fetch(`${API_BASE_URL}/admin/auth/register-default`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(defaultAdminData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('');

    if (result.success) {
      console.log('✅ Default admin created successfully!');
      console.log('You can now use this admin to create other admins.');
      
      // Test login with the created admin
      console.log('\n2. Testing login with created default admin:');
      const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: defaultAdminData.email,
          password: defaultAdminData.password
        })
      });

      const loginResult = await loginResponse.json();
      console.log('Login Status:', loginResponse.status);
      console.log('Login Response:', JSON.stringify(loginResult, null, 2));

      if (loginResult.success && loginResult.data?.token) {
        console.log('\n✅ Login successful! You can now use this token for other admin operations.');
        
        // Test creating another admin with the token
        console.log('\n3. Testing creation of second admin with authentication:');
        const secondAdminResponse = await fetch(`${API_BASE_URL}/admin/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginResult.data.token}`
          },
          body: JSON.stringify({
            user_name: 'admin2',
            email: 'admin2@fildex.com',
            password: 'Admin2Pass123!'
          })
        });

        const secondAdminResult = await secondAdminResponse.json();
        console.log('Second Admin Status:', secondAdminResponse.status);
        console.log('Second Admin Response:', JSON.stringify(secondAdminResult, null, 2));
      }
    } else {
      console.log('❌ Default admin creation failed:', result.message);
    }

  } catch (error) {
    console.error('❌ Error testing default admin creation:', error.message);
  }
}

async function testDuplicateDefaultAdmin() {
  console.log('\n🔄 Testing duplicate default admin creation (should fail):\n');

  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth/register-default`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_name: 'another_admin',
        email: 'another@fildex.com',
        password: 'AnotherPass123!'
      })
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.status === 409) {
      console.log('✅ Correctly prevented duplicate default admin creation!');
    } else {
      console.log('⚠️  Unexpected response for duplicate admin creation');
    }

  } catch (error) {
    console.error('❌ Error testing duplicate default admin:', error.message);
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
  console.log('🧪 Default Admin Creation Test Suite\n');
  console.log('=' .repeat(60));
  
  console.log('🔧 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd backend && npm start');
    return;
  }
  
  console.log('✅ Server is running!\n');
  
  await testDefaultAdminCreation();
  
  console.log('\n' + '=' .repeat(60));
  await testDuplicateDefaultAdmin();
  
  console.log('\n✅ Test suite completed!');
  console.log('\n📝 Summary:');
  console.log('- Use /admin/auth/register-default to create the first admin (no auth required)');
  console.log('- Use /admin/auth/register to create additional admins (auth required)');
  console.log('- Use /admin/auth/login to authenticate and get JWT token');
}

main().catch(console.error);
