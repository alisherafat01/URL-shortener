require('dotenv').config();
const debug = require('debug')('app:redis');
const redis = require('redis');
let connectionString = process.env.REDIS_CONNECTION;
if (process.env.NODE_ENV == 'test')
  connectionString = process.env.REDIS_TEST_CONNECTION
const client = redis.createClient({ url: connectionString });

client.on('connect', () => debug('Connected to Redis'))

client.on('error', (err) => debug('Redis Client Error', connectionString, err));

(async function () {
  await client.connect();
})();

exports.client = client;



exports.get = async (key) => {
  let value = await client.get(key);
  if (value) {
    console.log(`get ${key} from cache`);
    value = JSON.parse(value);
    return value;
  } else {
    return undefined;
  }
};

exports.set = async (key, value, ex = undefined) => {
  if (ex == undefined) {
    await client.set(key, JSON.stringify(value));
  } else {
    await client.set(key, JSON.stringify(value), { EX: ex });
  }
};

exports.delete = async (key) => {
  await client.del(key);
};

