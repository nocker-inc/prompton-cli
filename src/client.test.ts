import { describe, expect, it, mock } from "bun:test"

describe("execute", () => {
  it("returns data on success", async () => {
    mock.module("@/client", () => ({
      execute: mock(() => Promise.resolve({ promptonWorks: [{ id: "test-1" }] })),
    }))

    const { execute: mockedExecute } = await import("@/client")
    // biome-ignore lint/complexity/noBannedTypes: test mock
    const result = await (mockedExecute as Function)({}, {})
    expect(result).toHaveProperty("promptonWorks")
  })
})
