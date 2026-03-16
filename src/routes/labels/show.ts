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

export const help = "Usage: prompton labels <id>"

const Query = graphql(`
  query PromptonLabel($id: ID!) {
    promptonLabel(id: $id) {
      id
      name
    }
  }
`)

export default factory.createHandlers(zValidator("query", schema), async (c) => {
  const q = c.req.valid("query")

  if (q.help) {
    return c.text(help)
  }

  const id = c.req.param("label")
  const data = await execute(Query, { id: id ?? "" })

  if (!data.promptonLabel) {
    throw new NotFoundException(`Label not found: ${id}`)
  }

  return c.json(withPageURL("label", data.promptonLabel))
})
