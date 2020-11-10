const manager = require('amqp-connection-manager')
const chalk = require('chalk')

const connect = async (uri) => {
  const connection = await manager.connect(uri, { json: true })

  connection.on('connect', function () {
    console.log(chalk.yellow(`${uri} Connected!`))
  })
  connection.on('disconnect', function (params) {
    console.log(chalk.redBright(`${uri} Disconnected.`, params.err.stack))
  })

  return connection
}

module.exports = { connect }
