const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


// GET all notes
notesRouter.get('/', async (request, response) => {
    const notes = await Note
        .find({})
        .populate('user', { username: 1, name: 1 })

    response.json(notes.map(note => note.toJSON()))
})

// GET Homepage
notesRouter.get('/', (request, response) => {
    response.send('<h1>Welcome to my site</h1>')
    console.log('get homepage')
})

// GET note
notesRouter.get('/:id', async (request, response, next) => {
    const note = await Note.findById( request.params.id )
    if (note) {
        response.json(note.toJSON())
    } else {
        response.sendStatus(404).end()
    }
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

// POST note
notesRouter.post('/', async (request, response) => {
    const body = request.body

    const token = getTokenFrom(request)
    console.log(token)

    // const decodedToken = jwt.verify(token, process.env.SECRET)
    // if(!token || !decodedToken.id) {
    //     return response.status(401).send({
    //         'error': 'invalid or missing token'
    //     })
    // }

    // const user = await User.findById( decodedToken.id )
    const user = await User.findOne({})
    console.log('before save: ', user)

    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        date: new Date(),
        user: user._id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    console.log('after save: ', user)

    response.json(savedNote.toJSON())
})

// DELETE note

notesRouter.delete('/:id/delete', async (request, response, next) => {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

// TOGGLE IMPORTANCE

notesRouter.put('/:id', (request, response, next) => {

    const body = request.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            console.log(updatedNote)
            response.json(updatedNote.toJSON())
        })
        .catch(error => next(error))
})


module.exports = notesRouter