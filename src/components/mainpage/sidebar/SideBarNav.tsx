function SideBarNav() {
    const navItems = ["Widgets verwalten", "Family verwalten", "Profil bearbeiten"]

    return (
        <div className="m-2 flex flex-col items-stretch">
            {navItems.map((item) => (
                <button key={item} className="mt-1 mb-1 p-3 w-full bg-linear-to-b from-gray-500/70 to-gray-600 text-gray-200 text-left font-semibold rounded-xl border-2 border-white/10 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200">
                    {item}
                </button>
            ))}
        </div>
    )
}
export default SideBarNav