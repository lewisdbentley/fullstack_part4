const _ = require('lodash')


const initialBlogs = [
    {
        title: 'The Dillettante',
        author: 'Karl Schuh',
        url: 'www.karlschuh.com/essays/dillettante',
        likes: 25
    },
    {
        title: 'The Dillettante',
        author: 'Karl Schuh',
        url: 'www.karlschuh.com/essays/dillettante',
        likes: 25
    },
    {
        title: 'Village',
        author: 'Margerat Viscount',
        url: 'www.madgevis.biz',
        likes: 2
    },
    {
        title: 'Badger',
        author: 'Jeremy Corbyn',
        url: 'www.thered.biz',
        likes: 2075
    },
    {
        title: 'Badger',
        author: 'Jeremy Corbyn',
        url: 'www.thered.biz',
        likes: 2075
    },
]

const dummy = (blogs) => {
    console.log(blogs)
    return 1
}

const totalLikes = (blogs) => {
    let sum = 0
    blogs.forEach(blog => {
        sum = sum + blog.likes
    })
    return sum
}

const greatestLikes = (blogs) => {
    const likes = []
    blogs.forEach(blog => {
        likes.push(blog.likes)
    })
    const foundBlog = blogs.find(blog => {
        return blog.likes === Math.max(...likes)
    })
    return {
        title: foundBlog.title,
        author: foundBlog.author,
        likes: foundBlog.likes
    }
}

const arr = ['sky', 'clouds', 'trees', 'lake']

const first = _.last(arr)

console.log(first)

const mostBlogs = (blogs) => {
    const bundleNames = initialBlogs.map(blog => blog.author)

    let tally = _.reduce(bundleNames, (total, next) => {

        total[next] = ( total[next] || 0 ) + 1

        return total
    }, {})


    const bundleScores = _.values(tally)

    const highNum = Math.max(...bundleScores)

    const invertedTally = _.invert(tally)

    const highestNumOfBlogs = {
        author: invertedTally[highNum],
        blogs: highNum,
    }

    return highestNumOfBlogs
}

const mostLikes = (blogs) => {
    // create an object of unique authors with 0 likes

    const bundleNames = blogs.map(blog => blog.author)
    const uniqueNames = [... new Set(bundleNames)]
    const likesObj = {}
    uniqueNames.forEach((name, index) => likesObj[index] = name)
    const invertedLikesObj = _.invert(likesObj)
    for(let i = 0; i < uniqueNames.length; i++) {
        invertedLikesObj[uniqueNames[i]] = 0
    }

    // store total likes in author property

    for(let i = 0; i < uniqueNames.length; i++) {
        for(let j = 0; j < blogs.length; j++) {
            if(blogs[j].author === uniqueNames[i]) {
                invertedLikesObj[uniqueNames[i]] = invertedLikesObj[uniqueNames[i]] + blogs[j].likes
            }
        }
    }

    // return author with highest likes

    const bundleScores = []

    for(let i = 0; i < uniqueNames.length; i++) {
        bundleScores.push(invertedLikesObj[uniqueNames[i]])
    }

    const highestLikes = Math.max(...bundleScores)

    const reinvertedLikesObj = _.invert(invertedLikesObj)

    const authWithHighestLikes = {
        author: reinvertedLikesObj[highestLikes],
        likes: highestLikes
    }

    return authWithHighestLikes
}

const output = mostLikes(initialBlogs)

console.log(output)

module.exports = {
    dummy, totalLikes, greatestLikes
}