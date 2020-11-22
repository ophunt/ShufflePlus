import './App.css';

function App() {
  console.log(process.env.NODE_ENV)
  console.log(process.env.CLIENT_ID)

  return (
    <div className="App">
      <header>
        <p>
          Edit <code>src/App.js</code> and save to reload.
          {process.env.CLIENT_ID}
        </p>
      </header>
    </div>
  );
}

export default App;
