import { useRedis } from "#redis";

export default defineEventHandler(async () => {
  try {
    await useRedis().set("hello-world", "hello-world", "EX", 120);

    const redis = await useRedis().get("hello-world");
    return { redis };
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err });
  }
});
