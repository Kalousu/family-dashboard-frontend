import { LayoutGroup, Reorder } from "framer-motion"
import { useToDo } from "./useToDo"
import { ToDoItemRow, AddButton } from "./ToDoItemRow"

function ToDoWidget() {
    const { todos, setTodos, editingId, isAnyEditing, textareaRefs, addTodo, updateText, startEditing, finishEditing, deleteTodo, toggleComplete } = useToDo();

    return (
        <div className="w-full h-full bg-linear-to-b from-orange-400/30 to-yellow-200/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg overflow-hidden">
            <div
                className="w-full h-full overflow-y-auto overflow-x-hidden p-4"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(180,130,50,0.4) rgba(180,130,50,0.1)" }}
            >
            <h1 className="text-3xl text-center font-bold text-white mb-2">To-Do Liste</h1>
            <LayoutGroup>
                <Reorder.Group axis="y" values={todos} onReorder={setTodos} className="p-0 m-0">
                    {todos.map((todo) => (
                        <ToDoItemRow
                            key={todo.id}
                            todo={todo}
                            isEditing={editingId === todo.id}
                            isAnyEditing={isAnyEditing}
                            textareaRefs={textareaRefs}
                            onUpdateText={updateText}
                            onFinishEditing={finishEditing}
                            onStartEditing={startEditing}
                            onDelete={deleteTodo}
                            onToggleComplete={toggleComplete}
                        />
                    ))}
                </Reorder.Group>
                <AddButton onClick={addTodo} />
            </LayoutGroup>
            </div>
        </div>
    );
}

export default ToDoWidget
