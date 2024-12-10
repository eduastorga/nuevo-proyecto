import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, ListItemButton, Box } from '@mui/material';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const username = localStorage.getItem('username'); // Nombre del usuario actual
  const userColor = localStorage.getItem('color') || '#000000'; // Color del usuario actual

  // Cargar las tareas al montar el componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log("Tareas obtenidas del backend:", response.data); // Loguea las tareas obtenidas
        setTasks(response.data); // Guardar las tareas en el estado
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
        const response = await axios.post(
          'http://localhost:3001/tasks',
          { text: newTask },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        setTasks([...tasks, response.data]); // Añadir la nueva tarea al estado
        setNewTask('');
      } catch (error) {
        console.error('Error al agregar la tarea:', error);
      }
    }
  };

  // Función para marcar una tarea como completada
  const toggleTaskCompletion = async (taskId, currentIndex) => {
    const task = tasks[currentIndex];
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3001/tasks/${taskId}`,
        {
          completed: !task.completed, // Cambia el estado de completado
          username: username, // Agrega el nombre del usuario actual al cuerpo de la solicitud
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Tarea actualizada:", response.data); // Loguea la tarea actualizada

      const updatedTasks = tasks.map((t, index) =>
        index === currentIndex ? response.data : t
      );
      setTasks(updatedTasks); // Actualizar el estado de las tareas
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Tablero de Tareas
      </Typography>
      {username && (
        <Typography variant="h6" align="center" gutterBottom>
          Bienvenido {username}!
        </Typography>
      )}
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <TextField
          label="Nueva Tarea"
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={addTask} fullWidth>
          Agregar Tarea
        </Button>
      </Box>
      <List>
        {tasks.map((task, index) => (
          <ListItem
            key={task._id}
            disablePadding
            sx={{
              backgroundColor: task.completedByColor || '#f4f4f4', // Mostrar el color del usuario que completó la tarea o un color predeterminado
              mb: 1,
              borderRadius: 1,
            }}
          >
            <ListItemButton onClick={() => toggleTaskCompletion(task._id, index)}>
              <ListItemText
                primary={task.text}
                secondary={
                  task.completed && task.completedBy && task.completedBy.trim() !== 'undefined'
                    ? task.completedBy // Muestra únicamente el nombre del usuario
                    : null
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TaskBoard;
