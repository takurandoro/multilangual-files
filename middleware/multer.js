const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    var originalname = file.originalname;
    var extension = originalname.split('.');
    let filename = Date.now() + '.' + extension[extension.length - 1];
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
