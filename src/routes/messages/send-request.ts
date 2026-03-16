import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  recipientId: z.string(),
  requestId: z.string(),
  text: z.string(),
})

export const help = "Usage: prompton messages send-request --requestId <id> --text <text>"

const Mutation = graphql(`
  mutation SendPromptonRequestMessage($input: SendPromptonRequestMessageInput!) {
    sendPromptonRequestMessage(input: $input) {
      id
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.sendPromptonRequestMessage)
})
