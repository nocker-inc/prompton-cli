const SHORT_FLAGS: Record<string, string> = {
  l: "limit",
  o: "offset",
  s: "search",
  h: "help",
  t: "text",
  v: "version",
}

const GLOBAL_FLAGS = new Set(["text", "help", "version"])
const POST_COMMANDS = new Set([
  "login",
  "logout",
  "create",
  "update",
  "update-login",
  "update-avatar",
  "update-header",
  "delete",
  "publish",
  "unpublish",
  "like",
  "unlike",
  "follow",
  "unfollow",
  "block",
  "accept",
  "reject",
  "cancel",
  "close",
  "send",
  "send-request",
  "create-plan",
  "create-coffee",
])

export function toRequest(args: string[]) {
  const segments: string[] = []
  const params = new URLSearchParams()

  let i = 0
  while (i < args.length) {
    const arg = args[i]
    if (arg.startsWith("--")) {
      const key = arg.slice(2)
      const next = args[i + 1]
      if (next && !next.startsWith("-")) {
        params.set(key, next)
        i += 2
      } else {
        params.set(key, "true")
        i++
      }
    } else if (arg.startsWith("-") && arg.length === 2) {
      const long = SHORT_FLAGS[arg[1]]
      if (long) {
        const next = args[i + 1]
        if (next && !next.startsWith("-")) {
          params.set(long, next)
          i += 2
        } else {
          params.set(long, "true")
          i++
        }
      } else {
        i++
      }
    } else {
      segments.push(arg)
      i++
    }
  }

  const global: Record<string, boolean> = {}
  for (const flag of GLOBAL_FLAGS) {
    if (params.has(flag)) {
      global[flag] = true
      params.delete(flag)
    }
  }

  const path = `/${segments.join("/")}`
  const query = params.size > 0 ? `?${params}` : ""
  const lastSegment = segments[segments.length - 1]
  const method = POST_COMMANDS.has(lastSegment) || POST_COMMANDS.has(segments[0]) ? "POST" : "GET"
  return { path, url: `http://localhost${path}${query}`, method, global }
}
