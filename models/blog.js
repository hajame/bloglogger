const mongoose = require('mongoose')
const Schema = mongoose.Schema

if ( process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

let blogSchema = new Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

// blogSchema.statics.format = (blog) => {
//   return {
//     name: blog.name,
//     id: blog._id
//   }
// }

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog