// const redis = require('redis');

// const redisClient = redis.createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: 'redis-19363.crce179.ap-south-1-1.ec2.cloud.redislabs.com',
//         port: 19363
//     }
// });


// module.exports = redisClient;


const redis = require('redis');

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err.message);
});

module.exports = redisClient;