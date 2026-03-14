import type { NotFoundHandler } from "hono"

export const notFound: NotFoundHandler = (c) => {
  return c.json({ error: `Unknown command: ${c.req.path}` }, 404)
}
