const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs.map(b => b.toJSON()))
})

blogRouter.post('/', async (request, response) => {
    const body = request.body

    if(!request.token) {
        return response.status(401).json({ error: 'we couldn\'t identify you - missing token.' })
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken) {
        return response.status(401).json({ error: 'we couldn\'t identify you - invalid token.' })
    }

    const user = await User.findById(decodedToken.id)

    console.log('findById result: ', user)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    console.log('user.blogs: ', user)
    console.log('saved blog: ', savedBlog)

    response.status(201).json(savedBlog.toJSON())
})

blogRouter.delete('/:id', async (request, response) => {
    const token = request.token
    // find user
    const user = token === null
        ? false
        : await jwt.verify(token, process.env.SECRET)

    // find blog
    const blog = await Blog.findById(request.params.id)

    // if not found
    if (!blog) {
        response.status(401).json({ error: 'invalid blog id' })
    }

    if (!user) {
        response.status(401).json({ error: 'invalid token' })
    }
    // compare blog.user obj and user token
    const userIsOwner = user.id === blog.user._id.toString()
    console.log('user.id', typeof user.id)
    console.log('blog.user._id', typeof blog.user._id)
    console.log('userIsOwner', userIsOwner)

    userIsOwner === false
        ? response.status(401).json({ error: 'you\'re not the owner of that blog' })
        // if OK, delete blog
        : await Blog.findByIdAndDelete(request.params.id) && response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    // assign updated blog
    const updatedBlog = request.body

    // replace old blog with new blog
    const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })

    // response with new blog
    response.json(result.toJSON())
})

module.exports = blogRouter