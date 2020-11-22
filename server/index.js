import express from "express";
import { v4 as uuid } from "uuid";
import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5000;

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: `http://localhost:${PORT}/authorized`
});

const SPOTIFY_SCOPES = [
    "user-read-email",
    "user-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
    "playlist-read-collaborative"
]

let uuids = {};

app.get("/", (req, res) => {
    res.send(`Hello World!<br><a href="/authorize" target="_blank">Log in to Spotify</a>`);
});

app.get("/authorize", (req, res) => {
    const state = uuid();
    uuids[state] = true;
    const authURL = spotifyAPI.createAuthorizeURL(SPOTIFY_SCOPES, state);
    res.redirect(authURL);
});

app.get("/authorized", (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    if (!uuids[state]) {
        res.send(`Error: this authorization could not be paired with a valid request. Please try again.`);
    } else {
        spotifyAPI.authorizationCodeGrant(code).then(
            async (data) => {
                console.log('The token expires in ' + data.body.expires_in);
                console.log('The access token is ' + data.body.access_token);
                console.log('The refresh token is ' + data.body.refresh_token);

                res.send(JSON.stringify({token: data.body.access_token}));
            },
            (err) => {
                console.err("Error: ", err);
            }
        );
    }
});

app.get("/playlists", (req, res) => {
    const code = req.query.code;
    spotifyAPI.authorizationCodeGrant(code).then(
        async (data) => {
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
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
