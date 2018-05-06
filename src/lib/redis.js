const Redis = require('ioredis');

function client() {
  return new Redis(process.env.REDIS_URL);
}

client.instance = () => {
  if (!client.$instance) {
    client.$instance = client()
  }

  return client.$instance
}

module.exports = client;
