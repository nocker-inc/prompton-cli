import { describe, expect, it } from "bun:test"
import { toRequest } from "@/router"

describe("toRequest", () => {
  it("parses segments only", () => {
    const { path, url } = toRequest(["works"])
    expect(path).toBe("/works")
    expect(url).toBe("http://localhost/works")
  })

  it("parses segments with id", () => {
    const { path } = toRequest(["works", "abc123"])
    expect(path).toBe("/works/abc123")
  })

  it("parses long flags", () => {
    const { url } = toRequest(["works", "--limit", "5"])
    expect(url).toContain("limit=5")
  })

  it("parses short flags", () => {
    const { url } = toRequest(["works", "-l", "5"])
    expect(url).toContain("limit=5")
  })

  it("parses boolean flags as global", () => {
    const { global } = toRequest(["works", "--help"])
    expect(global.help).toBe(true)
  })

  it("extracts global flags", () => {
    const { global, url } = toRequest(["works", "--text"])
    expect(global.text).toBe(true)
    expect(url).not.toContain("text")
  })

  it("handles nested resources", () => {
    const { path } = toRequest(["users", "abc", "works", "--limit", "10"])
    expect(path).toBe("/users/abc/works")
  })

  it("handles search with Japanese", () => {
    const { url } = toRequest(["works", "--search", "猫"])
    expect(url).toContain("search=")
    expect(decodeURIComponent(url)).toContain("猫")
  })
})
