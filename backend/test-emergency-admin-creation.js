import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test data for emergency admin creation
const emergencyAdminData = {
  user_name: 'emergency_admin',
  email: 'emergency@fildex.com',
  password: 'EmergencyPass123!'
};

async function testEmergencyAdminCreation() {
  console.log('🚨 Testing Emergency Admin Creation API...\n');

  try {
    console.log('1. Testing emergency admin creation (no authentication required):');
    const response = await fetch(`${API_BASE_URL}/admin/auth/register-emergency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emergencyAdminData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('');

    if (result.success) {
      console.log('✅ Emergency admin created successfully!');
      console.log('You can now use this admin to access the system.');
      
      // Test login with the created admin
      console.log('\n2. Testing login with created emergency admin:');
      const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: emergencyAdminData.email,
          password: emergencyAdminData.password
        })
      });

      const loginResult = await loginResponse.json();
      console.log('Login Status:', loginResponse.status);
      console.log('Login Response:', JSON.stringify(loginResult, null, 2));

      if (loginResult.success && loginResult.data?.token) {
        console.log('\n✅ Login successful! You can now use this token for admin operations.');
        
        // Test getting all admins
        console.log('\n3. Testing get all admins with authentication:');
        const adminsResponse = await fetch(`${API_BASE_URL}/admin/admins`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginResult.data.token}`
          }
        });

        const adminsResult = await adminsResponse.json();
        console.log('Admins Status:', adminsResponse.status);
        console.log('Admins Response:', JSON.stringify(adminsResult, null, 2));
      }
    } else {
      console.log('❌ Emergency admin creation failed:', result.message);
    }

  } catch (error) {
    console.error('❌ Error testing emergency admin creation:', error.message);
  }
}

async function testDuplicateEmergencyAdmin() {
  console.log('\n🔄 Testing duplicate emergency admin creation (should fail):\n');

  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth/register-emergency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_name: 'another_emergency',
        email: 'another_emergency@fildex.com',
        password: 'AnotherEmergencyPass123!'
      })
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.status === 409) {
      console.log('✅ Correctly prevented duplicate admin creation!');
    } else {
      console.log('⚠️  Unexpected response for duplicate admin creation');
    }

  } catch (error) {
    console.error('❌ Error testing duplicate emergency admin:', error.message);
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
  console.log('🧪 Emergency Admin Creation Test Suite\n');
  console.log('=' .repeat(60));
  
  console.log('🔧 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd backend && npm start');
    return;
  }
  
  console.log('✅ Server is running!\n');
  
  await testEmergencyAdminCreation();
  
  console.log('\n' + '=' .repeat(60));
  await testDuplicateEmergencyAdmin();
  
  console.log('\n✅ Test suite completed!');
  console.log('\n📝 Summary:');
  console.log('- Use /admin/auth/register-emergency to create admin without authentication');
  console.log('- Use /admin/auth/register to create additional admins (auth required)');
  console.log('- Use /admin/auth/login to authenticate and get JWT token');
  console.log('\n🚨 IMPORTANT: Emergency admin creation should only be used when you cannot access existing admin accounts!');
}

main().catch(console.error);
