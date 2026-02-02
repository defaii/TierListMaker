import { useState, useEffect } from 'react'

function ItemImporter({ onAdd }) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [validationErrors, setValidationErrors] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [success, setSuccess] = useState(null)
    const [serverUp, setServerUp] = useState(true)
    const [checkingServer, setCheckingServer] = useState(false)

    const handleSelectFile = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // validation avant mise en file d'attente
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (!file.type || !file.type.startsWith('image/')) {
            setValidationErrors('Le fichier doit être une image.')
            e.target.value = ''
            return
        }
        if (file.size > maxSize) {
            setValidationErrors('L\'image est trop grande (max 5MB).')
            e.target.value = ''
            return
        }

        // ok: on prépare la prévisualisation et on attend la confirmation de l'utilisateur
        setValidationErrors(null)
        setError(null)
        const preview = URL.createObjectURL(file)
        setPreviewUrl(preview)
        setSelectedFile(file)
    }

    const handleUpload = async () => {
        if (!selectedFile) return
        if (typeof onAdd !== 'function') {
            console.error('onAdd is not a function')
            return
        }

        const apiUrl = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3000' ? 'http://localhost:5000' : '')
        const uploadUrl = apiUrl ? `${apiUrl}/api/upload` : '/api/upload'

        if (apiUrl && !serverUp) {
            setError("Serveur d'API indisponible. Cliquez sur 'Vérifier le serveur' ou démarrez le serveur avec `npm run dev:server`.")
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('name', name || 'Sans nom')
        formData.append('description', description)

        try {
            console.debug('Uploading to', uploadUrl)
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                let message = `Erreur ${response.status}`
                if (response.status === 404) {
                    setServerUp(false)
                    message = "Endpoint /api/upload introuvable (404). Vérifiez que le serveur est démarré (npm run server ou npm run dev:server)."
                } else {
                    try {
                        const errData = await response.json()
                        if (errData?.message) message = errData.message
                    } catch (e) {}
                }
                throw new Error(message)
            }

            const data = await response.json()
            if (!data?.imageUrl) {
                throw new Error('Réponse invalide du serveur (image manquante).')
            }

            if (typeof onAdd === 'function') {
                onAdd({
                    id: data.id || crypto.randomUUID(),
                    name: name || 'Sans nom',
                    description,
                    image: data.imageUrl,
                    tierId: null
                })
            }

            setSuccess('Image importée avec succès.')
            setName('')
            setDescription('')
            setSelectedFile(null)
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
                setPreviewUrl(null)
            }
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error('Erreur lors de l\'upload:', err)
            setError(err.message || 'Erreur lors de l\'upload.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    // Vérifie si le serveur backend est disponible
    const checkServer = async () => {
        const apiUrl = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3000' ? 'http://localhost:5000' : '')
        if (!apiUrl) {
            // pas d'URL externe configurée => on suppose que /api est servi par le même hôte
            setServerUp(true)
            return true
        }
        const url = `${apiUrl}/api/health`
        setCheckingServer(true)
        try {
            const res = await fetch(url)
            const ok = res.ok
            setServerUp(ok)
            return ok
        } catch (e) {
            setServerUp(false)
            return false
        } finally {
            setCheckingServer(false)
        }
    }

    useEffect(() => {
        // check on mount and if down, poll every 10s
        let poll = null
        checkServer().then(ok => {
            if (!ok) {
                poll = setInterval(() => checkServer(), 10000)
            }
        })
        return () => {
            if (poll) clearInterval(poll)
        }
    }, [])

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>Importer une image</h5>

                <input
                    className="form-control mb-2"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                />

                <textarea
                    className="form-control mb-2"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                />

                <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleSelectFile}
                    disabled={loading || !serverUp}
                />
                {!serverUp && (
                    <div className="alert alert-danger mt-2 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>API indisponible :</strong> le serveur d'upload n'a pas répondu.
                            {checkingServer ? ' Vérification en cours...' : ' Vérifiez qu\'il est démarré (`npm run dev:server`).'}
                        </div>
                        <div>
                            <button className="btn btn-sm btn-outline-light me-2" onClick={checkServer} disabled={checkingServer}>
                                {checkingServer ? 'Vérification...' : 'Vérifier le serveur'}
                            </button>
                        </div>
                    </div>
                )}

                {selectedFile && (
                    <div className="card p-2 mt-2">
                        <p className="mb-1"><strong>Fichier sélectionné :</strong> {selectedFile.name} ({Math.round(selectedFile.size / 1024)} Ko)</p>
                        {validationErrors && <div className="alert alert-warning">{validationErrors}</div>}
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>Valider et envoyer</button>
                            <button className="btn btn-secondary" onClick={() => { setSelectedFile(null); if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null) } setError(null); setValidationErrors(null); }}>Annuler</button>
                        </div>
                    </div>
                )}
                {previewUrl && (
                    <div className="mt-2">
                        <p>Prévisualisation :</p>
                        <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                )}
                {error && <div className="alert alert-danger mt-2">{error}</div>}
                {success && <div className="alert alert-success mt-2">{success}</div>}
                {loading && <p className="mt-2">Téléchargement en cours...</p>}
            </div>
        </div>
    )
}

export default ItemImporter
