export const firebaseConfig = {
  apiKey: process.env.PROMPTON_FIREBASE_API_KEY ?? "AIzaSyDsyd0xsmWxntAkpSPRmz3aqosqyBHP0cE",
  projectId: process.env.PROMPTON_FIREBASE_PROJECT_ID ?? "xfme7ty449msx2dggkjx",
  authDomain: process.env.PROMPTON_FIREBASE_AUTH_DOMAIN ?? "auth.prompton.io",
  googleClientId:
    process.env.PROMPTON_GOOGLE_CLIENT_ID ??
    "906232062731-k461rffd1rquif2tta8kdk73h4blshj6.apps.googleusercontent.com",
  googleClientSecret:
    process.env.PROMPTON_GOOGLE_CLIENT_SECRET ?? "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",
}
