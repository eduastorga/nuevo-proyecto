<<<<<<< HEAD
# nuevo-proyecto
=======
Proyecto: Aplicación de Gestión de Tareas
Descripción
Esta aplicación permite a los usuarios registrarse, iniciar sesión y gestionar sus tareas de forma personalizada. Incluye características como cambio de idioma (inglés y español), diseño responsivo adaptable a dispositivos móviles, tablets y computadoras, así como la opción de seleccionar un color para el usuario.

Requisitos Previos
Antes de comenzar, asegúrate de tener lo siguiente instalado en tu computadora:

Node.js - Plataforma que ejecuta JavaScript en el servidor.
MongoDB - Base de datos que usaremos para almacenar los datos.
Git - Herramienta para controlar las versiones del código.
Paso a Paso para Ejecutar el Proyecto
1. Clonar el Repositorio
Primero, clona el repositorio de GitHub en tu computadora. Abre la terminal y ejecuta el siguiente comando:

bash
Copiar código
git clone https://github.com/eduastorga/nuevo-proyecto.git
Esto creará una carpeta llamada nuevo-proyecto con todos los archivos del proyecto.

2. Acceder a la Carpeta del Proyecto
Navega a la carpeta del proyecto usando el siguiente comando:

bash
Copiar código
cd nuevo-proyecto
3. Instalar Dependencias
El proyecto está dividido en dos partes: el backend (servidor) y el frontend (interfaz de usuario).

a) Instalar Dependencias del Backend
Ve a la carpeta backend:

bash
Copiar código
cd backend
Instala las dependencias ejecutando:

bash
Copiar código
npm install
Configura el archivo .env:

Dentro de la carpeta backend, crea un archivo llamado .env.

Abre el archivo .env y agrega las siguientes líneas (sustituyendo <valor> por la información correspondiente):

plaintext
Copiar código
MONGO_URI=mongodb://localhost:27017/nombre_de_tu_base_de_datos
JWT_SECRET=tu_secreto_jwt
PORT=3001
Inicia el servidor:

bash
Copiar código
npm start
Si el servidor se ejecuta correctamente, deberías ver un mensaje como: "Server running on port 3001".

b) Instalar Dependencias del Frontend
Vuelve a la carpeta principal del proyecto:

bash
Copiar código
cd ..
Ve a la carpeta src:

bash
Copiar código
cd src
Instala las dependencias del frontend:

bash
Copiar código
npm install
Inicia el servidor de desarrollo del frontend:

bash
Copiar código
npm start
Esto debería abrir automáticamente la aplicación en tu navegador. Si no se abre, puedes ir a http://localhost:3000.

4. Registro e Ingreso en la Aplicación
En la interfaz de la aplicación, selecciona "Registrarse" y completa los campos de nombre de usuario, contraseña y elige un color.
Una vez registrado, inicia sesión para acceder al tablero de tareas.
5. Funcionalidades Principales
Cambio de Idioma: Puedes cambiar entre inglés y español usando el menú de idioma en la esquina superior.
Gestión de Tareas: Agrega, edita y marca tareas como completadas.
Diseño Adaptativo: Prueba a cambiar el tamaño de la ventana para ver cómo la interfaz se adapta a móvil, tablet y escritorio.
6. Verificar el Almacenamiento Local
En el navegador, abre las herramientas de desarrollo (clic derecho > "Inspeccionar" o presiona F12).
Ve a la pestaña Application > Local Storage y selecciona localhost.
Aquí podrás ver los datos almacenados del usuario, como el nombre y el idioma preferido.
7. Finalizar
Para detener los servidores, vuelve a la terminal y presiona Ctrl + C.
>>>>>>> c85c14bf (Primer commit - Primer Avance)
