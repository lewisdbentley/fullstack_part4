const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)


beforeEach(async () => {
    await Note.deleteMany({})

    const noteObjects = helper.initialNotes.map(note => new Note(note))
    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)
})

describe('when there are initially some notes saved', () => {
    test('notes returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes returned', async () => {
        const response = await api.get('/api/notes')

        expect(response.body).toHaveLength(helper.initialNotes.length)
    })

    test('the first note is about html', async () => {
        const response = await api.get('/api/notes')

        const contents = response.body.map(r => r.content)

        expect(contents).toContain('html is easy')
    })
})

describe('viewing a specific note', () => {
    test('succeeds with valid id', async () => {

        const notesAtStart = await helper.notesInDb()

        const noteToView = notesAtStart[0]

        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultNote.body).toEqual(noteToView)
    })

    test('fails with valid nonexisting id', async () => {
        const validNonexistingId = await helper.nonExistingId()

        console.log(validNonexistingId)

        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404)
    })
    test('fails with invalid id', async () => {
        const invalidId = 'thomas the tank engine'

        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400)
    })
})

describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
        const newNote = {
            content: 'to async, and await!',
            important: true,
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

        const contents = notesAtEnd.map(r => r.content)
        expect(contents).toContain(
            'to async, and await!'
        )
    })

    test('fails with status code 400 if data invalid', async () => {
        const newNote = {
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)

        const notesAtEnd = await helper.notesInDb()

        expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })
})

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        await api
            .delete(`/api/notes/${noteToDelete.id}/delete`)
            .expect(204)

        const notesAtEnd = await helper.notesInDb()

        expect(notesAtEnd).toHaveLength(
            helper.initialNotes.length - 1
        )

        const contents = notesAtEnd.map(r => r.content)

        expect(contents).not.toContain(noteToDelete.content)
    })
})

describe('one user in the database', () => {
    beforeEach(async () => {
        await User.deleteMany()

        const passwordHash = await bcrypt.hash('sekret', 10)

        const newUser = new User({ username: 'root', passwordHash })

        await newUser.save()
    })

    test('succeeds with creating a new user', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mben',
            name: 'Mark Bentley',
            password: 'baytree'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usersContent = usersAtEnd.map(user => user.username)

        expect(usersContent).toContain(newUser.username)
    })

    test('fails with correct status code and message with taken username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Mark Bentley',
            password: 'baytree',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll( () => {
    mongoose.connection.close()
})