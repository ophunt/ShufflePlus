import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import {Row, Col, Form} from 'react-bootstrap';

function submitForm(playlist1, playlist2) {
    const playlistURL = `http://localhost:5000/shuffle?p1=${playlist1}&p2=${playlist2}`;
}

function Shuffler(props) {
    const [playlist1, setPlaylist1] = useState(0);
    const [playlist2, setPlaylist2] = useState(0);

    return (
        <div>

            {/* splash screen */}
            {props.loggedIn === 0 && 
            <div>
                <Row style={{paddingTop: "5%"}}>
                    <Col className="text-center">
                        <img src="/shufflelogo298x228.png" alt="Shuffle+ logo"></img>
                        <h1 style={{paddingTop: "3%"}}>Welcome to <strong>Shuffle+</strong></h1>
                        <p>Intelligently combine and shuffle your Spotify playlists</p>
                        <h4>Login to Spotify to continue</h4>
                    </Col>
                </Row>
            </div>
            }

            {/* logged in */}
            {props.loggedIn === 1 && 
            <div><Row style={{paddingTop: "5%"}}>
                    <Col className="text-center">
                        <Form>
                            <Form.Group controlId="selectPlaylist1">
                                <Form.Label>Select first playlist:</Form.Label>
                                <Form.Control as="select" onChange={(e) => setPlaylist1(e.target.value)}>
                                    {props.playlistsLoaded ?
                                        props.playlists.items.map((p) => <option key={p.id} value={p.id}>{p.name}</option>) : null
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="selectPlaylist2">
                                <Form.Label>Select second playlist:</Form.Label>
                                <Form.Control as="select" onChange={(e) => setPlaylist2(e.target.value)}>
                                    {props.playlistsLoaded ?
                                        props.playlists.items.map((p) => <option key={p.id} value={p.id}>{p.name}</option>) : null
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Button variant="success" onClick={() => submitForm(playlist1, playlist2)}>Shuffle!</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
            }

        </div>
    );
}

export default Shuffler;