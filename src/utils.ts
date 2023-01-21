import { TweetV2, TwitterApi, UserV2 } from "twitter-api-v2"
import * as fs from 'fs'
import 'fs-access'

interface Bookmark {
    created_at: string
    date: string
    author: string
    iframe: string
    url: string
}

export const getBookmarks = async (loggedClient: TwitterApi) => {
    const bookmarks = await loggedClient.v2.bookmarks({
        'tweet.fields': ['created_at'],
        'user.fields': ['username'],
        expansions: ['referenced_tweets.id.author_id'],
    })

    const dict = processAuthors(bookmarks.data.includes.users)

    const processedBookmarks = bookmarks.data.data.map(b => ({
        created_at: b.created_at.replace(/[-:.Z]|000/g, ""),
        date: b.created_at.slice(0, 10),
        author: dict[b.author_id],
        iframe: `<iframe border=0 frameborder=0 height=500 width=550 src="https://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2F${dict[b.author_id]}%2Fstatus%2F${b.id}"></iframe>`,
        url: `https://twitter.com/${dict[b.author_id]}/status/${b.id}`
    }))

    return processedBookmarks
}

export function processAuthors(authors: UserV2[]) {
    const userDict = authors.reduce((dict, user) => {
        dict[user.id] = user.username
        return dict
    }, {} as { [key: string]: string })

    return userDict
}

export function processBookmarks(bookmarks: Bookmark[], vaultPath: string, filePath: string) {

    let prevData: string

    if (fs.existsSync(filePath)) prevData = fs.readFileSync(filePath, 'utf8')

    const f = fs.createWriteStream(filePath)

    bookmarks.forEach(b => {
        const title = `${b.created_at}-${b.author}`
        const path = `${vaultPath}${title}.md`
        if (!fs.existsSync(path)) {
            const ff = fs.createWriteStream(path)
            ff.write(`---\ntags: tweet\nauthor: ${b.author}\ndate: ${b.date}\n---\n**Tweet URL**\n${b.url}\n\n${b.iframe}`)
            ff.end()
            f.write(`[[${title}]]\n${b.iframe}\n\n---\n\n`)
        }
    })

    f.write(prevData)
    f.end()

    if (fs.existsSync(filePath)) return true

    return false
}