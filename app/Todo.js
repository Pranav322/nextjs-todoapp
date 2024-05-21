'use client'
import { useState } from "react";
import { useAuth } from "./store/AuthContext";

export const Todo = () => {
  const { user, loading, todos, addTodo, deleteTodo, toggleTodoCompleted, signInWithGoogle, logout } = useAuth();
  const [newTodo, setNewTodo] = useState('');

  if (loading) {
    return <p>Loading...</p>;
  }

  const completedTodos = todos.filter(todo => todo.completed).length;
  const notCompletedTodos = todos.length - completedTodos;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {user ? (
        <div className="text-center">
          <h1>Welcome, {user.displayName}</h1>
          <div className="mt-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter a new todo"
              className="border px-4 py-2 mr-2"
            />
            <button onClick={() => addTodo(newTodo, setNewTodo)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Todo
            </button>
          </div>
          <ul className="mt-4">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between px-4 py-2 border-b">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoCompleted(todo.id, !todo.completed)}
                />
                <span className={todo.completed ? 'line-through' : ''}>
                  {todo.content}
                </span>
                <button onClick={() => deleteTodo(todo.id)} className="text-red-500">
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p>Completed: {completedTodos}</p>
            <p>Not Completed: {notCompletedTodos}</p>
          </div>
          <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={signInWithGoogle} className="flex items-center justify-center">
          <img
            src="/signinbutton.png"
            alt="Sign In With Google"
            width={200}
            height={50}
          />
        </button>
      )}
    </div>
  );
};
