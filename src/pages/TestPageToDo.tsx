import ToDoWidget from "../widgets/toDo/toDoWidget";

function TestPageToDo() {

    return(
        <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundImage: "url('https://everwallpaper.com/cdn/shop/products/cartoon-cat-wall-mural-plain.jpg?v=1710129966')", backgroundSize: "cover" }}>
        <div className="w-80 h-96">
            <ToDoWidget />
        </div>
        </div>
    )   
}

export default TestPageToDo