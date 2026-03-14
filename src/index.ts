import { factory } from "@/factory"
import { onError } from "@/on-error"
import { print } from "@/printer"
import { toRequest } from "@/router"
import { notFound } from "@/routes/not-found"
import listUsers from "@/routes/users/index"
import showUser from "@/routes/users/show"
import userWorks from "@/routes/users/works"
import listWorks from "@/routes/works/index"
import showWork from "@/routes/works/show"
import pkg from "../package.json" with { type: "json" }

const app = factory.createApp()

app.onError(onError)
app.notFound(notFound)

app.get("/works", ...listWorks)
app.get("/works/:work", ...showWork)
app.get("/users", ...listUsers)
app.get("/users/:user", ...showUser)
app.get("/users/:user/works", ...userWorks)

const HELP = `prompton - CLI for Prompton API

Usage:
  prompton <resource> [id] [sub-resource] [options]
  prompton <command> --help               Show help for a command

Examples:
  prompton works
  prompton works <id>
  prompton works --search "猫"
  prompton users
  prompton users <id>
  prompton users <id> works`

const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(HELP)
  process.exit()
}

const { path, url, global } = toRequest(args)

if (global.version) {
  console.log(pkg.version)
  process.exit()
}

if (global.help) {
  if (path === "/") {
    console.log(HELP)
    process.exit()
  }
  const helpUrl = `${url + (url.includes("?") ? "&" : "?")}help=true`
  const res = await app.request(helpUrl)
  if (res.ok) {
    console.log(await res.text())
  } else {
    console.log(HELP)
  }
  process.exit()
}

const res = await app.request(url)

if (!res.ok) {
  const body = (await res.json()) as { error: string }
  console.error(global.text ? body.error : JSON.stringify(body))
  process.exit(1)
}

const contentType = res.headers.get("content-type") ?? ""

if (contentType.includes("text/plain")) {
  console.log(await res.text())
} else {
  const data = await res.json()
  if (global.text) {
    print(path, data)
  } else {
    console.log(JSON.stringify(data, null, 2))
  }
}
