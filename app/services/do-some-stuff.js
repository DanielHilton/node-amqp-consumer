const { CreateConsumer } = require('../amqp/consumer')

async function create (connection) {
  await CreateConsumer(
    connection,
    {
      exchange: 'test',
      queue: 'node-stuff',
      routingKey: 'test.node-stuff'
    },
    async message => {
      const now = Date.now()

      console.log({ now, message })
    })
}

module.exports = { create }
