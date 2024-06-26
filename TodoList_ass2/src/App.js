import React, { useState, useEffect } from 'react';
import ToDoList from './ToDoList.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>To-Do List</h1>
        <ToDoList />
      </header>
    </div>
  );
}

export default App;
