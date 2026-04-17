import { CircleMinus, CirclePlus, GripVertical, Pencil } from "lucide-react";
import { motion, Reorder, useDragControls } from "framer-motion";
import type { ToDoItem } from "./todoTypes";

function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

function Checkmark() {
    return (
        <svg viewBox="0 0 10 10" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="1.5,5 4,7.5 8.5,2.5" />
        </svg>
    );
}

function EditButton({ onClick }: { onClick: () => void }) {
    return (
        <motion.button onClick={onClick} whileHover={{ scale: 1.2 }} className="shrink-0">
            <Pencil size={20} className="text-white/40" />
        </motion.button>
    );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.2 }}
            className="shrink-0 opacity-20 group-hover:opacity-100 transition-opacity"
        >
            <CircleMinus size={20} className="text-white/40" />
        </motion.button>
    );
}

export function AddButton({ onClick }: { onClick: () => void }) {
    return (
        <motion.button
            layout
            className="mt-2 block"
            onClick={onClick}
            whileHover={{ scale: 1.075 }}
            transition={{ type: "spring", stiffness: 600, damping: 50 }}
        >
            <CirclePlus size={20} className="text-white/40 transition-colors hover:text-white/70" />
        </motion.button>
    );
}

interface ToDoItemRowProps {
    todo: ToDoItem;
    isEditing: boolean;
    isAnyEditing: boolean;
    textareaRefs: React.RefObject<Map<number, HTMLTextAreaElement>>;
    onUpdateText: (id: number, text: string) => void;
    onFinishEditing: (id: number) => void;
    onStartEditing: (id: number) => void;
    onDelete: (id: number) => void;
    onToggleComplete: (id: number) => void;
}

export function ToDoItemRow({ todo, isEditing, isAnyEditing, textareaRefs, onUpdateText, onFinishEditing, onStartEditing, onDelete, onToggleComplete }: ToDoItemRowProps) {
    const controls = useDragControls();
    return (
        <Reorder.Item value={todo} dragControls={controls} dragListener={false} className="group flex items-center gap-2 border-b border-white/20 pt-2 pb-0.5 pr-2 list-none">
            <GripVertical
                size={16}
                className="shrink-0 text-white cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity"
                onPointerDown={(e) => { e.preventDefault(); controls.start(e); }}
            />
            <div
                onClick={() => onToggleComplete(todo.id)}
                className={`shrink-0 w-4 h-4 rounded-sm border cursor-pointer transition-colors hover:border-white/80 ${todo.completed ? "bg-orange-400/20 border-white/60" : "border-white/40 bg-transparent"}`}
            >
                {todo.completed && <Checkmark />}
            </div>
            <textarea
                ref={(el) => { if (el) textareaRefs.current.set(todo.id, el); }}
                value={todo.text}
                readOnly={!isEditing}
                onChange={(e) => {
                    onUpdateText(todo.id, e.target.value);
                    autoResize(e.target);
                }}
                onBlur={() => { if (isEditing) onFinishEditing(todo.id); }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onFinishEditing(todo.id);
                    }
                }}
                rows={1}
                className={`w-full pl-1 pr-4 bg-transparent border-0 rounded-sm focus:outline-none ${isEditing ? "" : "cursor-default"} ${todo.completed ? "line-through text-amber-900/40" : ""}`}
                style={{ resize: "none", overflow: "hidden" }}
                autoFocus={isEditing}
            />
            <div className="flex shrink-0 gap-2 w-10">
                {!isAnyEditing && <DeleteButton onClick={() => onDelete(todo.id)} />}
                {(isEditing || !isAnyEditing) && (
                    <EditButton onClick={() => onStartEditing(todo.id)} />
                )}
            </div>
        </Reorder.Item>
    );
}
