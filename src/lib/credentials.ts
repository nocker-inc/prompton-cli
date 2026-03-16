import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { firebaseConfig } from "@/lib/config"

type Credentials = {
  refreshToken: string
  email: string
  uid: string
}

const CONFIG_DIR = join(homedir(), ".config", "prompton")
const CREDENTIALS_PATH = join(CONFIG_DIR, "credentials.json")

export function loadCredentials(): Credentials | null {
  if (!existsSync(CREDENTIALS_PATH)) {
    return null
  }
  const raw = readFileSync(CREDENTIALS_PATH, "utf-8")
  return JSON.parse(raw) as Credentials
}

export function saveCredentials(credentials: Credentials) {
  mkdirSync(CONFIG_DIR, { recursive: true })
  writeFileSync(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2))
}

export function deleteCredentials() {
  if (existsSync(CREDENTIALS_PATH)) {
    rmSync(CREDENTIALS_PATH)
  }
}

export async function refreshIdToken(refreshToken: string): Promise<string> {
  const res = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    },
  )

  if (!res.ok) {
    deleteCredentials()
    throw new Error("Session expired. Please run: prompton login")
  }

  const data = (await res.json()) as { id_token: string }
  return data.id_token
}
