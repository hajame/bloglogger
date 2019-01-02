const mongoose = require('mongoose')
const Schema = mongoose.Schema

let blogSchema = new Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog