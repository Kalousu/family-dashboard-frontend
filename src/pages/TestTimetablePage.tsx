import TimetableWidget from "../widgets/timetable/TimetableWidget"

function TestTimetablePage() {

    return(
        <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundImage: "url('https://everwallpaper.com/cdn/shop/products/cartoon-cat-wall-mural-plain.jpg?v=1710129966')", backgroundSize: "cover" }}>
            <div >
                <TimetableWidget />
            </div>
        </div>
    )
}

export default TestTimetablePage