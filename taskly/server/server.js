const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET_KEY = "din_superhemliga_nyckel";

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "manhal.alothman",
  host: "localhost",
  database: "taskly_db",
  password: "",
  port: 5432,
});

// Middleware för att kontrollera inloggning
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Ingen token" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Ogiltig token" });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hash],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Användarnamnet är upptaget" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (user.rows.length > 0) {
      const valid = await bcrypt.compare(password, user.rows[0].password_hash);
      if (valid) {
        const token = jwt.sign({ userId: user.rows[0].id }, SECRET_KEY, {
          expiresIn: "1h",
        });
        res.json({ token, username: user.rows[0].username });
      } else {
        res.status(401).json({ error: "Fel lösenord" });
      }
    } else {
      res.status(404).json({ error: "Användaren finns inte" });
    }
  } catch (err) {
    res.status(500).json({ error: "Serverfel" });
  }
});

// --- TASK ROUTES ---
app.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [
      req.user.userId,
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta" });
  }
});

app.post("/api/tasks", authenticateToken, async (req, res) => {
  const { title, deadline } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, deadline, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, deadline, req.user.userId],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte spara" });
  }
});

app.patch("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE tasks SET completed = NOT completed WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.user.userId],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Fel vid uppdatering" });
  }
});

app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.userId,
    ]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Fel vid radering" });
  }
});

app.listen(5001, () => console.log("Server körs på 5001 🚀"));
