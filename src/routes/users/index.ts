import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  limit: z.coerce.number().default(20),
  offset: z.coerce.number().default(0),
  search: z.string().optional(),
  help: z.string().optional(),
})

export const help = `Usage: prompton users [options]

Options:
  -l, --limit        Number of results (default: 20)
  -o, --offset       Offset for pagination (default: 0)
  -s, --search       Search query`

const Query = graphql(`
  query PromptonUsers($offset: Int!, $limit: Int!, $search: String) {
    promptonUsers(offset: $offset, limit: $limit, where: { search: $search }) {
      id
      login
      name
      worksCount
      isRequestable
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

    const data = await execute(Query, {
      offset: q.offset,
      limit: q.limit,
      search: q.search ?? null,
    })

    return c.json(data.promptonUsers)
  },
)
