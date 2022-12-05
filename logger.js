const winston = require('winston');

const debug = (output) => {
  winston.info(`Debug: ${output}`)
}

const answer = (output, part) => {
  winston.info(`The answer ${part ? `to part ${part}` : ''} is ${output}`)
}

module.exports = {
  answer,
  debug
}