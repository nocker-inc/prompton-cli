import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  folderId: z.string().optional(),
  tagNameJA: z.string().optional(),
})

export const help = `Usage: prompton works create

Options:
  --fileId      File ID (required)
  --fileName    File name (required)
  --fileType    File type (required)
  --folderId    Folder ID
  --tagNameJA   Tag name in Japanese`

const Mutation = graphql(`
  mutation CreatePromptonWork($input: CreatePromptonWorkInput!) {
    createPromptonWork(input: $input) {
      id
      title
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.createPromptonWork)
})
