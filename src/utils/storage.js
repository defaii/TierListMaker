export const saveData = (data) => {
    localStorage.setItem('tierlist', JSON.stringify(data))
}

export const loadData = () => {
    const saved = localStorage.getItem('tierlist')
    if (!saved) return null
    try {
        const data = JSON.parse(saved)
        // Normalise les URLs d'image héritées qui commencent par /uploads/
        const apiUrl = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3000' ? 'http://localhost:5000' : '')
        if (apiUrl && data?.items) {
            Object.values(data.items).forEach(item => {
                if (item && typeof item.image === 'string' && item.image.startsWith('/uploads/')) {
                    item.image = `${apiUrl}${item.image}`
                }
            })
        }
        return data
    } catch (e) {
        console.error('Erreur en lisant les données sauvegardées:', e)
        return null
    }
}
