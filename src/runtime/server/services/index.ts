import Redis from "ioredis";

let _redis: Redis;

export const useRedis = () => {
  if (!_redis) {
    const config = useRuntimeConfig();
    const opts = { lazyConnect: true, ...config.redis };

    _redis = opts.url ? new Redis(opts?.url, opts) : new Redis(opts);
  }
  return _redis;
};
