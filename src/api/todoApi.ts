import axiosInstance from "./axiosInstance";
import type { ToDoItem } from "../widgets/toDo/todoTypes";

export const getTodos = async (widgetId: number): Promise<ToDoItem[]> => {
    const response = await axiosInstance.get(`/api/widgets/todo/${widgetId}`);
    return response.data;
};

export const createTodo = async (widgetId: number, text: string, completed: boolean): Promise<ToDoItem> => {
    const response = await axiosInstance.post(`/api/widgets/todo/${widgetId}`, { text, completed });
    return response.data;
};

export const updateTodoText = async (todoId: number, text: string): Promise<ToDoItem> => {
    const response = await axiosInstance.patch(`/api/widgets/todo/${todoId}/text`, { text });
    return response.data;
};

export const updateTodoCompleted = async (todoId: number, completed: boolean): Promise<ToDoItem> => {
    const response = await axiosInstance.patch(`/api/widgets/todo/${todoId}/completed`, { completed });
    return response.data;
};

export const updateTodoPositions = async (positions: { id: number; sortOrder: number }[]): Promise<void> => {
    await axiosInstance.patch(`/api/widgets/todo/positions`, positions);
};

export const deleteTodo = async (todoId: number): Promise<void> => {
    await axiosInstance.delete(`/api/widgets/todo/${todoId}`);
};
