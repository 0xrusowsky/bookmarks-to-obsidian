This basic local app allows you to sync your unprocessed Twitter bookmarks with your Obsidian vault.

## How does it work?

This app creates a standalone file for each bookmarked tweet. Each file has the following structure:
```
---
tags: tweet
author: author_name
date: YYYY-MM-DD
---
**Tweet URL**
https://twitter.com/jack/status/20

<iframe border=0 frameborder=0 height=500 width=550  
 src="https://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2Fjack%2Fstatus%2F20"></iframe>
```

On top of that, it also maintains a file that tracks all the unprocessed bookmarks. The file has the following structure:

```
[[datetime-author]]
<iframe tweet-1></iframe>
---

[[datetime-author]]
<iframe tweet-2></iframe>
---
```

The idea is to delete the entries from `Unprocessed Bookmarks.md` once you have processed the standalone file that refers to the tweet (add the relevant tags, write some annotations, cross-reference it, etc.).
Every time that you sync your bookmarks, the app creates new files and entries for the tweets that belong to inexistent files.

## How to sync your bookmarks?

In the future I may create a public Obsidian plugin. But, as of now, you will have to host your own server.

#### Create a Twitter app
- If you don't have one yet, apply for a Twitter developer account [here](https://developer.twitter.com/en/portal/petition/essential/basic-info).
- Create a new app with the following settings:
	- App permissions: `read`
	- Type of app: `web app`
	- App info: the only relevant field is the callback URI `http://127.0.0.1:5000/oauth/callback`
- Generate your keys and tokens. You will need the OAuth2.0 ones: `CLIENT_ID`, `CLIENT_SECRET`

#### Create the .env file
- Fill the information discussed in the previous step.
- Inform the `VAULT_PATH`.

#### Init the server
- Run the following command to build all the dependencies and start running the local server.
```
npm run dev
```
- Open the localhost and follow the UI.