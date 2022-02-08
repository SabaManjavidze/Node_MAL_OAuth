const express = require("express")
const path = require("path")
const axios = require("axios")
const crypto = require("crypto")
const qs = require("querystring")
require("dotenv").config({ path: path.resolve(__dirname, ".env") })

const app = express()

const{CLIENT_ID,CLIENT_SECRET,STATE_VAR} = process.env

app.get("/", (req, res) => {
    res.send("MAL OAUTH2")
})

const code_challenge = crypto.randomBytes(50).toString("hex")
const getAuthUrl = async () => {
    try {
        const rootUrl = "https://myanimelist.net/v1/oauth2/authorize"
        const options = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code_challenge: code_challenge,
            response_type: 'code',
            redirect_uri: "http://localhost:3000/oauth/callback",
            state: STATE_VAR,
        }
        return `${rootUrl}?${new URLSearchParams(options)}`
    } catch (error) {
        return error
    }
}
app.get("/auth", async (req, res) => {
    const url = await getAuthUrl()
    res.redirect(url)
})

const getAccessToken = async (code) => {
    try {
        const rootUrl = "https://myanimelist.net/v1/oauth2/token"
        const options = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "http://localhost:3000/oauth/callback",
            code_verifier: code_challenge,
        }
        const response = await axios.post(rootUrl, qs.stringify(options))
        return response.data
    } catch (error) {
        return error.response.data
    }
}


app.get("/oauth/callback", async (req, res) => {
    const {code,state} = req.query
    if (state==process.env.STATE_VAR) {
        const token = await getAccessToken(code)
        res.send(token)
    } else {
        res.send("state not valid")
    }
})



const PORT = process.env.PORT || 3000
app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`)
})