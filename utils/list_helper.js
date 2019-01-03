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

module.exports = {
  dummy, totalLikes, favoriteBlog
}