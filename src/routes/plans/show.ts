import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"
import { NotFoundException } from "@/lib/errors"
import { withPageURL } from "@/lib/page-url"

const schema = z.object({
  help: z.string().optional(),
})

export const help = "Usage: prompton plans <id>"

const Query = graphql(`
  query PromptonPlan($id: ID!) {
    promptonPlan(id: $id) {
      id
      name
      description
      unitPrice
      minimumQuantity
      maximumQuantity
      category
      featureCommercialUse
      featureCopyrightFree
      featureFanFiction
      featurePrivate
    }
  }
`)

export default factory.createHandlers(zValidator("query", schema), async (c) => {
  const q = c.req.valid("query")

  if (q.help) {
    return c.text(help)
  }

  const id = c.req.param("plan")
  const data = await execute(Query, { id: id ?? "" })

  if (!data.promptonPlan) {
    throw new NotFoundException(`Plan not found: ${id}`)
  }

  return c.json(withPageURL("plan", data.promptonPlan))
})
