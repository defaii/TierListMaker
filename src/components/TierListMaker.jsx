import { useEffect, useState } from 'react'
import TierBuilder from './TierBuilder'
import ItemImporter from './ItemImporter'
import TierTable from './TierTable'
import ItemModal from './ItemModal'
import { loadData, saveData } from '../utils/storage'
import { getApiUrl } from '../utils/apiConfig'

const DEFAULT = {
    step: 1,
    tiers: [],
    items: {},
    showImporter: true // persiste l'état afficher/masquer l'importateur
}

function TierListMaker() {
    const [data, setData] = useState(DEFAULT)
    const [selectedItem, setSelectedItem] = useState(null)

    useEffect(() => {
        const saved = loadData()
        if (saved) setData(saved)
    }, [])

    useEffect(() => {
        saveData(data)
    }, [data])

    return (
        <div className="container mt-4">
            {data.step === 1 && (
                <TierBuilder
                    tiers={data.tiers}
                    setTiers={(tiers) =>
                        setData((d) => ({ ...d, tiers }))
                    }
                    onValidate={() =>
                        setData((d) => ({ ...d, step: 2 }))
                    }
                />
            )}

            {data.step >= 2 && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>Trier des images</h4>
                        <div>
                            <button
                                className={`btn btn-sm ${data.showImporter ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
                                onClick={() => setData(d => ({ ...d, showImporter: !d.showImporter }))}
                            >
                                {data.showImporter ? 'Cacher l\'import' : 'Afficher l\'import'}
                            </button>
                        </div>
                    </div>

                    {data.showImporter && (
                        <ItemImporter
                            onAdd={(item) =>
                                setData((d) => ({
                                    ...d,
                                    items: { ...d.items, [item.id]: item }
                                }))
                            }
                        />
                    )}

                    <TierTable
                        tiers={data.tiers}
                        items={data.items}
                        onSelectItem={setSelectedItem}
                    />
                </>
            )}

            <ItemModal
                item={selectedItem}
                tiers={data.tiers}
                onAssign={(itemId, tierId) => {
                    setData((d) => {
                        const copy = structuredClone(d)
                        // retirer l'item de tous les tiers
                        copy.tiers.forEach(t =>
                            t.items = t.items.filter(i => i !== itemId)
                        )
                        // si on fournit un tierId valide, on l'ajoute à ce tier
                        if (tierId) {
                            const tier = copy.tiers.find(t => t.id === tierId)
                            if (tier) tier.items.push(itemId)
                        }
                        // mettre à jour le champ tierId de l'item (peut être null)
                        if (copy.items[itemId]) copy.items[itemId].tierId = tierId || null
                        return copy
                    })
                    setSelectedItem(null)
                }}
                onDelete={async (itemId) => {
                    if (!itemId) return
                    const item = data.items[itemId]
                    if (!item) return
                    if (!window.confirm('Confirmez-vous la suppression de cette image ? Elle sera supprimée du serveur et de la liste.')) return

                    // si l'image provient du dossier uploads du serveur, on tente de la supprimer
                    const apiUrl = getApiUrl()
                    let filename = null
                    if (item.image && typeof item.image === 'string') {
                        try {
                            const url = new URL(item.image)
                            if (url.pathname.startsWith('/uploads/')) {
                                filename = url.pathname.split('/').pop()
                            }
                        } catch (e) {
                            // non-URL (data URL), nothing à faire côté serveur
                        }
                    }

                    if (filename && apiUrl) {
                        try {
                            const deleteUrl = `${apiUrl}/api/upload/${encodeURIComponent(filename)}`
                            const res = await fetch(deleteUrl, { method: 'DELETE' })
                            if (!res.ok) {
                                const err = await res.json().catch(() => ({}))
                                throw new Error(err.message || `Erreur ${res.status}`)
                            }
                        } catch (err) {
                            if (!window.confirm("Échec de la suppression sur le serveur. Supprimer localement quand même ?")) return
                        }
                    }

                    // suppression locale
                    setData((d) => {
                        const copy = structuredClone(d)
                        copy.tiers.forEach(t => t.items = t.items.filter(i => i !== itemId))
                        delete copy.items[itemId]
                        return copy
                    })
                    setSelectedItem(null)
                }}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    )
}

export default TierListMaker
