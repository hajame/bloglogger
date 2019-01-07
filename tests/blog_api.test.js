const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

describe('api tests', () => {
  const initialBlogs = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      title: 'In pursuit of Otama\'s tone',
      author: 'Oona Räisänen',
      url: 'https://www.windytan.com/2017/11/in-pursuit-of-otamas-tone.html',
      likes: 2,
    },
    {
      title: 'Descrambling split-band voice inversion with deinvert',
      author: 'Oona Räisänen',
      url: 'https://www.windytan.com/2017/09/descrambling-split-band-voice-inversion.html',
      likes: 1,
    }
  ]

  beforeAll(async () => {
    await Blog.remove({})

    for (let blog of initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(titles).toContain('Descrambling split-band voice inversion with deinvert')
  })

  test('a valid blog can be added', async () => {
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

    const response = await api
      .get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain('This is a valid blog')
  })

  afterAll(() => {
    server.close()
  })

  // test('a blog without likes prop has 0 likes', async () => {
  //   const newBlog = {
  //     title: 'This is a valid blog',
  //     author: 'Test',
  //     url: 'https://www.test.test/'
  //   }

  //   await api
  //     .post('/api/blogs')
  //     .send(newBlog)
  //     .expect(201)
  //     .expect('Content-Type', /application\/json/)

  //   const response = await api
  //     .get('/api/blogs')

  //   const likes = response.body.map(r => r.likes)

  //   expect(likes).toContain(0)
  // })

  afterAll(() => {
    server.close()
  })

})