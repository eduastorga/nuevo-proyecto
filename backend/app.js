// Importar dependencias
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Reemplazo de Configuration y OpenAIApi
require('dotenv').config();

const app = express();

// Middleware para CORS y parseo de JSON
app.use(cors());
app.use(express.json());

// Configuración de MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err.message));

// Verificación de API Key para OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY no está definido en .env');
}

// Esquema de usuarios
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  color: { type: String, default: '#000000' },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

// Middleware para verificar tokens
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token requerido' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.id;
    req.userColor = decoded.color;
    req.username = decoded.username;
    next();
  });
};

// Endpoints de autenticación
app.post('/register', async (req, res) => {
  try {
    const { username, password, color } = req.body;
    if (!username || !password || !color) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'El nombre de usuario ya está en uso' });
    }

    const newUser = new User({ username, password, color });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en /register:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user._id, username: user.username, color: user.color }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, color: user.color });
  } catch (error) {
    console.error('Error en /login:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para Chat con IA
app.post('/api/chat', verifyToken, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'El mensaje es obligatorio' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente diseñado para ayudar a las familias o compañeros de casa a organizar tareas del hogar. Responde siempre en el contexto de cómo gestionar, asignar y completar tareas en un entorno compartido.',
          },
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
   );
   

    const reply = response.data.choices[0]?.message?.content || 'No se recibió respuesta.';
    res.json({ reply });
  } catch (error) {
    console.error('Error al comunicarse con OpenAI:', error.message);
    res.status(500).json({ error: 'Error al comunicarse con OpenAI' });
  }
});
// Esquema de tareas (sin cambios, si ya estaba definido correctamente)
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userColor: { type: String },
  completedByColor: { type: String },
  completedBy: { type: String },
});

const Task = mongoose.model('Task', taskSchema);

// Endpoint para obtener tareas
app.get('/tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find(); // Carga todas las tareas
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas:', error.message);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// Endpoint para agregar tareas
app.post('/tasks', verifyToken, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'El texto de la tarea es obligatorio' });
  }

  try {
    const newTask = new Task({
      text,
      userColor: req.userColor,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error al crear la tarea:', error.message);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// Endpoint para actualizar tareas
app.put('/tasks/:id', verifyToken, async (req, res) => {
  const { completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        completed: completed,
        completedByColor: completed ? req.userColor : null,
        completedBy: completed ? req.username : null,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error.message);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// Endpoint para eliminar tareas (opcional)
app.delete('/tasks/:id', verifyToken, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error.message);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// Endpoint para obtener estadísticas
app.get('/task-stats', verifyToken, async (req, res) => {
  try {
    // Realiza la agregación para obtener estadísticas por usuario
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$completedBy', // Agrupa por el campo 'completedBy'
          count: { $sum: 1 }, // Cuenta las tareas completadas por cada usuario
        },
      },
    ]);

    // Consulta los usuarios para asociar colores y nombres
    const users = await User.find({}, 'username color');

    // Mapear los resultados para incluir colores y nombres de usuario
    const result = stats.map((stat) => {
      const user = users.find((u) => u.username === stat._id);
      return {
        username: user ? user.username : 'Usuario desconocido',
        color: user ? user.color : '#cccccc',
        count: stat.count,
      };
    });

    res.json(result); // Devuelve las estadísticas al cliente
  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});



// Puerto de escucha
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
