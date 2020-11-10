const { CreateConsumer } = require('../amqp/consumer')
const chalk = require('chalk')

async function create (connection) {
  return CreateConsumer(
    connection,
    {
      exchange: 'test',
      queue: 'logMessage',
      routingKey: 'test.logmessage'
    },
    async message => {
      console.log(chalk.grey(JSON.stringify(message)))
    })
}

module.exports = { create }
