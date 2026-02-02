import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

function TierManager({ tiers, setTiers }) {
    const [label, setLabel] = useState('')
    const [color, setColor] = useState('#ff0000')
    const [tierToDelete, setTierToDelete] = useState(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const addTier = () => {
        if (!label.trim()) return
        setTiers([
            ...tiers,
            { id: crypto.randomUUID(), label: label.trim(), color, items: [] }
        ])
        setLabel('')
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && label.trim()) {
            addTier()
        }
    }

    const requestDeleteTier = (tier) => {
        setTierToDelete(tier)
        setShowDeleteDialog(true)
    }

    const confirmDeleteTier = () => {
        if (tierToDelete) {
            setTiers(tiers.filter(t => t.id !== tierToDelete.id))
        }
        setShowDeleteDialog(false)
        setTierToDelete(null)
    }

    const cancelDeleteTier = () => {
        setShowDeleteDialog(false)
        setTierToDelete(null)
    }

    return (
        <>
            <div className="card mb-4 animate-fade-in">
                <div className="card-header border-b">
                    <h3 className="card-title flex items-center gap-2">
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
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Create a Tier
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="form-group md:col-span-2">
                        <label htmlFor="tier-name" className="form-label">
                            Tier Name
                        </label>
                        <input
                            id="tier-name"
                            className="form-control"
                            placeholder="e.g., S, A, B, C..."
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                            onKeyPress={handleKeyPress}
                            aria-required="true"
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tier-color" className="form-label">
                            Color
                        </label>
                        <input
                            id="tier-color"
                            type="color"
                            className="form-control"
                            style={{ height: '42px', cursor: 'pointer' }}
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            aria-label="Select tier color"
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={addTier}
                        disabled={!label.trim()}
                        aria-label="Add tier"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Tier
                    </button>
                </div>

                {tiers.length === 0 ? (
                    <div className="text-center py-6 text-secondary">
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto mb-3 opacity-50"
                            aria-hidden="true"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <p className="m-0">No tiers created yet. Add your first tier above!</p>
                    </div>
                ) : (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-secondary mb-3">
                            Your Tiers ({tiers.length})
                        </h4>
                        <div className="grid gap-3">
                            {tiers.map((tier, index) => (
                                <div
                                    key={tier.id}
                                    className="card card-sm flex-row items-center justify-between animate-slide-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="rounded-lg shadow-sm"
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                backgroundColor: tier.color,
                                                border: '2px solid rgba(0, 0, 0, 0.1)'
                                            }}
                                            aria-label={`Tier color: ${tier.color}`}
                                        />
                                        <div>
                                            <h5 className="m-0 font-bold">{tier.label}</h5>
                                            <p className="m-0 text-sm text-secondary">
                                                {tier.items?.length || 0} items
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-icon btn-danger"
                                        onClick={() => requestDeleteTier(tier)}
                                        aria-label={`Delete tier ${tier.label}`}
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Delete Tier"
                message={`Are you sure you want to delete the tier "${tierToDelete?.label}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={confirmDeleteTier}
                onCancel={cancelDeleteTier}
            />
        </>
    )
}

export default TierManager
