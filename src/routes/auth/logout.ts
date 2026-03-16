import { factory } from "@/factory"
import { deleteCredentials, loadCredentials } from "@/lib/credentials"

export const help = "Usage: prompton logout"

export default factory.createHandlers(async (c) => {
  const credentials = loadCredentials()

  if (!credentials) {
    return c.json({ message: "Not logged in" })
  }

  deleteCredentials()
  return c.json({ message: "Logged out" })
})
