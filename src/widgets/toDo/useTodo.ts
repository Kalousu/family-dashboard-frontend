import { useRef, useState, useEffect, useCallback } from "react";
import type { ToDoItem } from "./todoTypes";
import {
    getTodos,
    createTodo,
    updateTodoText,
    updateTodoCompleted,
    updateTodoPositions,
    deleteTodo as deleteTodoApi,
} from "../../api/todoApi";

export function useToDo(widgetId: number) {
    const [todos, setTodosState] = useState<ToDoItem[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const nextTempId = useRef(-1);
    const textareaRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map());
    const originalTextRef = useRef<string>("");
    const savingIds = useRef<Set<number>>(new Set());

    useEffect(() => {
        getTodos(widgetId)
            .then(data => setTodosState(data.sort((a, b) => a.sortOrder - b.sortOrder)))
            .catch(() => setError("Todos konnten nicht geladen werden."));
    }, [widgetId]);

    const focusItem = (id: number) =>
        setTimeout(() => textareaRefs.current.get(id)?.focus(), 0);

    const setTodos = (newTodos: ToDoItem[]) => {
        setTodosState(newTodos);
        const realTodos = newTodos.filter(t => t.id > 0);
        if (realTodos.length > 0) {
            void updateTodoPositions(realTodos.map((t, index) => ({ id: t.id, sortOrder: index })))
                .catch(() => setError("Reihenfolge konnte nicht gespeichert werden."));
        }
    };

    const addTodo = () => {
        const tempId = nextTempId.current--;
        setTodosState(prev => [...prev, { id: tempId, text: "", completed: false, sortOrder: prev.length }]);
        setEditingId(tempId);
        focusItem(tempId);
    };

    const updateText = (id: number, text: string) => {
        setTodosState(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    };

    const startEditing = (id: number) => {
        const item = todos.find(t => t.id === id);
        originalTextRef.current = item?.text ?? "";
        setEditingId(id);
        focusItem(id);
    };

    const finishEditing = useCallback(async (id: number) => {
        if (savingIds.current.has(id)) return;
        savingIds.current.add(id);

        const item = todos.find(t => t.id === id);

        if (!item?.text.trim()) {
            setTodosState(prev => prev.filter(t => t.id !== id));
            setEditingId(null);
            savingIds.current.delete(id);
            return;
        }

        const textChanged = item.text !== originalTextRef.current;

        try {
            if (id < 0) {
                const created = await createTodo(widgetId, item.text, item.completed);
                setTodosState(prev => prev.map(t => t.id === id ? created : t));
            } else if (textChanged) {
                await updateTodoText(id, item.text);
            }
        } catch {
            setError("Todo konnte nicht gespeichert werden.");
        }

        savingIds.current.delete(id);
        setEditingId(null);
    }, [todos, widgetId]);

    const deleteTodo = useCallback(async (id: number) => {
        try {
            if (id > 0) {
                await deleteTodoApi(id);
            }
        } catch {
            setError("Todo konnte nicht gelöscht werden.");
            return;
        }
        setTodosState(prev => prev.filter(t => t.id !== id));
    }, []);

    const toggleComplete = useCallback(async (id: number) => {
        if (id < 0) return;
        const item = todos.find(t => t.id === id);
        if (!item) return;
        const newCompleted = !item.completed;
        setTodosState(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
        try {
            await updateTodoCompleted(id, newCompleted);
        } catch {
            setTodosState(prev => prev.map(t => t.id === id ? { ...t, completed: item.completed } : t));
            setError("Status konnte nicht gespeichert werden.");
        }
    }, [todos]);

    return {
        todos,
        setTodos,
        editingId,
        isAnyEditing: editingId !== null,
        error,
        textareaRefs,
        addTodo,
        updateText,
        startEditing,
        finishEditing,
        deleteTodo,
        toggleComplete,
    };
}
