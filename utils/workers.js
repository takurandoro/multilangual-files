/* eslint-disable no-unused-vars */
const Queue = require('bull');
const File = require('../models/files.model');
const fileQueue = require('./queue');
const fs = require('fs-extra');

fileQueue.process('upload', async (job, done) => {
  try {
    const { userId, filename, filepath, originalName, size } = job.data;

    const file = await File.create({
      filename,
      filepath,
      originalName,
      size,
      userId,
    });

    job.progress(100);
    done(null, file);
  } catch (err) {
    done(err);
  }
});

fileQueue.process('update', async (job, done) => {
  try {
    const {
      fileId,
      newFilename,
      newFilepath,
      newOriginalName,
      newSize,
      oldFilepath,
    } = job.data;

    await fs.remove(oldFilepath);

    const file = await File.findByPk(fileId);
    file.filename = newFilename;
    file.filepath = newFilepath;
    file.originalName = newOriginalName;
    file.size = newSize;
    await file.save();

    job.progress(100);
    done(null, file);
  } catch (err) {
    done(err);
  }
});

fileQueue.process('delete', async (job, done) => {
  try {
    const { fileId, filepath } = job.data;

    await fs.remove(filepath);

    const file = await File.findByPk(fileId);
    await file.destroy();

    job.progress(100);
    done(null, { message: 'File deleted successfully' });
  } catch (err) {
    done(err);
  }
});

fileQueue.on('completed', (job, result) => {
  console.log(`Job completed with result: ${result}`);
});

fileQueue.on('failed', (job, err) => {
  console.log(`Job failed with error: ${err}`);
});
