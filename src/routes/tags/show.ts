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

export const help = "Usage: prompton tags <id>"

const Query = graphql(`
  query PromptonTag($id: ID!) {
    promptonTag(id: $id) {
      id
      name
      slug
    }
  }
`)

export default factory.createHandlers(zValidator("query", schema), async (c) => {
  const q = c.req.valid("query")

  if (q.help) {
    return c.text(help)
  }

  const id = c.req.param("tag")
  const data = await execute(Query, { id: id ?? "" })

  if (!data.promptonTag) {
    throw new NotFoundException(`Tag not found: ${id}`)
  }

  return c.json(withPageURL("tag", data.promptonTag))
})
