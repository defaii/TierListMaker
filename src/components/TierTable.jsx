function TierTable({ tiers, items, onSelectItem }) {
    // items non encore classés
    const unassignedItems = Object.values(items).filter(
        item => !item.tierId
    )

    return (
        <div className="mt-4">

            {/* ZONE NON CLASSÉ */}
            <div className="mb-4">
                <h5>Non classé</h5>
                <div className="d-flex flex-wrap gap-3 border p-3 rounded">
                    {unassignedItems.length === 0 && (
                        <span className="text-muted">Aucune image</span>
                    )}

                    {unassignedItems.map(item => (
                        <img
                            key={item.id}
                            src={item.image}
                            alt={item.name}
                            title={item.name}
                            onClick={() => onSelectItem(item)}
                            style={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                cursor: 'pointer'
                            }}
                            className="rounded shadow-sm"
                        />
                    ))}
                </div>
            </div>

            {/* TIERS */}
            {tiers.map(tier => (
                <div
                    key={tier.id}
                    className="d-flex align-items-center mb-3 p-2 rounded"
                    style={{ backgroundColor: tier.color }}
                >
                    {/* Label */}
                    <div
                        className="fw-bold text-white text-center"
                        style={{ width: 80 }}
                    >
                        {tier.label}
                    </div>

                    {/* Items */}
                    <div className="d-flex flex-wrap gap-2 ms-3">
                        {tier.items.length === 0 && (
                            <span className="text-white opacity-75">
                Aucun élément
              </span>
                        )}

                        {tier.items.map(itemId => {
                            const item = items[itemId]
                            if (!item) return null

                            return (
                                <img
                                    key={item.id}
                                    src={item.image}
                                    alt={item.name}
                                    title={item.name}
                                    onClick={() => onSelectItem(item)}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'cover',
                                        cursor: 'pointer'
                                    }}
                                    className="rounded border border-light"
                                />
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TierTable
