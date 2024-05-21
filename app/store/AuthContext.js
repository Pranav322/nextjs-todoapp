'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../config/firebase-config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        // Fetch todos if user is logged in
        fetchTodos(currentUser.uid); 
      } else {
        // Clear todos if user is not logged in
        setTodos([]); 
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTodos = async (userId) => {
    const todosCollectionRef = collection(db, 'users', userId, 'todos');
    const q = query(todosCollectionRef);

    try {
      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todosData);
    } catch (error) {
      console.error("Error fetching todos: ", error);
    }
  };

  const addTodo = async (newTodo, setNewTodo) => {
    if (newTodo.trim() !== '') {
      const todoData = {
        content: newTodo,
        createdAt: new Date(),
        completed: false
      };
      try {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'todos'), todoData);
        setTodos([...todos, { id: docRef.id, ...todoData }]);
        // Clear the input after adding a todo
        setNewTodo(''); 
      } catch (error) {
        console.error("Error adding todo: ", error);
      }
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'todos', todoId));
      const filteredTodos = todos.filter(todo => todo.id !== todoId);
      setTodos(filteredTodos);
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  const toggleTodoCompleted = async (todoId, completed) => {
    try {
      const todoDoc = doc(db, 'users', user.uid, 'todos', todoId);
      await updateDoc(todoDoc, { completed });
      const updatedTodos = todos.map(todo =>
        todo.id === todoId ? { ...todo, completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error updating todo: ", error);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      todos,
      addTodo,
      deleteTodo,
      toggleTodoCompleted,
      signInWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
