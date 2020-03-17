const manager = require('amqp-connection-manager')

const connect = async (uri) => {
  const connection = await manager.connect(uri, { json: true })

  connection.on('connect', function () {
    console.log(`${uri} Connected!`)
  })
  connection.on('disconnect', function (params) {
    console.log(`${uri} Disconnected.`, params.err.stack)
  })

  return connection
}

module.exports = { connect }
