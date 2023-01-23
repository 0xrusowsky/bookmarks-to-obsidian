

import { TwitterApi } from "twitter-api-v2"
import { getBookmarks, processBookmarks } from "../utils"
import { Router, Application } from "express"
import dotenv from "dotenv"

dotenv.config()
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CALLBACK_URL = process.env.CALLBACK_URL
const vaultPath = process.env.VAULT_PATH
const filePath = vaultPath + process.env.UNPROCESSED_NAME

const router = Router()
export default router

// Define a route handler for the default home page
router.get("/", (request, response) => {
    response.render("index")
})

router.get("/test", (request, response) => {
    response.render("index")
})

router.get('/auth', (request, response) => {
    // Obtain access token
    const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET })

    const { url, codeVerifier, state, codeChallenge } = client.generateOAuth2AuthLink(CALLBACK_URL, { scope: ['tweet.read', 'users.read', `bookmark.read`] })

    request.session.user = {
        state,
        codeVerifier,
        codeChallenge
    }

    return response.redirect(url)
})

router.get('/oauth/callback', (request, response) => {
    const { codeVerifier, state: sessionState } = request.session.user

    const state = request.query.state
    const code = String(request.query.code)

    if (!codeVerifier || !state || !sessionState || !code) {
        console.error('You denied the app or your session expired!')
        return response.render("error")
    }
    if (state !== sessionState) {
        console.error('Stored tokens didnt match!')
        return response.render("error")
    }

    // Obtain access token
    const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET })

    client.loginWithOAuth2({ code, codeVerifier, redirectUri: CALLBACK_URL })
        .then(async (authData) => {
            const bookmarks = await getBookmarks(authData.client)
            const output = processBookmarks(bookmarks, vaultPath, filePath)

            return output ? response.render("success") : response.render("error")
        })
        .catch(() => response.status(403).send('Invalid verifier or access tokens!'))
})