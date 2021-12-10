const mongoose = require('mongoose');
const Counter = require('./counter');

const postSchema = mongoose.Schema({
  id: {
    type: String,
  },
  postTitle: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  writer: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  numId: {
    type: Number,
  },
  attachment: { type: mongoose.Schema.Types.ObjectId, ref: 'file' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

postSchema.pre('save', async function (next) {
  let post = this;
  if (post.isNew) {
    if (post.postTitle === 'any') {
      await createPostNum('any', post);
    } else if (post.postTitle === 'game') {
      await createPostNum('game', post);
    }
  }
  return next();
});

async function createPostNum(postName, post) {
  counter = await Counter.findOne({ name: postName }).exec();
  if (!counter) counter = await Counter.create({ name: postName });
  counter.count++;
  counter.save();
  post.numId = counter.count;
}

const Post = mongoose.model('post', postSchema);

module.exports = Post;
