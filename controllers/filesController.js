const path = require('path');
const User = require('../models/user.model');
const fileQueue = require('../utils/queue');
const File = require('../models/files.model');

// Upload a file
const uploadFile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const job = await fileQueue.add('upload', {
      userId: user.id,
      filename: req.file.filename,
      filepath: req.file.path,
      originalName: req.file.originalname,
      size: req.file.size,
    });

    res.status(201).json({
      message: 'File upload initiated',
      jobId: job.id,
      jobData: job.data,
      jobstatus: job.getState(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Files error' });
  }
};

const readAllFilesFromUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const files = await File.findAll({
      where: { userId: userId },
    });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No files found for the user' });
    }

    res.status(200).json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Files error' });
  }
};

// Read a file
const readFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      where: { filename: req.params.filename },
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.sendFile(path.resolve(file.filepath));
  } catch (err) {
    next(err);
  }
};

// Update a file
const updateFile = async (req, res) => {
  try {
    const file = await File.findOne({
      where: { filename: req.params.filename, userId: req.body.userId },
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const oldFilePath = file.filepath;
    // Add job to the queue
    const job = await fileQueue.add('update', {
      fileId: file.id,
      newFilename: req.file.filename,
      newFilepath: req.file.path,
      newOriginalName: req.file.originalname,
      newSize: req.file.size,
      oldFilepath: oldFilePath,
    });

    res.status(200).json({
      message: 'File updated initiated',
      jobId: job.id,
      jobData: job.data,
      jobstatus: job.getState(),
    });
  } catch (err) {
    console.error(err);
  }
};

// Delete a file
const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      where: { filename: req.params.filename },
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Add job to the queue
    const job = await fileQueue.add('delete', {
      fileId: file.id,
      filepath: file.filepath,
    });

    res.status(200).json({ message: 'File deleted initiated', jobId: job.id });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  uploadFile,
  readFile,
  updateFile,
  deleteFile,
  readAllFilesFromUser,
};
