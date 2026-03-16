import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  userId: z.string(),
})

export const help = "Usage: prompton users block --userId <userId>"

const Mutation = graphql(`
  mutation BlockPromptonUser($input: BlockPromptonUserInput!) {
    blockPromptonUser(input: $input) {
      id
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.blockPromptonUser)
})
