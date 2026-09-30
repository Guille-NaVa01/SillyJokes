import express from "express";
import bodyParser from "body-parser";
import pool from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";
const JWT_SECRET = "mi_super_secreto_para_jwt"; // En prod, usar variables de entorno

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Allow requests from the Vite dev server and Nginx proxy
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

// --- AUTH ROUTES ---

// Register
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Faltan datos" });

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await pool.query("INSERT INTO users (username, password_hash) VALUES ($1, $2)", [username, hash]);
    res.json({ message: "Usuario registrado con éxito" });
  } catch (err) {
    if (err.code === "23505") return res.status(400).json({ error: "El usuario ya existe" });
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Faltan datos" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Credenciales inválidas" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- MIDDLEWARE JWT ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "Se requiere token (Authorization: Bearer <token>)" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Token mal formado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario en req
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// Aplicar el middleware a todas las rutas que siguen a continuación
app.use(verifyToken);


//1. GET a random joke
app.get("/random", async (req, res) => {
  const result = await pool.query("SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1");
  res.json(result.rows[0]);
});


//2. GET a specific joke
app.get("/jokes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await pool.query("SELECT * FROM jokes WHERE id = $1", [id]);
  res.json(result.rows[0]);
});

//3. GET a jokes by filtering on the joke type
app.get("/filter", async (req, res) => {
  const type = req.query.jokeType;
  const result = await pool.query("SELECT * FROM jokes WHERE jokeType = $1", [type]);
  res.json(result.rows);
});


//4. POST a new joke
app.post("/jokes", async (req, res) => {
  const text = req.body.jokeText;
  const type = req.body.jokeType;

  const result = await pool.query(
    "INSERT INTO jokes (jokeText, jokeType) VALUES ($1, $2) RETURNING *",
    [text, type]
  );

  console.log(result.rows[0]);
  res.json(result.rows[0]);
});

//5. PUT a joke
app.put("/jokes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const jokeText = req.body.text;
  const jokeType = req.body.type;

  const result = await pool.query(
    "UPDATE jokes SET jokeText = $1, jokeType = $2 WHERE id = $3 RETURNING *",
    [jokeText, jokeType, id]
  );

  console.log(result.rows[0]);
  res.json(result.rows[0]);
});

//6. PATCH a joke
app.patch("/jokes/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const existing = await pool.query("SELECT * FROM jokes WHERE id = $1", [id]);
  const existingJoke = existing.rows[0];

  const jokeText = req.body.text || existingJoke.joketext;
  const jokeType = req.body.type || existingJoke.joketype;

  const result = await pool.query(
    "UPDATE jokes SET jokeText = $1, jokeType = $2 WHERE id = $3 RETURNING *",
    [jokeText, jokeType, id]
  );

  console.log(result.rows[0]);
  res.json(result.rows[0]);
});

//7. DELETE Specific joke
app.delete("/jokes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await pool.query("DELETE FROM jokes WHERE id = $1 RETURNING *", [id]);

  if (result.rows.length > 0) {
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: `Joke with id: ${id} not found. No jokes were deleted.` });
  }
});

//8. DELETE All jokes
app.delete("/all", async (req, res) => {
  const userKey = req.query.key;
  if (userKey === masterKey) {
    await pool.query("DELETE FROM jokes");
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: `You are not authorised to perform this action.` });
  }
});
