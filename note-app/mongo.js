const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('please enter a password')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://lewisdbentley:${password}@cluster0.qnuen.mongodb.net/<note-app>?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//     content: 'clouds invaded the sky',
//     date: Date.now(),
//     important: false
// })

// note.save().then(response => {
//     console.log('note saved!')
//     console.log(response)
//     mongoose.connection.close()
// })

Note.find({}).then(notes => {
    notes.forEach(note => {
        console.log(note)
    })
})