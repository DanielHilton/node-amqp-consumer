async function publishMessage (message, connection, exchange, routingKey) {
  const channelWrapper = await connection.createChannel({
    setup: channel =>
      Promise.all([
        channel.assertExchange(exchange, 'topic', { durable: false })
      ])
  })

  await channelWrapper.waitForConnect()
  const result = await channelWrapper.publish(
    exchange,
    routingKey,
    new Buffer.from(JSON.stringify(message)),
    {
      contentType: 'application/json',
      persistent: false
    })

  channelWrapper.close()

  return result
}

module.exports = { publishMessage }
