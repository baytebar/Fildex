import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test data for super admin creation
const superAdminData = {
  user_name: 'superadmin',
  email: 'superadmin@fildex.com',
  password: 'SuperAdminPass123!'
};

// Test data for regular admin creation
const regularAdminData = {
  user_name: 'regular_admin',
  email: 'regular@fildex.com',
  password: 'RegularPass123!'
};

async function testSuperAdminCreation() {
  console.log('👑 Testing Super Admin Creation...\n');

  try {
    console.log('1. Creating super admin (no authentication required):');
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
    console.log('');

    if (result.success) {
      console.log('✅ Super admin created successfully!');
      
      // Test login with super admin
      console.log('\n2. Testing login with super admin:');
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

      if (loginResult.success && loginResult.data?.token) {
        console.log('\n✅ Super admin login successful!');
        return loginResult.data.token;
      }
    } else {
      console.log('❌ Super admin creation failed:', result.message);
    }

  } catch (error) {
    console.error('❌ Error testing super admin creation:', error.message);
  }
}

async function testRegularAdminCreation(superAdminToken) {
  console.log('\n👤 Testing Regular Admin Creation with Super Admin Token...\n');

  try {
    console.log('1. Creating regular admin with super admin token:');
    const response = await fetch(`${API_BASE_URL}/admin/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${superAdminToken}`
      },
      body: JSON.stringify(regularAdminData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('');

    if (result.success) {
      console.log('✅ Regular admin created successfully!');
      
      // Test login with regular admin
      console.log('\n2. Testing login with regular admin:');
      const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: regularAdminData.email,
          password: regularAdminData.password
        })
      });

      const loginResult = await loginResponse.json();
      console.log('Login Status:', loginResponse.status);
      console.log('Login Response:', JSON.stringify(loginResult, null, 2));

      if (loginResult.success && loginResult.data?.token) {
        console.log('\n✅ Regular admin login successful!');
        return loginResult.data.token;
      }
    } else {
      console.log('❌ Regular admin creation failed:', result.message);
    }

  } catch (error) {
    console.error('❌ Error testing regular admin creation:', error.message);
  }
}

async function testGetAllAdmins(superAdminToken) {
  console.log('\n📋 Testing Get All Admins...\n');

  try {
    const response = await fetch(`${API_BASE_URL}/admin/admins`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${superAdminToken}`
      }
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✅ Admins fetched successfully!');
      console.log(`Found ${result.data?.admins?.length || 0} admins`);
      
      if (result.data?.admins) {
        result.data.admins.forEach((admin, index) => {
          console.log(`${index + 1}. ${admin.user_name} (${admin.email}) - Role: ${admin.role || 'admin'}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error fetching admins:', error.message);
  }
}

async function testSuperAdminProtection(superAdminToken, regularAdminToken) {
  console.log('\n🛡️ Testing Super Admin Protection...\n');

  try {
    // First, get all admins to find the super admin ID
    const adminsResponse = await fetch(`${API_BASE_URL}/admin/admins`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${superAdminToken}`
      }
    });

    const adminsResult = await adminsResponse.json();
    
    if (adminsResult.success && adminsResult.data?.admins) {
      const superAdmin = adminsResult.data.admins.find(admin => admin.role === 'super_admin');
      const regularAdmin = adminsResult.data.admins.find(admin => admin.role === 'admin');
      
      if (superAdmin && regularAdmin) {
        console.log('1. Testing deletion of super admin (should fail):');
        const deleteSuperAdminResponse = await fetch(`${API_BASE_URL}/admin/admins/${superAdmin.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${superAdminToken}`
          }
        });

        const deleteSuperAdminResult = await deleteSuperAdminResponse.json();
        console.log('Status:', deleteSuperAdminResponse.status);
        console.log('Response:', JSON.stringify(deleteSuperAdminResult, null, 2));

        if (deleteSuperAdminResponse.status === 403) {
          console.log('✅ Super admin deletion correctly blocked!');
        }

        console.log('\n2. Testing deletion of regular admin by super admin (should succeed):');
        const deleteRegularAdminResponse = await fetch(`${API_BASE_URL}/admin/admins/${regularAdmin.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${superAdminToken}`
          }
        });

        const deleteRegularAdminResult = await deleteRegularAdminResponse.json();
        console.log('Status:', deleteRegularAdminResponse.status);
        console.log('Response:', JSON.stringify(deleteRegularAdminResult, null, 2));

        if (deleteRegularAdminResponse.status === 200) {
          console.log('✅ Regular admin deletion successful!');
        }

        console.log('\n3. Testing deletion by regular admin (should fail):');
        if (regularAdminToken) {
          const deleteByRegularResponse = await fetch(`${API_BASE_URL}/admin/admins/${superAdmin.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${regularAdminToken}`
            }
          });

          const deleteByRegularResult = await deleteByRegularResponse.json();
          console.log('Status:', deleteByRegularResponse.status);
          console.log('Response:', JSON.stringify(deleteByRegularResult, null, 2));

          if (deleteByRegularResponse.status === 403) {
            console.log('✅ Regular admin correctly blocked from deleting!');
          }
        }
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
  console.log('🧪 Super Admin Test Suite\n');
  console.log('=' .repeat(60));
  
  console.log('🔧 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd backend && npm start');
    return;
  }
  
  console.log('✅ Server is running!\n');
  
  const superAdminToken = await testSuperAdminCreation();
  
  if (superAdminToken) {
    const regularAdminToken = await testRegularAdminCreation(superAdminToken);
    await testGetAllAdmins(superAdminToken);
    await testSuperAdminProtection(superAdminToken, regularAdminToken);
  }
  
  console.log('\n✅ Test suite completed!');
  console.log('\n📝 Summary:');
  console.log('- Super admin has highest privileges');
  console.log('- Super admin cannot be deleted');
  console.log('- Only super admin can delete other admins');
  console.log('- Regular admins cannot delete super admin');
  console.log('\n🔑 Super Admin Credentials:');
  console.log(`   Email: ${superAdminData.email}`);
  console.log(`   Password: ${superAdminData.password}`);
}

main().catch(console.error);
