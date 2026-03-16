const BASE = "https://prompton.io"

const RESOURCE_PATHS: Record<string, string> = {
  work: "works",
  user: "users",
  plan: "plans",
  folder: "folders",
  tag: "tags",
  label: "labels",
  request: "requests",
  message: "messages",
}

type WithId = { id: string }

export function withPageURL<T extends WithId>(resource: string, item: T): T & { pageURL: string } {
  const path = RESOURCE_PATHS[resource] ?? resource
  return { ...item, pageURL: `${BASE}/${path}/${item.id}` }
}

export function withPageURLs<T extends WithId>(
  resource: string,
  items: T[],
): Array<T & { pageURL: string }> {
  return items.map((item) => withPageURL(resource, item))
}
