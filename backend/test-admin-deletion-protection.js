import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test data
const superAdminCredentials = {
  identifier: 'superadmin@fildex.com',
  password: 'SuperAdminPass123!'
};

const regularAdminCredentials = {
  identifier: 'leo@gmail.com',
  password: 'AdminPass123!'
};

async function testAdminDeletionProtection() {
  console.log('🛡️ Testing Admin Deletion Protection...\n');

  try {
    // 1. Login as super admin
    console.log('1. Logging in as super admin...');
    const superAdminLogin = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(superAdminCredentials)
    });

    const superAdminResult = await superAdminLogin.json();
    if (!superAdminResult.success) {
      console.log('❌ Super admin login failed');
      return;
    }

    const superAdminToken = superAdminResult.data.token;
    console.log('✅ Super admin logged in successfully');

    // 2. Get all admins to find IDs
    console.log('\n2. Getting all admins...');
    const adminsResponse = await fetch(`${API_BASE_URL}/admin/admins`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${superAdminToken}` }
    });

    const adminsResult = await adminsResponse.json();
    if (!adminsResult.success) {
      console.log('❌ Failed to get admins');
      return;
    }

    const admins = adminsResult.data.admins;
    console.log(`✅ Found ${admins.length} admins:`);
    admins.forEach(admin => {
      console.log(`   - ${admin.user_name} (${admin.email}) - Role: ${admin.role} - ID: ${admin.id}`);
    });

    // 3. Test super admin deletion protection
    console.log('\n3. Testing super admin deletion protection...');
    const superAdmin = admins.find(admin => admin.role === 'super_admin');
    if (superAdmin) {
      const deleteSuperAdminResponse = await fetch(`${API_BASE_URL}/admin/admins/${superAdmin.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${superAdminToken}` }
      });

      const deleteSuperAdminResult = await deleteSuperAdminResponse.json();
      console.log(`Status: ${deleteSuperAdminResponse.status}`);
      console.log(`Response: ${JSON.stringify(deleteSuperAdminResult, null, 2)}`);

      if (deleteSuperAdminResponse.status === 403 && deleteSuperAdminResult.message.includes('Cannot delete super admin')) {
        console.log('✅ Super admin deletion correctly blocked!');
      } else {
        console.log('❌ Super admin deletion should have been blocked');
      }
    }

    // 4. Test regular admin deletion (if exists)
    console.log('\n4. Testing regular admin deletion...');
    const regularAdmin = admins.find(admin => admin.role === 'admin');
    if (regularAdmin) {
      const deleteRegularAdminResponse = await fetch(`${API_BASE_URL}/admin/admins/${regularAdmin.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${superAdminToken}` }
      });

      const deleteRegularAdminResult = await deleteRegularAdminResponse.json();
      console.log(`Status: ${deleteRegularAdminResponse.status}`);
      console.log(`Response: ${JSON.stringify(deleteRegularAdminResult, null, 2)}`);

      if (deleteRegularAdminResponse.status === 200) {
        console.log('✅ Regular admin deletion successful!');
      } else {
        console.log('⚠️ Regular admin deletion failed or admin not found');
      }
    }

    // 5. Test self-deletion protection
    console.log('\n5. Testing self-deletion protection...');
    const deleteSelfResponse = await fetch(`${API_BASE_URL}/admin/admins/${superAdminResult.data.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${superAdminToken}` }
    });

    const deleteSelfResult = await deleteSelfResponse.json();
    console.log(`Status: ${deleteSelfResponse.status}`);
    console.log(`Response: ${JSON.stringify(deleteSelfResult, null, 2)}`);

    if (deleteSelfResponse.status === 403 && deleteSelfResult.message.includes('Cannot delete your own account')) {
      console.log('✅ Self-deletion correctly blocked!');
    } else {
      console.log('❌ Self-deletion should have been blocked');
    }

    // 6. Test regular admin trying to delete (if we can login as regular admin)
    console.log('\n6. Testing regular admin deletion permissions...');
    try {
      const regularAdminLogin = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regularAdminCredentials)
      });

      const regularAdminResult = await regularAdminLogin.json();
      if (regularAdminResult.success) {
        const regularAdminToken = regularAdminResult.data.token;
        
        // Try to delete another admin
        const deleteOtherAdminResponse = await fetch(`${API_BASE_URL}/admin/admins/${superAdmin.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${regularAdminToken}` }
        });

        const deleteOtherAdminResult = await deleteOtherAdminResponse.json();
        console.log(`Status: ${deleteOtherAdminResponse.status}`);
        console.log(`Response: ${JSON.stringify(deleteOtherAdminResult, null, 2)}`);

        if (deleteOtherAdminResponse.status === 403 && deleteOtherAdminResult.message.includes('Only super admin can delete')) {
          console.log('✅ Regular admin deletion correctly blocked!');
        } else {
          console.log('❌ Regular admin should not be able to delete other admins');
        }
      } else {
        console.log('⚠️ Could not login as regular admin (may not exist or wrong password)');
      }
    } catch (error) {
      console.log('⚠️ Could not test regular admin permissions:', error.message);
    }

  } catch (error) {
    console.error('❌ Error testing admin deletion protection:', error.message);
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
  console.log('🧪 Admin Deletion Protection Test Suite\n');
  console.log('=' .repeat(60));
  
  console.log('🔧 Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd backend && npm start');
    return;
  }
  
  console.log('✅ Server is running!\n');
  
  await testAdminDeletionProtection();
  
  console.log('\n✅ Test suite completed!');
  console.log('\n📝 Summary:');
  console.log('- Super admin cannot be deleted by anyone');
  console.log('- Only super admin can delete other admins');
  console.log('- Admins cannot delete their own account');
  console.log('- Regular admins cannot delete other admins');
}

main().catch(console.error);
