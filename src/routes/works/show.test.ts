import { describe, expect, it, mock } from "bun:test"
import { Hono } from "hono"

mock.module("@/client", () => ({
  execute: mock((_query: unknown, vars: { id: string }) => {
    if (vars.id === "work-1") {
      return Promise.resolve({
        promptonWork: {
          id: "work-1",
          title: "テスト作品",
          body: "作品の説明文",
          createdAt: 1773226745,
          updatedAt: 1773345181,
          likesCount: 5,
          viewsCount: 100,
          isPublic: true,
          isNSFW: false,
          price: 0,
          sampleImageURL: "https://samples.prompton.io/test",
          tags: [{ id: "tag-1", name: "イラスト" }],
          user: { id: "user-1", name: "テストユーザー", login: "test_user" },
        },
      })
    }
    return Promise.resolve({ promptonWork: null })
  }),
}))

const showWork = (await import("@/routes/works/show")).default

describe("GET /works/:work", () => {
  const app = new Hono()
  app.get("/works/:work", ...showWork)

  it("returns work detail", async () => {
    const res = await app.request("http://localhost/works/work-1")
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.id).toBe("work-1")
    expect(data.title).toBe("テスト作品")
    expect(data.tags).toHaveLength(1)
    expect(data.user.login).toBe("test_user")
  })

  it("throws NotFoundException for missing work", async () => {
    const res = await app.request("http://localhost/works/nonexistent")
    expect(res.status).toBe(404)
  })

  it("returns help text", async () => {
    const res = await app.request("http://localhost/works/any?help=true")
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain("Usage:")
  })
})
