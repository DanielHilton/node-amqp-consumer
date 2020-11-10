const chalk = require('chalk')

const CreateConsumer = async function (connection, { exchange, queue, dlx, routingKey }, messageHandler) {
  // Handle an incoming message.
  const consumerWrapper = async rawMessage => {
    const start = process.hrtime()
    try {
      const message = JSON.parse(rawMessage.content)
      if (message) {
        await messageHandler(message)
        return channelWrapper.ack(rawMessage)
      }

      channelWrapper.nack(rawMessage, false, false)
    } catch (error) {
      console.error(chalk.redBright(`Failed to process message ${error}`))
      channelWrapper.nack(rawMessage, false, false)
    } finally {
      console.log(`Consume message ${routingKey}: ${process.hrtime(start)[1] / 1000000}ms`)
    }
  }

  const channelWrapper = await connection.createChannel({
    setup: channel =>
      Promise.all([
        channel.assertExchange(exchange, 'topic', { durable: false }),
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
