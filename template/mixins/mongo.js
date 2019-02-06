const { MongoClient } = require('mongodb')
const { config } = require('tunebox')
let client
let db

module.exports = {
  name: 'mongo',
  async created () {
    const { host, port, name } = config.db
    client = await MongoClient.connect(
      `${host}:${port}`,
      { useNewUrlParser: true }
    )
    db = client.db(name)
  },
  async stopped () {
    if (client) {
      await client.close()
      client = null
    }

    return true
  },
  methods: {
    mongo (collection) {
      return db.collection(collection)
    }
  }
}
