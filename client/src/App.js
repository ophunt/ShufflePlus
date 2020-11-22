import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Shuffler from './Shuffler';

import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function App() {
  const [loggedIn, setLoggedIn] = useState(0);

  return (
    <div className="App">

      <Navbar className="navbar" expand="lg">
        <Navbar.Brand href="#home" style={{color: "#ffffff"}}>Shuffle+</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Button variant="success" className="ml-auto">
            {(loggedIn == 0) ? "Login to Spotify" : "Log Out"}
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <Container>
        <Shuffler />
      </Container>

    </div>
  );
}

export default App;
