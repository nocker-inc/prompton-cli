import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"
import { NotFoundException } from "@/lib/errors"

const schema = z.object({
  limit: z.coerce.number().default(20),
  offset: z.coerce.number().default(0),
  help: z.string().optional(),
})

export const help = `Usage: prompton users <id> works [options]

Options:
  -l, --limit        Number of results (default: 20)
  -o, --offset       Offset for pagination (default: 0)`

const Query = graphql(`
  query PromptonUserWorks($id: ID!, $offset: Int!, $limit: Int!) {
    promptonUser(id: $id) {
      id
      name
      login
      works(offset: $offset, limit: $limit) {
        id
        title
        likesCount
        viewsCount
      }
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

    const data = await execute(Query, {
      id: id ?? "",
      offset: q.offset,
      limit: q.limit,
    })

    if (!data.promptonUser) {
      throw new NotFoundException(`User not found: ${id}`)
    }

    return c.json(data.promptonUser)
  },
)
