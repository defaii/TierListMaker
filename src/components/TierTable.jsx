function TierTable({ tiers, items, onSelectItem }) {
    const unassignedItems = Object.values(items).filter(
        item => !item.tierId
    )

    return (
        <div className="mt-5 animate-slide-up">
            {/* Unassigned Items Section */}
            <div className="card mb-4">
                <div className="card-header border-b">
                    <div className="flex items-center justify-between">
                        <h3 className="card-title flex items-center gap-2 m-0">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <path d="M9 3v18" />
                            </svg>
                            Unassigned Items
                        </h3>
                        <span className="badge badge-primary">
                            {unassignedItems.length} {unassignedItems.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                </div>

                {unassignedItems.length === 0 ? (
                    <div className="text-center py-8">
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto mb-4 opacity-30"
                            aria-hidden="true"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <p className="text-secondary font-medium">All items have been assigned!</p>
                        <p className="text-sm text-tertiary">Click on any item to reassign it.</p>
                    </div>
                ) : (
                    <div
                        className="grid gap-3 p-4"
                        style={{
                            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))'
                        }}
                        role="list"
                        aria-label="Unassigned items"
                    >
                        {unassignedItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="relative rounded-lg overflow-hidden shadow-md transition cursor-pointer animate-scale-in"
                                style={{
                                    aspectRatio: '1',
                                    animationDelay: `${index * 30}ms`
                                }}
                                onClick={() => onSelectItem(item)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        onSelectItem(item)
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={`Select ${item.name}`}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name || 'Unassigned item'}
                                    className="w-full h-full"
                                    style={{
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)'
                                    }}
                                    loading="lazy"
                                />
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-0 flex items-end p-2 transition"
                                    style={{ transition: 'background-color 0.3s ease' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)'
                                    }}
                                >
                                    <span
                                        className="text-white text-xs font-medium truncate w-full opacity-0 transition"
                                        style={{ transition: 'opacity 0.3s ease' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = '1'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = '0'
                                        }}
                                    >
                                        {item.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tier Rows */}
            {tiers.length === 0 ? (
                <div className="card text-center py-8">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto mb-4 opacity-30"
                        aria-hidden="true"
                    >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <p className="text-secondary font-medium">No tiers created yet</p>
                    <p className="text-sm text-tertiary">Create your first tier to get started!</p>
                </div>
            ) : (
                <div className="grid gap-4" role="list" aria-label="Tiers">
                    {tiers.map((tier, tierIndex) => (
                        <div
                            key={tier.id}
                            className="shadow-lg rounded-lg overflow-hidden transition animate-slide-in"
                            style={{
                                animationDelay: `${tierIndex * 100}ms`
                            }}
                            role="listitem"
                            aria-label={`Tier ${tier.label}`}
                        >
                            <div className="flex items-stretch">
                                {/* Tier Label */}
                                <div
                                    className="flex items-center justify-center px-6 min-w-32 font-bold text-2xl text-white shadow-md"
                                    style={{
                                        backgroundColor: tier.color,
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}
                                    aria-label={`Tier ${tier.label} with ${tier.items?.length || 0} items`}
                                >
                                    {tier.label}
                                </div>

                                {/* Tier Items */}
                                <div
                                    className="flex-1 bg-white p-4"
                                    style={{ minHeight: '120px' }}
                                >
                                    {tier.items?.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-center">
                                            <div>
                                                <svg
                                                    width="48"
                                                    height="48"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="mx-auto mb-2 opacity-20"
                                                    aria-hidden="true"
                                                >
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                                <p className="text-sm text-tertiary m-0">
                                                    No items in this tier
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="grid gap-3"
                                            style={{
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))'
                                            }}
                                            role="list"
                                            aria-label={`Items in tier ${tier.label}`}
                                        >
                                            {tier.items.map(itemId => {
                                                const item = items[itemId]
                                                if (!item) return null

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="relative rounded-lg overflow-hidden shadow-md transition cursor-pointer"
                                                        style={{
                                                            aspectRatio: '1',
                                                            border: `3px solid ${tier.color}`
                                                        }}
                                                        onClick={() => onSelectItem(item)}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault()
                                                                onSelectItem(item)
                                                            }
                                                        }}
                                                        role="button"
                                                        tabIndex={0}
                                                        aria-label={`Select ${item.name} from tier ${tier.label}`}
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name || `Item in tier ${tier.label}`}
                                                            className="w-full h-full"
                                                            style={{
                                                                objectFit: 'cover',
                                                                transition: 'transform 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform = 'scale(1.1)'
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform = 'scale(1)'
                                                            }}
                                                            loading="lazy"
                                                        />
                                                        <div
                                                            className="absolute inset-0 bg-black bg-opacity-0 flex items-end p-2 transition"
                                                            style={{ transition: 'background-color 0.3s ease' }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)'
                                                            }}
                                                        >
                                                            <span
                                                                className="text-white text-xs font-medium truncate w-full opacity-0 transition"
                                                                style={{ transition: 'opacity 0.3s ease' }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.opacity = '1'
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.opacity = '0'
                                                                }}
                                                            >
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TierTable
