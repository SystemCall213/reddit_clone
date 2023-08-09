import express from 'express'
import dotenv from 'dotenv'
import { OAuth2Client } from 'google-auth-library'
const router = express.Router()
dotenv.config()


router.post('/', async function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.header('Referrer-Policy', 'no-referrer-when-downgrade')

    const redirectUrl = 'http://127.0.0.1:3000/oauth'

    const oAuth2Client = new OAuth2Client(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        process.env.NEXT_PUBLIC_GOOGLE_SECRET_ID,
        redirectUrl
    )

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
        prompt: 'consent'
    })

    res.json({url:authorizeUrl})
})

module.exports = router