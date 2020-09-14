const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
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
    }
]

const initialUsers = [
    {
        username: 'Billericay',
        name: 'Essex Mum',
        password: 'Billericay'
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, initialUsers, blogsInDb, usersInDB
}