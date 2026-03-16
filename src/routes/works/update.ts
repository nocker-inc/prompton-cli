import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  workId: z.string(),
  title: z.string().optional(),
  body: z.string().optional(),
})

export const help = "Usage: prompton works <id> update --title <title> --body <body>"

const Mutation = graphql(`
  mutation UpdatePromptonWork($input: UpdatePromptonWorkInput!) {
    updatePromptonWork(input: $input) {
      id
      title
      body
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.updatePromptonWork)
})
