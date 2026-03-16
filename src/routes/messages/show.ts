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

export const help = "Usage: prompton messages <threadId>"

const Query = graphql(`
  query PromptonMessageThread($threadId: ID!) {
    promptonMessageThread(threadId: $threadId) {
      id
      createdAt
      updatedAt
      messages {
        id
        text
        createdAt
        user {
          id
          name
          login
        }
      }
    }
  }
`)

export default factory.createHandlers(zValidator("query", schema), async (c) => {
  const q = c.req.valid("query")

  if (q.help) {
    return c.text(help)
  }

  const threadId = c.req.param("thread")
  const data = await execute(Query, { threadId: threadId ?? "" })

  if (!data.promptonMessageThread) {
    throw new NotFoundException(`Message thread not found: ${threadId}`)
  }

  return c.json(withPageURL("message", data.promptonMessageThread))
})
