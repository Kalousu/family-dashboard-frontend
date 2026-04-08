import { CircleMinus, CirclePlus, Pencil } from "lucide-react"
import { useState } from "react"


interface ToDoItem {
    id: number;
    text: string;
    completed: boolean;
    isEditing: boolean;
}

function ToDoWidget() {
    const [toDos, setToDos] = useState<ToDoItem[]>([]);
    const [nextId, setNextId] = useState(1);

    const addToDo = () => {
        setToDos([...toDos, {id: nextId, text: "", completed: false, isEditing: true}]);
        setNextId(nextId + 1);
    };

    function AddButton({ onClick }: { onClick: () => void }) {
        return (
            <button
                className="mt-2 block" onClick={onClick}
            >
                <CirclePlus size={20} />
            </button>
        );
    }

    const updateText = (id:number, newText: string) => {
        setToDos(toDos.map((t) => (t.id === id ? { ...t, text: newText } : t)));
    };

    const finishEditing = (id: number) => {
        setToDos(prev => {
            const item = prev.find(t => t.id === id);
            if (!item?.text.trim()) return prev.filter(t => t.id !== id);
            return prev.map(t => t.id === id ? { ...t, isEditing: false } : t);
        });
    };

    return(
        <div 
            className={`w-full h-full max-h-full overflow-y-auto overflow-x-hidden bg-linear-to-b from-amber-600/30 to-yellow-100/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4`}
            style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(180,130,50,0.4) transparent"
        }}>
            {toDos.map((todo) => (
            <div key={todo.id} className="border-b border-amber-800/20 pt-2 pb-0.5">
            <textarea
                value={todo.text}
                onChange={(e) => {updateText(todo.id, e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
                }}
                onBlur={() => finishEditing(todo.id)}
                onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    finishEditing(todo.id);
                }
                }}
                rows={1}
                className="w-full px-1 focus:outline-none focus:ring-1 focus:ring-amber-600/50 rounded-sm"
                style={{ resize: "none", overflow: "hidden" }}
                autoFocus
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