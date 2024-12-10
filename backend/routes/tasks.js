const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Asegúrate de crear el modelo de Task

// Ruta para actualizar el estado de una tarea
router.put('/update-task/:id', async (req, res) => {
  try {
    const { completed, username } = req.body;

    // Actualiza la tarea con el usuario que la completó
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed, completedBy: username },
      { new: true }
    );

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
});

module.exports = router;
