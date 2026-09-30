# Banco de Bromas (SillyJokes)

Bienvenido a **Banco de Bromas**, una aplicación web interactiva que te permite explorar, añadir, editar y eliminar bromas. ¡El mejor lugar para reír en familia!

La aplicación está protegida mediante un sistema de **autenticación por tokens (JWT)**, por lo que es necesario crear una cuenta o iniciar sesión para acceder a las funciones.

---

## Arquitectura del Proyecto

El proyecto está construido con un enfoque moderno en tres capas, todo contenido (containerizado) usando Docker:

1. **Frontend (React + Vite)**: 
   - Interfaz de usuario amigable y responsiva.
   - Construida y empaquetada como archivos estáticos (HTML/CSS/JS).
   - Maneja el estado de la autenticación guardando el JWT.

2. **Backend (Node.js + Express)**:
   - API RESTful que procesa las peticiones del frontend.
   - Maneja la encriptación de contraseñas (con `bcrypt`) y la generación/validación de tokens (con `jsonwebtoken`).
   - Se conecta a la base de datos para almacenar y consultar las bromas y usuarios.

3. **Base de Datos (PostgreSQL)**:
   - Almacena las tablas de `users` y `jokes`.
   - Se inicializa automáticamente con 100 bromas gracias al script de `init.sql`.

4. **Proxy (Nginx)**:
   - Funciona como un *Reverse Proxy*.
   - Sirve los archivos estáticos del Frontend directamente en el puerto `80`.
   - Redirige de forma transparente todas las peticiones con prefijo `/api/*` hacia el Backend (que corre de forma interna, ocultando su puerto).

---

## 🚀 Cómo iniciar la aplicación

Asegúrate de tener **Docker** (y Docker Compose) instalado y corriendo en tu computadora.

0.5. Si modificaste el frontend: npm run build
1. Abre tu terminal y navega a la carpeta principal del proyecto.
2. Ejecuta el siguiente comando para construir las imágenes y levantar los contenedores en segundo plano:
   ```bash
   docker compose up --build -d
   ```
3. ¡Listo! Abre tu navegador web y visita: **http://localhost**
4. Te pedirá que inicies sesión. Usa la opción "Regístrate aquí" para crear tu usuario inicial y luego entra.

---

## 🛑 Cómo terminar/detener la aplicación

Cuando quieras detener la aplicación, puedes hacerlo de manera segura sin perder tus datos:

1. Para **detener los contenedores** (tus usuarios y bromas guardadas se mantendrán):
   ```bash
   docker compose stop
   ```
   *Nota: La próxima vez solo necesitas usar `docker compose start`.*

2. Para **apagar y eliminar los contenedores** (manteniendo los datos de la base de datos guardados en el volumen `pg_data`):
   ```bash
   docker compose down
   ```

3. ⚠️ **PELIGRO:** Si quieres apagar los contenedores y **BORRAR** la base de datos (volver a las 100 bromas por defecto y borrar todos los usuarios la próxima vez que inicies):
   ```bash
   docker compose down -v
   ```

---

## 🛠️ Desarrollo (Modo Local sin Docker)

Si deseas trabajar en el código de forma local sin usar todo Docker:

1. Levanta tu propia base de datos PostgreSQL y crea la tabla `users` y `jokes`.
2. En la carpeta `Backend`, instala dependencias con `npm install` y corre `node index.js`.
3. En la carpeta `frontend`, corre `npm run dev` y entra a `http://localhost:5173`. El servidor de Vite hará el proxy automático a tu backend.
