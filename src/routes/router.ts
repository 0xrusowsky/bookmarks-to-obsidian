

import { TwitterApi } from "twitter-api-v2"
import { getBookmarks, processBookmarks } from "../utils"
import { Application } from "express"
import session from "express-session"
import dotenv from "dotenv"


dotenv.config()
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CALLBACK_URL = process.env.CALLBACK_URL
const vaultPath = process.env.VAULT_PATH
const filePath = vaultPath + process.env.UNPROCESSED_NAME

let sessionState: string
let sessionCodeVerifier: string

export const register = (app: Application) => {
    app.use(session({ secret: 'a lil project to synch my bookmarks' }))

    // define a route handler for the default home page
    app.get("/", (request, response) => {
        response.render("index")
    })

    app.get('/auth', (request, response) => {
        // Obtain access token
        const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET })

        const { url, codeVerifier, state } = client.generateOAuth2AuthLink(CALLBACK_URL, { scope: ['tweet.read', 'users.read', `bookmark.read`] })

        sessionState = state
        sessionCodeVerifier = codeVerifier

        return response.redirect(url)
    })

    app.get('/oauth/callback', (request, response) => {
        const state = request.query.state
        const code = String(request.query.code)
        const codeVerifier = sessionCodeVerifier

        if (!sessionCodeVerifier || !state || !sessionState || !code) {
            return response.status(400).send('You denied the app or your session expired!')
        }
        if (state !== sessionState) {
            return response.status(400).send('Stored tokens didnt match!')
        }

        // Obtain access token
        const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET })

        client.loginWithOAuth2({ code, codeVerifier, redirectUri: CALLBACK_URL })
            .then(async (authData) => {
                const bookmarks = await getBookmarks(authData.client)
                const output = processBookmarks(bookmarks, vaultPath, filePath)

                output ? response.render("success") : response.render("error")
            })
            .catch(() => response.status(403).send('Invalid verifier or access tokens!'))
    })
}