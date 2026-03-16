import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"
import { withPageURL } from "@/lib/page-url"

const schema = z.object({
  help: z.string().optional(),
})

export const help = "Usage: prompton my user"

const Query = graphql(`
  query ViewerPromptonUser {
    viewer {
      promptonUser {
        id
        login
        name
        biography
        worksCount
        followersCount
        followeesCount
        isRequestable
        twitterURL
        instagramURL
        siteURL
      }
    }
  }
`)

export default factory.createHandlers(zValidator("query", schema), async (c) => {
  const q = c.req.valid("query")

  if (q.help) {
    return c.text(help)
  }

  const data = await execute(Query)

  const user = data.viewer?.promptonUser ?? null
  return c.json(user ? withPageURL("user", user) : null)
})
