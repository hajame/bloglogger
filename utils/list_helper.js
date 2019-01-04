const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  let fav = null
  if (blogs) {
    blogs.forEach(blog => {
      if (!fav || blog.likes > fav.likes) {
        fav = blog
      }
    })
  }

  return !fav ? null : {
    title: fav.title,
    author: fav.author,
    likes: fav.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  let topWriter = blogs.reduce((a, b) => {
    return blogs.filter(blog => blog.author === a.author).length >= blogs.filter(blog => blog.author === b.author).length ? a : b
  }, blogs[0])
  return {
    author: topWriter.author,
    blogs: blogs.filter(blog => blog.author === topWriter.author).length
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}