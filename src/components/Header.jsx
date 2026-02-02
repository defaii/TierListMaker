function Header() {
    return (
        <header
            className="sticky top-0 shadow-lg animate-slide-in"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                zIndex: 1000
            }}
            role="banner"
        >
            <div className="container">
                <div className="flex items-center justify-between py-4">
                    <h1
                        className="text-inverse font-extrabold text-3xl md:text-4xl m-0"
                        style={{
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            letterSpacing: '-0.025em'
                        }}
                    >
                        Tier List Maker
                    </h1>
                    <div className="flex items-center gap-3">
                        <span
                            className="badge badge-info px-3 py-2 text-sm font-medium"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            v1.0
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
