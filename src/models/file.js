const mongoose = require('mongoose');

// schema
const fileSchema = mongoose.Schema({
  // 1
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

// model & export
const File = mongoose.model('file', fileSchema);

// model methods
File.createNewInstance = async function (file, uploadedBy, postId) {
  // 2
  return await File.create({
    originalFileName: file.originalname,
    serverFileName: file.filename,
    size: file.size,
    uploadedBy: uploadedBy,
    postId: postId,
  });
};

module.exports = File;
