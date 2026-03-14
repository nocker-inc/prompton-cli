import { describe, expect, it, mock } from "bun:test"
import { Hono } from "hono"

mock.module("@/client", () => ({
  execute: mock((_query: unknown, vars: { id: string }) => {
    if (vars.id === "user-1") {
      return Promise.resolve({
        promptonUser: {
          id: "user-1",
          name: "テストユーザー",
          login: "test_user",
          works: [
            { id: "work-1", title: "作品A", likesCount: 3, viewsCount: 50 },
            { id: "work-2", title: null, likesCount: 0, viewsCount: 0 },
          ],
        },
      })
    }
    return Promise.resolve({ promptonUser: null })
  }),
}))

const userWorks = (await import("@/routes/users/works")).default

describe("GET /users/:user/works", () => {
  const app = new Hono()
  app.get("/users/:user/works", ...userWorks)

  it("returns user works list", async () => {
    const res = await app.request("http://localhost/users/user-1/works")
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.login).toBe("test_user")
    expect(data.works).toHaveLength(2)
    expect(data.works[0].title).toBe("作品A")
  })

  it("throws NotFoundException for missing user", async () => {
    const res = await app.request("http://localhost/users/nonexistent/works")
    expect(res.status).toBe(404)
  })

  it("returns help text", async () => {
    const res = await app.request("http://localhost/users/any/works?help=true")
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain("--limit")
  })
})
