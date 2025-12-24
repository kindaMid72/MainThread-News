import { Redis } from '@upstash/redis' // use your own redis provider

const redis = new Redis({
  url: process.env.REDIS_REST_URL,
  token: process.env.REDIS_REST_TOKEN,
});

export default redis;
