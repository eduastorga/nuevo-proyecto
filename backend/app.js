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

// Esquema de Usuario con el campo color
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  color: {
    type: String,
    default: '#000000', // Color predeterminado, negro
  },
});

// Middleware para encriptar la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    user.password = await bcrypt.hash(user.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

// Ruta de Registro con color
app.post('/register', async (req, res) => {
  try {
    const { username, password, color } = req.body;
    if (!username || !password || !color) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send('El nombre de usuario ya está en uso');
    }

    const newUser = new User({ username, password, color });
    await newUser.save();
    res.status(201).send('Usuario registrado exitosamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
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

    const token = jwt.sign({ id: user._id, color: user.color }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, color: user.color });
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
});

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token requerido');

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Token inválido');
    req.userId = decoded.id;
    req.userColor = decoded.color;
    next();
  });
};

// Esquema de Tarea
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userColor: { type: String }, // Guardar el color del usuario que crea la tarea
  completedByColor: { type: String }, // Guardar el color del usuario que marca la tarea como completada
});

const Task = mongoose.model('Task', taskSchema);

// Ruta para crear una nueva tarea (solo para usuarios autenticados)
app.post('/tasks', verifyToken, async (req, res) => {
  try {
    const newTask = new Task({ text: req.body.text, userColor: req.userColor }); // Asigna el color del usuario
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).send('Error al crear la tarea');
  }
});

// Ruta para obtener todas las tareas (solo para usuarios autenticados)
app.get('/tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Error al obtener las tareas');
  }
});

// Ruta para marcar una tarea como completada (solo para usuarios autenticados)
app.put('/tasks/:id', verifyToken, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        completed: req.body.completed,
        completedByColor: req.body.completed ? req.userColor : null, // Guardar el color solo si se completa la tarea
      },
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
