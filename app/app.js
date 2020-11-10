// Imports
const nconf = require('nconf')
const amqpConnection = require('./amqp/connection')
const consumer = require('./services/do-some-stuff')
const express = require('express')
const httpServer = require('http')
const { MongoClient } = require('mongodb')
const chalk = require('chalk')

nconf.argv({
  RABBIT_URI: {
    alias: 'rabbit-uri',
    describe: 'URIs for rabbits connections',
    demand: false
  }
})
  .env()
  .defaults({
    RABBIT_URI: 'amqp://guest:fishcake@localhost:5672',
    MONGO_URL: 'mongodb://localhost:27017/nodepoc'
  })

const app = express()
const server = httpServer.createServer(app)

app.on('rabbit-ready', () => {
  server.listen(9000)
  console.log(chalk.cyan('The Node.js POC has started.'))
})

app.on('mongo-ready', () => {
  amqpConnection.connect(nconf.get('RABBIT_URI')).then(async connection => {
    await consumer.create(connection)
    app.emit('rabbit-ready')
    return connection
  }).catch(err => {
    console.error(chalk.red(`${err}: Failed to connect to AMQP server`))
    process.exit(69)
  })
})

Promise.resolve(MongoClient.connect(nconf.get('MONGO_URL'), { useNewUrlParser: true })
  .then((db, error) => {
    if (error) {
      console.log('You failed')
      return process.exit(2)
    }

    return db
  })).then(db => {
  global.mongo = db
  console.log(chalk.green('Connected to MongoDB'))
  app.emit('mongo-ready')
})

module.exports = server
