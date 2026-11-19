function Header(){
    return (
        <header className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="text-2xl bg-gray-50 rounded p-2">🌦️</div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Weather App Dashboard</h1>
                    <h3 className="text-sm text-gray-500 ">Real-Time Weather update every 15 seconds for your favorite coutry</h3>
                </div>
            </div>
            <div className="bg-gray-100 rounded-full py-1 px-2">🔴Live</div>
        </header>
    )

}
export default Header