import { CircleMinus, CirclePlus, Pencil } from "lucide-react"
import { useRef, useState } from "react"

function EditButton({ onClick, show, alwaysVisible }: { onClick: () => void, show: boolean, alwaysVisible: boolean }) {
    if (!show) return null;
    return (
        <button onClick={onClick} className={`shrink-0 transition-opacity ${alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <Pencil size={20} className="text-amber-800/40" />
        </button>
    );
}

function DeleteButton({ onClick, show }: { onClick: () => void, show: boolean }) {
    if (!show) return null;
    return (
        <button onClick={onClick} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <CircleMinus size={20} className="text-amber-800/40" />
        </button>
    );
}


interface ToDoItem {
    id: number;
    text: string;
    completed: boolean;
    isEditing: boolean;
}

function ToDoWidget() {
    const [toDos, setToDos] = useState<ToDoItem[]>([]);
    const [nextId, setNextId] = useState(1);
    const textareaRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map());

    const addToDo = () => {
        setToDos([...toDos, {id: nextId, text: "", completed: false, isEditing: true}]);
        setNextId(nextId + 1);
    };

    function AddButton({ onClick }: { onClick: () => void }) {
        return (
            <button
                className="mt-2 block" onClick={onClick}
            >
                <CirclePlus size={20} className="text-amber-800/40" />
            </button>
        );
    }

    const updateText = (id:number, newText: string) => {
        setToDos(toDos.map((t) => (t.id === id ? { ...t, text: newText } : t)));
    };

    const startEditing = (id: number) => {
        setToDos(prev => prev.map(t => t.id === id ? { ...t, isEditing: true } : t));
        setTimeout(() => textareaRefs.current.get(id)?.focus(), 0);
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
            {toDos.map((todo) => (
            <div key={todo.id} className="group flex items-center gap-2 border-b border-amber-800/20 pt-2 pb-0.5 pr-2">
            <textarea
                ref={(el) => { if (el) textareaRefs.current.set(todo.id, el); }}
                value={todo.text}
                readOnly={!todo.isEditing}
                onChange={(e) => {updateText(todo.id, e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
                }}
                onBlur={() => { if (todo.isEditing) finishEditing(todo.id); }}
                onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    finishEditing(todo.id);
                }
                }}
                rows={1}
                className={`w-full px-1 rounded-sm focus:outline-none ${todo.isEditing ? "focus:ring-1 focus:ring-amber-600/50" : "cursor-default"}`}
                style={{ resize: "none", overflow: "hidden" }}
                autoFocus={todo.isEditing}
            />
            <DeleteButton onClick={() => deleteToDo(todo.id)} show={!isAnyEditing} />
            <EditButton
                onClick={() => startEditing(todo.id)}
                show={todo.isEditing || !isAnyEditing}
                alwaysVisible={todo.isEditing}
            />
            </div>
        ))}
        <AddButton onClick={addToDo} />
    </div>
  );
}

export default ToDoWidget

/*ToDo:
- Wenn ToDo kein Text --> automatisch löschen
- Scrollen wenn zu viele ToDos
- AddButton links unter letztem ToDo
*/