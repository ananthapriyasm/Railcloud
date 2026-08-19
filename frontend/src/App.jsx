import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Get all todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(API_URL, {
        title: title,
        completed: false,
      });

      setTodos([response.data, ...todos]);
      setTitle("");
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo
  const toggleTodo = async (todo) => {
    try {
      const response = await axios.patch(`${API_URL}${todo.id}/`, {
        completed: !todo.completed,
      });

      setTodos(
        todos.map((item) =>
          item.id === todo.id ? response.data : item
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="app">
      <div className="todo-container">

        <h1>Todo App</h1>

        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            placeholder="Enter a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        <div className="todo-list">

          {todos.length === 0 ? (
            <p className="empty">
              No todos yet. Add your first task!
            </p>
          ) : (
            todos.map((todo) => (
              <div className="todo-item" key={todo.id}>

                <div className="todo-left">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                  />

                  <span
                    className={todo.completed ? "completed" : ""}
                  >
                    {todo.title}
                  </span>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
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