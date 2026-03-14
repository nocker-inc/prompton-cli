import type { ErrorHandler } from "hono"
import { HTTPException } from "hono/http-exception"

export const onError: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }

  return c.json({ error: err.message }, 500)
}
