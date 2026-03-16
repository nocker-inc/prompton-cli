import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  planId: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  unitPrice: z.number(),
  minimumQuantity: z.number(),
  maximumQuantity: z.number(),
  message: z.string(),
  objectSlugs: z.array(z.string()),
  styleSlugs: z.array(z.string()),
  featureCommercialUse: z.boolean(),
  featureCopyrightFree: z.boolean(),
  featureFanFiction: z.boolean(),
  featurePrivate: z.boolean(),
  imageFileId: z.string().optional(),
})

export const help = "Usage: prompton plans <id> update (JSON body required)"

const Mutation = graphql(`
  mutation UpdatePromptonPlan($input: UpdatePromptonPlanInput!) {
    updatePromptonPlan(input: $input) {
      id
      name
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.updatePromptonPlan)
})
