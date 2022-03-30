// const { createClient } = require("redis");

// const client = createClient({url: 'redis://alice:foobared@awesome.redis.server:6380'})

// client.on('error', (err) => console.log('Redis Client Error', err));

// module.exports = client
var redis  = require("redis"),
    client = redis.createClient(6379, "localhost");

client.on("error", function (err) {
  console.log("Redis error encountered", err);
});

client.on("end", function() {
  console.log("Redis connection closed");
});

module.exports = client
