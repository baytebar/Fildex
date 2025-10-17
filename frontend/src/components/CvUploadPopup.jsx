import React, { useState } from 'react';
import { X, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CVUploadForm from './CVUploadForm';

const CvUploadPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleUploadCv = () => {
    if (isAuthenticated) {
      setShowUploadForm(true);
    } else {
      onClose();
      navigate('/login');
    }
  };

  const handleUploadSuccess = (result) => {
    onClose();
    setShowUploadForm(false);
  };

  const handleBackToIntro = () => {
    setShowUploadForm(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8">
          {!showUploadForm ? (
            <>
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Ready to Land Your Dream Job?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Join thousands of professionals who found their perfect match. Upload your CV and let opportunities find you.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleUploadCv}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 hover:shadow-lg"
                >
                  <FileText className="w-5 h-5" />
                  {isAuthenticated ? 'Upload My CV' : 'Login to Upload CV'}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Maybe Later
                </button>
              </div>
            </>
          ) : (
            <div>
              <div className="text-center mb-6">
                <button
                  onClick={handleBackToIntro}
                  className="text-sm text-blue-600 hover:text-blue-700 mb-4"
                >
                  ← Back to introduction
                </button>
                <h3 className="text-lg font-semibold text-gray-800">Upload Your Resume</h3>
              </div>
              <CVUploadForm onSuccess={handleUploadSuccess} onClose={handleBackToIntro} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CvUploadPopup;
