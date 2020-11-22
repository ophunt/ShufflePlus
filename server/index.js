import express from "express";
import { v4 as uuid } from "uuid";
import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";
dotenv.config();

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: "http://localhost:3000/authorized"
});

const SPOTIFY_SCOPES = [
    "user-read-email",
    "user-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
    "playlist-read-collaborative"
]

const app = express();
const PORT = 3000;

let uuids = {};
let codes = {};

app.get("/", (req, res) => {
    res.send(`Hello World!`);
});

app.get("/authorize", (req, res) => {
    const state = uuid(); // TODO: Figure out how to use this correctly
    uuids[state] = true;
    const authURL = spotifyAPI.createAuthorizeURL(SPOTIFY_SCOPES, state);
    res.send(`<a href="${authURL}" target="_blank">Log In to Spotify</a>`);
});

app.get("/authorized", (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    if (!uuids[state]) {
        res.send(`Error: this authorization could not be paired with a valid request. Please try again.`);
    } else {
        spotifyAPI.authorizationCodeGrant(code).then(
            async (data) => {
                console.log('The token expires in ' + data.body['expires_in']);
                console.log('The access token is ' + data.body['access_token']);
                console.log('The refresh token is ' + data.body['refresh_token']);

                // Set the access token on the API object to use it in later calls
                spotifyAPI.setAccessToken(data.body['access_token']);
                spotifyAPI.setRefreshToken(data.body['refresh_token']);

                const user = (await spotifyAPI.getMe()).body.display_name;
                const playlists = (await spotifyAPI.getUserPlaylists(user)).body;
                res.send(`<b><u>Playlists for user ${user}:</u></b><br>${playlists.items.map(p => p.name).join("<br>")}`);
            },
            (err) => {
                console.err("Error: ", err);
            }
        );
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
