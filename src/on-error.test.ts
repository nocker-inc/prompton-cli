import { describe, expect, it } from "bun:test"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { onError } from "@/on-error"

describe("onError", () => {
  const app = new Hono()
  app.onError(onError)

  app.get("/http-error", () => {
    throw new HTTPException(404, { message: "Not Found" })
  })

  app.get("/generic-error", () => {
    throw new Error("Something broke")
  })

  it("handles HTTPException with correct status", async () => {
    const res = await app.request("http://localhost/http-error")
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body).toEqual({ error: "Not Found" })
  })

  it("handles generic Error as 500", async () => {
    const res = await app.request("http://localhost/generic-error")
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body).toEqual({ error: "Something broke" })
  })
})
