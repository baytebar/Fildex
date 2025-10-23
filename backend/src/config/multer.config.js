import multer from 'multer';

const storage = multer.memoryStorage();

// Allowed file types (MIME types)
const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
];

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false); // Reject file
  }
};

const upload = multer({ 
  storage, 
  limits: { 
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 10
  }, 
  fileFilter 
})

export default upload;