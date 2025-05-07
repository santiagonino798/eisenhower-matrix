import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import "./App.css";

const quadrants = [
  { id: "q1", label: "✅ Urgente e Importante" },
  { id: "q2", label: "🧠 No Urgente pero Importante" },
  { id: "q3", label: "⚠️ Urgente pero No Importante" },
  { id: "q4", label: "🌀 No Urgente y No Importante" },
];

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState({});
  const [completed, setCompleted] = useState([]);

  // Cargar tareas desde Supabase
  const fetchTasks = async () => {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) {
      console.error("Error al cargar tareas:", error);
      return;
    }

    const taskMap = {};
    const completedList = [];

    data.forEach((t) => {
      if (t.completed) {
        completedList.push({
          text: t.text,
          date: new Date(t.completed_at).toLocaleString(),
          id: t.id,
        });
      } else {
        taskMap[t.id] = { text: t.text, quadrant: t.quadrant };
      }
    });

    setTasks(taskMap);
    setCompleted(completedList);
  };

  // Crear tarea nueva
  const addTask = async () => {
    if (!task.trim()) return;
    const { data, error } = await supabase.from("tasks").insert([
      {
        text: task.trim(),
        quadrant: "q2",
        completed: false,
      },
    ]);

    if (error) console.error("Error creando tarea:", error);
    setTask("");
    fetchTasks();
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  };

  // Marcar como completada
  const completeTask = async (id) => {
    await supabase
      .from("tasks")
      .update({ completed: true, completed_at: new Date() })
      .eq("id", id);
    fetchTasks();
  };

  // Cambiar de cuadrante (drag & drop)
  const moveTask = async (id, quadrant) => {
    await supabase.from("tasks").update({ quadrant }).eq("id", id);
    fetchTasks();
  };

  const onDrop = (e, quadrant) => {
    const id = e.dataTransfer.getData("id");
    moveTask(id, quadrant);
  };

  const deleteCompleted = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="fullscreen">
      <div className="app">
        <h1 className="title">🧭 Matriz Eisenhower</h1>

        <div className="input-row">
          <input
            className="task-input"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Escribe una tarea..."
          />
          <button onClick={addTask} className="add-btn">
            Agregar
          </button>
        </div>

        <div className="grid">
          {quadrants.map((q) => (
            <div
              key={q.id}
              className="quadrant"
              onDrop={(e) => onDrop(e, q.id)}
              onDragOver={(e) => e.preventDefault()}
            >
              <h2>{q.label}</h2>
              {Object.entries(tasks)
                .filter(([_, t]) => t.quadrant === q.id)
                .map(([id, t]) => (
                  <div
                    key={id}
                    className="task"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("id", id)}
                  >
                    <span>{t.text}</span>
                    <div className="task-actions">
                      <button onClick={() => completeTask(id)}>✅</button>
                      <button onClick={() => deleteTask(id)}>✖</button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {completed.length > 0 && (
          <div className="log">
            <h3>Tareas completadas</h3>
            <ul>
              {completed.map((item, index) => (
                <li key={item.id} className="completed-item">
                  <span>
                    ✅ {item.text} — <span className="date">{item.date}</span>
                  </span>
                  <button
                    className="delete-completed"
                    onClick={() => deleteCompleted(item.id)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
