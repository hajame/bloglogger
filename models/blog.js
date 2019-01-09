const mongoose = require('mongoose')
const Schema = mongoose.Schema

let blogSchema = new Schema({
  title: String,
  author: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  url: String,
  likes: Number
})

blogSchema.statics.format = (blog) => {
  return {
    id: blog._id,
    user: blog.user,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog