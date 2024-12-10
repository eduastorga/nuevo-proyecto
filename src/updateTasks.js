const mongoose = require('mongoose');

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/nuevo-proyecto-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TaskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  completedBy: String,
});

const Task = mongoose.model('Task', TaskSchema);

async function updateTasks() {
  try {
    // Actualiza las tareas con el campo `completedBy`
    const tasks = await Task.find({ completed: true });
    for (const task of tasks) {
      task.completedBy = 'edubkn2'; // Cambia este valor según el usuario
      await task.save();
    }
    console.log('Tareas actualizadas exitosamente.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al actualizar las tareas:', error);
    mongoose.connection.close();
  }
}

updateTasks();
