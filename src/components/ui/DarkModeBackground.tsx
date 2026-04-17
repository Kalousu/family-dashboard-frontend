import { useEffect } from "react"
import useDarkMode from "../../hooks/useDarkMode"
import dashboardBgDark from "../../assets/dashboardbgdark.png"
import dashboardBgLight from "../../assets/dashboardbglight.png"

function DarkModeBackground() {
    const { isDarkMode } = useDarkMode()

    useEffect(() => {
        const img1 = new Image()
        const img2 = new Image()
        img1.src = dashboardBgDark
        img2.src = dashboardBgLight
    }, [])

    return (
        <>
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${dashboardBgDark})` }}
            />
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-out"
                style={{
                    backgroundImage: `url(${dashboardBgLight})`,
                    opacity: isDarkMode ? 0 : 1,
                }}
            />
        </>
    )
}

export default DarkModeBackground
