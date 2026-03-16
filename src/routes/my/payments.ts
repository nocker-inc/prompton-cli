import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"
import { withPageURLs } from "@/lib/page-url"

const schema = z.object({
  limit: z.coerce.number().default(20),
  offset: z.coerce.number().default(0),
  help: z.string().optional(),
})

export const help = `Usage: prompton my payments [options]

Options:
  -l, --limit        Number of results (default: 20)
  -o, --offset       Offset for pagination (default: 0)`

const Query = graphql(`
  query ViewerPromptonPayments($offset: Int!, $limit: Int!) {
    viewer {
      promptonPayments(offset: $offset, limit: $limit) {
        id
        createdAt
      }
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
  })

  return c.json(withPageURLs("payment", data.viewer?.promptonPayments ?? []))
})
