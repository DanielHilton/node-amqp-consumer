// Imports
const nconf = require('nconf')
const amqpConnection = require('./amqp/connection')
const consumer = require('./services/do-some-stuff')

nconf.argv({
  RABBIT_URI: {
    alias: 'rabbit-uri',
    describe: 'URIs for rabbits connections',
    demand: false
  }
})
  .env()
  .defaults({
    RABBIT_URI: 'amqp://guest:guest@localhost:5672/test#test'
  })

// Start
amqpConnection.connect(nconf.get('RABBIT_URI')).then(async connection => {
  await consumer.create(connection)
  return connection
}).catch(err => {
  console.error(`${err}: Failed to connect to AMQP server`)
  process.exit(69)
})
