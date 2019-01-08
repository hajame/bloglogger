const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', (request, response) => {
  let body = request.body

  if (body.title === undefined && body.url === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  if (body.likes === undefined) {
    body.likes = 0
  }
  let blog = new Blog(body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter