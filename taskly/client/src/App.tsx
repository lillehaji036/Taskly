import React, { useEffect, useState } from "react";

// 1. Definition av Task-typen
type Task = {
  id: number;
  title: string;
  deadline: string;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const fetchTasks = () => {
    fetch("http://localhost:5001/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Kunde inte hämta:", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTitle || !newDeadline) return alert("Fyll i allt!");

    await fetch("http://localhost:5001/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, deadline: newDeadline }),
    });
    setNewTitle("");
    setNewDeadline("");
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:5001/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const toggleTask = async (id: number) => {
    await fetch(`http://localhost:5001/api/tasks/${id}`, { method: "PATCH" });
    fetchTasks();
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Taskly 🗓️</h1>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          placeholder="Läxa/Prov"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="Date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
        />
        <button onClick={addTask}>Lägg till ➕</button>
      </div>

      <div>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #eee",
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            <div>
              <span
                onClick={() => toggleTask(task.id)}
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                {task.completed ? "✅ " : "⏳ "} {task.title}
              </span>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                Deadline: {task.deadline}
              </p>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
