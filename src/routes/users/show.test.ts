import { describe, expect, it, mock } from "bun:test"
import { Hono } from "hono"

mock.module("@/client", () => ({
  execute: mock((_query: unknown, vars: { id: string }) => {
    if (vars.id === "user-1") {
      return Promise.resolve({
        promptonUser: {
          id: "user-1",
          login: "test_user",
          name: "テストユーザー",
          biography: "自己紹介文",
          worksCount: 10,
          followersCount: 5,
          followeesCount: 3,
          isRequestable: true,
          twitterURL: "https://twitter.com/test_user",
          instagramURL: null,
          siteURL: null,
        },
      })
    }
    return Promise.resolve({ promptonUser: null })
  }),
}))

const showUser = (await import("@/routes/users/show")).default

describe("GET /users/:user", () => {
  const app = new Hono()
  app.get("/users/:user", ...showUser)

  it("returns user detail", async () => {
    const res = await app.request("http://localhost/users/user-1")
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.login).toBe("test_user")
    expect(data.biography).toBe("自己紹介文")
    expect(data.twitterURL).toContain("twitter.com")
  })

  it("throws NotFoundException for missing user", async () => {
    const res = await app.request("http://localhost/users/nonexistent")
    expect(res.status).toBe(404)
  })
})
