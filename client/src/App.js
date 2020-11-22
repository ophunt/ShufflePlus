import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Shuffler from './Shuffler';

import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function App() {
  const [loggedIn, setLoggedIn] = useState(0);

  let search = window.location.search;
  let params = new URLSearchParams(search);
  const [token, setToken] = useState(params.get("access_token"));
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const playlistURL = `http://localhost:5000/playlists?token=${token}`;
    fetch(playlistURL)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(res);
        }
      })
      .then((res) => setPlaylists(res))
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <div className="App">
      <Navbar className="navbar" expand="lg">
        <Navbar.Brand href="#home" style={{ color: "#ffffff" }}>Shuffle+</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Button variant="success" className="ml-auto" href="http://localhost:5000/authorize">
            {(loggedIn === 0) ? "Login to Spotify" : "Log Out"}
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <Container>
        <p>{JSON.stringify(playlists)}</p>
        <Shuffler />
      </Container>
    </div>
  );
}

export default App;
