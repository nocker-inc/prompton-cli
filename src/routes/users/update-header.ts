import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  imageFileId: z.string(),
})

export const help = "Usage: prompton users update-header --imageFileId <fileId>"

const Mutation = graphql(`
  mutation UpdatePromptonUserHeaderImage($input: UpdatePromptonUserHeaderImageInput!) {
    updatePromptonUserHeaderImage(input: $input) {
      id
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.updatePromptonUserHeaderImage)
})
