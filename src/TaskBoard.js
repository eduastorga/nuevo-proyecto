import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Cargar las tareas al montar el componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      }
    };
    fetchTasks();
  }, []);

  // Función para agregar una nueva tarea
  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await axios.post('http://localhost:3001/tasks', { text: newTask });
        setTasks([...tasks, response.data]);
        setNewTask('');
      } catch (error) {
        console.error('Error al crear la tarea:', error);
      }
    }
  };

  // Función para marcar una tarea como completada
  const toggleTaskCompletion = async (index) => {
    const task = tasks[index];
    try {
      const response = await axios.put(`http://localhost:3001/tasks/${task._id}`, {
        completed: !task.completed
      });
      const updatedTasks = tasks.map((t, i) =>
        i === index ? response.data : t
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Tablero de Tareas</h1>
      <div className="mb-3">
        <label className="form-label">Nueva Tarea</label>
        <input
          type="text"
          className="form-control"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={addTask}>
          Agregar Tarea
        </button>
      </div>

      <ul className="list-group mt-3">
        {tasks.map((task, index) => (
          <li
            key={task._id}
            className={`list-group-item ${task.completed ? 'list-group-item-success' : ''}`}
            onClick={() => toggleTaskCompletion(index)}
            style={{ cursor: 'pointer' }}
          >
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskBoard;

