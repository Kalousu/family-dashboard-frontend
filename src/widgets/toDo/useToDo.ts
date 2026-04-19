import { useRef, useState } from "react";
import type { ToDoItem } from "./todoTypes";

export function useToDo() {
    const [todos, setTodos] = useState<ToDoItem[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const nextId = useRef(1);
    const textareaRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map());

    const focusItem = (id: number) =>
        setTimeout(() => textareaRefs.current.get(id)?.focus(), 0);

    const addTodo = () => {
        const id = nextId.current++;
        setTodos(prev => [...prev, { id, text: "", completed: false }]);
        setEditingId(id);
        focusItem(id);
    };

    const updateText = (id: number, text: string) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    };

    const startEditing = (id: number) => {
        setEditingId(id);
        focusItem(id);
    };

    const finishEditing = (id: number) => {
        setTodos(prev => {
            const item = prev.find(t => t.id === id);
            if (!item?.text.trim()) return prev.filter(t => t.id !== id);
            return prev;
        });
        setEditingId(null);
    };

    const deleteTodo = (id: number) => {
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    const toggleComplete = (id: number) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    return {
        todos,
        setTodos,
        editingId,
        isAnyEditing: editingId !== null,
        textareaRefs,
        addTodo,
        updateText,
        startEditing,
        finishEditing,
        deleteTodo,
        toggleComplete,
    };
}
