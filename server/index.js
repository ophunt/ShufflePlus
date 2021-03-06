import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV || "development";
const app = express();
const PORT = 5000;
const CLIENT_PORT = 8080;
const CLIENT_URL = env === "development" ? "localhost" : "shuffle.plus";

if (env === "development") {
    app.use(cors());
} else {
    const whitelist = [`http://${CLIENT_URL}:${CLIENT_PORT}`]
    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error(`Illegal domain ${origin} not in legal list ${whitelist.join(", ")}`))
            }
        }
    }
    app.use(cors(corsOptions));
}

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: `http://${CLIENT_URL}:${PORT}/authorized`
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
    res.send(`Shuffle+ Backend API. Please use through authorized client.`);
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
                const clientURL = `http://${CLIENT_URL}:${CLIENT_PORT}/?access_token=${data.body.access_token}`;
                res.redirect(clientURL);
            },
            (err) => {
                console.err("Error: ", err);
            }
        );
    }
});

app.get("/playlists", (req, res) => {
    const token = req.query.token;

    // Set the access token on the API object to use it in later calls
    spotifyAPI.setAccessToken(token);

    spotifyAPI.getMe()
        .then((meRes) => {
            const user = meRes.body.id;
            spotifyAPI.getUserPlaylists(user).then((plRes) => {
                res.send(plRes.body);
            })
        })
})

app.get("/shuffle", async (req, res) => {
    const token = req.query.token;
    const p1 = req.query.p1;
    const p2 = req.query.p2;
    const allow_duplicates = req.query.d;
    const name = req.query.name || "ShufflePlus Combined Playlist";

    // Fetch tracks
    spotifyAPI.setAccessToken(token);
    const p1Tracks = await getAllPlaylistTracks(p1);
    const p2Tracks = await getAllPlaylistTracks(p2);

    // Combine and map to track id
    const allTracks = p1Tracks
        .concat(p2Tracks)
        .map(t => t.track.id)
        .filter(t => t !== null)
        .map(id => `spotify:track:${id}`);

    // Dedup if necessary
    const playlistTracks = allow_duplicates ? allTracks : [...new Set(allTracks)];

    // Make a new playlist
    const newPlaylist = await spotifyAPI.createPlaylist(name, { "description": "Powered by Shuffle+" });

    // Split into arrays of at most 100 tracks (limit for one transaction)
    for (let i = 0; i < playlistTracks.length; i += 100) {
        // Put all the tracks in the playlist
        await spotifyAPI.addTracksToPlaylist(newPlaylist.body.id, playlistTracks.slice(i, i + 100));
    }

    // Return the playlist
    res.send(JSON.stringify(newPlaylist.body.external_urls.spotify));
})

async function getAllPlaylistTracks(playlist) {
    let tracks = [];

    let res = await spotifyAPI.getPlaylistTracks(playlist);
    const size = res.body.total;

    for (let offset = 0; offset < size; offset += 100) {
        res = await spotifyAPI.getPlaylistTracks(playlist, { offset: offset });
        tracks = tracks.concat(res.body.items);
    }

    return tracks;
}

app.listen(PORT, () => {
    console.log(`App running in mode ${env} at http://${CLIENT_URL}:${PORT}`);
});
