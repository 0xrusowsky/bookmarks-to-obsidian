import "express-session";

declare module 'express-session' {
    interface Session {
        user: {
            codeVerifier: string;
            codeChallenge: string;
            state: string;
        },
        obsidianBookmarks: {
            existing: {
                title: string;
                content: string;
            }[];
            unprocessed: string;
        },
        twitterBookmarks: Bookmark[]
    }
}

export interface Bookmark {
    created_at: string
    date: string
    author: string
    iframe: string
    url: string
}