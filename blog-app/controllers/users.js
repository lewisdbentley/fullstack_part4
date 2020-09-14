const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users.map(u => u.toJSON()))
})

userRouter.post('/', async (request, response) => {
    const body = request.body

    if(body.password === undefined) {
        return response.status(400).json({
            'error': 'You must set a password'
        })
    } else if (body.password.length < 3) {
        return response.status(400).json({
            'error': 'Password must be at least three characters long'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    })

    const savedUser = await user.save()

    console.log(savedUser)

    response.json(savedUser)
})

userRouter.put('/:id', async (request, response) => {
    const updatedUser = request.body
    const user = await User.findById(request.params.id)
    user.username = updatedUser.username
    await user.save()
    response.json(user.toJSON())
})

module.exports = userRouter