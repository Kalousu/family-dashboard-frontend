import { CircleMinus, CirclePlus, GripVertical, Pencil } from "lucide-react"
import { useRef, useState } from "react"
import { LayoutGroup, motion, Reorder, useDragControls } from "framer-motion"

function EditButton({ onClick, show, alwaysVisible }: { onClick: () => void, show: boolean, alwaysVisible: boolean }) {
    if (!show) return null;
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.2 }}
            className={`shrink-0 transition-opacity ${alwaysVisible ? "opacity-100" : "opacity-20 group-hover:opacity-100"}`}
        >
            <Pencil size={20} className="text-amber-800/40" />
        </motion.button>
    );
}

function DeleteButton({ onClick, show }: { onClick: () => void, show: boolean }) {
    return (
        <motion.button
            onClick={show ? onClick : undefined}
            whileHover={show ? { scale: 1.2 } : {}}
            className={`shrink-0 transition-opacity ${show ? "opacity-20 group-hover:opacity-100" : "opacity-20 pointer-events-none"}`}
        >
            <CircleMinus size={20} className="text-amber-800/40" />
        </motion.button>
    );
}


interface ToDoItem {
    id: number;
    text: string;
    completed: boolean;
    isEditing: boolean;
}

interface ToDoItemRowProps {
    todo: ToDoItem;
    isAnyEditing: boolean;
    textareaRefs: React.RefObject<Map<number, HTMLTextAreaElement>>;
    onUpdateText: (id: number, text: string) => void;
    onFinishEditing: (id: number) => void;
    onStartEditing: (id: number) => void;
    onDelete: (id: number) => void;
    onToggleComplete: (id: number) => void;
}

function ToDoItemRow({ todo, isAnyEditing, textareaRefs, onUpdateText, onFinishEditing, onStartEditing, onDelete, onToggleComplete }: ToDoItemRowProps) {
    const controls = useDragControls();
    return (
        <Reorder.Item value={todo} dragControls={controls} dragListener={false} className="group flex items-center gap-2 border-b border-amber-800/20 pt-2 pb-0.5 pr-2 list-none">
            <GripVertical
                size={16}
                className="shrink-0 text-amber-800/30 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity"
                onPointerDown={(e) => { e.preventDefault(); controls.start(e); }}
            />
            <div
                onClick={() => onToggleComplete(todo.id)}
                className={`shrink-0 w-4 h-4 rounded-sm border cursor-pointer transition-colors ${todo.completed ? "bg-amber-700/60 border-amber-700/60" : "border-amber-800/40 bg-transparent"}`}
            >
                {todo.completed && (
                    <svg viewBox="0 0 10 10" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                        <polyline points="1.5,5 4,7.5 8.5,2.5" />
                    </svg>
                )}
            </div>
            <textarea
                ref={(el) => { if (el) textareaRefs.current.set(todo.id, el); }}
                value={todo.text}
                readOnly={!todo.isEditing}
                onChange={(e) => {
                    onUpdateText(todo.id, e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                }}
                onBlur={() => { if (todo.isEditing) onFinishEditing(todo.id); }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onFinishEditing(todo.id);
                    }
                }}
                rows={1}
                className={`w-full pl-1 pr-4 bg-transparent border-0 rounded-sm focus:outline-none ${todo.isEditing ? "" : "cursor-default"} ${todo.completed ? "line-through text-amber-900/40" : ""}`}
                style={{ resize: "none", overflow: "hidden" }}
                autoFocus={todo.isEditing}
            />
            <div className="flex shrink-0 gap-2 w-10">
                <DeleteButton onClick={() => onDelete(todo.id)} show={!isAnyEditing} />
                <EditButton
                    onClick={() => onStartEditing(todo.id)}
                    show={todo.isEditing || !isAnyEditing}
                    alwaysVisible={todo.isEditing}
                />
            </div>
        </Reorder.Item>
    );
}

function AddButton({ onClick }: { onClick: () => void }) {
    return (
        <motion.button
            layout
            className="mt-2 block"
            onClick={onClick}
            whileHover={{ scale: 1.075 }}
            transition={{ type: "spring", stiffness: 600, damping: 50 }}
        >
            <CirclePlus size={20} className="text-amber-800/40" />
        </motion.button>
    );
}

function ToDoWidget() {
    const [toDos, setToDos] = useState<ToDoItem[]>([]);
    const [nextId, setNextId] = useState(1);
    const textareaRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map());

    const addToDo = () => {
        setToDos([...toDos, {id: nextId, text: "", completed: false, isEditing: true}]);
        setNextId(nextId + 1);
    };

    const updateText = (id:number, newText: string) => {
        setToDos(toDos.map((t) => (t.id === id ? { ...t, text: newText } : t)));
    };

    const startEditing = (id: number) => {
        setToDos(prev => prev.map(t => t.id === id ? { ...t, isEditing: true } : t));
        setTimeout(() => textareaRefs.current.get(id)?.focus(), 0);
    };

    const toggleComplete = (id: number) => {
        setToDos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteToDo = (id: number) => {
        setToDos(prev => prev.filter(t => t.id !== id));
    };

    const finishEditing = (id: number) => {
        setToDos(prev => {
            const item = prev.find(t => t.id === id);
            if (!item?.text.trim()) return prev.filter(t => t.id !== id);
            return prev.map(t => t.id === id ? { ...t, isEditing: false } : t);
        });
    };

    const isAnyEditing = toDos.some(t => t.isEditing);

    return(
        <div
            className={`w-full h-full max-h-full overflow-y-auto overflow-x-hidden bg-linear-to-b from-amber-600/30 to-yellow-100/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4`}
            style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(180,130,50,0.4) transparent"
        }}>
            <div>
                <h1 className="text-2xl text-center font-bold text-amber-800/80 mb-2">
                    To-Do Liste
                </h1>
            </div>
            <LayoutGroup>
                <Reorder.Group axis="y" values={toDos} onReorder={setToDos} className="p-0 m-0">
                    {toDos.map((todo) => (
                        <ToDoItemRow
                            key={todo.id}
                            todo={todo}
                            isAnyEditing={isAnyEditing}
                            textareaRefs={textareaRefs}
                            onUpdateText={updateText}
                            onFinishEditing={finishEditing}
                            onStartEditing={startEditing}
                            onDelete={deleteToDo}
                            onToggleComplete={toggleComplete}
                        />
                    ))}
                </Reorder.Group>
                <AddButton onClick={addToDo} />
            </LayoutGroup>
    </div>
  );
}

export default ToDoWidget