const { Router } = require('express');
const {
  uploadFile,
  readFile,
  readAllFilesFromUser,
  deleteFile,
  updateFile,
} = require('../controllers/filesController');
const upload = require('../middleware/multer');

const router = Router();
router
  .route('/:userId')
  .get(readAllFilesFromUser)
  .post(upload.single('file'), uploadFile);

router
  .route('/:filename')
  .get(readFile)
  .put(upload.single('file'), updateFile)
  .delete(deleteFile);

module.exports = router;
