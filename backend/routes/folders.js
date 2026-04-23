const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const Image = require('../models/Image');
const auth = require('../middleware/auth');

// Helper function — calculates total size of a folder recursively
async function getFolderSize(folderId) {
  // Get all images directly in this folder
  const images = await Image.find({ folder: folderId });
  let size = images.reduce((sum, img) => sum + img.size, 0);

  // Get all subfolders
  const subfolders = await Folder.find({ parent: folderId });
  for (const sub of subfolders) {
    size += await getFolderSize(sub._id);
  }

  return size;
}

// CREATE FOLDER
router.post('/', auth, async (req, res) => {
  try {
    const { name, parent } = req.body;

    // If parent folder given, make sure it belongs to this user
    if (parent) {
      const parentFolder = await Folder.findById(parent);
      if (!parentFolder || parentFolder.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const folder = await Folder.create({
      name,
      owner: req.user.id,
      parent: parent || null
    });

    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET ALL ROOT FOLDERS (parent = null)
router.get('/', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user.id, parent: null });

    // Attach size to each folder
    const foldersWithSize = await Promise.all(
      folders.map(async (folder) => ({
        ...folder.toObject(),
        size: await getFolderSize(folder._id)
      }))
    );

    res.json(foldersWithSize);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET SUBFOLDERS inside a folder
router.get('/:id/children', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user.id, parent: req.params.id });

    const foldersWithSize = await Promise.all(
      folders.map(async (folder) => ({
        ...folder.toObject(),
        size: await getFolderSize(folder._id)
      }))
    );

    res.json(foldersWithSize);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE FOLDER
router.delete('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder || folder.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Folder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Folder deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;