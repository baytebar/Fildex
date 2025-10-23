import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, X, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, setUploadStatus } from '../features/cvForm/cvFormSlice';
import { uploadResume } from '../features/resume/resumeSlice';

const CVUploadForm = ({ onSuccess, onClose, name, email, phone }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  
  const { isLoading, error, uploadStatus } = useSelector((state) => state.resume);

  const handleFileSelect = (file) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      dispatch(setUploadStatus('error'));
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      dispatch(setUploadStatus('error'));
      return;
    }

    setSelectedFile(file);
    dispatch(clearError());
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Use the new resume upload API
    const formData = new FormData();
    formData.append('resume', selectedFile);
    if (name) formData.append('name', name);
    if (email) formData.append('email', email);
    if (phone) {
      formData.append('contact', JSON.stringify({
        number: phone,
        country_code: '+353' // Default to Ireland, could be made dynamic
      }));
    }

    try {
      const result = await dispatch(uploadResume(formData)).unwrap();
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    dispatch(clearError());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
          <p className="text-sm text-gray-600">
            Upload your CV in PDF, DOC, or DOCX format (max 5MB)
          </p>
        </div>

        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : selectedFile
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {selectedFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
              >
                <X className="w-3 h-3" />
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Upload className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Drop your resume here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX files only
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700">Resume uploaded successfully!</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVUploadForm;
