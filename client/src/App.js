import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Shuffler from './Shuffler';

import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function login(loggedIn) {
    if(loggedIn === 0) {
        window.location.href="http://localhost:5000/authorize";
    }
    else {
        window.location.href="http://localhost:3000";
    }
}

function App() {
  const [loggedIn, setLoggedIn] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false);

  let search = window.location.search;
  let params = new URLSearchParams(search);
  const token = params.get("access_token");

  useEffect(() => {
    if (token !== null) {
      setLoggedIn(1);

      const playlistURL = `http://localhost:5000/playlists?token=${token}`;
      fetch(playlistURL)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.log(res);
          }
        })
        .then((res) => {
          setPlaylists(res);
          setPlaylistsLoaded(true);
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  return (
    <div className="App">
      <Navbar className="navbar" expand="lg">
        <Navbar.Brand href="#home" style={{ color: "#ffffff" }}>Shuffle+</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Button variant="success" className="ml-auto" onClick={() => login(loggedIn)}>
            {(loggedIn === 0) ? "Login to Spotify" : "Log Out"}
        </Button>
        </Navbar.Collapse>
      </Navbar>

      <Container>
        {/* {playlistsLoaded ?
          playlists.items.map((p) => <p>{p.name}</p>) : null
        } */}


        <Shuffler />
      </Container>
    </div>
  );
}

export default App;
