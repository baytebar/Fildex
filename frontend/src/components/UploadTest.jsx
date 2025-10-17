import React from 'react';
import { useSelector } from 'react-redux';
import CVUploadForm from './CVUploadForm';

const UploadTest = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isLoading, error, uploadStatus } = useSelector((state) => state.cvForm);

  const handleUploadSuccess = (result) => {
    alert('Upload successful!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Upload Test</h1>
          <p className="text-gray-600">Please login to test the upload functionality.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Resume Upload Test</h1>
          <p className="text-gray-600">
            Test the resume upload functionality. Current user: <strong>{user?.name || user?.email}</strong>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Status</h2>
          <div className="space-y-2 mb-6">
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Upload Status:</strong> {uploadStatus || 'None'}</p>
            {error && <p><strong>Error:</strong> <span className="text-red-600">{error}</span></p>}
          </div>

          <CVUploadForm onSuccess={handleUploadSuccess} />
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">API Information</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Endpoint:</strong> POST /api/v1/user/profile/profile-update</p>
            <p><strong>Authentication:</strong> Bearer token required</p>
            <p><strong>File Types:</strong> PDF, DOC, DOCX</p>
            <p><strong>Max Size:</strong> 5MB</p>
            <p><strong>Field Name:</strong> cv</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTest;
