import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    //cb - callback
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    //null for error
    //then we create the filename; fieldname for the image, date, and extension name
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

function checkFileType(file,cb) {
  //the types we want to allow
  const filetypes = /jpg|jpeg|png/;
  //extension name, we pass the extension of the original filename and make it lowercase
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  //we check the extension name with mimetype in order to verify if we get a matching extension with what we need
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Only images!");
  }
}

const upload = multer({
  storage,
});

router.post('/', upload.single('image'), (req, res) => {
  res.send({
    message: 'Image Uploaded',
    image: `/${req.file.path}`,
  })
 })
export default router;