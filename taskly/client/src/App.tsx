import React, { useEffect, useState } from "react";

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
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header-kort */}
        <div className="bg-indigo-700 rounded-t-2xl p-8 shadow-xl text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight">Taskly 🚀</h1>
          <p className="mt-2 text-indigo-100 opacity-80">
            Dina uppgifter i molnet
          </p>
        </div>

        {/* Input-kort */}
        <div className="bg-white p-6 shadow-md mb-6 rounded-b-2xl border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="md:col-span-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Vad behöver göras?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="date"
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-600"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
            <button
              onClick={addTask}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95"
            >
              Lägg till ➕
            </button>
          </div>
        </div>

        {}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">
                Inga läxor just nu. Njut av friheten! ☕️
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border-l-8 transition-all hover:shadow-md ${
                  task.completed
                    ? "border-green-400 opacity-75"
                    : "border-indigo-500"
                }`}
              >
                <div
                  className="flex items-center gap-5 flex-1 cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {task.completed && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>

                  <div>
                    <h3
                      className={`text-lg font-bold ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <span className="grayscale opacity-70">📅</span>{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-500 p-3 rounded-xl transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
