const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); // Middleware para manejar JSON

// Conectar a MongoDB utilizando Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err.message);
  });

// Definir el esquema para Usuario
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true, // Asegura que el nombre de usuario sea único en la base de datos
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
});

// Middleware para encriptar la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next(); // Si la contraseña no se ha modificado, continuar
  try {
    // Encriptar la contraseña utilizando bcrypt
    user.password = await bcrypt.hash(user.password, 10);
    next(); // Continuar con el guardado
  } catch (error) {
    next(error); // Manejar cualquier error de encriptación
  }
});

// Crear y exportar el modelo de usuario
const User = mongoose.model('User', userSchema);

// Ruta de Registro
app.post('/register', async (req, res) => {
  console.log(req.body); // Verificar qué datos se reciben desde React

  try {
    const { username, password } = req.body;
    // Validación básica para verificar que ambos campos estén presentes
    if (!username || !password) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    // Verificar si el nombre de usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send('El nombre de usuario ya está en uso'); // 409 Conflict
    }

    // Crear un nuevo usuario
    const newUser = new User({ username, password });
    await newUser.save(); // Guardar en la base de datos

    // Responder con un mensaje de éxito
    res.status(201).send('Usuario registrado exitosamente');
  } catch (error) {
    console.error(error); // Imprimir el error para depuración
    res.status(500).send('Error interno del servidor'); // Enviar mensaje de error general
  }
});

// Ruta de Inicio de Sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Credenciales incorrectas');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
});

// Modelo de Tarea
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// Ruta para crear una nueva tarea
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({ text: req.body.text });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).send('Error al crear la tarea');
  }
});

// Ruta para obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Error al obtener las tareas');
  }
});

// Ruta para marcar una tarea como completada
app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).send('Error al actualizar la tarea');
  }
});


// Iniciar el servidor en el puerto especificado
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
