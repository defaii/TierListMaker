import { useState, useEffect } from 'react'
import { getApiUrl } from '../utils/apiConfig'
import LoadingSpinner from './LoadingSpinner'

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
    const [isDragging, setIsDragging] = useState(false)

    const validateFile = (file) => {
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (!file.type || !file.type.startsWith('image/')) {
            return 'The file must be an image (JPEG, PNG, GIF, etc.)'
        }
        if (file.size > maxSize) {
            return 'The image is too large (max 5MB)'
        }
        return null
    }

    const handleSelectFile = (file) => {
        if (!file) return

        const error = validateFile(file)
        if (error) {
            setValidationErrors(error)
            return
        }

        setValidationErrors(null)
        setError(null)
        const preview = URL.createObjectURL(file)
        setPreviewUrl(preview)
        setSelectedFile(file)
    }

    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            handleSelectFile(file)
        }
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleSelectFile(file)
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return
        if (typeof onAdd !== 'function') {
            setError('Upload handler not configured properly')
            return
        }

        const apiUrl = getApiUrl()
        const uploadUrl = apiUrl ? `${apiUrl}/api/upload` : '/api/upload'

        if (apiUrl && !serverUp) {
            setError("API server unavailable. Click 'Check Server' or start the server with `npm run dev:server`.")
            return
        }

        setLoading(true)
        setError(null)
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('name', name || 'Untitled')
        formData.append('description', description)

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                let message = `Error ${response.status}`
                if (response.status === 404) {
                    setServerUp(false)
                    message = "Endpoint /api/upload not found (404). Make sure the server is running (npm run server or npm run dev:server)."
                } else {
                    try {
                        const errData = await response.json()
                        if (errData?.message) message = errData.message
                    } catch (e) {
                        message = `Server error: ${response.statusText}`
                    }
                }
                throw new Error(message)
            }

            const data = await response.json()
            if (!data?.imageUrl) {
                throw new Error('Invalid server response (missing image URL)')
            }

            onAdd({
                id: data.id || crypto.randomUUID(),
                name: name || 'Untitled',
                description,
                image: data.imageUrl,
                tierId: null
            })

            setSuccess('Image uploaded successfully!')
            setName('')
            setDescription('')
            setSelectedFile(null)
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
                setPreviewUrl(null)
            }
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            setError(err.message || 'Error uploading image')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setSelectedFile(null)
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }
        setError(null)
        setValidationErrors(null)
    }

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    const checkServer = async () => {
        const apiUrl = getApiUrl()
        if (!apiUrl) {
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Import Images
                </h3>
            </div>

            {!serverUp && (
                <div className="alert-modern alert-error" role="alert">
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
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div className="flex-1">
                        <strong>API Unavailable:</strong> The upload server is not responding.
                        {checkingServer ? ' Checking...' : ' Make sure it is running (`npm run dev:server`).'}
                    </div>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={checkServer}
                        disabled={checkingServer}
                        aria-label="Check server status"
                    >
                        {checkingServer ? 'Checking...' : 'Check Server'}
                    </button>
                </div>
            )}

            <div className="grid gap-4">
                <div className="form-group">
                    <label htmlFor="item-name" className="form-label">
                        Item Name
                    </label>
                    <input
                        id="item-name"
                        className="form-control"
                        placeholder="e.g., My favorite character"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="item-description" className="form-label">
                        Description (optional)
                    </label>
                    <textarea
                        id="item-description"
                        className="form-control"
                        placeholder="Add a description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        rows="3"
                    />
                </div>

                {!selectedFile && (
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${
                            isDragging ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-300 hover:border-primary'
                        } ${!serverUp || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => !loading && serverUp && document.getElementById('file-input').click()}
                        role="button"
                        tabIndex={0}
                        aria-label="Click to upload or drag and drop an image"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                !loading && serverUp && document.getElementById('file-input').click()
                            }
                        }}
                    >
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto mb-4"
                            style={{ color: isDragging ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}
                            aria-hidden="true"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <p className="text-lg font-medium mb-2">
                            {isDragging ? 'Drop image here' : 'Drag and drop an image'}
                        </p>
                        <p className="text-sm text-secondary mb-3">or click to browse</p>
                        <p className="text-xs text-tertiary">
                            Supports: JPEG, PNG, GIF (max 5MB)
                        </p>
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileInputChange}
                            disabled={loading || !serverUp}
                            aria-label="Upload image file"
                        />
                    </div>
                )}

                {validationErrors && (
                    <div className="alert-modern alert-warning" role="alert">
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
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        {validationErrors}
                    </div>
                )}

                {selectedFile && (
                    <div className="card card-flat animate-slide-in">
                        <div className="flex items-start gap-4">
                            {previewUrl && (
                                <div className="flex-shrink-0">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="rounded-lg shadow-md"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h4 className="font-semibold mb-1">Selected File</h4>
                                <p className="text-sm text-secondary mb-2">
                                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleUpload}
                                        disabled={loading}
                                        aria-label="Upload selected image"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="spinner spinner-sm" aria-hidden="true" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
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
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                Upload
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-outline"
                                        onClick={handleCancel}
                                        disabled={loading}
                                        aria-label="Cancel upload"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert-modern alert-error" role="alert">
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
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert-modern alert-success animate-slide-in" role="alert">
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
                        {success}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-4">
                        <LoadingSpinner size="medium" text="Uploading image..." />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ItemImporter
