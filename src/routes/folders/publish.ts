import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({ folderId: z.string() })
export const help = "Usage: prompton folders <id> publish"

const Mutation = graphql(`
  mutation MarkPromptonFolderAsPublic($input: MarkPromptonFolderAsPublicInput!) {
    markPromptonFolderAsPublic(input: $input) {
      id
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.markPromptonFolderAsPublic)
})
