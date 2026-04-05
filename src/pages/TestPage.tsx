import WeatherWidget from "../widgets/weather/WeatherWidget"

function TestPage() {

    return(
        <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundImage: "url('https://everwallpaper.com/cdn/shop/products/cartoon-cat-wall-mural-plain.jpg?v=1710129966')", backgroundSize: "cover" }}>
            <div className = "w-100 h-135">
                <WeatherWidget />
            </div>
        </div>
    )
}

export default TestPage