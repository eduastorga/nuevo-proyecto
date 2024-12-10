const mongoose = require('mongoose');

// Conecta a tu base de datos
mongoose.connect('mongodb://localhost:27017/nuevo-proyecto-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define el esquema y modelo de tareas
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  completedByColor: String,
  completedBy: String, // El nuevo campo
});

const Task = mongoose.model('Task', taskSchema);

// Define el esquema y modelo de usuarios
const userSchema = new mongoose.Schema({
  username: String,
  color: String,
});

const User = mongoose.model('User', userSchema);

// Script para actualizar las tareas
const updateTasks = async () => {
  try {
    // Obtén todos los usuarios
    const users = await User.find();
    const usersByColor = users.reduce((acc, user) => {
      acc[user.color] = user.username;
      return acc;
    }, {});

    // Actualiza las tareas con el campo `completedBy`
    const tasks = await Task.find();
    for (const task of tasks) {
      if (task.completedByColor && usersByColor[task.completedByColor]) {
        task.completedBy = usersByColor[task.completedByColor];
        await task.save();
      }
    }

    console.log('Tareas actualizadas con éxito');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al actualizar tareas:', error);
    mongoose.connection.close();
  }
};

updateTasks();
