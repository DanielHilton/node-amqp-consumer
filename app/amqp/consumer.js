const chalk = require('chalk')

const CreateConsumer = async function (connection, { exchange, queue, dlx, routingKey }, messageHandler) {
  // Handle an incoming message.
  const consumerWrapper = async rawMessage => {
    try {
      const message = JSON.parse(rawMessage.content)
      if (message) {
        await messageHandler(message)
        channelWrapper.ack(rawMessage)
        return
      }

      channelWrapper.nack(rawMessage, false, false)
    } catch (error) {
      console.error(chalk.redBright('Failed to process message'))
      channelWrapper.nack(rawMessage, false, false)
    }
  }

  const channelWrapper = await connection.createChannel({
    setup: channel =>
      Promise.all([
        channel.assertExchange(exchange, 'fanout', { durable: false }),
        channel.assertQueue(queue, {
          durable: false,
          arguments: (dlx) ? { 'x-dead-letter-exchange': dlx } : {}
        }),
        channel.prefetch(10),
        channel.bindQueue(queue, exchange, routingKey),
        channel.consume(queue, consumerWrapper)
      ])

  })

  await channelWrapper.waitForConnect()
  console.log(chalk.magentaBright(`Listening for messages on exchange ${exchange} with routing key ${routingKey}`))
}

module.exports = { CreateConsumer }
