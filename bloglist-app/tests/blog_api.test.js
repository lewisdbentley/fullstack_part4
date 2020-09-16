const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./blog_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)
let token = null

describe('initial blogs in db', () => {
    beforeEach(async () => {
        await Blog.deleteMany()

        const mongooseBlogs = helper.initialBlogs.map(blog => {
            return new Blog(blog)
        })

        const promiseBlogs = mongooseBlogs.map(async (blog) => {
            return await blog.save()
        })

        await Promise.all(promiseBlogs)

        // create & log in a user
        await User.deleteMany()
        const helperUser = helper.initialUsers[0]
        const passwordHash = await bcrypt.hash(helperUser.password, 10)
        const user = new User({
            username: helperUser.username,
            name: helperUser.name,
            passwordHash
        })
        await user.save()
        const response = await api
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({
                'username': 'Billericay',
                'password': 'Billericay',
            })
            .expect(200)

        const responseToken = response.res.text
        const parsedToken = JSON.parse(responseToken)
        const jsonToken = parsedToken.token.toString()
        const str = 'bearer'
        token = str.concat(' ', jsonToken)

        console.log('token ', token)
    })

    test('correct amount of entries in json format', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(2)
    })

    test('has an id', async () => {

        // assign blogs to var
        const response = await helper.blogsInDb()
        console.log(response)
        // assign blog
        const blog = response[0]
        // check if blog has id property
        expect(blog.id).toBeDefined()
    })

    test('post blog', async () => {

        // create blog obj
        const newBlog = {
            title: 'The Value of Currency',
            author: 'Damian Schwartz',
            url: 'www.damianschwartz.com',
            likes: 322
        }
        // post to api/blogs
        await api
            .post('/api/blogs')
            .set('Authorization', token)
            .send(newBlog)
            .expect(201)

        // verify amount of blogs incremented
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
        // verify blogs contains posted blog
        const contents = blogsAtEnd.map(blog => blog.title)
        expect(contents).toContain(
            'The Value of Currency'
        )
    })

    test('default no likes', async () => {
        // create blog with no likes property
        const newBlog = {
            title: 'The Brandenberg Concerto',
            author: 'Andrea La Monaca',
            url: 'www.bachtobach.com/blog',
        }
        // post to api/blogs
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        // verify posted blog has property likes & it is set to 0
        const blogsAtEnd = await helper.blogsInDb()
        const postedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
        console.log(postedBlog)
        expect(postedBlog.likes).toBeDefined()
        expect(postedBlog.likes).toEqual(0)
    })

    test('must contain title and url', async () => {
        // create new blog missing title and url
        const newBlog = {
            title: 'wonderful adventure',
            author: 'Arthur Wait'
        }
        // post to api/blogs
        await api
            .post('/api/blogs')
            .send(newBlog)
            // verify receive 400
            .expect(400)
    })

    test('must provide token to post new blog', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const newBlog = {
            title: 'wonderful adventure',
            author: 'Arthur Wait'
        }
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        expect(response.body.error).toContain(
            'we couldn\'t identify you - invalid or missing token.'
        )

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toEqual(blogsAtStart.length)
    })
})

describe('one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany()

        const mongooseUsers = helper.initialUsers.map(user => {
            return new User(user)
        })

        const promiseUsers = await mongooseUsers.map(user => {
            return user.save()
        })

        await Promise.all(promiseUsers)
    })

    test('fails to create user with empty password', async () => {
        const usersAtStart = await helper.usersInDB()

        const user = {
            username: 'One Direction Member #1',
            name: 'Harry Styles',
        }

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)

        expect(response.body.error).toContain(
            'You must set a password'
        )

        const usersAtEnd = await helper.usersInDB()

        expect(usersAtEnd).not.toContain(user.username)
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })

    test('fails to create user with >3 char password', async () => {
        const usersAtStart = await helper.usersInDB()

        const user = {
            username: 'One Direction Member #1',
            name: 'Harry Styles',
            password: '#1'
        }

        console.log('users in db:', usersAtStart.length)

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)

        expect(response.body.error).toContain('must be at least three characters')

        const usersAtEnd = await helper.usersInDB()

        expect(usersAtEnd).not.toContain(user.username)
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails to create user with empty username', async () => {
        const usersAtStart = await helper.usersInDB()

        const user = {
            name: 'Harry Styles',
            password: 'password'
        }

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)

        expect(response.body.error).toContain(
            '`username` is required'
        )

        const usersAtEnd = await helper.usersInDB()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })

    test('fails to create user with >3 char username', async () => {
        const usersAtStart = await helper.usersInDB()

        const user = {
            username: '#1',
            name: 'Harry Styles',
            password: 'password'
        }

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)

        console.log('response:', response.body)

        expect(response.body.error).toContain(
            'is shorter than the minimum allowed length'
        )

        const usersAtEnd = await helper.usersInDB()

        expect(usersAtEnd).not.toContain(user.username)
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails to create non-unique username', async () => {
        const usersAtStart = await helper.usersInDB()

        const user = {
            username: 'Billericay',
            name: 'Essex Mum',
            password: 'Billericay'
        }

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)

        expect(response.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd.length).toBe(usersAtStart.length)

    })
})

afterAll(() => {
    mongoose.connection.close()
})