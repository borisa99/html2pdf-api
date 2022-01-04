const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./temp");
  },
  filename: function (req, file, callback) {
    const extension = file.originalname.split(".").pop();
    const filename = file.fieldname + "-" + Date.now() + "." + extension;
    req.fileName = filename;
    callback(null, filename);
  },
});
const upload = multer({ storage: storage }).single("file");

module.exports = {
  upload,
};
