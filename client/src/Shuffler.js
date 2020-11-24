import './Shuffler.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Carousel, Button, Alert } from 'react-bootstrap';

const CLIENT_URL = process.env.NODE_ENV === "development" ? "localhost" : "shuffle.plus";
const SERVER_PORT = "5000";

async function submitForm(token, playlistName, playlist1, playlist2, duplicates) {
    const shuffleURL = `http://${CLIENT_URL}:${SERVER_PORT}/shuffle?token=${token}&name=${playlistName}&p1=${playlist1}&p2=${playlist2}&d=${duplicates}`;
    const playlistURL = await (await fetch(shuffleURL)).json();
    return playlistURL;
}

function Shuffler({ token, loggedIn, playlistsLoaded, playlists }) {
    const [playlistName, setPlaylistName] = useState("Shuffle+ Combined Playlist");
    const [playlist1, setPlaylist1] = useState("");
    const [playlist2, setPlaylist2] = useState("");
    const [duplicates, setDuplicates] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [playlistURL, setPlaylistURL] = useState("");

    // Default item selected is the first item
    useEffect(() => {
        const firstTrack = playlists.items ? playlists.items[0].id : "";
        setPlaylist1(firstTrack);
        setPlaylist2(firstTrack);
    }, [playlists]);

    return (
        <div>
            {!loggedIn ?
                <div>
                    <Row style={{ paddingTop: "1%" }}>
                        <Carousel className="text-center carousel" style={{ maxWidth: "100%" }}>
                            <Carousel.Item>
                                <img src="/party.jpg" alt="Party" style={{ maxWidth: "100%" }}></img>
                                <Carousel.Caption>
                                    <h3>Set the playlist and party on</h3>
                                    <p>Stop worrying about adding songs to the queue</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src="/dj.jpg" alt="DJ" style={{ maxWidth: "100%" }}></img>
                                <Carousel.Caption>
                                    <h3>Be your own DJ</h3>
                                    <p>Mix and match songs into one fantastic playlist</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src="/headphones.jpg" alt="Headphones" style={{ maxWidth: "100%" }}></img>
                                <Carousel.Caption>
                                    <h3>Take all your music with you</h3>
                                    <p>Listen to your favorite songs without switching albums</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </Row>
                </div>
                :
                <div><Row style={{ paddingTop: "5%" }}>
                    <Col className="text-center form">
                        <Alert variant="success" show={playlistURL !== ""} dismissible onClose={() => {
                            setPlaylistURL("");
                            setDisabled(false);
                        }}>
                            Success! <Alert.Link href={playlistURL}>Click here</Alert.Link> to go to your new playlist.
                        </Alert>

                        <Form>
                            <Form.Group controlId="selectPlaylistName">
                                <Form.Label>Enter a name for the new playlist:</Form.Label>
                                <Form.Control type="text" placeholder="Shuffle+ Combined Playlist" onChange={(e) => setPlaylistName(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="selectPlaylist1">
                                <Form.Label>Select first playlist:</Form.Label>
                                <Form.Control as="select" onChange={(e) => setPlaylist1(e.target.value)}>
                                    {playlistsLoaded ?
                                        playlists.items.map((p) => <option key={p.id} value={p.id}>{p.name}</option>) : null
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="selectPlaylist2">
                                <Form.Label>Select second playlist:</Form.Label>
                                <Form.Control as="select" onChange={(e) => setPlaylist2(e.target.value)}>
                                    {playlistsLoaded ?
                                        playlists.items.map((p) => <option key={p.id} value={p.id}>{p.name}</option>) : null
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Check type="switch" id="duplicateSwitch" label="Allow duplicates in the resulting playlist" onChange={(e) => setDuplicates(!duplicates)}></Form.Check>
                            <Button style={{marginTop: "1%"}} variant="success" disabled={disabled} onClick={async () => {
                                setDisabled(true);
                                await setPlaylistURL(await submitForm(token, playlistName, playlist1, playlist2, duplicates));
                            }}>Shuffle!</Button>
                        </Form>
                    </Col>
                </Row>
                </div>
            }

        </div>
    );
}

export default Shuffler;