import { useState } from 'react'

function TierManager({ tiers, setTiers }) {
    const [label, setLabel] = useState('')
    const [color, setColor] = useState('#ff0000')

    const addTier = () => {
        if (!label) return
        setTiers([
            ...tiers,
            { id: crypto.randomUUID(), label, color, items: [] }
        ])
        setLabel('')
    }

    const removeTier = (id) => {
        setTiers(tiers.filter(t => t.id !== id))
    }

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>Créer un Tier</h5>

                <div className="d-flex gap-2">
                    <input
                        className="form-control"
                        placeholder="Nom"
                        value={label}
                        onChange={e => setLabel(e.target.value)}
                    />
                    <input
                        type="color"
                        className="form-control form-control-color"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={addTier}>
                        Ajouter
                    </button>
                </div>

                <ul className="list-group mt-3">
                    {tiers.map(t => (
                        <li key={t.id} className="list-group-item d-flex justify-content-between">
              <span>
                <span style={{ background: t.color }} className="badge me-2">&nbsp;</span>
                  {t.label}
              </span>
                            <button className="btn btn-sm btn-danger" onClick={() => removeTier(t.id)}>
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TierManager
