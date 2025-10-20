import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createDepartment } from '../features/admin/adminSlice';
import { toast } from 'sonner';

const UploadTest = () => {
  const dispatch = useDispatch();
  const [departmentName, setDepartmentName] = useState('');

  const handleCreateDepartment = async () => {
    if (!departmentName.trim()) {
      toast.error('Department name is required');
      return;
    }

    try {
      // In a real scenario, you would get the admin ID from the Redux store
      // For testing purposes, we're using a placeholder
      await dispatch(createDepartment({ 
        name: departmentName.trim(),
        created_by: '6614819bc997430540b5409a' // Placeholder admin ID
      })).unwrap();
      setDepartmentName('');
      toast.success('Department created successfully!');
    } catch (error) {
      toast.error('Failed to create department: ' + (error.message || 'Please try again'));
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-2xl font-bold text-gray-800">Department Test</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department Name
          </label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter department name"
          />
        </div>
        <button
          onClick={handleCreateDepartment}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Department
        </button>
      </div>
    </div>
  );
};

export default UploadTest;