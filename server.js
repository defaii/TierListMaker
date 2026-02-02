const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

const uploadDir = path.join(__dirname, 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })
// Note: kept outside of `public/` to prevent CRA dev server from reloading the app when files are added

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext)
  }
})

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadDir))

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Fichier manquant' })
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`
  console.log(`Uploaded file saved: ${req.file.filename} -> ${imageUrl}`)
  res.json({ id: req.file.filename, imageUrl })
})

// Supprime un fichier uploadé par son nom de fichier
app.delete('/api/upload/:filename', (req, res) => {
  const filename = req.params.filename
  if (!filename) return res.status(400).json({ message: 'Nom de fichier manquant' })
  const filePath = path.join(uploadDir, filename)
  if (!filePath.startsWith(uploadDir)) {
    return res.status(400).json({ message: 'Nom de fichier invalide' })
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return res.status(404).json({ message: 'Fichier introuvable' })
    fs.unlink(filePath, (err) => {
      if (err) return res.status(500).json({ message: 'Erreur lors de la suppression' })
      console.log(`Deleted uploaded file: ${filename}`)
      res.json({ deleted: true })
    })
  })
})

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
