import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({ requestId: z.string() })
export const help = "Usage: prompton requests <id> cancel"

const Mutation = graphql(`
  mutation CancelPromptonRequest($input: CancelPromptonRequestInput!) {
    cancelPromptonRequest(input: $input) {
      id
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.cancelPromptonRequest)
})
