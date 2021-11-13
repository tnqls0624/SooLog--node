const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    post: {
      type: String,
      required: true,
    },
    writer: {
      type: String,
      required: true,
    },
    parentComment: {
      type: String,
    },
    childComment: {
      type: Array,
    },
    text: {
      type: String,
      required: [true, 'text is required'],
    },
    isDeleted: {
      type: Boolean,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
  }
);

commentSchema
  .virtual('childComments')
  .get(() => {
    return this._childComments;
  })
  .set((value) => {
    this._childComments = value;
  });

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
