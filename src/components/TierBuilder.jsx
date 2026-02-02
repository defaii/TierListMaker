import TierManager from './TierManager'

function TierBuilder({ tiers, setTiers, onValidate }) {
    return (
        <div>
            <TierManager tiers={tiers} setTiers={setTiers} />
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-success" onClick={onValidate} disabled={!tiers || tiers.length === 0}>
                    Valider les tiers
                </button>
            </div>
        </div>
    )
}

export default TierBuilder
