const listHelper = require('../utils/list_helper')


test('listHelper simply returns 1', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)

    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const emptyBlog = []
        const result = listHelper.totalLikes(emptyBlog)
        expect(result).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
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
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        const listWithTwoBlogs = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            },
            {
                _id: '6a422aa71b54a676234d17f9',
                title: 'Confessions of a Dedicated Dilettante',
                author: 'Robert, Klose',
                url: 'https://www.questia.com/newspaper/1P2-32609718/confessions-of-a-dedicated-dilettante',
                likes: 12,
                __v: 0
            }
        ]
        const result = listHelper.totalLikes(listWithTwoBlogs)
        expect(result).toBe(17)
    })
})

describe('highest number of likes', () => {
    test('find blog with highest number of likes', () => {
        const listWithTwoBlogs = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            },
            {
                _id: '6a422aa71b54a676234d17f9',
                title: 'Confessions of a Dedicated Dilettante',
                author: 'Robert, Klose',
                url: 'https://www.questia.com/newspaper/1P2-32609718/confessions-of-a-dedicated-dilettante',
                likes: 12,
                __v: 0
            }
        ]
        const result = listHelper.greatestLikes(listWithTwoBlogs)
        expect(result).toStrictEqual({
            title: 'Confessions of a Dedicated Dilettante',
            author: 'Robert, Klose',
            likes: 12
        })
    })
})