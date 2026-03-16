import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  unitPrice: z.number(),
  minimumQuantity: z.number(),
  maximumQuantity: z.number(),
  message: z.string(),
  objectSlugs: z.array(z.string()),
  styleSlugs: z.array(z.string()),
  featureCommercialUse: z.boolean().default(false),
  featureCopyrightFree: z.boolean().default(false),
  featureFanFiction: z.boolean().default(false),
  featurePrivate: z.boolean().default(false),
  imageFileId: z.string().optional(),
})

export const help = "Usage: prompton plans create (JSON body required)"

const Mutation = graphql(`
  mutation CreatePromptonPlan($input: CreatePromptonPlanInput!) {
    createPromptonPlan(input: $input) {
      id
      name
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.createPromptonPlan)
})
