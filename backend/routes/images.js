const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Image = require('../models/Image');
const Folder = require('../models/Folder');
const auth = require('../middleware/auth');

// Multer config — saves images to /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());
    valid ? cb(null, true) : cb(new Error('Images only!'));
  }
});

// UPLOAD IMAGE
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, folder } = req.body;

    // Make sure folder belongs to this user
    const folderDoc = await Folder.findById(folder);
    if (!folderDoc || folderDoc.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const image = await Image.create({
      name,
      filename: req.file.filename,
      size: req.file.size,
      folder,
      owner: req.user.id
    });

    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET IMAGES inside a folder
router.get('/folder/:folderId', auth, async (req, res) => {
  try {
    const images = await Image.find({
      folder: req.params.folderId,
      owner: req.user.id
    });

    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE IMAGE
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image || image.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;