import multer from "multer";

// ===== File size limit (2MB) =====
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// ===== Allowed file types =====
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(
      new Error("Invalid file type. Only .jpg, .png, and .webp files are allowed")
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export default upload;
