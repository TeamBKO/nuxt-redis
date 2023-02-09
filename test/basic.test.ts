import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";

describe("redis is configured properly", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("../playground", import.meta.url)),
    server: true,
  });

  it("should save 'hello world' within redis and respond back.", async () => {
    const response = await $fetch("/api");
    console.log(response);
    expect(response).toHaveProperty("redis");
  });
});
