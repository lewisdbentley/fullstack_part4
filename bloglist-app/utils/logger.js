const message = (...message) => {
    console.log(...message)
}

const error = (...error) => {
    console.log(...error)
}

module.exports = {
    message,
    error
}