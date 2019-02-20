import * as Redis from "ioredis";

let $instance: Redis.Redis;

export function redis() {
  return new Redis(process.env.REDIS_URL);
}

export function instance(): Redis.Redis {
  if (!$instance) {
    $instance = redis()
  }

  return $instance
}
