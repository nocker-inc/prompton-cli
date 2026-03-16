import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  name: z.string(),
  description: z.string(),
  isPublic: z.boolean().default(true),
})

export const help = "Usage: prompton folders create --name <name> --description <desc>"

const Mutation = graphql(`
  mutation CreatePromptonFolder($input: CreatePromptonFolderInput!) {
    createPromptonFolder(input: $input) {
      id
      name
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.createPromptonFolder)
})
