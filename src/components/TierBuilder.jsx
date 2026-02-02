import TierManager from './TierManager'

function TierBuilder({ tiers, setTiers, onValidate }) {
    const isValid = tiers && tiers.length > 0

    return (
        <div className="animate-slide-in">
            {/* Step Indicator */}
            <div className="card mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: isValid ? 'var(--color-success)' : 'var(--color-primary)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.25rem'
                            }}
                            aria-label="Step 1"
                        >
                            1
                        </div>
                        <div>
                            <h3 className="m-0 text-lg font-bold">Create Tiers</h3>
                            <p className="m-0 text-sm text-secondary">
                                Define your tier categories and colors
                            </p>
                        </div>
                    </div>
                    {isValid && (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: 'var(--color-success)' }}
                            aria-hidden="true"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )}
                </div>
            </div>

            <TierManager tiers={tiers} setTiers={setTiers} />

            <div className="flex justify-end mt-4">
                <button
                    className="btn btn-success btn-lg"
                    onClick={onValidate}
                    disabled={!isValid}
                    aria-label="Validate tiers and proceed to next step"
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
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Validate Tiers
                </button>
            </div>
        </div>
    )
}

export default TierBuilder
