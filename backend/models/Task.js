const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedBy: { type: String }, // Campo para el usuario que completó la tarea
});

module.exports = mongoose.model('Task', taskSchema);
