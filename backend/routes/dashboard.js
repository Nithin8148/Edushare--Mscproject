const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth'); // Corrected import

const multer = require('multer');

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.get('/stats', authMiddleware, (req, res, next) => {
  dashboardController.getStats(req, res).catch(next);
});

router.get('/recent-products', authMiddleware, (req, res, next) => {
  dashboardController.getRecentProducts(req, res).catch(next);
});

router.post('/upload-profile-picture', authMiddleware, (req, res, next) => {
  dashboardController.uploadProfilePicture(req, res).catch(next);
});

router.delete('/remove-profile-picture', authMiddleware, (req, res, next) => {
  dashboardController.removeProfilePicture(req, res).catch(next);
});

router.post('/upload-document', authMiddleware, upload.single('document'), (req, res, next) => {
  dashboardController.uploadDocument(req, res).catch(next);
});

router.get('/documents', authMiddleware, (req, res, next) => {
  dashboardController.getDocuments(req, res).catch(next);
});

router.delete('/documents/:id', authMiddleware, (req, res, next) => {
  dashboardController.deleteDocument(req, res).catch(next);
});

module.exports = router;
