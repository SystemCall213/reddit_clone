import express from 'express'
import dotenv from 'dotenv'
import { OAuth2Client } from 'google-auth-library'
const router = express.Router()
dotenv.config()

async function getUserInfo(access_token) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/
    userinfo?access_token${access_token}`)
    const data = await response.json()
    console.log('data: ', data)
}

router.get('/', async function(req, res, next) {
    const code = req.query.code
    try {
        const redirectUrl = 'http://127.0.0.1:3000/oauth'

        const oAuth2Client = new OAuth2Client(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.NEXT_PUBLIC_GOOGLE_SECRET_ID,
            redirectUrl
        )
        
        const res = await oAuth2Client.getToken(code)
        await oAuth2Client.setCredentials(res.tokens)
        console.log('Tokens aquired')
        const user = oAuth2Client.credentials
        console.log('credentials: ', user)
        await getUserInfo(user.access_token)
    } catch (err) {
        console.log('Error while signing in')
    }
})