import { defineNuxtModule, addTemplate, createResolver } from "@nuxt/kit";
import { RedisOptions } from "ioredis";
import defu from "defu";
import { NuxtConfigSchema } from "@nuxt/schema";

// Module options TypeScript inteface definition
export interface ModuleOptions extends RedisOptions {
  url?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-redis",
    configKey: "redis",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} };
    nuxt.options.runtimeConfig.redis = defu(nuxt.options.runtimeConfig.redis, {
      ...options,
    });

    const { resolve } = createResolver(import.meta.url);

    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};

      nitroConfig.externals = defu(
        typeof nitroConfig.externals === "object" ? nitroConfig.externals : {},
        {
          inline: [resolve("./runtime")],
        }
      );
      nitroConfig.alias["#redis"] = resolve("./runtime/server/services");
    });

    addTemplate({
      filename: "types/redis.d.ts",
      getContents: () =>
        [
          "declare module '#redis' {",
          `const useRedis: typeof import('${resolve(
            "./runtime/server/services"
          )}').useRedis`,
          "}",
        ].join("\n"),
    });

    nuxt.hook("prepare:types", (options) => {
      options.references.push({
        path: resolve(nuxt.options.buildDir, "types/redis.d.ts"),
      });
    });

    nuxt.hook("close", async () => {
      const { useRedis } = await import("#redis");
      useRedis().disconnect();
    });

    // Do no add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve("./runtime/plugin"));
  },
});
