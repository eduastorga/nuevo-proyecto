// src/TaskBoard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, ListItemButton, Box } from '@mui/material';

const TaskBoard = ({ translations }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const username = localStorage.getItem('username');
  const userColor = localStorage.getItem('color') || '#000000'; // Obtener el color del usuario

  // Cargar las tareas al montar el componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTasks(response.data); // Guardar las tareas en el estado
      } catch (error) {
        console.error(translations.errorFetchingTasks, error);
      }
    };
    fetchTasks();
  }, [translations]);

  // Función para agregar una nueva tarea
  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await axios.post(
          'http://localhost:3001/tasks',
          { text: newTask },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setTasks([...tasks, response.data]); // Añadir la nueva tarea al estado
        setNewTask('');
      } catch (error) {
        console.error(translations.errorAddingTask, error);
      }
    }
  };

  // Función para marcar una tarea como completada
  const toggleTaskCompletion = async (taskId, currentIndex) => {
    const task = tasks[currentIndex];
    try {
      const response = await axios.put(
        `http://localhost:3001/tasks/${taskId}`,
        { completed: !task.completed },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      const updatedTasks = tasks.map((t, index) => (index === currentIndex ? response.data : t));
      setTasks(updatedTasks); // Actualizar el estado de las tareas
    } catch (error) {
      console.error(translations.errorUpdatingTask, error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {translations.taskBoard}
      </Typography>
      {username && (
        <Typography variant="h6" align="center" gutterBottom>
          {translations.welcomeUser} {username}!
        </Typography>
      )}
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <TextField
          label={translations.newTask}
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={addTask} fullWidth>
          {translations.addTask}
        </Button>
      </Box>
      <List>
        {tasks.map((task, index) => (
          <ListItem
            key={task._id}
            disablePadding
            sx={{
              backgroundColor: task.completed ? userColor : 'background.paper', // Usa el color del usuario al completar
              mb: 1,
              borderRadius: 1,
            }}
          >
            <ListItemButton onClick={() => toggleTaskCompletion(task._id, index)}>
              <ListItemText primary={task.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TaskBoard;
