import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  planId: z.string(),
  recipientId: z.string(),
  quantity: z.number(),
  note: z.string(),
  fileIds: z.array(z.string()).default([]),
})

export const help = "Usage: prompton requests create-plan (JSON body required)"

const Mutation = graphql(`
  mutation CreatePromptonPlanRequest($input: CreatePromptonPlanRequestInput!) {
    createPromptonPlanRequest(input: $input) {
      id
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.createPromptonPlanRequest)
})
