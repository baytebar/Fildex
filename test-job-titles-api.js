import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api/v1';

async function testJobTitlesAPI() {
  try {
    // First login to get a fresh token
    console.log('Logging in...');
    const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: 'admin@fildex.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.text();
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', loginData);
    
    const loginResult = JSON.parse(loginData);
    if (!loginResult.data || !loginResult.data.token) {
      console.error('Login failed');
      return;
    }
    
    const token = loginResult.data.token;
    console.log('Got token:', token.substring(0, 20) + '...');
    
    // Now test the job titles API
    console.log('\nTesting job titles API...');
    const jobTitlesResponse = await fetch(`${API_BASE_URL}/admin/job-titles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Job titles response status:', jobTitlesResponse.status);
    const jobTitlesData = await jobTitlesResponse.text();
    console.log('Job titles response data:', jobTitlesData);
    
    // Parse and analyze the response
    if (jobTitlesData) {
      const result = JSON.parse(jobTitlesData);
      console.log('\nParsed response:');
      console.log('- Status:', result.status);
      console.log('- Message:', result.message);
      console.log('- Data type:', typeof result.data);
      console.log('- Data length:', Array.isArray(result.data) ? result.data.length : 'Not an array');
      if (Array.isArray(result.data) && result.data.length > 0) {
        console.log('- First item:', result.data[0]);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testJobTitlesAPI();
