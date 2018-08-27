import * as Redis from "ioredis";

export function client() {
  return new Redis(process.env.REDIS_URL);
}

let $instance: Redis.Redis;

export function instance(): Redis.Redis {
  if (!$instance) {
    $instance = client()
  }

  return $instance
}
