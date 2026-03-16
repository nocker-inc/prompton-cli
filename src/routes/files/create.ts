import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  fileId: z.string(),
  fileType: z.string(),
  path: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const help = "Usage: prompton files create --fileId <id> --fileType <type> --path <path>"

const Mutation = graphql(`
  mutation CreatePromptonFile($input: CreatePromptonFileInput!) {
    createPromptonFile(input: $input) {
      id
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.createPromptonFile)
})
