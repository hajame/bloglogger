const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb, usersInDb } = require('./test_helper')
const User = require('../models/user')

describe('api tests', () => {
  describe('when there are blogs in the db', () => {
    beforeAll(async () => {
      await Blog.remove({})

      const blogObjects = initialBlogs.map(b => new Blog(b))
      await Promise.all(blogObjects.map(b => b.save()))
    })

    describe('blogs are returned', () => {

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

    describe('blogs can be added', () => {

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
          .expect(200)
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
          .expect(200)
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

    describe('blogs can be altered', () => {
      let addedBlog

      beforeAll(async () => {
        addedBlog = new Blog({
          title: 'This blog will be altered',
          author: 'AltTest',
          url: 'https://www.alttest.test/',
          likes: 1
        })
        await addedBlog.save()
      })

      test('a blog in database can be deleted', async () => {
        const newBlog = {
          title: 'This blog has been altered',
          author: 'AltTest',
          url: 'https://www.alttest.test/',
          likes: 555
        }

        await api
          .put(`/api/blogs/${addedBlog._id}`)
          .send(newBlog)
          .expect(200)

        const blogsAfterOperation = await blogsInDb()

        const titles = blogsAfterOperation.map(r => r.title)
        const likes = blogsAfterOperation.map(r => r.likes)

        expect(titles).toContain(newBlog.title)
        expect(likes).toContain(newBlog.likes)
      })

      test('a blog in database can be updated', async () => {
        const blogsAtStart = await blogsInDb()

        await api
          .delete(`/api/blogs/${addedBlog._id}`)
          .expect(204)

        const blogsAfterOperation = await blogsInDb()

        const titles = blogsAfterOperation.map(r => r.title)

        expect(titles).not.toContain(addedBlog.title)
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
      })
    })
  })

  describe('when there is initially one user at db', async () => {
    beforeAll(async () => {
      await User.remove({})
      const user = new User({
        username: 'root',
        name: 'Root Rootelsson',
        password: 'sekret',
        adult: true
      })
      await user.save()
    })

    test('POST /api/users succeeds with a fresh username', async () => {
      const usersBeforeOperation = await usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
        adult: true
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
      const usernames = usersAfterOperation.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('POST /api/users sets adult true if undefined', async () => {
      const usersBeforeOperation = await usersInDb()

      const newUser = {
        username: 'mlookkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
      const newInDb = usersAfterOperation.filter(u => u.username === 'mlookkai')
      expect(newInDb[0].adult).toBe(true)
    })

    test('POST /api/users fails with a taken username', async () => {
      const usersBeforeOperation = await usersInDb()

      const newUser = {
        username: 'root',
        name: 'Rebel Root Wannabe',
        password: 'password',
        adult: false
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body).toEqual({ error: 'username must be unique' })

      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST /api/users fails with a too short password', async () => {
      const usersBeforeOperation = await usersInDb()

      const newUser = {
        username: 'new',
        name: 'new user',
        password: 'ps',
        adult: false
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body).toEqual({ error: 'password must be 3 or more characters long' })

      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

  })
  afterAll(() => {
    server.close()
  })
})