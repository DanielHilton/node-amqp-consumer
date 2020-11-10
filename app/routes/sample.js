const HttpStatus = require('literal-http-status')

module.exports = async (req, res) => {
  const start = process.hrtime()
  const result = await global.mongo.db()
    .collection('node')
    .aggregate([{ $sample: { size: 3 } }]).toArray()

  res.status(HttpStatus['I\'m A Teapot']).send(result)
  console.log(`GET /sample: ${process.hrtime(start)[1] / 1000000}ms`)
}
