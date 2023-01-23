import "express-session";

declare module 'express-session' {
    interface Session {
        user: {
            codeVerifier: string;
            codeChallenge: string;
            state: string;
        }
    }

    interface SessionData {
        user: {
            codeVerifier: string;
            codeChallenge: string;
            state: string;
        }
    }
}