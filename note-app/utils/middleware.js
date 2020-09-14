const logger = require('./logger')

// const requestLogger = (request, response, next) => {
//     console.log('method: ', request.method)
//     console.log('path  : ', request.path)
//     console.log('body  : ', request.body)
//     console.log('---')
//     next()
// }

// ERROR MIDDLEWARE

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint reached'})
}

const errorMiddleware = (error, request, response, next) => {

    logger.error(
        '----------',
        error.message,
        '----------'
    )

    if ( error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if ( error.name === 'ValidationError' ) {
        return response.status(400).send({
            error: error.message
        })
    } else if ( error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    next(error)
}

module.exports = {
    // requestLogger,
    unknownEndpoint,
    errorMiddleware
}