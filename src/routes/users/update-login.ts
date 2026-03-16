import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  login: z.string(),
})

export const help = "Usage: prompton users update-login --login <login>"

const Mutation = graphql(`
  mutation UpdatePromptonUserLogin($input: UpdatePromptonUserLoginInput!) {
    updatePromptonUserLogin(input: $input) {
      id
      login
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.updatePromptonUserLogin)
})
