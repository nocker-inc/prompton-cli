import { factory } from "@/factory"
import { onError } from "@/on-error"
import { print } from "@/printer"
import { toRequest } from "@/router"
import { notFound } from "@/routes/not-found"
import login from "@/routes/auth/login"
import logout from "@/routes/auth/logout"
import whoami from "@/routes/auth/whoami"
import createFile from "@/routes/files/create"
import listFolders from "@/routes/folders/index"
import showFolder from "@/routes/folders/show"
import createFolder from "@/routes/folders/create"
import updateFolder from "@/routes/folders/update"
import deleteFolder from "@/routes/folders/delete"
import publishFolder from "@/routes/folders/publish"
import unpublishFolder from "@/routes/folders/unpublish"
import listLabels from "@/routes/labels/index"
import showLabel from "@/routes/labels/show"
import showMessageThread from "@/routes/messages/show"
import sendMessage from "@/routes/messages/send"
import sendRequestMessage from "@/routes/messages/send-request"
import listPlans from "@/routes/plans/index"
import showPlan from "@/routes/plans/show"
import createPlan from "@/routes/plans/create"
import updatePlan from "@/routes/plans/update"
import deletePlan from "@/routes/plans/delete"
import publishPlan from "@/routes/plans/publish"
import unpublishPlan from "@/routes/plans/unpublish"
import showRequest from "@/routes/requests/show"
import createPlanRequest from "@/routes/requests/create-plan"
import createCoffeeRequest from "@/routes/requests/create-coffee"
import acceptRequest from "@/routes/requests/accept"
import rejectRequest from "@/routes/requests/reject"
import cancelRequest from "@/routes/requests/cancel"
import closeRequest from "@/routes/requests/close"
import listTags from "@/routes/tags/index"
import showTag from "@/routes/tags/show"
import listUsers from "@/routes/users/index"
import showUser from "@/routes/users/show"
import userWorks from "@/routes/users/works"
import updateUser from "@/routes/users/update"
import updateUserLogin from "@/routes/users/update-login"
import updateUserAvatar from "@/routes/users/update-avatar"
import updateUserHeader from "@/routes/users/update-header"
import followUser from "@/routes/users/follow"
import unfollowUser from "@/routes/users/unfollow"
import blockUser from "@/routes/users/block"
import myFollowees from "@/routes/my/followees"
import myLikes from "@/routes/my/likes"
import myMessages from "@/routes/my/messages"
import myPayments from "@/routes/my/payments"
import myRequests from "@/routes/my/requests"
import myUser from "@/routes/my/user"
import myWorks from "@/routes/my/works"
import listWorks from "@/routes/works/index"
import showWork from "@/routes/works/show"
import createWork from "@/routes/works/create"
import updateWork from "@/routes/works/update"
import deleteWork from "@/routes/works/delete"
import publishWork from "@/routes/works/publish"
import unpublishWork from "@/routes/works/unpublish"
import likeWork from "@/routes/works/like"
import unlikeWork from "@/routes/works/unlike"
import pkg from "../package.json" with { type: "json" }

const app = factory.createApp()

app.onError(onError)
app.notFound(notFound)

// Auth
app.post("/login", ...login)
app.post("/logout", ...logout)
app.get("/whoami", ...whoami)

// My (viewer)
app.get("/my/user", ...myUser)
app.get("/my/works", ...myWorks)
app.get("/my/likes", ...myLikes)
app.get("/my/requests", ...myRequests)
app.get("/my/messages", ...myMessages)
app.get("/my/followees", ...myFollowees)
app.get("/my/payments", ...myPayments)

// Works
app.get("/works", ...listWorks)
app.get("/works/:work", ...showWork)
app.post("/works/create", ...createWork)
app.post("/works/update", ...updateWork)
app.post("/works/delete", ...deleteWork)
app.post("/works/publish", ...publishWork)
app.post("/works/unpublish", ...unpublishWork)
app.post("/works/like", ...likeWork)
app.post("/works/unlike", ...unlikeWork)

// Users
app.get("/users", ...listUsers)
app.get("/users/:user", ...showUser)
app.get("/users/:user/works", ...userWorks)
app.post("/users/update", ...updateUser)
app.post("/users/update-login", ...updateUserLogin)
app.post("/users/update-avatar", ...updateUserAvatar)
app.post("/users/update-header", ...updateUserHeader)
app.post("/users/follow", ...followUser)
app.post("/users/unfollow", ...unfollowUser)
app.post("/users/block", ...blockUser)

// Plans
app.get("/plans", ...listPlans)
app.get("/plans/:plan", ...showPlan)
app.post("/plans/create", ...createPlan)
app.post("/plans/update", ...updatePlan)
app.post("/plans/delete", ...deletePlan)
app.post("/plans/publish", ...publishPlan)
app.post("/plans/unpublish", ...unpublishPlan)

// Folders
app.get("/folders", ...listFolders)
app.get("/folders/:folder", ...showFolder)
app.post("/folders/create", ...createFolder)
app.post("/folders/update", ...updateFolder)
app.post("/folders/delete", ...deleteFolder)
app.post("/folders/publish", ...publishFolder)
app.post("/folders/unpublish", ...unpublishFolder)

// Tags + Labels
app.get("/tags", ...listTags)
app.get("/tags/:tag", ...showTag)
app.get("/labels", ...listLabels)
app.get("/labels/:label", ...showLabel)

// Requests
app.get("/requests/:request", ...showRequest)
app.post("/requests/create-plan", ...createPlanRequest)
app.post("/requests/create-coffee", ...createCoffeeRequest)
app.post("/requests/accept", ...acceptRequest)
app.post("/requests/reject", ...rejectRequest)
app.post("/requests/cancel", ...cancelRequest)
app.post("/requests/close", ...closeRequest)

// Messages
app.get("/messages/:thread", ...showMessageThread)
app.post("/messages/send", ...sendMessage)
app.post("/messages/send-request", ...sendRequestMessage)

// Files
app.post("/files/create", ...createFile)

const HELP = `prompton - CLI for Prompton API

Usage:
  prompton <resource> [id] [sub-resource] [options]
  prompton <command> --help               Show help for a command

Auth:
  prompton login                        Login with Google
  prompton logout                       Logout
  prompton whoami                       Show current user

My (requires login):
  prompton my user                      My profile
  prompton my works                     My works
  prompton my likes                     My liked works
  prompton my requests                  My requests
  prompton my messages                  My message threads
  prompton my followees                 My followees
  prompton my payments                  My payments

Resources:
  works, users, plans, folders, tags, labels, requests, messages, files

Examples:
  prompton works                        List works
  prompton works <id>                   Show work detail
  prompton works create                 Create work (POST)
  prompton users                        List users
  prompton users <id>                   Show user detail
  prompton users <id> works             List user's works
  prompton plans                        List plans
  prompton requests <id>                Show request detail
  prompton messages <threadId>          Show message thread`

const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(HELP)
  process.exit()
}

const { path, url, method, global } = toRequest(args)

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

const requestInit: RequestInit = { method }
if (method === "POST") {
  const params = new URL(url).searchParams
  const body: Record<string, string> = {}
  for (const [key, value] of params) {
    body[key] = value
  }
  requestInit.headers = { "Content-Type": "application/json" }
  requestInit.body = JSON.stringify(body)
}
const res = await app.request(method === "POST" ? url.split("?")[0] : url, requestInit)

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
