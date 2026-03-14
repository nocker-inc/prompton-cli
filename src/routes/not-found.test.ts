import { describe, expect, it } from "bun:test"
import { Hono } from "hono"
import { notFound } from "@/routes/not-found"

describe("notFound", () => {
  const app = new Hono()
  app.notFound(notFound)

  it("returns 404 JSON with path", async () => {
    const res = await app.request("http://localhost/unknown")
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body).toEqual({ error: "Unknown command: /unknown" })
  })
})
