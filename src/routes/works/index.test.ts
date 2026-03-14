import { describe, expect, it, mock } from "bun:test"
import { Hono } from "hono"

mock.module("@/client", () => ({
  execute: mock(() =>
    Promise.resolve({
      promptonWorks: [
        {
          id: "work-1",
          title: "テスト作品",
          likesCount: 5,
          viewsCount: 100,
          isPublic: true,
          sampleImageURL: "https://samples.prompton.io/test",
          user: { id: "user-1", name: "テストユーザー", login: "test_user" },
        },
        {
          id: "work-2",
          title: null,
          likesCount: 0,
          viewsCount: 0,
          isPublic: true,
          sampleImageURL: "https://samples.prompton.io/test2",
          user: { id: "user-1", name: "テストユーザー", login: "test_user" },
        },
      ],
    }),
  ),
}))

const listWorks = (await import("@/routes/works/index")).default
const { help } = await import("@/routes/works/index")

describe("GET /works", () => {
  const app = new Hono()
  app.get("/works", ...listWorks)

  it("returns works list as JSON", async () => {
    const res = await app.request("http://localhost/works")
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveLength(2)
    expect(data[0].id).toBe("work-1")
    expect(data[0].title).toBe("テスト作品")
    expect(data[1].title).toBeNull()
  })

  it("returns help text", async () => {
    const res = await app.request("http://localhost/works?help=true")
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain("Usage:")
    expect(text).toContain("--limit")
  })

  it("exports help string", () => {
    expect(help).toContain("prompton works")
  })
})
