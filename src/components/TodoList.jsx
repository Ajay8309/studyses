import { useEffect, useState } from "react";
import { getTodos, addTodo, fetchAITodo, deleteTodo, updateTodo } from "../firebase";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Loader2, Trash, Pencil } from "lucide-react";
import React from "react";
import useAuth from "./useAuth";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const user = useAuth();

  useEffect(() => {
    const loadTodos = async () => {
      if (!user) return;
      const fetchedTodos = await getTodos(user.uid);
      setTodos(fetchedTodos);
    };

    loadTodos();
  }, [user]);

  const handleAddTodo = async () => {
    if (!newTask.trim() || !user) return alert("Please log in to add a task!");

    const id = await addTodo(user.uid, newTask.trim());
    setTodos([...todos, { id, task: newTask.trim(), completed: false }]);
    setNewTask("");
  };

  const handleDeleteTodo = async (id) => {
    if (!user) return alert("Please log in to delete a task!");

    await deleteTodo(user.uid, id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = async (id) => {
    if (!user || !editText.trim()) return alert("Please enter text to update!");

    await updateTodo(user.uid, id, editText.trim());
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, task: editText.trim() } : todo)));
    setEditingTodo(null);
    setEditText("");
  };

  const handleToggleComplete = async (id, currentStatus) => {
    if (!user) return alert("Please log in to update tasks!");

    await updateTodo(user.uid, id, null, !currentStatus);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleFetchAI = async () => {
    setLoading(true);
    if (!user) {
      alert("Please log in to fetch AI tasks!");
      setLoading(false);
      return;
    }

    const aiTodos = await fetchAITodo();
    if (aiTodos.length) {
      for (const task of aiTodos) {
        const id = await addTodo(user.uid, task);
        setTodos((prev) => [...prev, { id, task, completed: false }]);
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">✅ Your To-Do List</h2>

      {/* Input Box & Add Button */}
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md transition duration-200"
        >
          Add
        </button>
      </div>

      <button
        onClick={handleFetchAI}
        disabled={loading}
        className={`mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg transition duration-200 shadow-md ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {loading ? <Loader2 className="animate-spin" /> : "✨ Get AI Suggestions"}
      </button>

      <ul className="mt-6 space-y-3">
        {todos.map((todo) => (
          <motion.li
            key={todo.id || Math.random()} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center justify-between p-3 rounded-lg shadow-md ${
              todo.completed ? "bg-gray-200 line-through text-gray-500" : "bg-white"
            }`}
          >
            <button onClick={() => handleToggleComplete(todo.id, todo.completed)}>
              {todo.completed ? (
                <CheckCircle className="text-green-600" />
              ) : (
                <Circle className="text-gray-400" />
              )}
            </button>

            {editingTodo === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="border p-1 rounded w-full"
                onKeyDown={(e) => e.key === "Enter" && handleEditTodo(todo.id)}
              />
            ) : (
              <span className="flex-1 mx-2">{todo.task}</span>
            )}

            {editingTodo === todo.id ? (
              <button
                onClick={() => handleEditTodo(todo.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                ✅
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingTodo(todo.id);
                  setEditText(todo.task);
                }}
                className="text-yellow-500 hover:text-yellow-700"
              >
                <Pencil />
              </button>
            )}

            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash />
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
