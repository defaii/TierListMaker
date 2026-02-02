import { useEffect, useState } from 'react'
import { getApiUrl } from '../utils/apiConfig'
import ConfirmDialog from './ConfirmDialog'

function ItemModal({ item, tiers, onAssign, onClose, onDelete }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    useEffect(() => {
        if (!item) return

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [item, onClose])

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleDelete = () => {
        setShowDeleteDialog(true)
    }

    const confirmDelete = () => {
        if (onDelete) {
            onDelete(item.id)
        }
        setShowDeleteDialog(false)
        onClose()
    }

    const cancelDelete = () => {
        setShowDeleteDialog(false)
    }

    const handleTierAssign = (tierId) => {
        onAssign(item.id, tierId)
        onClose()
    }

    if (!item) return null

    return (
        <>
            <div
                className="modal-backdrop animate-fade-in"
                onClick={handleBackdropClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="modal modal-lg animate-scale-in">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h2 id="modal-title" className="modal-title">
                            {item.name || 'Untitled Item'}
                        </h2>
                        <button
                            className="modal-close"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
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
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Image Preview */}
                            <div>
                                <img
                                    src={item.image}
                                    alt={item.name || 'Item preview'}
                                    className="w-full rounded-lg shadow-lg"
                                    style={{
                                        maxHeight: '400px',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>

                            {/* Item Details */}
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-secondary mb-2">
                                        Description
                                    </h3>
                                    {item.description ? (
                                        <p className="text-base text-primary">
                                            {item.description}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-tertiary italic">
                                            No description provided
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-secondary mb-2">
                                        Current Tier
                                    </h3>
                                    {item.tierId ? (
                                        (() => {
                                            const currentTier = tiers.find(t => t.id === item.tierId)
                                            return currentTier ? (
                                                <div
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium"
                                                    style={{
                                                        backgroundColor: currentTier.color,
                                                        color: 'white'
                                                    }}
                                                >
                                                    {currentTier.label}
                                                </div>
                                            ) : (
                                                <span className="badge badge-primary">Unassigned</span>
                                            )
                                        })()
                                    ) : (
                                        <span className="badge badge-primary">Unassigned</span>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-secondary mb-3">
                                        Assign to Tier
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            className={`btn ${item.tierId === null ? 'btn-primary' : 'btn-outline'}`}
                                            onClick={() => handleTierAssign(null)}
                                            aria-label="Unassign from tier"
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                            Unassigned
                                        </button>
                                        {tiers.map(tier => (
                                            <button
                                                key={tier.id}
                                                className="btn"
                                                style={{
                                                    backgroundColor: tier.color,
                                                    color: 'white',
                                                    border: item.tierId === tier.id ? '3px solid rgba(0,0,0,0.3)' : 'none'
                                                }}
                                                onClick={() => handleTierAssign(tier.id)}
                                                aria-label={`Assign to tier ${tier.label}`}
                                                aria-pressed={item.tierId === tier.id}
                                            >
                                                {tier.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer">
                        <button
                            className="btn btn-danger"
                            onClick={handleDelete}
                            aria-label="Delete this item"
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
                            Delete Item
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Delete Item"
                message={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </>
    )
}

export default ItemModal
