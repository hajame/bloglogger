const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const listWithThreeBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17b2',
      title: 'In pursuit of Otama\'s tone',
      author: 'Oona Räisänen',
      url: 'https://www.windytan.com/2017/11/in-pursuit-of-otamas-tone.html',
      likes: 2,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17c3',
      title: 'Descrambling split-band voice inversion with deinvert',
      author: 'Oona Räisänen',
      url: 'https://www.windytan.com/2017/09/descrambling-split-band-voice-inversion.html',
      likes: 1,
      __v: 0
    }
  ]

  test('when list has only one blog equals its author and one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list has only many blogs equals the one with most blogs', () => {
    const result = listHelper.mostBlogs(listWithThreeBlogs)
    expect(result).toEqual({
      author: 'Oona Räisänen',
      blogs: 2
    })
  })

  test('when list is empty equals null', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual(null)
  })
})