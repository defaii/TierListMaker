function ItemModal({ item, tiers, onAssign, onClose, onDelete }) {
    if (!item) return null

    return (
        <div className="modal show d-block bg-dark bg-opacity-75">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5>{item.name}</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body text-center">
                        <img src={item.image} className="img-fluid mb-3" />
                        <p>{item.description}</p>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-outline-danger me-auto"
                            onClick={() => onDelete && onDelete(item.id)}
                        >
                            Supprimer
                        </button>

                        <button
                            className="btn btn-outline-secondary me-2"
                            onClick={() => onAssign(item.id, null)}
                            disabled={item.tierId === null}
                        >
                            Non classé
                        </button>

                        {tiers.map(t => (
                            <button
                                key={t.id}
                                className="btn text-white"
                                style={{ background: t.color }}
                                onClick={() => onAssign(item.id, t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemModal
