import { useRef, useState, useEffect } from "react";
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
    const nextTempId = useRef(-1);
    const textareaRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map());
    const originalTextRef = useRef<string>("");
    const savingIds = useRef<Set<number>>(new Set());

    useEffect(() => {
        getTodos(widgetId).then(data =>
            setTodosState(data.sort((a, b) => a.sortOrder - b.sortOrder))
        );
    }, [widgetId]);

    const focusItem = (id: number) =>
        setTimeout(() => textareaRefs.current.get(id)?.focus(), 0);

    // Called by framer-motion's Reorder.Group onReorder — optimistic update + API sync
    const setTodos = (newTodos: ToDoItem[]) => {
        setTodosState(newTodos);
        const realTodos = newTodos.filter(t => t.id > 0);
        if (realTodos.length > 0) {
            updateTodoPositions(realTodos.map((t, index) => ({ id: t.id, sortOrder: index })));
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

    const finishEditing = async (id: number) => {
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

        if (id < 0) {
            const created = await createTodo(widgetId, item.text, item.completed);
            setTodosState(prev => prev.map(t => t.id === id ? created : t));
        } else if (textChanged) {
            await updateTodoText(id, item.text);
        }

        savingIds.current.delete(id);
        setEditingId(null);
    };

    const deleteTodo = async (id: number) => {
        if (id > 0) {
            await deleteTodoApi(id);
        }
        setTodosState(prev => prev.filter(t => t.id !== id));
    };

    const toggleComplete = async (id: number) => {
        if (id < 0) return; // Noch nicht gespeichertes Todo kann nicht getoggled werden
        const item = todos.find(t => t.id === id);
        if (!item) return;
        const newCompleted = !item.completed;
        setTodosState(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
        console.log(`Toggling todo ${id} to completed=${newCompleted}`);
        await updateTodoCompleted(id, newCompleted);
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
