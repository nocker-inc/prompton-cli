import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"
import { withPageURLs } from "@/lib/page-url"

const schema = z.object({
  limit: z.coerce.number().default(20),
  offset: z.coerce.number().default(0),
  search: z.string().optional(),
  help: z.string().optional(),
})

export const help = `Usage: prompton plans [options]

Options:
  -l, --limit        Number of results (default: 20)
  -o, --offset       Offset for pagination (default: 0)
  -s, --search       Search query`

const Query = graphql(`
  query PromptonPlans($offset: Int!, $limit: Int!, $search: String) {
    promptonPlans(offset: $offset, limit: $limit, where: { search: $search }) {
      id
      name
      description
      unitPrice
      minimumQuantity
      maximumQuantity
      category
    }
  }
`)

export default factory.createHandlers(zValidator("query", schema), async (c) => {
  const q = c.req.valid("query")

  if (q.help) {
    return c.text(help)
  }

  const data = await execute(Query, {
    offset: q.offset,
    limit: q.limit,
    search: q.search ?? null,
  })

  return c.json(withPageURLs("plan", data.promptonPlans))
})
