type Work = {
  id: string
  title: string | null
  likesCount: number
  viewsCount: number
  user: { login: string; name: string | null }
}

type WorkDetail = Work & {
  body: string | null
  isPublic: boolean
  isNSFW: boolean
  price: number
  tags: Array<{ name: string }>
}

type User = {
  id: string
  login: string
  name: string
  worksCount: number
  isRequestable: boolean
}

type UserDetail = User & {
  biography: string
  followersCount: number | null
  followeesCount: number | null
  twitterURL: string | null
  instagramURL: string | null
  siteURL: string | null
}

type UserWithWorks = {
  name: string
  login: string
  works: Array<{
    id: string
    title: string | null
    likesCount: number
    viewsCount: number
  }>
}

function printWorkList(works: Work[]) {
  if (works.length === 0) {
    console.log("No works found.")
    return
  }
  for (const w of works) {
    const title = w.title ?? "(untitled)"
    console.log(`${w.id}\t${title}\t@${w.user.login}\t♥${w.likesCount}\t👁${w.viewsCount}`)
  }
}

function printWork(w: WorkDetail) {
  console.log(`ID:      ${w.id}`)
  console.log(`Title:   ${w.title ?? "(untitled)"}`)
  console.log(`Author:  ${w.user.name ?? w.user.login} (@${w.user.login})`)
  console.log(`Likes:   ${w.likesCount}`)
  console.log(`Views:   ${w.viewsCount}`)
  console.log(`Public:  ${w.isPublic}`)
  console.log(`NSFW:    ${w.isNSFW}`)
  console.log(`Price:   ${w.price}`)
  if (w.tags.length > 0) {
    console.log(`Tags:    ${w.tags.map((t) => t.name).join(", ")}`)
  }
  if (w.body) {
    console.log(`\n${w.body}`)
  }
}

function printUserList(users: User[]) {
  if (users.length === 0) {
    console.log("No users found.")
    return
  }
  for (const u of users) {
    const req = u.isRequestable ? "✓" : "-"
    console.log(`${u.id}\t@${u.login}\t${u.name}\t${u.worksCount} works\t${req}`)
  }
}

function printUser(u: UserDetail) {
  console.log(`ID:        ${u.id}`)
  console.log(`Login:     @${u.login}`)
  console.log(`Name:      ${u.name}`)
  console.log(`Works:     ${u.worksCount}`)
  console.log(`Followers: ${u.followersCount ?? 0}`)
  console.log(`Following: ${u.followeesCount ?? 0}`)
  console.log(`Requests:  ${u.isRequestable ? "open" : "closed"}`)
  if (u.biography) {
    console.log(`\n${u.biography}`)
  }
  const links = [u.twitterURL, u.instagramURL, u.siteURL].filter(Boolean)
  if (links.length > 0) {
    console.log(`\nLinks:`)
    for (const link of links) {
      console.log(`  ${link}`)
    }
  }
}

function printUserWorks(data: UserWithWorks) {
  if (data.works.length === 0) {
    console.log("No works found.")
    return
  }
  console.log(`Works by ${data.name} (@${data.login}):`)
  for (const w of data.works) {
    const title = w.title ?? "(untitled)"
    console.log(`${w.id}\t${title}\t♥${w.likesCount}\t👁${w.viewsCount}`)
  }
}

const matchers: Array<{ pattern: RegExp; fn: (data: unknown) => void }> = [
  { pattern: /^\/works\/[^/]+$/, fn: (d) => printWork(d as WorkDetail) },
  { pattern: /^\/works$/, fn: (d) => printWorkList(d as Work[]) },
  {
    pattern: /^\/users\/[^/]+\/works$/,
    fn: (d) => printUserWorks(d as UserWithWorks),
  },
  { pattern: /^\/users\/[^/]+$/, fn: (d) => printUser(d as UserDetail) },
  { pattern: /^\/users$/, fn: (d) => printUserList(d as User[]) },
]

export function print(path: string, data: unknown) {
  for (const { pattern, fn } of matchers) {
    if (pattern.test(path)) {
      fn(data)
      return
    }
  }
  console.log(JSON.stringify(data, null, 2))
}
