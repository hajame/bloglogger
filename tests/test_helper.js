const Blog = require('../models/blog')
const User = require('../models/user')

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

const format = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}

const nonExistingId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(format)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  initialBlogs, format, nonExistingId, blogsInDb, usersInDb
}