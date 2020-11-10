// Imports
const nconf = require('nconf')
const amqpConnection = require('./amqp/connection')
const express = require('express')
const httpServer = require('http')
const { MongoClient } = require('mongodb')
const chalk = require('chalk')

const initialiseConsumers = require('./consumers/initialise')

nconf.argv({
  RABBIT_URI: {
    alias: 'rabbit-uri',
    describe: 'URIs for rabbits connections',
    demand: false
  }
})
  .env()
  .defaults({
    RABBIT_URI: 'amqp://guest:guest@localhost:5672',
    MONGO_URL: 'mongodb://localhost:27017/poc'
  })

const app = express()
const server = httpServer.createServer(app)

app.use('/sample', require('./routes/sample'))

app.on('rabbit-ready', () => {
  server.listen(9000)
  console.log(chalk.cyan('The Node.js POC has started.'))
})

app.on('mongo-ready', () => {
  amqpConnection.connect(nconf.get('RABBIT_URI')).then(async connection => {
    await initialiseConsumers(connection)
    app.emit('rabbit-ready')
    return connection
  }).catch(err => {
    console.error(chalk.red(`${err}: Failed to connect to AMQP server`))
    process.exit(69)
  })
})

Promise.resolve(MongoClient.connect(nconf.get('MONGO_URL'), { useNewUrlParser: true })
  .then((client, error) => {
    if (error) {
      console.log('You failed')
      return process.exit(2)
    }

    return client
  })).then(client => {
  global.mongo = client
  console.log(chalk.green('Connected to MongoDB'))
  app.emit('mongo-ready')
})

module.exports = server
