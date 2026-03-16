import { createServer } from "node:http"
import { execFile } from "node:child_process"
import { factory } from "@/factory"
import { firebaseConfig } from "@/lib/config"
import { saveCredentials } from "@/lib/credentials"

async function exchangeCodeForGoogleToken(code: string, redirectUri: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: firebaseConfig.googleClientId,
      client_secret: firebaseConfig.googleClientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Google token exchange failed: ${err}`)
  }

  return (await res.json()) as { id_token: string }
}

async function signInWithGoogle(googleIdToken: string) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postBody: `id_token=${googleIdToken}&providerId=google.com`,
        requestUri: "http://localhost",
        returnSecureToken: true,
      }),
    },
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Firebase sign-in failed: ${err}`)
  }

  return (await res.json()) as {
    idToken: string
    refreshToken: string
    email: string
    localId: string
  }
}

function openBrowser(url: string) {
  const cmd =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open"
  execFile(cmd, [url], () => {})
}

function waitForCallback(port: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? "", `http://localhost:${port}`)

      if (url.pathname !== "/callback") {
        res.writeHead(404)
        res.end()
        return
      }

      const code = url.searchParams.get("code")
      const error = url.searchParams.get("error")

      if (error) {
        res.writeHead(200, { "Content-Type": "text/html" })
        res.end("<h1>Login failed</h1><p>You can close this tab.</p>")
        server.close()
        reject(new Error(`OAuth error: ${error}`))
        return
      }

      if (!code) {
        res.writeHead(400)
        res.end("Missing code")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end("<h1>Login successful!</h1><p>You can close this tab.</p>")
      server.close()
      resolve(code)
    })

    server.listen(port, () => {})
    server.on("error", reject)
  })
}

export const help = "Usage: prompton login"

export default factory.createHandlers(async (c) => {
  const port = 19836
  const redirectUri = `http://localhost:${port}/callback`

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  authUrl.searchParams.set("client_id", firebaseConfig.googleClientId)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("scope", "openid email profile")
  authUrl.searchParams.set("access_type", "offline")
  authUrl.searchParams.set("prompt", "consent")

  const codePromise = waitForCallback(port)

  openBrowser(authUrl.toString())

  const code = await codePromise
  const googleToken = await exchangeCodeForGoogleToken(code, redirectUri)
  const firebaseToken = await signInWithGoogle(googleToken.id_token)

  saveCredentials({
    refreshToken: firebaseToken.refreshToken,
    email: firebaseToken.email,
    uid: firebaseToken.localId,
  })

  return c.json({ message: `Logged in as ${firebaseToken.email}` })
})
