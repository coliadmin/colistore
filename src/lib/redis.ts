import {createClient, RedisClientType} from "redis";

import {config} from "./config";

import {ProductTypes} from "@/modules/twenty/company/product";

let redisClient: RedisClientType;

export async function getRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({
      url: config.redis.URL,
      name: ProductTypes.COLISTORE,
      socket: {
        reconnectStrategy: function (retries) {
          if (retries > 20) {
            console.log(
              "lib/redis getRedisClient | Too many attempts to reconnect. Redis connection was terminated",
            );

            return new Error("Too many retries.");
          } else {
            return retries * 500;
          }
        },
        connectTimeout: 10000, // in milliseconds
      },
    });

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    redisClient.on("error", (err) => {
      console.error("lib/redis getRedisClient | Redis Client Error", err);
    });
  }

  return redisClient;
}
