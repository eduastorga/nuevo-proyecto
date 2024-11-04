<<<<<<< HEAD
# nuevo-proyecto
=======
Proyecto: Aplicación de Gestión de Tareas

Descripción: Esta aplicación permite a los usuarios registrarse, iniciar sesión y gestionar sus tareas de forma personalizada. Incluye características como cambio de idioma (inglés y español), diseño responsivo adaptable a dispositivos móviles, tablets y computadoras, así como la opción de seleccionar un color para el usuario.

Requisitos Previos: Antes de comenzar, asegúrate de tener lo siguiente instalado en tu computadora:

Node.js, que es una plataforma que ejecuta JavaScript en el servidor.
MongoDB, que será la base de datos para almacenar los datos de la aplicación.
Git, que es la herramienta para controlar las versiones del código.
Paso a Paso para Ejecutar el Proyecto

Clonar el Repositorio: Primero, clona el repositorio de GitHub en tu computadora. Abre la terminal y ejecuta el comando "git clone https://github.com/eduastorga/nuevo-proyecto.git". Esto creará una carpeta llamada "nuevo-proyecto" con todos los archivos del proyecto.

Acceder a la Carpeta del Proyecto: Navega a la carpeta del proyecto usando el comando "cd nuevo-proyecto".

Instalar Dependencias: El proyecto está dividido en dos partes: el backend, que es el servidor, y el frontend, que es la interfaz de usuario.

a) Instalar Dependencias del Backend: Ve a la carpeta "backend" usando el comando "cd backend". Luego instala las dependencias ejecutando "npm install".

Configura el archivo ".env":

Dentro de la carpeta backend, crea un archivo llamado ".env".
Abre el archivo .env y agrega las siguientes líneas, sustituyendo "<valor>" por la información correspondiente:
MONGO_URI, que será la dirección de tu base de datos MongoDB, por ejemplo, "mongodb://localhost:27017/nombre_de_tu_base_de_datos".
JWT_SECRET, que será una cadena secreta que usarás para firmar tokens, por ejemplo, "tu_secreto_jwt".
PORT, que es el puerto en el que correrá el servidor backend, por ejemplo, "3001".
Inicia el servidor ejecutando "npm start". Si el servidor se ejecuta correctamente, deberías ver un mensaje como "Server running on port 3001".

b) Instalar Dependencias del Frontend: Vuelve a la carpeta principal del proyecto usando "cd .." y luego ve a la carpeta "src", que contiene el frontend, usando el comando "cd src". Instala las dependencias del frontend ejecutando "npm install".

Inicia el servidor de desarrollo del frontend usando el comando "npm start". Esto debería abrir automáticamente la aplicación en tu navegador. Si no se abre, puedes ir a la dirección http://localhost:3000 en tu navegador para ver la aplicación.

Registro e Ingreso en la Aplicación: En la interfaz de la aplicación:

Selecciona la opción "Registrarse" y completa los campos de nombre de usuario, contraseña, y elige un color.
Una vez registrado, inicia sesión para acceder al tablero de tareas.
Funcionalidades Principales:

Cambio de Idioma: Puedes cambiar entre inglés y español usando el menú de idioma en la esquina superior de la aplicación.
Gestión de Tareas: Permite agregar, editar y marcar tareas como completadas en el tablero de tareas.
Diseño Adaptativo: Prueba a cambiar el tamaño de la ventana del navegador para ver cómo la interfaz se adapta automáticamente a diferentes dispositivos, como móvil, tablet y escritorio.
Verificar el Almacenamiento Local: En el navegador, abre las herramientas de desarrollo. Para hacer esto, haz clic derecho en la página, selecciona "Inspeccionar" o presiona la tecla F12. Luego, ve a la pestaña "Application", selecciona "Local Storage" y busca "localhost". Aquí podrás ver los datos almacenados del usuario, como el nombre y el idioma preferido, que se guardan en el almacenamiento local del navegador.

Finalizar: Para detener los servidores, vuelve a la terminal y presiona las teclas "Ctrl + C" al mismo tiempo.
>>>>>>> c85c14bf (Primer commit - Primer Avance)
