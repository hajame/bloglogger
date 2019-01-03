const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
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
      _id: '5a422aa71b54a676234d17a1',
      title: 'Animated line drawings with OpenCV',
      author: 'Oona Räisänen',
      url: 'https://www.windytan.com/2017/12/animated-line-drawings-with-opencv.html',
      likes: 3,
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

  test('when list has only one blog equals that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has only many blogs equals the one with top likes', () => {
    const result = listHelper.favoriteBlog(listWithThreeBlogs)
    expect(result).toEqual({
      title: 'Animated line drawings with OpenCV',
      author: 'Oona Räisänen',
      likes: 3
    })
  })

  test('when list is empty equals null', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual(null)
  })
})