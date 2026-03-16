import { factory } from "@/factory"
import { loadCredentials } from "@/lib/credentials"

export const help = "Usage: prompton whoami"

export default factory.createHandlers(async (c) => {
  const credentials = loadCredentials()

  if (!credentials) {
    return c.json({ message: "Not logged in" })
  }

  return c.json({
    email: credentials.email,
    uid: credentials.uid,
  })
})
