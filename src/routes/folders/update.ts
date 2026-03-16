import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  folderId: z.string(),
  name: z.string(),
  description: z.string(),
  imageFileId: z.string().optional(),
})

export const help = "Usage: prompton folders <id> update"

const Mutation = graphql(`
  mutation UpdatePromptonFolder($input: UpdatePromptonFolderInput!) {
    updatePromptonFolder(input: $input) {
      id
      name
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.updatePromptonFolder)
})
