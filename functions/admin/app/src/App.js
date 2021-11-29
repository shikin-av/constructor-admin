import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import Login from './Login'
import Home from './Home'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element = {<Home />} />
          <Route path={"/login"} element = {<Login />} />          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
