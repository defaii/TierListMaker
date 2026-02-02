const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 5000

const uploadDir = path.join(__dirname, 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })
// Note: kept outside of `public/` to prevent CRA dev server from reloading the app when files are added

// Allowed MIME types for image uploads
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]

// File size limit: 5MB
const FILE_SIZE_LIMIT = 5 * 1024 * 1024

// MIME type validation function
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Type de fichier non autorisé. Seules les images sont acceptées.'), false)
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueId = crypto.randomUUID()
    cb(null, `${uniqueId}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter
})

// Security middleware
app.use(helmet())

// Rate limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadDir))

app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'Fichier trop volumineux. Taille maximale: 5MB' })
      }
      return res.status(400).json({ message: `Erreur de téléchargement: ${err.message}` })
    } else if (err) {
      return res.status(400).json({ message: err.message })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Fichier manquant' })
    }

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`
    res.json({ id: req.file.filename, imageUrl })
  })
})

// Supprime un fichier uploadé par son nom de fichier
app.delete('/api/upload/:filename', (req, res) => {
  const filename = req.params.filename

  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ message: 'Nom de fichier invalide' })
  }

  // Use path.resolve for better path traversal protection
  const filePath = path.resolve(uploadDir, filename)

  // Ensure the resolved path is still within uploadDir
  if (!filePath.startsWith(path.resolve(uploadDir))) {
    return res.status(403).json({ message: 'Accès interdit' })
  }

  fs.stat(filePath, (err, stat) => {
    if (err) {
      return res.status(404).json({ message: 'Fichier introuvable' })
    }

    if (!stat.isFile()) {
      return res.status(400).json({ message: 'Le chemin spécifié n\'est pas un fichier' })
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la suppression du fichier' })
      }
      res.json({ deleted: true })
    })
  })
})

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    // Only log in development
  }
})
