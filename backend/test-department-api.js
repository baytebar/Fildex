// Simple test script to verify department API functionality
import fetch from 'node-fetch';

async function testDepartmentAPI() {
  const baseURL = 'http://localhost:5000/api/v1';
  
  try {
    // Test getting all departments
    console.log('Testing GET /admin/departments');
    const departmentsResponse = await fetch(`${baseURL}/admin/departments`);
    const departmentsData = await departmentsResponse.json();
    console.log('Departments:', departmentsData);
    
    // If we want to test creating a department, we would need a valid admin token
    // This would require first logging in as an admin
    
  } catch (error) {
    console.error('Error testing department API:', error);
  }
}

testDepartmentAPI();