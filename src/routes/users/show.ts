import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"
import { NotFoundException } from "@/lib/errors"

const schema = z.object({
  help: z.string().optional(),
})

export const help = "Usage: prompton users <id>"

const Query = graphql(`
  query PromptonUser($id: ID!) {
    promptonUser(id: $id) {
      id
      login
      name
      biography
      worksCount
      followersCount
      followeesCount
      isRequestable
      twitterURL
      instagramURL
      siteURL
    }
  }
`)

export default factory.createHandlers(
  zValidator("query", schema),
  async (c) => {
    const q = c.req.valid("query")

    if (q.help) {
      return c.text(help)
    }

    const id = c.req.param("user")

    const data = await execute(Query, { id: id ?? "" })

    if (!data.promptonUser) {
      throw new NotFoundException(`User not found: ${id}`)
    }

    return c.json(data.promptonUser)
  },
)
