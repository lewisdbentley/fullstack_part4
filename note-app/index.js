const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const tester = require('./utils/for_testing')


const server = http.createServer(app)

logger.info(tester.palindrome('lewis bentley'))

logger.info(tester.average([1, 2, 3, 4]))

server.listen(config.PORT, () => {
    logger.info(`the server is running on port ${config.PORT}!`)
})