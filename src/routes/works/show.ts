import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"
import { NotFoundException } from "@/lib/errors"

const schema = z.object({
  help: z.string().optional(),
})

export const help = "Usage: prompton works <id>"

const Query = graphql(`
  query PromptonWork($id: ID!) {
    promptonWork(id: $id) {
      id
      title
      body
      createdAt
      updatedAt
      likesCount
      viewsCount
      isPublic
      isNSFW
      price
      sampleImageURL
      user {
        id
        name
        login
      }
      tags {
        id
        name
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

    const id = c.req.param("work")
    const data = await execute(Query, { id: id ?? "" })

    if (!data.promptonWork) {
      throw new NotFoundException(`Work not found: ${id}`)
    }

    return c.json(data.promptonWork)
  },
)
