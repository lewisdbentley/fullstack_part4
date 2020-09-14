const logger = require('./logger')


const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization) {
        const authorization = request.get('authorization')
        logger.message('Authorization header: ', authorization)
        if( authorization && authorization.toLowerCase().startsWith('bearer')) {
            request.token = authorization.substring(7)
        }
    }
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(400).send({ 'error': 'unknown endpoint' })
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
    unknownEndpoint, errorMiddleware, tokenExtractor
}