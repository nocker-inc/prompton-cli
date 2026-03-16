import { zValidator } from "@hono/zod-validator"
import { graphql } from "gql.tada"
import { z } from "zod"
import { execute } from "@/client"
import { factory } from "@/factory"

const schema = z.object({
  name: z.string(),
  biography: z.string().optional(),
  twitterUsername: z.string().optional(),
  instagramUsername: z.string().optional(),
  pixivUsername: z.string().optional(),
  githubUsername: z.string().optional(),
  tumblrUsername: z.string().optional(),
  deviantartUsername: z.string().optional(),
})

export const help = `Usage: prompton users update --name "name" [options]

Options:
  --name             Display name (required)
  --biography        Bio text
  --twitterUsername   Twitter username
  --instagramUsername Instagram username
  --pixivUsername     Pixiv username
  --githubUsername    GitHub username`

const Mutation = graphql(`
  mutation UpdatePromptonUserProfile($input: UpdatePromptonUserProfileInput!) {
    updatePromptonUserProfile(input: $input) {
      id
      name
      biography
    }
  }
`)

export default factory.createHandlers(zValidator("json", schema), async (c) => {
  const input = c.req.valid("json")
  const data = await execute(Mutation, { input })
  return c.json(data.updatePromptonUserProfile)
})
