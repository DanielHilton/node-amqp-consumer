const enrichMessageConsumer = require('./enrich-message')
const logMessageConsumer = require('./log-message')

module.exports = (connection) => {
  return Promise.all([
    enrichMessageConsumer.create(connection),
    logMessageConsumer.create(connection)
  ])
}
