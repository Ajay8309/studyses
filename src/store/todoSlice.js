import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTodos, addTodo, toggleTodoComplete } from "../firebase";

export const loadTodos = createAsyncThunk("todos/loadTodos", async (userId) => {
  return await getTodos(userId); 
});

export const addNewTodo = createAsyncThunk("todos/addNewTodo", async ({ userId, task }) => {
  const id = await addTodo(userId, task);
  return { id, task, completed: false };
});

export const toggleComplete = createAsyncThunk("todos/toggleComplete", async (todoId) => {
  await toggleTodoComplete(todoId);
  return todoId;
});

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    status: "idle",
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(toggleComplete.fulfilled, (state, action) => {
        const todo = state.items.find((t) => t.id === action.payload);
        if (todo) todo.completed = !todo.completed;
      });
  },
});

export default todoSlice.reducer;
