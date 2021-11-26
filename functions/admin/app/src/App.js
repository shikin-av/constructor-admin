import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const API_URL = 'http://localhost:5001/constructor-2de11/us-central1/api'

function App() {

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(resilt => {
        console.log(resilt)
      })
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
