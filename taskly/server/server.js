const express = require("express");
const cors = require("cors");
const fs = require("fs"); // Lägg till denna!
const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = "./data.json";

// Hjälpfunktion för att läsa från filen
const readTasks = () => {
  if (!fs.existsSync(FILE_PATH)) return [];
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
};

// Hjälpfunktion för att spara till filen
const saveTasks = (tasks) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
};

// Hämta alla uppgifter
app.get("/api/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Skapa en ny uppgift ➕
app.post("/api/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    deadline: req.body.deadline,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

// Ta bort uppgift ❌
app.delete("/api/tasks/:id", (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter((t) => t.id !== Number(req.params.id));
  saveTasks(tasks);
  res.status(204).send();
});

// Markera som klar ✅
app.patch("/api/tasks/:id", (req, res) => {
  let tasks = readTasks();
  tasks = tasks.map((t) =>
    t.id === Number(req.params.id) ? { ...t, completed: !t.completed } : t,
  );
  saveTasks(tasks);
  res.json({ message: "Uppdaterad" });
});

app.listen(5001, () => console.log("Taskly-motorn körs på port 5001! 🚀"));
