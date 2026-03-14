import { describe, expect, it, mock } from "bun:test"
import { Hono } from "hono"

mock.module("@/client", () => ({
  execute: mock(() =>
    Promise.resolve({
      promptonUsers: [
        {
          id: "user-1",
          login: "test_user",
          name: "テストユーザー",
          worksCount: 10,
          isRequestable: true,
        },
        {
          id: "user-2",
          login: "another_user",
          name: "別のユーザー",
          worksCount: 0,
          isRequestable: false,
        },
      ],
    }),
  ),
}))

const listUsers = (await import("@/routes/users/index")).default
const { help } = await import("@/routes/users/index")

describe("GET /users", () => {
  const app = new Hono()
  app.get("/users", ...listUsers)

  it("returns users list as JSON", async () => {
    const res = await app.request("http://localhost/users")
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveLength(2)
    expect(data[0].login).toBe("test_user")
    expect(data[1].isRequestable).toBe(false)
  })

  it("returns help text", async () => {
    const res = await app.request("http://localhost/users?help=true")
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toContain("--search")
  })

  it("exports help string", () => {
    expect(help).toContain("prompton users")
  })
})
