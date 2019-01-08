const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb } = require('./test_helper')

describe('api tests', () => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(b => new Blog(b))
    await Promise.all(blogObjects.map(b => b.save()))
  })

  describe('GET-method tests', () => {

    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const blogsInDatabase = await blogsInDb()
      const response = await api
        .get('/api/blogs')

      expect(response.body.length).toBe(blogsInDatabase.length)
    })

    test('a specific blog is within the returned blogs', async () => {
      const response = await api
        .get('/api/blogs')

      const titles = response.body.map(r => r.title)

      expect(titles).toContain('Descrambling split-band voice inversion with deinvert')
    })
  })

  describe('POST-method tests', () => {
    
    test('a valid blog can be added', async () => {
      const blogsAtStart = await blogsInDb()
      const newBlog = {
        title: 'This is a valid blog',
        author: 'Test',
        url: 'https://www.test.test/',
        likes: 9
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      const titles = blogsAfterOperation.map(r => r.title)

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
      expect(titles).toContain('This is a valid blog')
    })

    test('a blog without likes prop has 0 likes', async () => {
      const newBlog = {
        title: 'This is a valid blog',
        author: 'Test',
        url: 'https://www.test.test/'
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const blogsAfterOperation = await blogsInDb()
      const likes = blogsAfterOperation.map(r => r.likes)
      expect(likes).toContain(0)
    })

    test('a blog without title or url is not added', async () => {
      const newBlog = {
        author: 'Test',
        likes: 55
      }
      const blogsAtStart = await blogsInDb()
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
  })

  afterAll(() => {
    server.close()
  })
})