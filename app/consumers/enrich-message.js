const { CreateConsumer } = require('../amqp/consumer')
const axios = require('axios')
const qs = require('qs')
const { publishMessage } = require('../amqp/publisher')

async function create (connection) {
  await CreateConsumer(
    connection,
    {
      exchange: 'test',
      queue: 'enrichWithBibleVerse',
      routingKey: 'test.enrichwithbibleverse'
    },
    async message => {
      const now = Date.now()
      const documentToStore = {
        amqpMessage: message,
        timestamp: now,
        biblePassage: await getPassageFromBible()
      }

      const collection = global.mongo.db().collection('node')
      await collection.insertOne(documentToStore)

      publishMessage(documentToStore, connection, 'test', 'test.logmessage')
    })
}

async function getPassageFromBible () {
  const biblePassage = await axios.get(`https://labs.bible.org/api/?${qs.stringify({
    passage: 'random',
    type: 'json'
  })}`)

  return biblePassage.data[0]
}

module.exports = { create }
