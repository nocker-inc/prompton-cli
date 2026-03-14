import type { TadaDocumentNode } from "gql.tada"
import { print } from "graphql"

const ENDPOINT = "https://graphql.prompton.io"

export async function execute<Data, Variables>(
  query: TadaDocumentNode<Data, Variables>,
  ...[variables]: Variables extends Record<string, never> ? [] : [Variables]
): Promise<Data> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: print(query), variables }),
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }

  const json = (await res.json()) as {
    data?: Data
    errors?: Array<{ message: string }>
  }

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("\n"))
  }

  if (!json.data) {
    throw new Error("No data returned")
  }

  return json.data
}
