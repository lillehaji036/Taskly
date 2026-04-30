import React, { useEffect, useState } from "react";

type Task = { id: number; title: string; deadline: string; completed: boolean };

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5001/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Kunde inte hämta data:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const handleAuth = async () => {
    try {
      const endpoint = isRegistering ? "register" : "login";
      const res = await fetch(`http://localhost:5001/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (!isRegistering) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          alert("Konto skapat! Logga in nu.");
          setIsRegistering(false);
        }
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Servern svarar inte.");
    }
  };

  const addTask = async () => {
    if (!newTitle || !newDeadline) return;
    try {
      await fetch("http://localhost:5001/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, deadline: newDeadline }),
      });
      setNewTitle("");
      setNewDeadline("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id: number) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-extrabold text-indigo-700">
              {isRegistering ? "Skapa konto ✨" : "Välkommen tillbaka!"}
            </h2>
          </div>
          <div className="space-y-4">
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Användarnamn"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Lösenord"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleAuth}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
            >
              {isRegistering ? "Registrera" : "Logga in"}
            </button>
            <p
              className="text-center text-sm text-gray-500 cursor-pointer hover:text-indigo-600"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Redan ett konto? Logga in"
                : "Inget konto? Skapa ett här"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="bg-indigo-700 rounded-t-2xl p-8 shadow-xl text-center text-white relative">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}
            className="absolute top-4 right-4 bg-indigo-800/50 hover:bg-red-500 text-white text-xs py-1 px-3 rounded-lg transition-all"
          >
            Logga ut 👋
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight">Taskly 🚀</h1>
          <p className="mt-2 text-indigo-100 opacity-80">Organisera din dag</p>
        </div>

        <div className="bg-white p-6 shadow-md mb-6 rounded-b-2xl border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="md:col-span-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Vad ska du göra?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="date"
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600"
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

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">
                Inga uppgifter än. Skriv något ovan! ✨
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
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
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
                    <p className="text-sm text-gray-500">
                      📅 {new Date(task.deadline).toLocaleDateString()}
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
