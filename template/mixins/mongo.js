const { MongoClient } = require('mongodb')
const { config } = require('tunebox')

let client
let db

const start = async () => {
  const { host, port, name } = config.db
  client = await MongoClient.connect(`${host}:${port}`)
  db = client.db(name)
}

start()

module.exports = {
  name: 'mongo',
  methods: {
    mongo (collection) {
      return db.collection(collection)
    }
  }
}
