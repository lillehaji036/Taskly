const express = require("express");
const cors = require("cors");
const { Pool } = require("pg"); 

const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
  user: "manhal.alothman",
  host: "localhost",
  database: "taskly_db",
  password: "",
  port: 5432,
});

app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY deadline ASC",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Serverfel vid hämtning");
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title, deadline } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, deadline) VALUES ($1, $2) RETURNING *",
      [title, deadline],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Kunde inte spara i databasen");
  }
});

// Ta bort uppgift ❌
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Fel vid radering");
  }
});

// Markera som klar ✅
app.patch("/api/tasks/:id", async (req, res) => {
  try {
    await pool.query(
      "UPDATE tasks SET completed = NOT completed WHERE id = $1",
      [req.params.id],
    );
    res.json({ message: "Uppdaterad" });
  } catch (err) {
    res.status(500).send("Fel vid uppdatering");
  }
});

app.listen(5001, () =>
  console.log(
    "Taskly körs med PostgreSQL på port 5001, yeeeaaahhhh Beybe! ✅🤙🏻🐘",
  ),
);
