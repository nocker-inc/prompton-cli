import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"
import { NotFoundException } from "@/lib/errors"
import { withPageURL } from "@/lib/page-url"

const schema = z.object({
  help: z.string().optional(),
})

export const help = "Usage: prompton requests <id>"

const Query = graphql(`
  query PromptonRequest($id: ID!) {
    promptonRequest(id: $id) {
      id
      title
      note
      status
      createdAt
      updatedAt
      sender {
        id
        name
        login
      }
      recipient {
        id
        name
        login
      }
      plan {
        id
        name
        unitPrice
      }
    }
  }
`)

export default factory.createHandlers(zValidator("query", schema), async (c) => {
  const q = c.req.valid("query")

  if (q.help) {
    return c.text(help)
  }

  const id = c.req.param("request")
  const data = await execute(Query, { id: id ?? "" })

  if (!data.promptonRequest) {
    throw new NotFoundException(`Request not found: ${id}`)
  }

  return c.json(withPageURL("request", data.promptonRequest))
})
