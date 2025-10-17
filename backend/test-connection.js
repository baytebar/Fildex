// Simple test script to verify backend is running and accessible
import fetch from 'node-fetch';

const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test if server is running
    const response = await fetch('http://localhost:5000/api/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });

    if (response.ok) {
      console.log('✅ Backend is running and accessible');
      const data = await response.json();
      console.log('Response:', data);
    } else {
      console.log('⚠️ Backend responded with status:', response.status);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
    console.log('Make sure the backend server is running on http://localhost:5000');
  }
};

testBackendConnection();

