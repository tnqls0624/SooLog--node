const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// schema
const fileSchema = mongoose.Schema({
  originalFileName: { type: String },
  serverFileName: { type: String },
  size: { type: Number },
  uploadedBy: {
    type: String,
    ref: 'user',
    required: true,
  },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
  isDeleted: { type: Boolean, default: false },
});

fileSchema.methods.processDelete = function () {
  this.isDeleted = true;
  this.save();
};

fileSchema.methods.getFileStream = async function () {
  let stream;
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
    this.serverFileName
  );
  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    stream = fs.createReadStream(filePath);
  } else {
    this.processDelete();
  }
  return stream;
};

// model & export
const File = mongoose.model('file', fileSchema);

// model methods
File.createNewInstance = async function (file, uploadedBy, postId) {
  return await File.create({
    originalFileName: file.originalname,
    serverFileName: file.filename,
    size: file.size,
    uploadedBy: uploadedBy,
    postId: postId,
  });
};

module.exports = File;
