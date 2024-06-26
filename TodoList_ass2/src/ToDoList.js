import React, { useState, useEffect } from 'react';
import './ToDoList.css';

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (selectedDate) => {
    if (taskInput.trim()) {
      const newTask = { id: Date.now(), text: taskInput.trim(), completed: false, date: selectedDate };
      setTasks([...tasks, newTask]);
      setTaskInput('');
      setSelectedDate(new Date().toISOString().split('T')[0]); // Reset to today's date
      setError('');
      showPopupMessage('Task added!');
    } else {
      setError('Task cannot be empty');
    }
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    showPopupMessage('Task deleted!');
  };

  const markTaskAsCompleted = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    ));
    showPopupMessage('Task completed!');
  };

  const startEditingTask = (taskId, taskText) => {
    setEditingTaskId(taskId);
    setEditingTaskText(taskText);
  };

  const saveEditedTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, text: editingTaskText } : task
    ));
    setEditingTaskId(null);
    setEditingTaskText('');
    showPopupMessage('Task edited!');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  }).filter(task =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupMessage('');
    }, 2000);
  };

  return (
    <div className="todo-container">
      <h1 className="todo-heading">To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a new task"
          className="task-input"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
        <button onClick={() => addTask(selectedDate)} className="add-task-button">Add Task</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'filter-button active' : 'filter-button'}>All</button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'filter-button active' : 'filter-button'}>Active</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'filter-button active' : 'filter-button'}>Completed</button>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tasks..."
        className="search-bar"
      />
      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-info">
              <div className="task-text">{task.text}</div> 
              <span className="task-date">({task.date})</span>
            </div>
            <div className="task-actions">
              {editingTaskId === task.id ? (
                <div className="edit-task-container">
                  <input
                    type="text"
                    value={editingTaskText}
                    onChange={(e) => setEditingTaskText(e.target.value)}
                    className="edit-input"
                  />
                  <button className="save-button" onClick={() => saveEditedTask(task.id)}>Save</button>
                </div>
              ) : (
                <>
                  {!task.completed && <button className="edit-button" onClick={() => startEditingTask(task.id, task.text)}>✎</button>}
                </>
              )}
              <button className="complete-button" onClick={() => markTaskAsCompleted(task.id)}>✔️</button>
              <button className="remove-button" onClick={() => removeTask(task.id)}>✖️</button>
            </div>
          </li>
        ))}
      </ul>
      {popupMessage && <div className="popup">{popupMessage}</div>}
    </div>
  );
}

export default ToDoList;
